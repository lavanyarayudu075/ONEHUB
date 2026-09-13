import { useState, useRef, useEffect } from "react";
import { BrainCircuit, Send, Sparkles, RotateCcw } from "lucide-react";

// Default stats used if the parent Dashboard doesn't pass real numbers in yet.
// Once you wire this to real backend data, just pass a `stats` prop from
// Dashboard.jsx, e.g. <AiInsightsChat stats={{ totalMembers, activeTasks, ... }} />
const DEFAULT_STATS = {
  totalMembers: 1248,
  activeTasks: 24,
  completedTasks: 856,
  productivity: 92.4,
  productivityGrowth: 6.8,
  topDepartment: "Operations",
};

const QUICK_PROMPTS = [
  "How's overall productivity?",
  "Which department is performing best?",
  "Give me a task completion summary",
  "Any suggestions to improve?",
];

function buildInitialMessage(stats) {
  return `Organisation productivity increased by ${stats.productivityGrowth}% this month. Your ${stats.topDepartment} department has the highest task completion rate. Ask me anything about your organisation's performance.`;
}

function generateAIResponse(rawMessage, stats) {
  const message = rawMessage.toLowerCase();

  if (/(hi|hello|hey)\b/.test(message)) {
    return "Hey! I'm your ONEHUB AI assistant. Ask me about productivity, departments, tasks, or team performance.";
  }

  if (message.includes("productiv") || message.includes("performance")) {
    return `Overall productivity is at ${stats.productivity}%, up ${stats.productivityGrowth}% from last month. That's driven mainly by faster task turnaround in ${stats.topDepartment} and fewer overdue items across teams.`;
  }

  if (message.includes("department")) {
    return `${stats.topDepartment} currently has the highest task completion rate across all departments. If other departments adopted similar workflows (shorter review cycles, clearer task ownership), overall completion rate could improve by an estimated 8-10%.`;
  }

  if (message.includes("task") || message.includes("completion")) {
    return `You have ${stats.activeTasks} active tasks and ${stats.completedTasks} completed so far. That's a healthy completion ratio. I'd recommend reviewing tasks that have been "In Progress" for more than 5 days to prevent bottlenecks.`;
  }

  if (message.includes("member") || message.includes("team") || message.includes("employee") || message.includes("staff")) {
    return `Your organisation has ${stats.totalMembers} members. Engagement looks strongest in departments with smaller team sizes and more frequent check-ins — consider replicating that structure in larger teams.`;
  }

  if (message.includes("improve") || message.includes("suggest") || message.includes("recommend")) {
    return `Here are 3 quick wins: 1) Redistribute tasks from overloaded members to balance workload, 2) Set due-date reminders for tasks nearing deadline, 3) Review departments with completion rates below 70% for process bottlenecks.`;
  }

  if (message.includes("help") || message.includes("what can you do")) {
    return "I can summarize productivity trends, compare department performance, break down task completion, and suggest improvements. Try asking something like \"which department needs attention?\"";
  }

  return `I don't have a specific insight for that yet, but here's a quick snapshot: productivity is up ${stats.productivityGrowth}% this month, ${stats.topDepartment} leads in completion rate, and there are ${stats.activeTasks} active tasks in flight. Try asking about productivity, departments, tasks, or team performance.`;
}

function AiInsightsChat({ stats = DEFAULT_STATS }) {
  const [messages, setMessages] = useState(() => [
    { id: 1, role: "ai", text: buildInitialMessage(stats) },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const delay = 500 + Math.random() * 500;
    setTimeout(() => {
      const reply = generateAIResponse(trimmed, stats);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "ai", text: reply },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([{ id: Date.now(), role: "ai", text: buildInitialMessage(stats) }]);
    setInput("");
    setIsTyping(false);
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-600 dark:text-cyan-300">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 transition-colors duration-500 dark:text-white">
              AI Insights
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Powered by ONEHUB AI
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          title="Reset conversation"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="mb-4 flex-1 space-y-3 overflow-y-auto pr-1"
        style={{ maxHeight: "320px", minHeight: "220px" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950"
                  : "border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts (only shown before the user has sent anything) */}
      {messages.length === 1 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-3 py-1.5 text-xs text-cyan-700 transition hover:bg-cyan-500/10 dark:border-cyan-400/20 dark:bg-cyan-400/5 dark:text-cyan-300 dark:hover:bg-cyan-400/10"
            >
              <Sparkles className="h-3 w-3" />
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about productivity, departments, tasks..."
          className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default AiInsightsChat;