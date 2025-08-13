'use client'

import React from 'react'

import { FileText, PanelRight } from 'lucide-react'

import { useChat } from '@/lib/chat-context'
import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function Header() {
  const { state, toggleArtifactPanel } = useChat()
  const { artifacts, ui } = state
  
  const artifactCount = artifacts.order.length
  const hasArtifacts = artifactCount > 0

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Deep Counsel
            </span>
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other controls can go here */}
          </div>
          
          <nav className="flex items-center space-x-2">
            {/* Artifact Panel Toggle */}
            <Button
              variant={ui.artifactPanelOpen ? "secondary" : "ghost"}
              size="sm"
              onClick={toggleArtifactPanel}
              className={cn(
                "relative",
                hasArtifacts && !ui.artifactPanelOpen && "text-primary"
              )}
            >
              <PanelRight className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Artifacts</span>
              {hasArtifacts && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {artifactCount}
                </Badge>
              )}
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Other controls */}
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">New Chat</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
