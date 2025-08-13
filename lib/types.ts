import { z } from 'zod'

// Base message schema
export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system', 'tool']),
  content: z.array(z.object({
    type: z.enum(['text', 'artifact']),
    text: z.string().optional(),
    artifactId: z.string().optional(),
    artifactType: z.enum(['code', 'text', 'image', 'sheet', 'document', 'plan', 'diff']).optional(),
    data: z.any().optional()
  })),
  createdAt: z.string(),
  meta: z.record(z.unknown()).optional()
})

export type Message = z.infer<typeof MessageSchema>

// Artifact schema
export const ArtifactSchema = z.object({
  id: z.string(),
  type: z.enum(['code', 'text', 'image', 'sheet', 'document', 'plan', 'diff']),
  title: z.string().optional(),
  content: z.string(),
  language: z.string().optional(),
  status: z.enum(['streaming', 'complete', 'error']).default('complete'),
  sourceMessageId: z.string(),
  version: z.number().default(1),
  parentId: z.string().optional(),
  createdAt: z.number(),
  metadata: z.record(z.unknown()).optional()
})

export type Artifact = z.infer<typeof ArtifactSchema>

// Artifact store schema
export const ArtifactStoreSchema = z.object({
  byId: z.record(ArtifactSchema),
  order: z.array(z.string())
})

export type ArtifactStore = z.infer<typeof ArtifactStoreSchema>

// Chat state schema
export const ChatStateSchema = z.object({
  messages: z.array(MessageSchema),
  artifacts: ArtifactStoreSchema,
  ui: z.object({
    artifactPanelOpen: z.boolean().default(false),
    activeArtifactId: z.string().optional()
  })
})

export type ChatState = z.infer<typeof ChatStateSchema>

// Legal document types (for our specific use case)
export const LegalDocumentTypeSchema = z.enum([
  'contract',
  'brief',
  'memo',
  'motion',
  'pleading',
  'discovery',
  'statute',
  'case_law',
  'regulation',
  'opinion'
])

export type LegalDocumentType = z.infer<typeof LegalDocumentTypeSchema>

// Legal analysis artifact
export const LegalAnalysisSchema = ArtifactSchema.extend({
  type: z.literal('document'),
  metadata: z.object({
    documentType: LegalDocumentTypeSchema.optional(),
    jurisdiction: z.string().optional(),
    practiceArea: z.string().optional(),
    citations: z.array(z.string()).optional(),
    keyTerms: z.array(z.string()).optional(),
    riskLevel: z.enum(['low', 'medium', 'high']).optional()
  }).optional()
})

export type LegalAnalysis = z.infer<typeof LegalAnalysisSchema>

// Message content types
export type TextContent = {
  type: 'text'
  text: string
  annotations?: Array<{
    type: string
    data: Record<string, unknown>
  }>
}

export type ArtifactContent = {
  type: 'artifact'
  artifactId: string
  artifactType: Artifact['type']
  summary?: string
  data: unknown
}

export type MessageContent = TextContent | ArtifactContent

// Stream event types
export type StreamEvent = 
  | { type: 'text-delta'; content: string }
  | { type: 'artifact-start'; artifactId: string; artifactType: Artifact['type'] }
  | { type: 'artifact-content'; artifactId: string; content: string }
  | { type: 'artifact-complete'; artifactId: string }
  | { type: 'error'; error: string }

// Chat actions for state management
export type ChatAction = 
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'UPDATE_MESSAGE'; messageId: string; content: MessageContent[] }
  | { type: 'APPEND_TO_MESSAGE'; messageId: string; content: MessageContent }
  | { type: 'UPSERT_ARTIFACT'; artifact: Artifact }
  | { type: 'SET_ARTIFACT_PANEL_OPEN'; open: boolean }
  | { type: 'SET_ACTIVE_ARTIFACT'; artifactId?: string }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_ARTIFACT_STATUS'; artifactId: string; status: Artifact['status'] }

// Chat context type
export interface ChatContextType {
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void
  upsertArtifact: (artifact: Omit<Artifact, 'createdAt'>) => void
  toggleArtifactPanel: () => void
  setActiveArtifact: (artifactId?: string) => void
}