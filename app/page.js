"use client";
import { useState, useRef, useEffect } from "react";

const QUICK = [
  { icon: "🥗", label: "תפריט יומי", q: "תבני לי תפריט יומי מלא ומפורט" },
  { icon: "💪", label: "אימון להיום", q: "תציעי לי אימון כוח מלא להיום" },
  { icon: "🥚", label: "יעד חלבון", q: "כמה חלבון אני צריכה ביום ואיך להגיע לזה עם ביצים ודגים?" },
  { icon: "🦴", label: "תרגילים לגב", q: "אילו תרגילים אני יכולה לעשות עם כאבי גב תחתון?" },
  { icon: "✨", label: "חיטוב + שריר", q: "איך לשלב חיטוב ובניית שריר בגיל 56?" },
];

const STATS = [
  ["58 ק\"ג", "משקל"],
  ["170 ס\"מ", "גובה"],
  ["23%", "שומן"],
  ["56", "גיל"],
  ["4-5×", "אימונים שבוע"],
];

const S = {
  page: {
    background: "#0a0a0f", minHeight: "100vh", display: "flex",
    flexDirection: "column", fontFamily: "'Heebo', Arial, sans-serif",
    direction: "rtl", color: "#e8e4dc",
  },
  header: {
    padding: "18px 24px", borderBottom: "1px solid #2a2a38",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: "rgba(10,10,15,0.95)",
  },
  logoIcon: {
    width: 42, height: 42, borderRadius: 12,
    background: "linear-gradient(135deg,#c9a84c,#c97a8a)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
  },
  logoTitle: { fontSize: 19, fontWeight: 700, color: "#c9a84c" },
  logoSub: { fontSize: 10, color: "#7a7a8a", letterSpacing: 1, textTransform: "uppercase" },
  profileChip: {
    display: "flex", alignItems: "center", gap: 9,
    background: "#1a1a24", border: "1px solid #2a2a38",
    borderRadius: 100, padding: "6px 14px 6px 6px",
  },
  statsBar: { display: "flex", borderBottom: "1px solid #2a2a38", overflowX: "auto" },
  statItem: (last) => ({
    flex: 1, minWidth: 90, padding: "13px 16px", textAlign: "center",
    borderLeft: last ? "none" : "1px solid #2a2a38",
  }),
  statVal: { fontSize: 18, fontWeight: 700, color: "#c9a84c" },
  statLbl: { fontSize: 10, color: "#7a7a8a", letterSpacing: 0.8, textTransform: "uppercase", marginTop: 2 },
  main: {
    flex: 1, display: "flex", flexDirection: "column",
    maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 16px",
  },
  quickRow: { display: "flex", gap: 8, padding: "14px 0 8px", flexWrap: "wrap" },
  quickBtn: {
    display: "flex", alignItems: "center", gap: 7,
    background: "#1a1a24", border: "1px solid #2a2a38", borderRadius: 100,
    padding: "8px 15px", fontSize: 13, color: "#e8e4dc", cursor: "pointer",
    fontFamily: "inherit", whiteSpace: "nowrap",
  },
  messages: {
    flex: 1, overflowY: "auto", display: "flex", flexDirection: "column",
    gap: 12, paddingBottom: 12, maxHeight: "54vh",
  },
  msgRow: (isUser) => ({
    display: "flex", gap: 10, alignItems: "flex-start",
    flexDirection: isUser ? "row-reverse" : "row",
  }),
  avatar: (isUser) => ({
    width: 34, height: 34, borderRadius: "50%", flexShrink: 0, marginTop: 2,
    background: isUser
      ? "linear-gradient(135deg,#c97a8a,#8a3a50)"
      : "linear-gradient(135deg,#c9a84c,#8a6a20)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
  }),
  bubble: (isUser) => ({
    maxWidth: "74%", padding: "12px 16px", borderRadius: 18, fontSize: 14, lineHeight: 1.75,
    ...(isUser ? {
      background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.22)",
      borderTopLeftRadius: 4, textAlign: "right",
    } : {
      background: "#1a1a24", border: "1px solid #2a2a38", borderTopRightRadius: 4,
    }),
  }),
  inputArea: { padding: "12px 0 20px" },
  inputWrap: {
    display: "flex", gap: 8, background: "#1a1a24",
    border: "1px solid #2a2a38", borderRadius: 14,
    padding: "6px 6px 6px 14px",
  },
  sendBtn: (disabled) => ({
    width: 42, height: 42, background: "linear-gradient(135deg,#c9a84c,#8a6a20)",
    border: "none", borderRadius: 9, cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
    alignSelf: "flex-end", opacity: disabled ? 0.4 : 1, transition: "opacity 0.2s",
  }),
  disclaimer: { textAlign: "center", fontSize: 11, color: "#5a5a6a", marginTop: 8 },
};

function formatText(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} style={{ color: "#e8c97a" }}>{p.slice(2, -2)}</strong>
      : p.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
        ))
  );
}

export default function FitnessAgent() {
  const [messages, setMessages] = useState([{
    role: "agent",
    text: "שלום! אני הסוכן האישי שלך 🌿\n\nאני מכיר אותך — בת 56, 170 ס\"מ, 58 ק\"ג, ואת רוצה גוף שרירי וחטוב.\n\n**מה שאני לוקח בחשבון:**\n⚠️ כאבי גב — נימנע מעומס על עמוד השדרה\n🚫 ללא גלוטן, ללא מוצרי חלב\n🥚 חלבון מביצים ודגים בלבד\n🎯 ריקומפוזיציה: חיטוב + בניית שריר\n\nשאלי אותי כל שאלה — אימון, תזונה, מתכון, תוכנית שבועית!"
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");
    const newHistory = [...history, { role: "user", content: trimmed }];
    setHistory(newHistory);
    setMessages(prev => [...prev, { role: "user", text: trimmed }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const reply = data.reply || "מצטערת, משהו השתבש.";
      setHistory(h => [...h, { role: "assistant", content: reply }]);
      setMessages(prev => [...prev, { role: "agent", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "⚠️ שגיאה בחיבור. נסי שוב." }]);
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes pulse {
          0%,100%{opacity:.3;transform:scale(.85)}
          50%{opacity:1;transform:scale(1.1)}
        }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#2a2a38;border-radius:2px}
        textarea{caret-color:#c9a84c}
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={S.logoIcon}>🌿</div>
          <div>
            <div style={S.logoTitle}>הסוכן האישי שלי</div>
            <div style={S.logoSub}>כושר · תזונה · גוף חזק</div>
          </div>
        </div>
        <div style={S.profileChip}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#c97a8a,#c9a84c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👩</div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>הפרופיל שלי</span>
        </div>
      </div>

      {/* Stats */}
      <div style={S.statsBar}>
        {STATS.map(([v, l], i) => (
          <div key={i} style={S.statItem(i === STATS.length - 1)}>
            <div style={S.statVal}>{v}</div>
            <div style={S.statLbl}>{l}</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={S.main}>
        {/* Quick actions */}
        <div style={S.quickRow}>
          {QUICK.map((q, i) => (
            <button key={i} style={S.quickBtn} onClick={() => send(q.q)} disabled={loading}>
              {q.icon} {q.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={S.messages}>
          {messages.map((m, i) => (
            <div key={i} style={S.msgRow(m.role === "user")}>
              <div style={S.avatar(m.role === "user")}>{m.role === "user" ? "👩" : "🌿"}</div>
              <div style={S.bubble(m.role === "user")}>{formatText(m.text)}</div>
            </div>
          ))}
          {loading && (
            <div style={S.msgRow(false)}>
              <div style={S.avatar(false)}>🌿</div>
              <div style={{ background: "#1a1a24", border: "1px solid #2a2a38", borderRadius: 18, borderTopRightRadius: 4, padding: "14px 18px", display: "flex", gap: 6 }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#c9a84c", animation: `pulse 1.4s ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={S.inputArea}>
          <div style={S.inputWrap}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="שאלי אותי על אימון, תפריט, מתכון..."
              rows={1}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "inherit", fontSize: 14, color: "#e8e4dc", lineHeight: 1.6, paddingTop: 8, direction: "rtl" }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={S.sendBtn(loading || !input.trim())}>➤</button>
          </div>
          <div style={S.disclaimer}>המידע להנחיה כללית ואינו מחליף ייעוץ רפואי מקצועי</div>
        </div>
      </div>
    </div>
  );
}
