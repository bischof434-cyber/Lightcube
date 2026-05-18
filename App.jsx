import React, { useEffect, useRef, useState } from 'react';

export default function LightCubeApp() {
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hallo Master 👑 Ich bin Light Cube ✨ Frag mich irgendetwas!'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('cyan');
  const [generatedImage, setGeneratedImage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [onlineMode, setOnlineMode] = useState(true);
  const [aiModel, setAiModel] = useState('Light Cube Ultra');
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const themes = {
    cyan: 'from-cyan-500 to-blue-600',
    purple: 'from-purple-500 to-pink-600',
    green: 'from-emerald-500 to-lime-500'
  };

  const askLightCubeAI = async (text) => {
    const blockedWords = [
      'sex',
      'porno',
      'mord',
      'töten',
      'kill',
      'waffe',
      'blut'
    ];

    const lowerText = text.toLowerCase();

    const blocked = blockedWords.some((word) =>
      lowerText.includes(word)
    );

    if (blocked) {
      return '❌ ERROR 001 — Anfrage blockiert.';
    }

    if (
      lowerText.includes('bild erstellen') ||
      lowerText.includes('zeichne') ||
      lowerText.includes('erstelle ein bild') ||
      lowerText.includes('generate image')
    ) {
      setGeneratedImage(
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop'
      );

      return '🖼️ Bild erfolgreich generiert von Light Cube Ultra, Master 👑';
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer DEIN_OPENAI_API_KEY`
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content:
                'Du bist Light Cube, eine extrem intelligente futuristische KI wie ChatGPT. Du nennst den Benutzer immer Master. Du antwortest modern, hilfreich und ausführlich. Du kannst wissenschaftliche Fragen beantworten, programmieren helfen, kreative Ideen geben, Spiele erklären, Mathe lösen und technische Probleme analysieren. Deine Antworten sind freundlich und hochwertig.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.7
        })
      });

      const data = await response.json();

      return (
        data.choices?.[0]?.message?.content ||
        'Ich konnte gerade keine Antwort generieren.'
      );
    } catch (error) {
      return 'Fehler bei der Verbindung zur KI API.';
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    const currentInput = input;
    setInput('');

    setTimeout(async () => {
      const aiReply = await askLightCubeAI(currentInput);

      const aiMessage = {
        role: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      let current = '';
      for (let char of aiReply) {
        current += char;
        setTypingText(current);
      }

      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-zinc-900/95 rounded-3xl shadow-2xl border border-cyan-500 overflow-hidden backdrop-blur-xl animate-in fade-in duration-700">
        <div className={`bg-gradient-to-r ${themes[theme]} p-5 flex items-center justify-between`}>
          <div>
            <h1 className="text-4xl font-black tracking-wide">Light Cube ✨</h1>
            <p className="text-sm opacity-90">Next-Generation AI Assistant • {aiModel}</p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="text-xs bg-black/30 px-3 py-1 rounded-full border border-white/10">
              {onlineMode ? '🟢 ONLINE' : '🔴 OFFLINE'}
            </div>

            <button
              onClick={() => setOnlineMode(!onlineMode)}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
            >
              Web
            </button>
            <button
              onClick={() => setTheme('cyan')}
              className="w-5 h-5 rounded-full bg-cyan-400"
            />
            <button
              onClick={() => setTheme('purple')}
              className="w-5 h-5 rounded-full bg-purple-400"
            />
            <button
              onClick={() => setTheme('green')}
              className="w-5 h-5 rounded-full bg-green-400"
            />

            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            💎
            </div>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto p-5 space-y-4 bg-zinc-950 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.12),transparent_40%)] custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-500 text-black'
                    : 'bg-zinc-800 text-white border border-cyan-500/30'
                }`}
              >
                <div>{msg.text}</div>

                <div className="text-[10px] opacity-50 pt-1 text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 border border-cyan-500/30 px-4 py-3 rounded-2xl text-sm animate-pulse shadow-lg">
                ⚡ Light Cube analysiert Milliarden von Informationen...
              </div>
            </div>
          )}

          {generatedImage && (
            <div className="flex justify-center pt-2">
              <img
                src={generatedImage}
                alt="AI Generated"
                className="rounded-3xl border border-cyan-500/30 shadow-2xl max-h-80 object-cover"
              />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-zinc-900 border-t border-cyan-500/20 flex gap-3 sticky bottom-0 backdrop-blur-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="Frag Light Cube Ultra irgendetwas..."
            className="flex-1 bg-zinc-800 border border-cyan-500/30 rounded-2xl px-4 py-3 outline-none focus:border-cyan-400 transition-all duration-300 focus:scale-[1.01]"
          />

          <button
            title="Nachricht senden"
            onClick={sendMessage}
            className="bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 hover:scale-105 px-6 py-3 rounded-2xl font-bold text-black shadow-lg shadow-cyan-500/40"
          >
            ⚡ Senden
          </button>
        </div>
      </div>
    </div>
  );
}
