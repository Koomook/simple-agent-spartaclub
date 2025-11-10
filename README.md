# Claude Agent Template

A Next.js template for building AI agents with Claude Agent SDK and custom MCP tools.

## Features

- **Claude Agent SDK Integration** - Multi-turn agentic workflows with Claude Sonnet 4.5
- **Custom MCP Tools** - Extend agent capabilities with your own tools
- **Real-time Streaming** - Server-sent events for token-by-token responses
- **Modern UI** - Built with Next.js 15, React 19, and Tailwind CSS
- **TypeScript** - Fully typed for better DX

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Anthropic API Key ([Get one here](https://console.anthropic.com/))

### Setup

1. **Clone and install dependencies**

   ```bash
   git clone <your-repo-url>
   cd claude-agent-template
   pnpm install
   ```

2. **Set up environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. **Run development server**

   ```bash
   pnpm dev
   ```

   Open http://localhost:3000 in your browser.

## Project Structure

```
/
├── app/
│   ├── api/agent/route.ts     # Agent API endpoint (Claude SDK integration)
│   └── page.tsx               # Main chat interface
├── components/
│   └── agent-chat.tsx         # Chat UI component
├── lib/
│   ├── mcp-tools.ts           # MCP tools registry
│   └── mcp-tools/
│       └── hello-world.ts     # Example MCP tool
└── .env.example               # Environment variables template
```

## Adding Custom Tools

This template includes a simple `hello-world` tool as an example. To add your own tools:

### 1. Create a new tool file

Create a new file in `lib/mcp-tools/`:

```typescript
// lib/mcp-tools/my-tool.ts
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

export const myTool = tool(
  "my-tool",
  "Description of what your tool does",
  {
    // Define parameters using Zod schemas
    param1: z.string().describe("Description of param1"),
    param2: z.number().optional().describe("Optional param2"),
  },
  async ({ param1, param2 }) => {
    // Implement your tool logic here
    const result = doSomething(param1, param2);

    return {
      content: [{
        type: "text" as const,
        text: result,
      }],
    };
  }
);
```

### 2. Register the tool

Add your tool to `lib/mcp-tools.ts`:

```typescript
import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { helloWorldTool } from "./mcp-tools/hello-world";
import { myTool } from "./mcp-tools/my-tool"; // Import your tool

export const customMcpServer = createSdkMcpServer({
  name: "custom-tools",
  version: "1.0.0",
  tools: [
    helloWorldTool,
    myTool, // Add your tool here
  ],
});
```

### 3. Update the agent configuration

Add your tool to the allowed tools in `app/api/agent/route.ts`:

```typescript
allowedTools: [
  "Read",
  "Write",
  "Bash",
  "Grep",
  "Glob",
  "WebSearch",
  "mcp__0__hello-world",
  "mcp__0__my-tool", // Add your tool here
],
```

### 4. Update the system prompt (optional)

Update the system prompt in `app/api/agent/route.ts` to describe when and how to use your tool.

## Available Built-in Tools

The agent has access to these built-in tools:

- **Read** - Read files from the filesystem
- **Write** - Write files to the filesystem
- **Bash** - Execute bash commands
- **Grep** - Search file contents using regex
- **Glob** - Find files matching patterns
- **WebSearch** - Search the web

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **AI SDK**: Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)
- **Model**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **UI**: React 19, Tailwind CSS, Framer Motion
- **Language**: TypeScript

## Use Cases

This template is great for building:

- **Domain-specific assistants** - Add tools for database queries, API calls, file processing
- **Workflow automation** - Create tools for repetitive tasks in your domain
- **Custom chatbots** - Extend agent capabilities with external services
- **Research tools** - Build tools for data analysis, report generation, etc.

## Learn More

- [Claude Agent SDK Documentation](https://docs.anthropic.com/en/docs/agents)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic API Reference](https://docs.anthropic.com/en/api)

## Development

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint
```

## License

MIT
