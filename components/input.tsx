"use client";

import { toast } from "sonner";

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModelId: string;
  isGeneratingResponse: boolean;
  isReasoningEnabled: boolean;
  onSubmit: () => void;
}

export function Input({
  input,
  setInput,
  isGeneratingResponse,
  onSubmit,
}: InputProps) {

  return (
    <textarea
      className="mb-12 w-full bg-transparent outline-none resize-none min-h-12 placeholder:text-zinc-400"
      placeholder="궁금한 강의를 물어보세요..."
      value={input}
      autoFocus
      onChange={(event) => {
        setInput(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (input === "") {
            return;
          }

          if (isGeneratingResponse) {
            toast.error("답변이 완료될 때까지 기다려주세요!");

            return;
          }

          onSubmit();
        }
      }}
    />
  );
}
