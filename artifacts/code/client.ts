import { Code, Copy, Download } from 'lucide-react';
import { createElement } from 'react';

import type { ArtifactAction } from '@/components/create-artifact';

export const codeArtifact = {
  kind: 'code' as const,
  actions: [
    {
      icon: createElement(Copy, { className: 'w-4 h-4' }),
      label: 'Copy',
      description: 'Copy code to clipboard',
      onClick: async (context: any) => {
        await navigator.clipboard.writeText(context.content);
      },
    },
    {
      icon: createElement(Download, { className: 'w-4 h-4' }),
      label: 'Download',
      description: 'Download as file',
      onClick: async (context: any) => {
        const blob = new Blob([context.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code.txt';
        a.click();
        URL.revokeObjectURL(url);
      },
    },
  ] as ArtifactAction[],
};