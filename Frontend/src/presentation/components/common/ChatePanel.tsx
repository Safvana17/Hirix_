import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Typography, InputAdornment } from '@mui/material';
import { Send, MessageSquareDashed } from 'lucide-react';
import type { Message } from '../../../types/interview';

interface ChatPanelProps {
  messages: Message[];
  sendMessage: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, sendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom of the chat list when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box 
      className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Messages Scroll Area */}
      <Box className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <Box 
            className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-12"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <Box className="h-12 w-12 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-center mb-2">
              <MessageSquareDashed className="h-6 w-6 text-slate-400" />
            </Box>
            <Typography variant="body2" className="font-semibold text-slate-400">
              No messages yet
            </Typography>
            <Typography variant="caption" className="text-slate-500 text-center max-w-[200px]">
              Type a message below to start collaborating in real-time.
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              className={`flex flex-col w-full ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              {/* Sender Name */}
              <Typography variant="caption" className="text-slate-550 mb-1 text-[10px] uppercase font-bold tracking-wider px-1">
                {msg.isMe ? 'You' : msg.senderName}
              </Typography>

              {/* Message Bubble */}
              <Box
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md border ${
                  msg.isMe
                    ? 'bg-gradient-to-tr from-violet-600 to-indigo-650 text-white border-indigo-500/10 rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border-slate-700/50 rounded-tl-none'
                }`}
              >
                <Typography variant="body2" className="leading-relaxed break-words text-sm font-medium">
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  className={`block text-[9px] text-right mt-1.5 font-semibold font-mono ${
                    msg.isMe ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  {formatTime(msg.timeStamp)}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Panel */}
      <Box className="p-3 border-t border-slate-800 bg-slate-950/40 backdrop-blur-xl">
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Send a message..."
          variant="outlined"
          size="small"
          autoComplete="off"
          InputProps={{
            className: 'bg-slate-900 border border-slate-800 rounded-xl text-slate-250 text-sm hover:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-300',
            style: { color: '#e2e8f0', backgroundColor: '#0f172a' },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className={`transition-all duration-300 ${
                    inputText.trim()
                      ? 'text-indigo-400 hover:text-indigo-300 hover:scale-105'
                      : 'text-slate-600'
                  }`}
                  size="small"
                >
                  <Send className="h-4.5 w-4.5" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
            },
          }}
        />
      </Box>
    </Box>
  );
};
export default ChatPanel;
