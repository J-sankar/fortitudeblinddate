import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useSession } from "../context/SessionContext";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
  const navigate = useNavigate();
  const { session } = useSession();
  const { user, profile } = useAuth();
  const typingChannelRef = useRef(null);
  const bottomRef = useRef(null);

  const [localMessageCount, setLocalMessageCount] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const MAX_MESSAGES = 100;
  const messagesLeft = localMessageCount != null ? Math.max(MAX_MESSAGES - localMessageCount, 0) : null;

  // 1. Listen for Session Updates (Message Count)
  useEffect(() => {
    if (!session?.id) return;
    setLocalMessageCount(session.message_count || 0);

    const channel = supabase
      .channel(`session-updates-${session.id}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "sessions",
        filter: `id=eq.${session.id}`,
      }, (payload) => {
        setLocalMessageCount(payload.new.message_count);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session?.id]);

  // 2. Initial Message Load & Realtime Message Subscription
  useEffect(() => {
    if (!session?.id || !user?.id) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", session.id)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === user.id ? "me" : "other",
          text: msg.text,
        })));
      }
      setLoadingMessages(false);
    };

    loadMessages();

    const msgChannel = supabase
      .channel(`chat-room-${session.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `session_id=eq.${session.id}`,
      }, (payload) => {
        if (payload.new.sender_id === user.id) return;
        setMessages(prev => [...prev, {
          id: payload.new.id,
          sender: "other",
          text: payload.new.text,
        }]);
      })
      .subscribe();

    return () => supabase.removeChannel(msgChannel);
  }, [session?.id, user?.id]);

  // 3. Typing Indicator (Broadcast)
  useEffect(() => {
    if (!session?.id) return;

    typingChannelRef.current = supabase.channel(`typing-${session.id}`);
    
    typingChannelRef.current
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.sender_id !== user.id) {
          setIsTyping(payload.isTyping);
          if (payload.isTyping) setTimeout(() => setIsTyping(false), 3000);
        }
      })
      .subscribe();

    return () => {
      if (typingChannelRef.current) supabase.removeChannel(typingChannelRef.current);
    };
  }, [session?.id, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || !session) return;
    const textToSend = input;
    
    // Optimistic Update
    const tempId = Date.now();
    setMessages(prev => [...prev, { id: tempId, sender: "me", text: textToSend }]);
    setInput("");

    const { error } = await supabase
      .from("messages")
      .insert([{ session_id: session.id, sender_id: user.id, text: textToSend }]);

    if (error) console.error("Send error:", error);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (typingChannelRef.current?.state === 'joined') {
      typingChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { sender_id: user.id, isTyping: true },
      });
    }
  };

  if (loadingMessages) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0c111f]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-[#ed9e6f] rounded-full animate-bounce" />
            <span className="w-3 h-3 bg-[#b66570] rounded-full animate-bounce [animation-delay:0.2s]" />
          </div>
          <p className="text-[#ed9e6f] font-mono text-xs uppercase animate-pulse">✦ Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full text-white flex flex-col overflow-hidden bg-[#0c111f]">
      {/* Nebula Background (Omitted for brevity, keep your original CSS here) */}

      <div className="sticky top-0 z-20 bg-[#0c111f]/40 backdrop-blur-md border-b border-white/10 px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-[#ed9e6f] uppercase">{profile.nickname || "ANONYMOUS"}</p>
            <p className="text-[10px] text-white/40 uppercase">✦ Blind Date</p>
          </div>
          <p className="text-xs text-[#b66570] font-mono">07:42 LEFT</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 w-full scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-fadeIn`}>
            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[15px] shadow-2xl ${
                msg.sender === "me" ? "bg-[#ed9e6f] text-[#0c111f] rounded-tr-none" : "bg-[#2d1f44]/60 border border-white/10 rounded-tl-none"
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 flex gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 bg-[#80466e] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#80466e] rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 pb-10 w-full">
        <div className="flex gap-2 items-center bg-[#2d1f44]/80 backdrop-blur-2xl border border-white/10 rounded-full p-1.5">
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Whisper to the stars..."
            className="flex-1 bg-transparent px-5 py-2 text-sm outline-none"
          />
          <button onClick={sendMessage} className="bg-[#ed9e6f] text-[#0c111f] p-2.5 rounded-full">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}