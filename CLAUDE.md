# CLAUDE.md - Development Guide

> Development guide for the Claude Agent Template

## Development Environment

### Commands

```bash
pnpm install       # Install dependencies
pnpm dev           # Start development server (http://localhost:3000)
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
```

### GitHub Issue Management

```bash
# View issues
gh issue list                          # List all open issues
gh issue list --state all              # List all issues (open and closed)
gh issue list --label "bug"            # List issues with specific label
gh issue list --assignee @me           # List issues assigned to you

# Create issue
gh issue create                        # Create issue interactively
gh issue create --title "Bug: Fix login" --body "Description here"
gh issue create --title "Feature" --label "enhancement" --assignee "@me"

# View issue details
gh issue view 123                      # View issue #123
gh issue view 123 --web                # Open issue #123 in browser

# Update issue
gh issue edit 123 --title "New title"
gh issue edit 123 --add-label "bug,priority"
gh issue edit 123 --add-assignee "@me"

# Close/Reopen issue
gh issue close 123                     # Close issue #123
gh issue close 123 --comment "Fixed"   # Close with comment
gh issue reopen 123                    # Reopen closed issue

# Comment on issue
gh issue comment 123 --body "Update here"
```

## Environment Setup

Required environment variables (see `.env.example`):
- `ANTHROPIC_API_KEY` - For Claude models (required)

## Architecture Overview

### Agent Chat System

Uses **Claude Agent SDK** for multi-turn tool usage:

**Key Components:**
- `app/api/agent/route.ts` - Agent API using `query()` from SDK
- `components/agent-chat.tsx` - UI for agent streaming
- `lib/mcp-tools.ts` - Custom MCP tools registry
- `lib/mcp-tools/hello-world.ts` - Example MCP tool

**Message Flow:**
```
User Input (components/agent-chat.tsx)
  ↓
POST /api/agent → query({ prompt, options })
  ↓
Agent executes tools across multiple turns
  ↓
Server-Sent Events stream to client
  ↓
UI shows tool usage and results
```

**Agent Configuration:**
- Model: Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Tools: Read, Write, Bash, Grep, Glob, WebSearch + custom MCP tools
- Max turns: 10
- System prompt: See `app/api/agent/route.ts`

### MCP Tools Architecture

Custom tools defined using SDK's `tool()` function.

**Example Tool Structure:**

```typescript
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

export const myTool = tool(
  "tool-name",           // Tool identifier (must be unique)
  "Tool description",    // What the tool does
  {
    // Parameters defined with Zod schemas
    param1: z.string().describe("Parameter description"),
    param2: z.number().optional().describe("Optional parameter"),
  },
  async ({ param1, param2 }) => {
    // Tool implementation
    const result = await doSomething(param1, param2);

    return {
      content: [{
        type: "text" as const,
        text: result,
      }],
    };
  }
);
```

**Tool Registration:**

```typescript
// lib/mcp-tools.ts
import { createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { myTool } from "./mcp-tools/my-tool";

export const customMcpServer = createSdkMcpServer({
  name: "custom-tools",
  version: "1.0.0",
  tools: [myTool],
});
```

**Agent Configuration:**

```typescript
// app/api/agent/route.ts
const result = query({
  prompt: userPrompt,
  options: {
    model: "claude-sonnet-4-5-20250929",
    systemPrompt: "...",
    allowedTools: [
      "Read", "Write", "Bash", "Grep", "Glob", "WebSearch",
      "mcp__0__my-tool", // Custom tool
    ],
    mcpServers: [customMcpServer],
  },
});
```

## Creating Custom Tools

### Step 1: Define Tool Logic

Create a new file in `lib/mcp-tools/`:

```typescript
// lib/mcp-tools/search-database.ts
import { tool } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

export const searchDatabase = tool(
  "search-database",
  "Search database for records matching criteria",
  {
    query: z.string().describe("Search query"),
    limit: z.number().optional().default(10).describe("Max results"),
  },
  async ({ query, limit = 10 }) => {
    try {
      // Your implementation
      const results = await db.search(query, limit);

      return {
        content: [{
          type: "text" as const,
          text: formatResults(results),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text" as const,
          text: `Error: ${error}`,
        }],
        isError: true,
      };
    }
  }
);
```

### Step 2: Register Tool

```typescript
// lib/mcp-tools.ts
import { searchDatabase } from "./mcp-tools/search-database";

export const customMcpServer = createSdkMcpServer({
  name: "custom-tools",
  version: "1.0.0",
  tools: [
    helloWorldTool,
    searchDatabase, // Add new tool
  ],
});
```

### Step 3: Configure Agent

```typescript
// app/api/agent/route.ts
allowedTools: [
  "Read", "Write", "Bash", "Grep", "Glob", "WebSearch",
  "mcp__0__hello-world",
  "mcp__0__search-database", // Add new tool
],
```

### Step 4: Update System Prompt

```typescript
// app/api/agent/route.ts
systemPrompt: `...

# Available Custom Tools

- **search-database**: Search database for records
  - query: Search query string
  - limit: Max results (default: 10)
  - Example: "Search for users with name John"

...`,
```

## Tool Development Best Practices

### Parameter Validation

Use Zod schemas for type-safe parameter validation:

```typescript
{
  email: z.string().email().describe("User email address"),
  age: z.number().min(0).max(120).describe("User age"),
  role: z.enum(["admin", "user", "guest"]).describe("User role"),
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
      content: [{
        type: "text" as const,
        text: result,
      }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text" as const,
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }],
      isError: true,
    };
  }
}
```

### Output Formatting

Return structured, readable output:

```typescript
const formatResults = (items: any[]) => {
  return [
    `Found ${items.length} results:`,
    '',
    ...items.map((item, i) =>
      `${i + 1}. **${item.name}**\n   ${item.description}`
    ),
  ].join('\n');
};
```

## System Prompt Guidelines

A good system prompt should:

1. **Define the role**: What is the agent's purpose?
2. **List available tools**: What tools can be used and when?
3. **Provide examples**: Show how to use tools correctly
4. **Set constraints**: What should the agent avoid?

Example structure:

```typescript
systemPrompt: `You are an AI assistant that helps with [DOMAIN].

# Your Role
- [Role description]
- [Key capabilities]

# Available Custom Tools
- **tool-name**: [Description]
  - Parameters: [List]
  - When to use: [Guidelines]
  - Example: [Usage example]

# Guidelines
- [Behavioral guidelines]
- [Quality standards]
- [Error handling]
`,
```

## Frontend Integration

The agent chat UI (`components/agent-chat.tsx`) handles:

- **Streaming responses**: Server-Sent Events (SSE) from `/api/agent`
- **Tool usage display**: Shows when tools are being called
- **Message history**: Maintains conversation context
- **Session management**: Resumes conversations with session IDs

Key features:

```typescript
// POST to /api/agent
const response = await fetch('/api/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: userInput,
    sessionId: currentSessionId, // Resume conversation
    messages: messageHistory,
  }),
});

// Parse SSE stream
const reader = response.body.getReader();
for await (const chunk of readStream(reader)) {
  const data = JSON.parse(chunk);
  handleMessage(data);
}
```

## Advanced Topics

### Adding External APIs

```typescript
export const fetchWeather = tool(
  "fetch-weather",
  "Get current weather for a city",
  {
    city: z.string().describe("City name"),
  },
  async ({ city }) => {
    const response = await fetch(
      `https://api.weather.com/v1/current?city=${city}`
    );
    const data = await response.json();

    return {
      content: [{
        type: "text" as const,
        text: `Weather in ${city}: ${data.condition}, ${data.temp}°C`,
      }],
    };
  }
);
```

### Database Integration

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const queryUsers = tool(
  "query-users",
  "Query users from database",
  {
    filter: z.string().optional().describe("Filter criteria"),
  },
  async ({ filter }) => {
    const users = await prisma.user.findMany({
      where: filter ? { name: { contains: filter } } : {},
    });

    return {
      content: [{
        type: "text" as const,
        text: formatUsers(users),
      }],
    };
  }
);
```

### File Processing

```typescript
import fs from 'fs/promises';

export const readMarkdown = tool(
  "read-markdown",
  "Read and parse markdown files",
  {
    path: z.string().describe("File path"),
  },
  async ({ path }) => {
    const content = await fs.readFile(path, 'utf-8');
    const parsed = parseMarkdown(content);

    return {
      content: [{
        type: "text" as const,
        text: parsed,
      }],
    };
  }
);
```

## Troubleshooting

### Tool not found

Make sure:
1. Tool is exported from `lib/mcp-tools/your-tool.ts`
2. Tool is imported and added to `customMcpServer` in `lib/mcp-tools.ts`
3. Tool is added to `allowedTools` in `app/api/agent/route.ts` with prefix `mcp__0__`

### Streaming issues

Check:
1. Response headers include `Content-Type: text/event-stream`
2. No errors in browser console
3. SSE format is correct: `data: {...}\n\n`

### Type errors

Ensure:
1. Zod schemas match your parameter types
2. Return type is `{ content: [...] }` or `{ content: [...], isError: true }`
3. TypeScript is properly configured in `tsconfig.json`

## Resources

- **Claude Agent SDK**: [GitHub](https://github.com/anthropics/anthropic-sdk-typescript)
- **Model Context Protocol**: [Website](https://modelcontextprotocol.io/)
- **Zod Documentation**: [Website](https://zod.dev/)
- **Next.js App Router**: [Docs](https://nextjs.org/docs/app)

## Contributing

When contributing to this template:

1. Keep tools simple and focused
2. Document parameters clearly
3. Handle errors gracefully
4. Write clear system prompts
5. Test with various inputs
