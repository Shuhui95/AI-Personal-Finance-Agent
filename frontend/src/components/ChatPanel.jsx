import { useEffect, useRef, useState } from "react";

import { aiApi } from "../api/axios";
import { formatTime } from "../utils/formatters";

import "./ChatPanel.css";


function ChatPanel({
  messages,
  setMessages,
  onUserMessage,
}) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);


  async function handleSubmit(event) {
    event.preventDefault();

    const cleanedMessage = input.trim();

    if (!cleanedMessage || sending) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: cleanedMessage,
      time: formatTime(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
    ]);

    onUserMessage(cleanedMessage);

    setInput("");
    setSending(true);

    try {
      const response = await aiApi.post(
        "/chat",
        {
          message: cleanedMessage,
        }
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response.data.response,
        time: formatTime(),
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(
        "Agent request failed:",
        error
      );

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I couldn't reach the finance agent. Please check that the AI service is running and try again.",
        time: formatTime(),
        error: true,
      };

      setMessages((currentMessages) => [
        ...currentMessages,
        errorMessage,
      ]);
    } finally {
      setSending(false);
    }
  }


  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      handleSubmit(event);
    }
  }


  return (
    <section className="chat-section">
      <div className="chat-header">
        <div>
          <h2>
            Hi! <span>👋</span>
          </h2>

          <p>
            Ask me anything about your finances.
          </p>
        </div>

        <div className="agent-status">
          <span className="agent-status-dot" />
          AI Agent online
        </div>
      </div>

      <div className="chat-window">
        <div className="message-list">
          {messages.length === 0 && (
            <div className="chat-empty-state">
              <div className="empty-agent-icon">
                ✦
              </div>

              <h3>
                Your personal finance assistant
              </h3>

              <p>
                Ask about your expenses, monthly totals,
                categories, transactions or spending patterns.
              </p>

              <div className="suggestion-grid">
                <button
                  onClick={() =>
                    setInput(
                      "How much did I spend this month?"
                    )
                  }
                >
                  Monthly spending
                </button>

                <button
                  onClick={() =>
                    setInput(
                      "Which category did I spend the most on?"
                    )
                  }
                >
                  Top category
                </button>

                <button
                  onClick={() =>
                    setInput(
                      "Show me my recent expenses."
                    )
                  }
                >
                  Recent expenses
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "message-row user-row"
                  : "message-row assistant-row"
              }
            >
              {message.role === "assistant" && (
                <div className="assistant-avatar">
                  ✦
                </div>
              )}

              <div
                className={[
                  "message-bubble",
                  message.role === "user"
                    ? "user-message"
                    : "assistant-message",
                  message.error
                    ? "error-message"
                    : "",
                ].join(" ")}
              >
                <div className="message-content">
                  {message.content}
                </div>

                <span className="message-time">
                  {message.time}
                </span>
              </div>
            </div>
          ))}

          {sending && (
            <div className="message-row assistant-row">
              <div className="assistant-avatar">
                ✦
              </div>

              <div className="message-bubble assistant-message">
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        className="chat-input-wrapper"
        onSubmit={handleSubmit}
      >
        <textarea
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask me about your expenses..."
          rows="1"
          disabled={sending}
        />

        <button
          type="submit"
          className="chat-send-button"
          disabled={
            sending ||
            input.trim().length === 0
          }
        >
          {sending ? "···" : "➤"}
        </button>
      </form>
    </section>
  );
}

export default ChatPanel;