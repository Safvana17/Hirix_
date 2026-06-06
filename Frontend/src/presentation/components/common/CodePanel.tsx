import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Typography, Button, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import { Play, Terminal, Trash2, Code2 } from 'lucide-react';
import type { CodingLanguage } from '../../../types/test';
import { interviewRunCode } from '../../../redux/slices/features/interview/CompanyInterviewSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store';

interface CodePanelProps {
  code: string;
  language: CodingLanguage;
  updateCode: (code: string) => void;
  updateLanguage: (language: CodingLanguage) => void;
}

// export const CODING_LANGUAGE: CodingLanguage[] = ['javascript', 'python']

export const CodePanel: React.FC<CodePanelProps> = ({
  code,
  language,
  updateCode,
  updateLanguage,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);

  const handleRunCode = async () => {
    setIsRunning(true);
    setConsoleOutput('Running...');
    try {
        console.log('run code...')
        const result = await dispatch(interviewRunCode({data: {language, sourceCode: code}})).unwrap()
        console.log('after run code...')
        if(result.error){
          setConsoleOutput(result.error)
        }else if(result.stderr){
          setConsoleOutput(result.stderr)
        }else{
          setConsoleOutput(result.stdout || 'No Output')
        }
      } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Execution failed';
      setConsoleOutput(`[Error] ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Box className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <Box className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
        <Box className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-indigo-400" />
          <Typography variant="subtitle2" className="text-slate-200 font-bold text-xs tracking-wide">
            CODE EDITOR
          </Typography>
        </Box>

        <Box className="flex items-center gap-3">
          <FormControl size="small">
            <Select
              value={language}
              onChange={(e) => updateLanguage(e.target.value as CodingLanguage)}
              sx={{
                color: '#cbd5e1',
                fontSize: '12px',
                height: '36px',
                minWidth: '120px',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
              }}
            >
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="python">Python</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleRunCode}
            disabled={isRunning}
            startIcon={isRunning ? <CircularProgress size={14} /> : <Play className="h-3.5 w-3.5" />}
            sx={{
              textTransform: 'none',
              borderRadius: '12px',
              height: '36px',
              backgroundColor: isRunning ? '#334155' : '#059669',
            }}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </Box>
      </Box>

      <Box className="flex-1 min-h-[200px]">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => updateCode(value ?? '')}
          theme="vs-dark"
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </Box>


{/* Output Section */}
<Box className="border-t border-slate-800 bg-slate-950 flex flex-col h-[220px]">
  <Box className="flex items-center justify-between px-4 py-2 border-b border-slate-900 bg-slate-900/60">
    <Box className="flex items-center gap-2 text-slate-400">
      <Terminal className="h-4 w-4" />
      <Typography
        variant="caption"
        className="font-bold tracking-wider uppercase text-[10px]"
      >
        Output
      </Typography>
    </Box>

    {consoleOutput && (
      <Button
        size="small"
        onClick={() => setConsoleOutput(null)}
        startIcon={<Trash2 className="h-3 w-3" />}
        sx={{
          textTransform: 'none',
          fontSize: '10px',
          color: '#64748b',
        }}
      >
        Clear
      </Button>
    )}
  </Box>

  <Box
    className="flex-1 overflow-y-auto p-4 font-mono text-[11.5px] leading-relaxed"
    sx={{
      scrollbarWidth: 'thin',
    }}
  >
    {consoleOutput ? (
      <pre
        style={{
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: consoleOutput.includes('[Error]')
            ? '#f87171'
            : '#34d399',
        }}
      >
        {consoleOutput}
      </pre>
    ) : (
      <Typography
        variant="caption"
        className="text-slate-600 italic"
      >
        Run code to see output here.
      </Typography>
    )}
  </Box>
</Box>
    </Box>
  );
};

export default CodePanel;
