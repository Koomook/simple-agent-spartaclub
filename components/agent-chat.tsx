"use client";

import cn from "classnames";
import { toast } from "sonner";
import { useState } from "react";
import { Messages } from "./messages";
import { Footnote } from "./footnote";
import { ArrowUpIcon, StopIcon } from "./icons";
import { Input } from "./input";
import { UIMessage } from "ai";

interface AgentMessage {
  type: string;
  content: unknown;
  timestamp: string;
}

export function AgentChat() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<UIMessage>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);

  const sendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;

    if (promptToSend === "" || isGenerating) {
      return;
    }

    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: promptToSend }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          prompt: promptToSend,
          sessionId: sessionId, // Pass session ID to resume conversation
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let currentAssistantMessage: UIMessage | null = null;
      let buffer = "";
      let currentText = ""; // Track accumulated text for streaming
      const toolMessageMap = new Map<string, UIMessage>(); // Track tool messages by tool_use_id

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: AgentMessage = JSON.parse(line.slice(6));

              // Log all messages for debugging
              console.log("📨 Message received:", data);

              // Handle different message types
              if (data.type === "debug") {
                // Show debug info
                const content = data.content as Record<string, unknown>;
                console.log("🔍 Agent Debug:", content);
              } else if (data.type === "stream_event") {
                // Handle token-by-token streaming events
                const content = data.content as Record<string, unknown>;
                const event = content.event as Record<string, unknown>;

                if (event.type === "content_block_start") {
                  // Start new content block
                  currentText = "";

                  // Create new assistant message if not exists
                  if (!currentAssistantMessage) {
                    currentAssistantMessage = {
                      id: `assistant-${Date.now()}`,
                      role: "assistant",
                      parts: [{ type: "text", text: "" }],
                    };
                    setMessages((prev) => [...prev, currentAssistantMessage!]);
                  }
                } else if (event.type === "content_block_delta") {
                  const delta = event.delta as Record<string, unknown>;
                  if (delta.type === "text_delta" && typeof delta.text === "string") {
                    // Append new token to current text
                    currentText += delta.text;

                    // Update the current assistant message
                    if (currentAssistantMessage) {
                      currentAssistantMessage.parts = [
                        { type: "text", text: currentText },
                      ];
                      setMessages((prev) =>
                        prev.map(m => m.id === currentAssistantMessage!.id ? { ...currentAssistantMessage! } : m)
                      );
                    }
                  }
                } else if (event.type === "content_block_stop") {
                  // Content block complete, prepare for next message
                  currentAssistantMessage = null;
                  currentText = "";
                }
              } else if (data.type === "assistant") {
                // Handle Claude Agent SDK assistant message
                const content = data.content as Record<string, unknown>;
                console.log("💬 Assistant message:", content);

                // Extract message content from SDK format
                const sdkMessage = content.message as Record<string, unknown>;
                if (sdkMessage && Array.isArray(sdkMessage.content)) {
                  // Check for tool use
                  const toolUseBlocks = sdkMessage.content.filter(
                    (block: Record<string, unknown>) => block.type === "tool_use"
                  );

                  // Show tool usage
                  for (const toolBlock of toolUseBlocks) {
                    const toolName = String(toolBlock.name || "unknown");
                    const toolInput = toolBlock.input as Record<string, unknown> || {};
                    const toolUseId = String(toolBlock.id || "");

                    // Create a tool use message
                    const toolMessage: UIMessage = {
                      id: `tool-${toolUseId || Date.now()}-${Math.random()}`,
                      role: "assistant",
                      parts: [{
                        type: "tool" as const,
                        toolName: toolName,
                        toolInput: toolInput,
                        toolUseId: toolUseId,
                      } as any],
                    };
                    toolMessageMap.set(toolUseId, toolMessage);
                    setMessages((prev) => [...prev, toolMessage]);
                  }

                  // Skip showing text content here since it's already been streamed
                  // via stream_event messages (content_block_delta)
                }
              } else if (data.type === "user") {
                // Handle user messages (tool results)
                const content = data.content as Record<string, unknown>;
                const userMessage = content.message as Record<string, unknown>;

                if (userMessage && Array.isArray(userMessage.content)) {
                  // Check for tool results
                  const toolResultBlocks = userMessage.content.filter(
                    (block: Record<string, unknown>) => block.type === "tool_result"
                  );

                  // Update tool messages with results
                  for (const resultBlock of toolResultBlocks) {
                    const toolUseId = String(resultBlock.tool_use_id || "");
                    const toolResult = resultBlock.content;

                    // Find the corresponding tool message and update it
                    const toolMessage = toolMessageMap.get(toolUseId);
                    if (toolMessage && toolMessage.parts[0]) {
                      (toolMessage.parts[0] as any).toolResult = toolResult;

                      // Trigger re-render by updating messages
                      setMessages((prev) => [...prev]);
                    }
                  }
                }
              } else if (data.type === "system") {
                // Handle system messages (tool use, etc)
                const content = data.content as Record<string, unknown>;
                console.log("⚙️ System message:", content);

                if (content.subtype === "init") {
                  // Capture session ID from system init message
                  const newSessionId = content.session_id as string;
                  if (newSessionId && !sessionId) {
                    // Only capture and show status for NEW sessions
                    setSessionId(newSessionId);
                    console.log(`📝 Session ID captured (new): ${newSessionId}`);
                  } else if (newSessionId && sessionId) {
                    // Session already exists, just log (don't show status)
                    console.log(`📝 Session ID (resumed): ${newSessionId}`);
                  }
                }
              } else if (data.type === "result") {
                // Handle final result
                const content = data.content as Record<string, unknown>;
                console.log("✅ Final result:", content);

                // Show final stats
                const statsMessage: UIMessage = {
                  id: `stats-${Date.now()}`,
                  role: "assistant",
                  parts: [{
                    type: "text" as const,
                    text: `✅ **Completed**\n` +
                          `Turns: ${content.num_turns || "N/A"}\n` +
                          `Duration: ${content.duration_ms ? `${Math.round(Number(content.duration_ms) / 1000)}s` : "N/A"}`,
                  }],
                };
                setMessages((prev) => [...prev, statsMessage]);
              }
            } catch (e) {
              console.error("Failed to parse message:", e);
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        toast.info("Generation stopped");
      } else {
        console.error("Error:", error);
        toast.error("An error occurred, please try again!");
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const stop = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full max-w-3xl",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        },
      )}
    >
      {messages.length > 0 ? (
        <Messages messages={messages} status={isGenerating ? "streaming" : "ready"} />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-0.5 sm:text-2xl text-xl w-full">
            <div className="flex flex-row gap-2 items-center">
              <div className="font-bold text-sparta-red">스파르타 강의 검색 💡</div>
            </div>
            <div className="dark:text-zinc-400 text-sparta-gray">
              AI로 찾는 나에게 딱 맞는 강의
            </div>
            <div className="dark:text-zinc-500 text-sparta-gray text-sm mt-2">
              무료 강의부터 국비지원 강의까지 · 실시간 AI 추천
            </div>
          </div>

          {/* Course search scenario buttons */}
          <div className="flex flex-col gap-3 w-full">
            <div className="text-sm dark:text-zinc-400 text-sparta-gray-600 font-medium">
              이런 걸 물어보세요
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => sendMessage("무료로 시작할 수 있는 강의를 추천해줘")}
                className="text-left p-4 rounded-lg border-2 dark:border-sparta-red/30 border-sparta-red/20 dark:bg-zinc-800/50 bg-sparta-pink/30 hover:dark:bg-sparta-red/10 hover:bg-sparta-pink/50 hover:border-sparta-red/40 transition-colors"
              >
                <div className="text-sm font-bold dark:text-zinc-200 text-sparta-dark">
                  💰 무료로 시작하는 강의
                </div>
                <div className="text-xs dark:text-zinc-400 text-sparta-gray mt-1">
                  부담 없이 시작할 수 있는 무료 강의를 찾아드려요
                </div>
              </button>

              <button
                onClick={() => sendMessage("AI나 GPT 관련 강의를 찾아줘")}
                className="text-left p-4 rounded-lg border-2 dark:border-sparta-cyan/30 border-sparta-cyan/20 dark:bg-zinc-800/50 bg-sparta-light-blue/30 hover:dark:bg-sparta-cyan/10 hover:bg-sparta-light-blue/50 hover:border-sparta-cyan/40 transition-colors"
              >
                <div className="text-sm font-bold dark:text-zinc-200 text-sparta-dark">
                  🤖 AI·GPT 강의
                </div>
                <div className="text-xs dark:text-zinc-400 text-sparta-gray mt-1">
                  최신 AI 기술을 배울 수 있는 강의를 추천해드려요
                </div>
              </button>

              <button
                onClick={() => sendMessage("국비지원으로 들을 수 있는 강의를 알려줘")}
                className="text-left p-4 rounded-lg border-2 dark:border-sparta-purple/30 border-sparta-purple/20 dark:bg-zinc-800/50 bg-purple-50 hover:dark:bg-sparta-purple/10 hover:bg-purple-100 hover:border-sparta-purple/40 transition-colors"
              >
                <div className="text-sm font-bold dark:text-zinc-200 text-sparta-dark">
                  🎓 국비지원 강의
                </div>
                <div className="text-xs dark:text-zinc-400 text-sparta-gray mt-1">
                  국비지원으로 부담 없이 배울 수 있는 강의예요
                </div>
              </button>

              <button
                onClick={() => sendMessage("취업이나 이직 준비를 위한 강의를 추천해줘")}
                className="text-left p-4 rounded-lg border-2 dark:border-zinc-600 border-zinc-300 dark:bg-zinc-800/50 bg-zinc-50 hover:dark:bg-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 transition-colors"
              >
                <div className="text-sm font-bold dark:text-zinc-200 text-sparta-dark">
                  💼 취업·이직 준비
                </div>
                <div className="text-xs dark:text-zinc-400 text-sparta-gray mt-1">
                  커리어 성장을 위한 실전 강의를 찾아드려요
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full">
        <div className="flex relative flex-col gap-1 p-3 w-full rounded-2xl dark:bg-zinc-800 bg-zinc-100">
          <Input
            input={input}
            setInput={setInput}
            selectedModelId="sonnet-3.7"
            isGeneratingResponse={isGenerating}
            isReasoningEnabled={false}
            onSubmit={sendMessage}
          />

          <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
            <button
              className={cn(
                "size-8 flex flex-row justify-center items-center bg-sparta-red text-white p-1.5 rounded-full hover:bg-sparta-red-hover hover:scale-105 active:scale-95 transition-all",
                {
                  "bg-sparta-gray-200 text-sparta-gray-600 cursor-not-allowed hover:bg-sparta-gray-200 hover:scale-100":
                    !isGenerating && input === "",
                  "bg-sparta-gray-600 hover:bg-sparta-gray-700":
                    isGenerating,
                },
              )}
              onClick={() => {
                if (input === "") {
                  return;
                }

                if (isGenerating) {
                  stop();
                } else {
                  sendMessage();
                }
              }}
            >
              {isGenerating ? <StopIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <Footnote />
      </div>
    </div>
  );
}