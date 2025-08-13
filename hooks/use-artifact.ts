import { useState, useCallback } from 'react';

// Initial artifact data
export const initialArtifactData = {
  id: '',
  title: '',
  content: '',
  kind: 'text' as const,
  isVisible: false,
};

// Custom hook for artifact management
export function useArtifact() {
  const [artifact, setArtifact] = useState(null);
  
  const updateArtifact = useCallback((newArtifact: any) => {
    setArtifact(newArtifact);
  }, []);
  
  const clearArtifact = useCallback(() => {
    setArtifact(null);
  }, []);
  
  return {
    artifact,
    setArtifact,
    updateArtifact,
    clearArtifact,
  };
}