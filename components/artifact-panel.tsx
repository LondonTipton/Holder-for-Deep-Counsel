'use client'

import React from 'react'

import { Code, File, FileText, Image, MoreHorizontal,Sheet, X } from 'lucide-react'

import { useChat } from '@/lib/chat-context'
import { Artifact } from '@/lib/types'
import { cn, formatDate } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet as SheetUI, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const artifactIcons = {
  code: Code,
  text: FileText,
  document: File,
  image: Image,
  sheet: Sheet,
  plan: FileText,
  diff: Code
}

interface ArtifactPanelProps {
  className?: string
}

export function ArtifactPanel({ className }: ArtifactPanelProps) {
  const { state, toggleArtifactPanel, setActiveArtifact } = useChat()
  const { artifacts, ui } = state
  
  const artifactList = ui.artifactPanelOpen 
    ? artifacts.order.map(id => artifacts.byId[id]).filter(Boolean)
    : []
  
  const activeArtifact = ui.activeArtifactId 
    ? artifacts.byId[ui.activeArtifactId]
    : null

  const handleArtifactSelect = (artifact: Artifact) => {
    setActiveArtifact(artifact.id)
  }

  const handleClosePanel = () => {
    toggleArtifactPanel()
    setActiveArtifact(undefined)
  }

  return (
    <SheetUI open={ui.artifactPanelOpen} onOpenChange={toggleArtifactPanel}>
      <SheetContent 
        side="right" 
        className={cn(
          "w-[400px] sm:w-[540px] lg:w-[640px] xl:w-[800px] overflow-hidden",
          "bg-background border-l border-border",
          className
        )}
      >
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-foreground">
            Artifacts
          </SheetTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClosePanel}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="flex h-full mt-4">
          {/* Artifact List */}
          <div className="w-64 border-r border-border pr-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              All Artifacts ({artifactList.length})
            </h3>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {artifactList.map((artifact) => {
                  const IconComponent = artifactIcons[artifact.type]
                  const isActive = activeArtifact?.id === artifact.id
                  
                  return (
                    <div
                      key={artifact.id}
                      onClick={() => handleArtifactSelect(artifact)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                        "hover:bg-muted/50 hover:border-muted-foreground/20",
                        isActive 
                          ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20" 
                          : "bg-card border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className={cn(
                          "h-4 w-4 mt-0.5 flex-shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-sm font-medium truncate",
                              isActive ? "text-foreground" : "text-foreground"
                            )}>
                              {artifact.title || `${artifact.type} artifact`}
                            </span>
                            <Badge 
                              variant={artifact.status === 'complete' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {artifact.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {formatDate(artifact.createdAt)}
                          </p>
                          {artifact.language && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {artifact.language}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {artifactList.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No artifacts yet</p>
                    <p className="text-xs mt-1">
                      Ask for code, documents, or analysis to create artifacts
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Artifact Content */}
          <div className="flex-1 pl-4">
            {activeArtifact ? (
              <ArtifactViewer artifact={activeArtifact} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Select an artifact to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </SheetUI>
  )
}

interface ArtifactViewerProps {
  artifact: Artifact
}

function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  const IconComponent = artifactIcons[artifact.type]
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <IconComponent className="h-5 w-5 text-primary" />
          <div>
            <h4 className="font-medium text-foreground">
              {artifact.title || `${artifact.type} artifact`}
            </h4>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(artifact.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {artifact.status}
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
              {artifact.content}
            </pre>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}