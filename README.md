# Claude Agent Template

A Next.js template for building AI agents with Claude Agent SDK and custom MCP tools.

## Overview

This template provides a complete foundation for building AI agents powered by Claude Sonnet 4.5. It demonstrates how to create custom tools, integrate with external services, and build interactive chat interfaces with real-time streaming.

## Features

- **Multi-turn Agent Workflows** - Built on Claude Agent SDK for complex task execution
- **Custom MCP Tools** - Easy-to-extend tool system with type safety
- **Real-time Streaming** - Server-sent events for responsive user experience
- **Modern Stack** - Next.js 15, React 19, Tailwind CSS, TypeScript
- **Built-in Tools** - File operations, bash commands, web search, and more

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

## Architecture

### System Overview

The agent system is built on three core components:

1. **Agent API** (`app/api/agent/route.ts`) - Handles requests, manages conversation state, and streams responses
2. **MCP Tools** (`lib/mcp-tools/`) - Custom tools that extend agent capabilities
3. **Chat UI** (`components/agent-chat.tsx`) - Interactive interface with real-time streaming

### Message Flow

```
User Input
  ↓
POST /api/agent → query({ prompt, options })
  ↓
Agent executes tools across multiple turns
  ↓
Server-Sent Events stream to client
  ↓
UI displays tool usage and results
```

### Agent Configuration

- **Model**: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **Built-in Tools**: Read, Write, Bash, Grep, Glob, WebSearch
- **Custom Tools**: Defined via MCP (Model Context Protocol)
- **Max Turns**: 10 per conversation
- **Streaming**: Yes (Server-Sent Events)

## Creating Custom Tools

### Tool Structure

Tools are defined using the `tool()` function from the Claude Agent SDK:

```typescript
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

export const searchDatabase = tool(
  "search-database",              // Unique tool name
  "Search database records",      // Description for the agent
  {
    query: z.string().describe("Search query"),
    limit: z.number().optional().default(10).describe("Max results"),
  },
  async ({ query, limit = 10 }) => {
    // Implementation
    const results = await db.search(query, limit);

    return {
      content: [{
        type: "text" as const,
        text: JSON.stringify(results, null, 2),
      }],
    };
  }
);
```

### Integration Steps

**1. Create tool file** in `lib/mcp-tools/your-tool.ts`

**2. Register in `lib/mcp-tools.ts`:**

```typescript
import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { searchDatabase } from "./mcp-tools/search-database";

export const customMcpServer = createSdkMcpServer({
  name: "custom-tools",
  version: "1.0.0",
  tools: [searchDatabase],
});
```

**3. Configure in `app/api/agent/route.ts`:**

```typescript
allowedTools: [
  "Read", "Write", "Bash", "Grep", "Glob", "WebSearch",
  "mcp__0__search-database", // Add with mcp__0__ prefix
],
```

**4. Update system prompt** (optional) to guide tool usage

## Best Practices

### Parameter Validation

Use Zod for type-safe parameter validation:

```typescript
{
  email: z.string().email().describe("User email"),
  age: z.number().min(0).max(120).describe("User age"),
  role: z.enum(["admin", "user", "guest"]).describe("Role"),
  tags: z.array(z.string()).optional().describe("Optional tags"),
}
```

### Error Handling

Always handle errors gracefully:

```typescript
async ({ param }) => {
  try {
    const result = await riskyOperation(param);
    return {
      content: [{ type: "text" as const, text: result }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text" as const,
        text: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
      }],
      isError: true,
    };
  }
}
```

### System Prompts

Good system prompts should:

1. Define the agent's role and purpose
2. List available tools with usage guidelines
3. Provide examples of correct tool usage
4. Set clear constraints and expectations

## Advanced Examples

### External API Integration

```typescript
export const fetchWeather = tool(
  "fetch-weather",
  "Get weather for a city",
  { city: z.string().describe("City name") },
  async ({ city }) => {
    const response = await fetch(`https://api.weather.com/v1/current?city=${city}`);
    const data = await response.json();
    return {
      content: [{
        type: "text" as const,
        text: `${city}: ${data.condition}, ${data.temp}°C`,
      }],
    };
  }
);
```

### Database Queries

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queryUsers = tool(
  "query-users",
  "Query users from database",
  { filter: z.string().optional() },
  async ({ filter }) => {
    const users = await prisma.user.findMany({
      where: filter ? { name: { contains: filter } } : {},
    });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(users) }],
    };
  }
);
```

## Troubleshooting

**Tool not found**
- Verify tool is exported from `lib/mcp-tools/your-tool.ts`
- Check it's imported in `lib/mcp-tools.ts`
- Ensure it's added to `allowedTools` with `mcp__0__` prefix

**Streaming issues**
- Verify `Content-Type: text/event-stream` header
- Check browser console for errors
- Ensure SSE format: `data: {...}\n\n`

**Type errors**
- Match Zod schemas to parameter types
- Return `{ content: [...] }` or `{ content: [...], isError: true }`

## Resources

- [Claude Agent SDK](https://docs.claude.com/en/docs/agent-sdk/overview)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## Contributing

Guidelines for contributions:
- Keep tools focused and simple
- Document parameters clearly
- Handle all error cases
- Write descriptive system prompts
- Test with various inputs

## License

MIT
