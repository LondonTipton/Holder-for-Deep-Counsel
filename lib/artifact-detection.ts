import { Artifact } from '@/lib/types'
import { generateHash,nanoid } from '@/lib/utils'

// Artifact detection patterns
const CODE_PATTERN = /```(\w+)?\n([\s\S]*?)```/g
const ARTIFACT_PATTERN = /<artifact type="([^"]+)"[^>]*>([\s\S]*?)<\/artifact>/g

export interface ArtifactDetectionResult {
  text: string
  artifacts: Omit<Artifact, 'createdAt'>[]
}

export function detectArtifacts(
  content: string, 
  sourceMessageId: string
): ArtifactDetectionResult {
  let processedText = content
  const artifacts: Omit<Artifact, 'createdAt'>[] = []
  
  // Process code blocks
  let codeMatch
  while ((codeMatch = CODE_PATTERN.exec(content)) !== null) {
    const [fullMatch, language = 'plaintext', code] = codeMatch
    const artifactId = `artifact-${generateHash(fullMatch)}`
    
    // Only create artifacts for substantial code blocks (>20 chars)
    if (code.trim().length > 20) {
      artifacts.push({
        id: artifactId,
        type: 'code',
        title: `Code snippet ${language ? `(${language})` : ''}`,
        content: code.trim(),
        language,
        status: 'complete',
        sourceMessageId,
        version: 1
      })
      
      // Replace in text with artifact reference
      processedText = processedText.replace(
        fullMatch,
        `[Code Artifact: ${language || 'code'}]`
      )
    }
  }
  
  // Process explicit artifact tags
  let artifactMatch
  while ((artifactMatch = ARTIFACT_PATTERN.exec(content)) !== null) {
    const [fullMatch, type, artifactContent] = artifactMatch
    const artifactId = `artifact-${generateHash(fullMatch)}`
    
    artifacts.push({
      id: artifactId,
      type: type as Artifact['type'],
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} artifact`,
      content: artifactContent.trim(),
      status: 'complete',
      sourceMessageId,
      version: 1
    })
    
    // Replace in text with artifact reference
    processedText = processedText.replace(
      fullMatch,
      `[${type.charAt(0).toUpperCase() + type.slice(1)} Artifact]`
    )
  }
  
  return {
    text: processedText,
    artifacts
  }
}

export function extractLegalArtifacts(content: string, sourceMessageId: string): ArtifactDetectionResult {
  let processedText = content
  const artifacts: Omit<Artifact, 'createdAt'>[] = []
  
  // Legal document patterns
  const legalPatterns = [
    {
      pattern: /(?:LEGAL BRIEF|MEMORANDUM|MOTION):\s*([\s\S]*?)(?=\n\n|\n(?:[A-Z][A-Z\s]{10,}:)|$)/gi,
      type: 'document' as const,
      title: 'Legal Brief'
    },
    {
      pattern: /(?:CONTRACT|AGREEMENT):\s*([\s\S]*?)(?=\n\n|\n(?:[A-Z][A-Z\s]{10,}:)|$)/gi,
      type: 'document' as const,
      title: 'Contract'
    },
    {
      pattern: /(?:ANALYSIS|REVIEW):\s*([\s\S]*?)(?=\n\n|\n(?:[A-Z][A-Z\s]{10,}:)|$)/gi,
      type: 'document' as const,
      title: 'Legal Analysis'
    }
  ]
  
  legalPatterns.forEach(({ pattern, type, title }) => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      const [fullMatch, legalContent] = match
      
      if (legalContent.trim().length > 50) {
        const artifactId = `legal-${generateHash(fullMatch)}`
        
        artifacts.push({
          id: artifactId,
          type,
          title,
          content: legalContent.trim(),
          status: 'complete',
          sourceMessageId,
          version: 1,
          metadata: {
            documentType: 'memo',
            practiceArea: 'general'
          }
        })
        
        processedText = processedText.replace(fullMatch, `[${title}]`)
      }
    }
  })
  
  return {
    text: processedText,
    artifacts
  }
}

export class StreamingArtifactProcessor {
  private buffer = ''
  private currentArtifact: Partial<Artifact> | null = null
  private onArtifactUpdate: (artifact: Omit<Artifact, 'createdAt'>) => void
  
  constructor(onArtifactUpdate: (artifact: Omit<Artifact, 'createdAt'>) => void) {
    this.onArtifactUpdate = onArtifactUpdate
  }
  
  processChunk(chunk: string, sourceMessageId: string): string {
    this.buffer += chunk
    
    // Check for artifact start
    const artifactStartMatch = this.buffer.match(/<artifact type="([^"]+)"[^>]*>/i)
    if (artifactStartMatch && !this.currentArtifact) {
      const artifactType = artifactStartMatch[1] as Artifact['type']
      this.currentArtifact = {
        id: nanoid(),
        type: artifactType,
        title: `${artifactType.charAt(0).toUpperCase() + artifactType.slice(1)} artifact`,
        content: '',
        status: 'streaming',
        sourceMessageId,
        version: 1
      }
      
      // Remove the opening tag from buffer
      this.buffer = this.buffer.replace(artifactStartMatch[0], '')
      
      // Notify about new artifact
      this.onArtifactUpdate(this.currentArtifact as Omit<Artifact, 'createdAt'>)
    }
    
    // Check for artifact end
    const artifactEndMatch = this.buffer.match(/<\/artifact>/i)
    if (artifactEndMatch && this.currentArtifact) {
      // Extract content before the closing tag
      const endIndex = this.buffer.indexOf('</artifact>')
      this.currentArtifact.content = this.buffer.substring(0, endIndex)
      this.currentArtifact.status = 'complete'
      
      // Final update
      this.onArtifactUpdate(this.currentArtifact as Omit<Artifact, 'createdAt'>)
      
      // Clean up
      this.buffer = this.buffer.substring(endIndex + 11) // 11 = '</artifact>'.length
      this.currentArtifact = null
      
      return '[Artifact Created]'
    }
    
    // If we're inside an artifact, accumulate content
    if (this.currentArtifact) {
      this.currentArtifact.content = this.buffer
      this.onArtifactUpdate(this.currentArtifact as Omit<Artifact, 'createdAt'>)
      return '' // Don't show artifact content in main message
    }
    
    // Process regular text for inline artifacts
    const result = detectArtifacts(chunk, sourceMessageId)
    if (result.artifacts.length > 0) {
      result.artifacts.forEach(artifact => this.onArtifactUpdate(artifact))
    }
    
    return result.text
  }
  
  finalize(): string {
    if (this.currentArtifact) {
      this.currentArtifact.status = 'complete'
      this.onArtifactUpdate(this.currentArtifact as Omit<Artifact, 'createdAt'>)
    }
    
    const remainingText = this.buffer
    this.buffer = ''
    this.currentArtifact = null
    
    return remainingText
  }
}