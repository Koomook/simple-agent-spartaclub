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

When working with GitHub issues, use the `gh` CLI command:

```bash
gh issue list                          # List all open issues
```

**Note**: For all GitHub-related operations (viewing, creating, editing, closing issues), always use `gh` commands via the Bash tool.

### Git Worktree Management

Use the `./wt` script to create isolated worktrees for feature branches. This allows you to work on multiple branches simultaneously without switching contexts.

**Usage:**

```bash
./wt feature/new-feature              # Create worktree for new branch
./wt feature/existing-branch          # Create worktree for existing branch
```

**What it does:**

1. Creates a new git worktree in `../feature/new-feature`
2. Copies `.env` file to the new worktree
3. Installs dependencies with `pnpm install`
4. Ready to use - just `cd ../feature/new-feature`

**Example workflow:**

```bash
# Working on main branch
./wt feature/add-auth               # Create worktree for auth feature
cd ../feature/add-auth              # Switch to new worktree
pnpm dev                            # Start dev server for this branch
```

## Environment Setup

Required environment variables (see `.env.example`):
- `ANTHROPIC_API_KEY` - For Claude models (required)

## Working with Claude Agent SDK

For detailed information about the architecture, creating custom tools, and advanced usage patterns, see [README.md](./README.md).

The README covers:
- Architecture overview (Agent Chat System, MCP Tools Architecture)
- Creating custom tools (step-by-step guide)
- Tool development best practices
- System prompt guidelines
- Frontend integration
- Advanced topics (External APIs, Database, File Processing)
- Troubleshooting

## Project Structure

```
simple-agent-spartaclub/
├── app/
│   ├── api/agent/route.ts          # Agent API endpoint with streaming
│   ├── layout.tsx                  # Root layout with Sparta branding
│   ├── page.tsx                    # Main chat interface
│   └── globals.css                 # Global styles with brand colors
├── components/
│   ├── agent-chat.tsx              # Main chat UI component
│   ├── input.tsx                   # Chat input with auto-resize
│   └── footnote.tsx                # Footer with branding
├── lib/
│   ├── mcp-tools.ts                # MCP tools registry
│   └── mcp-tools/
│       ├── hello-world.ts          # Example MCP tool
│       └── search-courses.ts       # Sparta course search tool
├── prisma/
│   ├── schema.prisma               # Database schema (Sparta courses)
│   └── seed.ts                     # Database seeding script
├── .claude/
│   ├── commands/
│   │   └── solve-github-issue.md   # TDD workflow for GitHub issues
│   ├── agents/
│   │   ├── github-issue-planner.md # Issue analysis agent
│   │   └── github-issue-manager.md # Issue management agent
│   └── prompts.md                  # System prompts library
├── wt                              # Git worktree helper script
├── CLAUDE.md                       # This file
├── README.md                       # Architecture & implementation guide
└── PLAN.md                         # Development roadmap
```
