import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import './ChatInterface.css';

function buildMarkdownExport(messages) {
  let body = '';
  let appendixA = '';
  let appendixB = '';

  for (const msg of messages) {
    if (msg.role === 'user') {
      body += `## Question\n\n${msg.content}\n\n`;
    } else {
      if (msg.stage3) {
        body += `## Council Answer\n\n`;
        body += `**Chairman:** ${msg.stage3.model}\n\n${msg.stage3.response}\n\n`;
        body += `---\n\n`;
        body += `*See [Appendix A](#appendix-a-individual-responses) for individual model responses and [Appendix B](#appendix-b-peer-rankings) for peer rankings.*\n\n`;
      }
      if (msg.stage1) {
        appendixA += `## Appendix A: Individual Responses\n\n`;
        for (const r of msg.stage1) {
          appendixA += `### ${r.model}\n\n${r.response}\n\n`;
        }
      }
      if (msg.stage2) {
        appendixB += `## Appendix B: Peer Rankings\n\n`;
        if (msg.metadata?.aggregate_rankings) {
          appendixB += `### Aggregate Rankings\n\n`;
          appendixB += `| Model | Average Rank |\n|-------|-------------|\n`;
          for (const r of msg.metadata.aggregate_rankings) {
            appendixB += `| ${r.model} | ${r.average_rank} |\n`;
          }
          appendixB += '\n';
        }
        for (const r of msg.stage2) {
          appendixB += `### ${r.model}\n\n${r.ranking}\n\n`;
        }
      }
    }
  }
  return (body + appendixA + appendixB).trim();
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ChatInterface({
  conversation,
  onSendMessage,
  onRetry,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="chat-interface">
        <div className="empty-state">
          <h2>Welcome to LLM Council</h2>
          <p>Create a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <h2>Start a conversation</h2>
            <p>Ask a question to consult the LLM Council</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="message-group">
              {msg.role === 'user' ? (
                <div className="user-message">
                  <div className="message-label">You</div>
                  <div className="message-content">
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="assistant-message">
                  <div className="message-label">LLM Council</div>

                  {/* Stage 1 */}
                  {msg.loading?.stage1 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Running Stage 1: Collecting individual responses...</span>
                    </div>
                  )}
                  {msg.stage1 && <Stage1 responses={msg.stage1} />}

                  {/* Stage 2 */}
                  {msg.loading?.stage2 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Running Stage 2: Peer rankings...</span>
                    </div>
                  )}
                  {msg.stage2 && (
                    <Stage2
                      rankings={msg.stage2}
                      labelToModel={msg.metadata?.label_to_model}
                      aggregateRankings={msg.metadata?.aggregate_rankings}
                    />
                  )}

                  {/* Stage 3 */}
                  {msg.loading?.stage3 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Running Stage 3: Final synthesis...</span>
                    </div>
                  )}
                  {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}

                  {msg.error && (
                    <div className="error-message">
                      <span>Error: {msg.error}</span>
                      <button className="retry-button" onClick={onRetry} disabled={isLoading}>
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Consulting the council...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {conversation.messages.length > 0 && conversation.messages.some(m => m.stage3) && (
        <div className="export-bar">
          <button
            className="export-button"
            onClick={() => {
              const md = buildMarkdownExport(conversation.messages);
              downloadFile(md, `${conversation.title || 'council'}.md`, 'text/markdown');
            }}
          >
            Export Markdown
          </button>
          <button
            className="export-button"
            onClick={() => window.print()}
          >
            Export PDF
          </button>
        </div>
      )}

      {conversation.messages.length === 0 && (
        <form className="input-form" onSubmit={handleSubmit}>
          <textarea
            className="message-input"
            placeholder="Ask your question... (Shift+Enter for new line, Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim() || isLoading}
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
