'use client'

import React, { createContext, useCallback,useContext, useReducer } from 'react'

import { Artifact,ChatAction, ChatContextType, ChatState, Message } from '@/lib/types'
import { nanoid } from '@/lib/utils'

const initialState: ChatState = {
  messages: [],
  artifacts: {
    byId: {},
    order: []
  },
  ui: {
    artifactPanelOpen: false,
    activeArtifactId: undefined
  }
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message]
      }
    
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.messageId
            ? { ...msg, content: action.content }
            : msg
        )
      }
    
    case 'APPEND_TO_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.messageId
            ? { ...msg, content: [...msg.content, action.content] }
            : msg
        )
      }
    
    case 'UPSERT_ARTIFACT':
      const artifact = action.artifact
      const isNew = !state.artifacts.byId[artifact.id]
      
      return {
        ...state,
        artifacts: {
          byId: {
            ...state.artifacts.byId,
            [artifact.id]: artifact
          },
          order: isNew 
            ? [artifact.id, ...state.artifacts.order]
            : state.artifacts.order
        }
      }
    
    case 'SET_ARTIFACT_PANEL_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          artifactPanelOpen: action.open
        }
      }
    
    case 'SET_ACTIVE_ARTIFACT':
      return {
        ...state,
        ui: {
          ...state.ui,
          activeArtifactId: action.artifactId
        }
      }
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        artifacts: {
          byId: {},
          order: []
        }
      }
    
    case 'SET_ARTIFACT_STATUS':
      return {
        ...state,
        artifacts: {
          ...state.artifacts,
          byId: {
            ...state.artifacts.byId,
            [action.artifactId]: {
              ...state.artifacts.byId[action.artifactId],
              status: action.status
            }
          }
        }
      }
    
    default:
      return state
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  
  const addMessage = useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: nanoid(),
      createdAt: new Date().toISOString()
    }
    dispatch({ type: 'ADD_MESSAGE', message: newMessage })
  }, [])
  
  const upsertArtifact = useCallback((artifact: Omit<Artifact, 'createdAt'>) => {
    const newArtifact: Artifact = {
      ...artifact,
      createdAt: Date.now()
    }
    dispatch({ type: 'UPSERT_ARTIFACT', artifact: newArtifact })
  }, [])
  
  const toggleArtifactPanel = useCallback(() => {
    dispatch({ 
      type: 'SET_ARTIFACT_PANEL_OPEN', 
      open: !state.ui.artifactPanelOpen 
    })
  }, [state.ui.artifactPanelOpen])
  
  const setActiveArtifact = useCallback((artifactId?: string) => {
    dispatch({ type: 'SET_ACTIVE_ARTIFACT', artifactId })
    if (artifactId && !state.ui.artifactPanelOpen) {
      dispatch({ type: 'SET_ARTIFACT_PANEL_OPEN', open: true })
    }
  }, [state.ui.artifactPanelOpen])
  
  const contextValue: ChatContextType = {
    state,
    dispatch,
    addMessage,
    upsertArtifact,
    toggleArtifactPanel,
    setActiveArtifact
  }
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}