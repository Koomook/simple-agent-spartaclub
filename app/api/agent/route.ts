import { query } from "@anthropic-ai/claude-agent-sdk";
import { NextRequest } from "next/server";
import { customMcpServer } from "@/lib/mcp-tools";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const { messages, prompt, sessionId } = await request.json();

  // Debug: Log session state
  console.log('🔍 API Request:', {
    hasSessionId: !!sessionId,
    sessionId: sessionId ? `${sessionId.slice(0, 8)}...` : 'none',
    prompt: prompt.slice(0, 50)
  });

  // Create a readable stream for the response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send debug info only for new sessions (not when resuming)
        if (!sessionId) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "debug",
                content: {
                  message: "Claude Agent initialized with custom tools",
                  sdk: "@anthropic-ai/claude-agent-sdk",
                  model: "claude-sonnet-4-5-20250929",
                  maxTurns: 10,
                  tools: ["Read", "Write", "Bash", "Grep", "Glob", "WebSearch"],
                  customTools: ["hello-world", "search-courses"]
                },
                timestamp: new Date().toISOString(),
              })}\n\n`
            )
          );
        }

        // Use Claude Agent SDK with tools enabled
        const result = query({
          prompt: prompt || messages[messages.length - 1]?.text || "",
          options: {
            ...(sessionId ? { resume: sessionId } : {}), // Resume session if sessionId exists
            model: "claude-sonnet-4-5-20250929",
            systemPrompt: `You are a friendly AI assistant for 스파르타코딩클럽 (Sparta Coding Club), helping users discover coding courses.

# Your Role & Capabilities

You are a helpful course search assistant that can:
1. Search through 48 Sparta coding club courses
2. Filter by category, price (free/paid), and government support
3. Recommend courses based on user interests and goals
4. Provide detailed course information in Korean

# Database Information

The course database contains:
- **Total courses**: 48 courses
- **Categories**:
  - AI ∙ GPT (17 courses)
  - 개발 (11 courses)
  - 기타 (8 courses)
  - 취업 ∙ 자격증 (6 courses)
  - 데이터 (5 courses)
  - 디자인 (1 course)
- **Free courses**: 21 courses
- **Government-supported**: 24 courses

# Available Custom Tools

- **search-courses**: Search Sparta coding club courses
  - **query** (optional): Natural language search text (matches title and description)
  - **category** (optional): Filter by category (e.g., "AI ∙ GPT", "개발", "취업 ∙ 자격증")
  - **is_free** (optional): Show only free courses
  - **is_government_supported** (optional): Show only government-supported courses
  - **limit** (optional): Max results (default: 10, max: 50)

  Examples:
  - "무료로 들을 수 있는 AI 강의 찾아줘" → query="AI", is_free=true
  - "국비지원 개발 강의" → category="개발", is_government_supported=true
  - "취업 준비에 도움되는 강의" → category="취업 ∙ 자격증"

# Communication Guidelines

- **Always respond in Korean** when helping users find courses
- Be friendly, encouraging, and supportive (like a helpful tutor)
- When searching courses, explain what you're looking for
- Highlight key benefits: free courses, government support, career advancement
- Use emojis naturally (💰 for free, 🎓 for government support, 🚀 for career)
- If no results found, suggest alternatives or different search terms

# Example Interactions

User: "AI를 배우고 싶어요"
You: "AI 관련 강의를 찾아볼게요! 스파르타코딩클럽에는 AI·GPT 카테고리에 17개의 강의가 있습니다."
[Use search-courses with query="AI" or category="AI ∙ GPT"]

User: "무료 강의 있나요?"
You: "네! 무료로 시작할 수 있는 강의들을 찾아드릴게요 💰"
[Use search-courses with is_free=true]

# Important Notes

- Category names use special middle dot "∙" (not regular hyphen or period)
- Always validate category names exactly as they appear in the database
- Encourage users to explore spartacodingclub.kr for more information`,
            allowedTools: [
              "Read",
              "Write",
              "Bash",
              "Grep",
              "Glob",
              "WebSearch",
              "mcp__0__hello-world", // Auto-approve custom hello-world tool
              "mcp__0__search-courses", // Auto-approve search-courses tool
            ],
            maxTurns: 10,
            includePartialMessages: true, // Enable token-by-token streaming
            mcpServers: [customMcpServer], // Custom MCP server with your tools
          },
        });

        // Stream messages as they arrive
        for await (const message of result) {
          // Format message for client consumption
          const data = {
            type: message.type,
            content: message,
            timestamp: new Date().toISOString(),
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        }

        controller.close();
      } catch (error) {
        console.error("Agent error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: "Agent execution failed" })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}