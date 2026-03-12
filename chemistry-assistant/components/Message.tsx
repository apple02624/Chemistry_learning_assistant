import ReactMarkdown from "react-markdown";

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function Message({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className="w-full flex">
      {/* Assistant */}
      {!isUser && (
        <div className="flex w-full items-start gap-3">
          <div className="text-xl">🤖</div>

          <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gray-200 text-black dark:bg-gray-700 dark:text-white transition">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* User */}
      {isUser && (
        <div className="flex w-full justify-end items-start gap-3">
          <div className="max-w-[75%] px-4 py-3 rounded-2xl bg-gray-200 text-black dark:bg-gray-700 dark:text-white transition">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <div className="text-xl">👤</div>
        </div>
      )}
    </div>
  );
}