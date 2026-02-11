import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSession } from "../context/SessionContext";
import { useAuth } from "../context/AuthContext";


export default function TestChatPage() {
  const navigate = useNavigate();

  const { session } = useSession();
  const { user } = useAuth();

  console.log("CHAT SESSION: ",session)
  
useEffect(() => {
  if (!session) return;

  const channel = supabase
    .channel("messages-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `session_id=eq.${session.id}`,
      },
      (payload) => {
        const msg = payload.new;

        // ⭐ IMPORTANT: Ignore own messages
        if (msg.sender_id === user.id) return;

        setMessages(prev => [
          ...prev,
          {
            id: msg.id,
            sender: "other",
            text: msg.text,
          },
        ]);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [session?.id, user?.id]);


  const [messages, setMessages] = useState([
    { id: 1, sender: "other", text: "Hey 👋" },
    { id: 2, sender: "me", text: "Hi! This is a test chat." },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim() || !session) return;

    const newMessage = {
      session_id: session.id,
      sender_id: user.id,
      text: input,
    };

    // ⭐ Update UI instantly (optimistic update)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "me",
        text: input,
      },
    ]);

    setInput("");

    // ⭐ Insert ONLY this message
    const { error } = await supabase
      .from("messages")
      .insert(newMessage);

    if (error) {
      console.error("Message insert error:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0b0b0c] text-white">

      {/* HEADER */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="text-white/60 hover:text-white"
        >
          ←
        </button>
        <div>
          <p className="font-medium">Test Match</p>
          <p className="text-xs text-white/50">online</p>
        </div>
      </div>

      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "me"
                  ? "bg-[#f3b6c0] text-black rounded-br-md"
                  : "bg-white/10 text-white rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="px-4 py-3 border-t border-white/10 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type something…"
          className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm outline-none"
        />
        <button
          onClick={sendMessage}
          className="rounded-full bg-[#f3b6c0] px-5 text-sm font-medium text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}
