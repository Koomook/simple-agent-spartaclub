import { AgentChat } from "@/components/agent-chat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "스파르타 강의 검색 | AI로 찾는 나에게 딱 맞는 강의",
  description: "AI 기반 강의 추천 시스템으로 스파르타코딩클럽의 다양한 강의를 찾아보세요. 무료 강의부터 국비지원 강의까지!",
};

export default function Home() {
  return (
    <div className="flex flex-col size-full items-center">
      <AgentChat />
    </div>
  );
}
