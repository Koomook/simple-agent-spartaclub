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
# 
gh issue ...
```

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

**Benefits:**

- Work on multiple features simultaneously
- No need to stash/commit changes when switching tasks
- Each worktree has its own `node_modules` and build output
- Share git history but maintain separate working directories

**Example workflow:**

```bash
# Working on main branch
./wt feature/add-auth               # Create worktree for auth feature
cd ../feature/add-auth              # Switch to new worktree
pnpm dev                            # Start dev server for this branch

# In another terminal, work on a different feature
cd ~/github/simple-agent-spartaclub
./wt feature/ui-improvements        # Create another worktree
cd ../feature/ui-improvements
pnpm dev                            # Run on different port
```

**Cleanup:**

```bash
git worktree remove ../feature/branch-name    # Remove worktree when done
git worktree list                              # View all worktrees
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

## Key Files

- `app/api/agent/route.ts` - Agent API endpoint
- `components/agent-chat.tsx` - Chat UI component
- `lib/mcp-tools.ts` - MCP tools registry
- `lib/mcp-tools/` - Custom tool implementations
