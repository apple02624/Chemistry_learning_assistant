import { useState } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function InputBox({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form reload

      if (!e.shiftKey) {
        handleSend(); // send if just Enter
      }
    }
  };

  return (
    <div className="p-4 flex gap-2">
      <input
        className="flex-1 border rounded-xl px-4 py-3 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}  // 👈 added
        placeholder="Ask a chemistry question..."
      />

      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
}