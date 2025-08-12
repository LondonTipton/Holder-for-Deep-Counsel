'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChat } from '@/lib/chat-context'
import { detectArtifacts } from '@/lib/artifact-detection'
import { Send, FileText, Code, Scale } from 'lucide-react'

export default function HomePage() {
  const { state, addMessage, upsertArtifact } = useChat()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message
    addMessage({
      role: 'user',
      content: [{ type: 'text', text: userMessage }]
    })

    // Simulate AI response with potential artifacts
    setTimeout(() => {
      let response = ''
      const messageId = `msg-${Date.now()}`

      // Check for artifact-generating queries
      if (userMessage.toLowerCase().includes('code') || userMessage.toLowerCase().includes('function')) {
        response = `Here's a sample JavaScript function for you:

\`\`\`javascript
function calculateLegalFee(hourlyRate, hoursWorked, expenses = 0) {
  if (hourlyRate <= 0 || hoursWorked <= 0) {
    throw new Error('Invalid input: rates and hours must be positive');
  }
  
  const baseFee = hourlyRate * hoursWorked;
  const totalFee = baseFee + expenses;
  
  return {
    baseFee: baseFee.toFixed(2),
    expenses: expenses.toFixed(2),
    totalFee: totalFee.toFixed(2),
    breakdown: {
      hourlyRate,
      hoursWorked,
      expenses
    }
  };
}

// Example usage
const legalFee = calculateLegalFee(350, 15.5, 250);
console.log(\`Total fee: $\${legalFee.totalFee}\`);
\`\`\`

This function calculates legal fees with proper error handling and returns a detailed breakdown.`
      } else if (userMessage.toLowerCase().includes('contract') || userMessage.toLowerCase().includes('legal')) {
        response = `I'll help you with legal analysis. Here's a sample contract review:

<artifact type="document">
# Contract Review Analysis

## Executive Summary
This contract review identifies several key provisions that require attention before execution.

## Key Terms Analysis

### 1. Payment Terms
- **Net 30 payment terms** - Standard and acceptable
- **Late payment penalty**: 1.5% per month - Within reasonable range
- **Dispute resolution**: Binding arbitration - Consider litigation rights

### 2. Liability Provisions
- **Limitation of liability clause** present
- **Mutual indemnification** - Balanced approach
- **Insurance requirements**: $1M general liability - Adequate coverage

### 3. Termination Rights
- **30-day notice period** for convenience termination
- **Immediate termination** for material breach
- **Surviving obligations** clearly defined

## Recommendations
1. **Negotiate** intellectual property ownership clauses
2. **Clarify** performance milestones and deliverables
3. **Review** force majeure provisions for comprehensiveness
4. **Consider** adding confidentiality protections

## Risk Assessment: **MEDIUM**
The contract contains standard commercial terms with moderate risk exposure.
</artifact>

This analysis covers the key legal aspects you should consider. Would you like me to elaborate on any specific section?`
      } else {
        response = `Thank you for your question about "${userMessage}". As an AI legal assistant, I can help you with:

- Contract analysis and review
- Legal document drafting
- Case law research
- Compliance guidance
- Risk assessment

Feel free to ask me to analyze a contract, draft a legal document, or help with any legal research. I can create interactive artifacts for complex legal content.`
      }

      // Detect and extract artifacts
      const { text, artifacts } = detectArtifacts(response, messageId)

      // Add AI message
      addMessage({
        role: 'assistant',
        content: [{ type: 'text', text }]
      })

      // Add artifacts
      artifacts.forEach(artifact => upsertArtifact(artifact))

      setIsLoading(false)
    }, 1500)
  }

  const exampleQueries = [
    {
      icon: Code,
      title: "Generate Code",
      query: "Create a JavaScript function to calculate legal fees"
    },
    {
      icon: FileText,
      title: "Contract Analysis", 
      query: "Analyze this contract for potential risks and key terms"
    },
    {
      icon: Scale,
      title: "Legal Research",
      query: "Help me understand employment law compliance requirements"
    }
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] max-w-4xl mx-auto p-4">
      {state.messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Deep Counsel AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Your intelligent legal assistant with beautiful design and powerful artifact capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {exampleQueries.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="p-6 h-auto flex flex-col space-y-2 text-left"
                onClick={() => setInput(example.query)}
              >
                <example.icon className="h-6 w-6 text-primary" />
                <span className="font-medium">{example.title}</span>
                <span className="text-sm text-muted-foreground">
                  {example.query}
                </span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {state.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content.map((content, index) => (
                  <div key={index}>
                    {content.type === 'text' && (
                      <p className="whitespace-pre-wrap">{content.text}</p>
                    )}
                    {content.type === 'artifact' && (
                      <div className="mt-2 p-2 bg-background/50 rounded border">
                        <p className="text-sm font-medium">
                          Artifact created: {content.artifactType}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl p-4 rounded-lg bg-muted">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about legal matters, contracts, or request code examples..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
