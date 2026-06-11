import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { MessageSquare, Code2 } from 'lucide-react';
import ChatPanel from './ChatePanel';
import CodePanel from './CodePanel';
import type { Message } from '../../../types/interview';
import type { CodingLanguage } from '../../../types/test';

interface InterviewSidebarProps {
  messages: Message[];
  sendMessage: (text: string) => void;
  code: string;
  language: CodingLanguage;
  updateCode: (code: string) => void;
  updateLanguage: (language: CodingLanguage) => void;
  defaultTab?: number;
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({
  messages,
  sendMessage,
  code,
  language,
  updateCode,
  updateLanguage,
  defaultTab = 0,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box 
      className="flex flex-col h-full bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >

      <Box className="border-b border-slate-800 bg-slate-900/60">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="inherit"
          sx={{
            minHeight: '48px',
            '& .MuiTabs-indicator': {
              backgroundColor: '#6366f1', // Indigo indicator
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >

          <Tab
            icon={<MessageSquare className="h-4.5 w-4.5 mr-2" />}
            iconPosition="start"
            label="Chat"
            className={`font-bold text-xs tracking-wider transition-colors duration-300 ${
              activeTab === 0 ? 'text-indigo-400' : 'text-slate-450 hover:text-slate-300'
            }`}
            style={{
              textTransform: 'none',
              fontSize: '12px',
              minHeight: '48px',
              color: activeTab === 0 ? '#818cf8' : '#94a3b8',
            }}
          />

          <Tab
            icon={<Code2 className="h-4.5 w-4.5 mr-2" />}
            iconPosition="start"
            label="Editor"
            className={`font-bold text-xs tracking-wider transition-colors duration-300 ${
              activeTab === 1 ? 'text-indigo-400' : 'text-slate-450 hover:text-slate-300'
            }`}
            style={{
              textTransform: 'none',
              fontSize: '12px',
              minHeight: '48px',
              color: activeTab === 1 ? '#818cf8' : '#94a3b8',
            }}
          />
        </Tabs>
      </Box>


      <Box className="flex-1 overflow-hidden p-2 bg-slate-950/20">
        {activeTab === 0 && (
          <Box className="h-full">
            <ChatPanel messages={messages} sendMessage={sendMessage} />
          </Box>
        )}
        {activeTab === 1 && (
          <Box className="h-full">
            <CodePanel
              code={code}
              language={language}
              updateCode={updateCode}
              updateLanguage={updateLanguage}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default InterviewSidebar;
