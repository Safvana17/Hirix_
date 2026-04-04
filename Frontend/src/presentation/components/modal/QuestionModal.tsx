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
  Typography
} from '@mui/material';
import { Grid } from '@mui/material';
import type { ModalMode, QuestionFormData, TestCase } from '../../../types/question';
import type { Category } from '../../../types/category';

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
    onClose: () => void;
    onSave: (data: QuestionFormData) => void
}


 const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, mode, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: '',
    description: '',
    type: 'mcq',
    difficulty: 'easy',
    categoryId: '',
    options: [],
    answer: '',
    testCases: [],
    isPremium: false,
    isPractice: false,
    createdBy: 'Admin'
  });

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
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {mode === 'create' ? 'Add Question' : 'Edit Question'}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              label="Description"
              multiline
              rows={4}
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

          {/* Conditional UI */}
          {formData.type === 'mcq' && (
            <Grid size={12}>
              <Typography variant="subtitle1" gutterBottom>Options</Typography>
              {formData.options.map((opt, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  fullWidth
                  margin="dense"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}

              <TextField
                label="Correct Answer"
                fullWidth
                margin="normal"
                value={formData.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
              />
              <Button onClick={addOptions}>Add Options</Button>
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
                    value={tc.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                  <TextField
                    label="Output"
                    fullWidth
                    value={tc.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                  />
                </Box>
              ))}

              <Button onClick={addTestCase}>Add Test Case</Button>
            </Grid>
          )}

          {/* Toggles */}
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

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPremium}
                    onChange={(e) => handleChange('isPremium', e.target.checked)}
                  />
                }
                label="Premium"
              />
            </Box>

            {/* Visual indicator */}
            <Box mt={2}>
              {formData.isPractice && <Chip label="Practice" color="primary" />}
              {formData.isPremium && <Chip label="Premium" color="secondary" sx={{ ml: 1 }} />}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" style={{backgroundColor:'#0B3358'}} onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}


export default QuestionModal