import React, { useState } from 'react';
import {
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Grid } from '@mui/material';
import type { ModalMode, Question, QuestionFormData, TestCase } from '../../../types/question';
import type { Category } from '../../../types/category';
import { Close } from '@mui/icons-material';
import type { UserRole } from '../../../constants/role';

const questionTypes = [
  { label: 'MCQ', value: 'mcq' },
  { label: 'Coding', value: 'coding' },
  { label: 'Decriptive', value: 'descriptive'}
];

const difficulties = ['easy', 'medium', 'hard'];

interface QuestionModalProps {
    isOpen: boolean;
    mode: ModalMode
    categories: Category[]
    initialData: Question | null
    role: UserRole
    onClose: () => void;
    onSave?: (data: QuestionFormData) => void
}


 const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, mode, categories,initialData,role, onClose, onSave }) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    id: initialData?.id || '',
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'mcq',
    difficulty: initialData?.difficulty ||  'easy',
    categoryId: initialData?.categoryId || '',
    categoryName: initialData?.categoryName || '',
    options: initialData?.options || [],
    answer: initialData?.answer || '',
    testCases: initialData?.testCases || [],
    isPremium: initialData?.isPremium || false,
    isPractice: initialData?.isPractice || false,
  });

  console.log('initial data: ', initialData)

  const handleChange = <K extends keyof QuestionFormData>(field: K, value: QuestionFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...formData.options];
    updated[index] = value;
    handleChange('options', updated);
  };

  const handleTestCaseChange = (
   index: number, 
   key: keyof TestCase, 
   value: string
) => {
    const updated = [...formData.testCases];
    updated[index] = {
      ...updated[index],
      [key]: value
    }
    handleChange('testCases', updated);
  };

  const addTestCase = () => {
    handleChange('testCases', [...formData.testCases, { input: '', expectedOutput: '' }]);
  };

  const addOptions = () => {
    handleChange('options', [...formData.options, ''])
  }
  const handleSubmit = () => {
    if(onSave) onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{background:"#6B4705", color:"#fff"}}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
           <span>
              {mode === 'create' && 'Add Question'} 
              {mode === 'edit' && 'Edit Question'}
           </span>
           <IconButton onClick={onClose} sx={{color: "#fff"}}>
              <Close />
            </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              label="Title"
              fullWidth
              InputProps={{
                readOnly: mode === 'view'
              }}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Description"
              multiline
              rows={4}
              InputProps={{
                readOnly: mode === 'view'
              }}
              fullWidth
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>

          <Grid size={6}>
            <TextField
              select
              label="Type"
              fullWidth
              InputProps={{
                readOnly: mode === 'view'
              }}
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value as QuestionFormData['type'])}
            >
              {questionTypes.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={6}>
            <TextField
              select
              label="Difficulty"
              fullWidth
              InputProps={{
                readOnly: mode === 'view'
              }}
              value={formData.difficulty}
              onChange={(e) => handleChange('difficulty', e.target.value as QuestionFormData['difficulty'])}
            >
              {difficulties.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={12}>
            <Autocomplete
              options={categories}
              disabled={mode==='view'}
              getOptionLabel={(option) => option.name}
              value={categories.find(c => c.id === formData.categoryId) || null}
              onChange={(_, value) => {
                handleChange('categoryId', value?.id || '');
              }}
              renderInput={(params) => (
                <TextField {...params} label="Category" />
              )}
            />
          </Grid>
          {formData.type === 'mcq' && (
            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom>Options</Typography>
              {formData.options.map((opt, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  fullWidth
                  InputProps={{
                    readOnly: mode === 'view'
                  }}
                  margin="dense"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}

              <TextField
                label="Correct Answer"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: mode === 'view'
                }}
                value={formData.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
              />
              {mode !== 'view' &&
                <Button onClick={addOptions}>Add Options</Button>
              }
            </Grid>
          )}

          {formData.type === 'coding' && (
            <Grid size={12}>
              <Typography variant="subtitle1">Test Cases</Typography>
              {formData.testCases.map((tc, index) => (
                <Box key={index} display="flex" gap={2} mb={2}>
                  <TextField
                    label="Input"
                    fullWidth
                    InputProps={{
                      readOnly: mode === 'view'
                    }}
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                  <TextField
                    label="Output"
                    fullWidth
                    InputProps={{
                      readOnly: mode === 'view'
                    }}
                    value={tc.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                  />
                </Box>
              ))}
              {mode !== 'view' &&
                <Button onClick={addTestCase}>Add Test Case</Button>
              }
            </Grid>
          )}

         {mode !== 'view' && 
          <Grid size={12}>
            <Box display="flex" gap={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPractice}
                    onChange={(e) => handleChange('isPractice', e.target.checked)}
                  />
                }
                label="Practice"
              />

              {role === 'Admin' && 
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPremium}
                      onChange={(e) => handleChange('isPremium', e.target.checked)}
                    />
                  }
                  label="Premium"
                />
              }
            </Box>
          </Grid>
        }

          <Box mt={2}>
            {formData.isPractice && <Chip label="Practice" color="primary" />}
            {role === 'Admin' && (
            formData.isPremium ? (
              <Chip label="Premium" sx={{ background: 'linear-gradient(to right, #8822F5, #feb47b)', color: "#fff", ml: 1 }}/>
            ) : (
              <Chip label="Free" sx={{ ml: 1, background: 'linear-gradient(to right, #ff7e5f, #9057C6)', color: "#fff"}} />
            )
          )}
          </Box>

        </Grid>
      </DialogContent>


      {mode !== 'view' &&
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" style={{backgroundColor:'#0B3358'}} onClick={handleSubmit}>
          {mode === 'create' && 'Add Question'}
          {mode === 'edit' && 'Update'}
        </Button>
      </DialogActions>
      }

    </Dialog>
  );
}


export default QuestionModal