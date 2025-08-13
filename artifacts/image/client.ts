import { Copy, Download } from 'lucide-react';
import { createElement } from 'react';

import type { ArtifactAction } from '@/components/create-artifact';

export const imageArtifact = {
  kind: 'image' as const,
  actions: [
    {
      icon: createElement(Copy, { className: 'w-4 h-4' }),
      label: 'Copy',
      description: 'Copy image URL to clipboard',
      onClick: async (context: any) => {
        await navigator.clipboard.writeText(context.content);
      },
    },
    {
      icon: createElement(Download, { className: 'w-4 h-4' }),
      label: 'Download',
      description: 'Download image',
      onClick: async (context: any) => {
        const a = document.createElement('a');
        a.href = context.content;
        a.download = 'image.png';
        a.click();
      },
    },
  ] as ArtifactAction[],
};