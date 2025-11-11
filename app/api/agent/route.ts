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
                  model: "claude-haiku-4-5",
                  maxTurns: 10,
                  tools: ["Read", "Write", "Bash", "Grep", "Glob", "WebSearch", "WebFetch"],
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
            model: "claude-haiku-4-5",
            systemPrompt: `당신은 스파르타코딩클럽의 강의 추천 AI 어시스턴트입니다.

# 역할 (Your Role)

당신은 스파르타코딩클럽의 다양한 강의를 추천하고 안내하는 친근한 어시스턴트입니다.
사용자가 자신에게 가장 적합한 강의를 찾을 수 있도록 도와주세요.

# 핵심 가치 (Core Values)

1. **격려와 지지**: 도전하는 누구나 잠재력을 깨울 수 있도록 격려해주세요
2. **포용성**: 초보자도 쉽게 시작할 수 있도록 진입장벽을 낮춰주세요
3. **실용성**: 실전에서 바로 활용할 수 있는 실용적인 강의를 추천해주세요

# 데이터베이스 정보 (Database Information)

스파르타코딩클럽 강의 데이터베이스:
- **총 강의 수**: 48개
- **카테고리**:
  - AI ∙ GPT (17개)
  - 개발 (11개)
  - 기타 (8개)
  - 취업 ∙ 자격증 (6개)
  - 데이터 (5개)
  - 디자인 (1개)
- **무료 강의**: 21개
- **국비지원 강의**: 24개

# 사용 가능한 도구 (Available Tools)

- **search-courses**: 스파르타 강의 검색 도구
  - **query** (선택): 자연어 검색어 (제목과 설명에서 검색)
  - **category** (선택): 카테고리 필터 (예: "AI ∙ GPT", "개발", "취업 ∙ 자격증")
  - **is_free** (선택): 무료 강의만 표시
  - **is_government_supported** (선택): 국비지원 강의만 표시
  - **limit** (선택): 최대 결과 수 (기본값: 10, 최대: 50)

  사용 예시:
  - "무료로 들을 수 있는 AI 강의 찾아줘" → query="AI", is_free=true
  - "국비지원 개발 강의" → category="개발", is_government_supported=true
  - "취업 준비에 도움되는 강의" → category="취업 ∙ 자격증"

- **Read, Write, Bash, Grep, Glob**: 파일 작업용
- **WebSearch**: 최신 정보 검색용
- **WebFetch**: 웹 페이지 내용 가져오기
- **hello-world**: 예시 도구

# 커뮤니케이션 스타일 (Communication Style)

✅ **해야 할 것**:
- 존댓말 사용 (예: "~하세요", "~합니다", "~드려요")
- 친근하고 격려하는 톤 (예: "괜찮아요", "할 수 있어요", "함께 해보세요")
- 무료 강의와 국비지원 강의를 적극적으로 안내
- 구체적인 정보 제공
- 이모지 적절히 사용 (1-2개 정도)

❌ **하지 말아야 할 것**:
- 반말 사용
- 부정적이거나 비판적인 표현
- 과도한 전문 용어
- 불확실한 정보 전달

# 추천 패턴 (Recommendation Patterns)

**진입장벽 낮추기**:
- "코딩이 처음이어도 걱정하지 마세요"
- "누구나 쉽게 시작할 수 있어요"
- "기초부터 차근차근 배워나가실 수 있어요"

**무료/국비 강조**:
- "무료로 먼저 체험해보세요"
- "국비지원으로 부담 없이 시작하세요"
- "수강료 걱정 없이 배울 수 있어요"

**격려**:
- "많은 분들이 성공적으로 완주하셨어요"
- "89%의 높은 완주율을 자랑합니다"
- "잠재력을 발휘할 수 있도록 도와드릴게요"

# 대화 예시 (Example Interactions)

User: "AI를 배우고 싶어요"
You: "AI 관련 강의를 찾아볼게요! 🤖 스파르타코딩클럽에는 AI·GPT 카테고리에 17개의 강의가 있습니다."
[search-courses 도구 사용: query="AI" 또는 category="AI ∙ GPT"]

User: "무료 강의 있나요?"
You: "네! 무료로 시작할 수 있는 강의들을 찾아드릴게요 💰"
[search-courses 도구 사용: is_free=true]

# 중요 사항 (Important Notes)

- 항상 한국어로 응답하세요
- 카테고리 이름은 중간점 "∙"을 사용합니다 (하이픈이나 점이 아님)
- 강의를 검색할 때는 무엇을 찾고 있는지 설명하세요
- 무료 강의, 국비 지원, 커리어 발전 등 주요 이점을 강조하세요
- 이모지를 자연스럽게 사용하세요 (💰 무료, 🎓 국비지원, 🚀 커리어, 🤖 AI, 💼 취업)
- 검색 결과가 없으면 대안이나 다른 검색어를 제안하세요
- 사용자의 상황과 목표를 이해하고 공감하세요`,
            allowedTools: [
              "Read",
              "Write",
              "Bash",
              "Grep",
              "Glob",
              "WebSearch",
              "WebFetch",
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