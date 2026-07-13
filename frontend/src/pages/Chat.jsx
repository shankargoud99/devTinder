import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const loadHistory = async () => {
      try {
        const res = await api.get(`/chat/${targetUserId}`);
        const chat = res.data.data;
        setMessages(
          chat.messages.map((m) => ({
            senderId: m.senderId?._id || m.senderId,
            firstName: m.senderId?.firstName,
            photoUrl: m.senderId?.photoUrl,
            text: m.text,
            createdAt: m.createdAt,
          }))
        );
        const other = chat.participants?.find((p) => p !== user._id && p?._id !== user._id);
        if (other?.firstName) setTargetUser(other);
      } catch (err) {
        console.error(err);
      }
    };
    loadHistory();

    const socket = createSocketConnection();
    socket.emit("joinChat", { targetUserId });

    socket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("errorMessage", (err) => {
      console.error(err.message);
    });

    return () => {
      socket.off("messageReceived");
      socket.off("errorMessage");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const socket = createSocketConnection();
    socket.emit("sendMessage", { targetUserId, text: text.trim() });
    setText("");
  };

  if (!user) return null;

  return (
    <div className="dc-card max-w-2xl mx-auto flex flex-col h-[70vh]">
      <div className="p-4 border-b" style={{ borderColor: "var(--dc-border)" }}>
        <p className="font-medium">{targetUser?.firstName || "Chat"}</p>
      </div>

      <div className="flex-1 overflow-y-auto dc-scrollbar p-4 flex flex-col gap-3">
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === user._id;
          return (
            <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[70%] px-3 py-2 rounded-lg text-sm"
                style={{
                  background: isMine ? "var(--dc-accent-dim)" : "var(--dc-surface-raised)",
                  border: `1px solid ${isMine ? "var(--dc-accent)" : "var(--dc-border)"}`,
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2" style={{ borderColor: "var(--dc-border)" }}>
        <input
          type="text"
          placeholder="Type a message..."
          className="input flex-1"
          style={{ background: "var(--dc-surface-raised)", border: "1px solid var(--dc-border)", color: "var(--dc-text)" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="btn border-none"
          style={{ background: "var(--dc-accent)", color: "#06170d" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
