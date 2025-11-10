import { AgentChat } from "@/components/agent-chat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent Chat - Claude Agent SDK",
  description: "Multi-turn agent chat powered by Claude Agent SDK",
};

export default function AgentPage() {
  return (
    <div className="flex flex-col size-full items-center">
      <AgentChat />
    </div>
  );
}