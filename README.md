# Deep Counsel AI Chat

An intelligent legal AI chat interface combining the beautiful design system of [Morphic](https://github.com/miurla/morphic) with the powerful artifact capabilities of [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot).

## Features

### From Morphic 🎨
- Beautiful, responsive UI design
- Advanced theming and typography
- Smooth animations and transitions
- Comprehensive color system
- Mobile-optimized chat interface

### From Vercel AI Chatbot 🛠️
- Multi-pane chat UI with artifacts panel
- Code execution and display
- Document and sheet editing
- Image generation and editing
- Streaming message support
- Artifact versioning and management

### Unified Experience 🚀
- Seamless integration of both design and functionality
- Consistent theming across all artifact types
- Unified message schema supporting both text and artifacts
- Responsive artifact panel that adapts to screen size
- Enhanced legal AI capabilities for document analysis

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/LondonTipton/Holder-for-Deep-Counsel.git
cd Holder-for-Deep-Counsel

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# AI Provider Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Database (Optional)
DATABASE_URL=your_database_url

# Authentication (Optional)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture

### Message Schema
```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: MessageContent[]
  createdAt: string
}

interface MessageContent {
  type: 'text' | 'artifact'
  text?: string
  artifactId?: string
  artifactType?: 'code' | 'document' | 'image' | 'sheet'
}
```

### Artifact System
- **Code Artifacts**: Syntax-highlighted code with execution capabilities
- **Document Artifacts**: Rich text editing with markdown support  
- **Image Artifacts**: Image generation and editing tools
- **Sheet Artifacts**: Spreadsheet functionality with data visualization

## Legal AI Capabilities

This interface is specifically designed for legal professionals with:

- **Document Analysis**: AI-powered contract and legal document review
- **Legal Research**: Intelligent case law and statute analysis
- **Brief Generation**: Automated legal brief writing assistance
- **Compliance Checking**: Regulatory compliance analysis
- **Precedent Mining**: Relevant case law discovery

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Morphic](https://github.com/miurla/morphic) - For the beautiful UI design system
- [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot) - For the artifact functionality
- [Vercel AI SDK](https://github.com/vercel/ai) - For AI integration capabilities
- [Next.js](https://nextjs.org/) - For the React framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling

---

**Deep Counsel** - Transforming Legal Practice Through Advanced AI