import { AgentChat } from "@/components/agent-chat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스파르타코딩클럽 강의 검색",
  description: "스파르타코딩클럽의 48개 강의를 AI로 쉽게 찾아보세요",
};

export default function Home() {
  return (
    <div className="flex flex-col size-full items-center">
      <AgentChat />
    </div>
  );
}
