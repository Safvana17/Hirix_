import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Plus } from 'lucide-react'
import type { ModalMode, Question, QuestionDifficulty, QuestionFormData, QuestionType } from '../../../types/question'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllCategories } from '../../../redux/slices/features/category/categorySlice'
import QuestionModal from '../../components/modal/QuestionModal'
import toast from 'react-hot-toast'
import { createQuestion, getAllQuestions } from '../../../redux/slices/features/question/questionSlice'
import { Box, Card, Chip, Divider, IconButton, InputAdornment, MenuItem, Pagination, Tab, Tabs, TextField, Typography } from '@mui/material'
import { Delete, Edit, Search, Visibility } from '@mui/icons-material'
import { useDebounce } from '../../../hooks/useDebounce'


const questionDifficulty: QuestionDifficulty[] = ['easy', 'medium', 'hard']
const questionType: QuestionType[] = ['mcq', 'coding', 'descriptive']

const CompanyQuestion: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null> (null)
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | ''>('')
  const [type, setType] = useState<QuestionType | ''>('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const dispatch = useDispatch<AppDispatch>()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const {categories} = useSelector((state: RootState) => state.category)
  const {questions, pagination } = useSelector((state: RootState) => state.question)
  const { user } = useSelector((state: RootState) => state.auth)


  useEffect(() => {
     dispatch(getAllQuestions({params: {search: debouncedSearchTerm, category: category, type: type || undefined, difficulty: difficulty || undefined, page,limit: 10}, role: user!.role}))
     dispatch(getAllCategories({}))
  }, [dispatch, debouncedSearchTerm, category,difficulty, type, page, user])

  const handleAddQuestion = () => {
    setSelectedQuestion(null)
    setModalMode('create')
    setIsModalOpen(true) 
  }

  const handleSaveQuestion = async (data: QuestionFormData) => {
      try {
        if(modalMode === 'create' && user){
            await dispatch(createQuestion({data, role: user.role})).unwrap()
            setIsModalOpen(false)
            toast.success('Question added successfully')
            await dispatch(getAllQuestions({params: {search: debouncedSearchTerm, category: category, type: type || undefined, difficulty: difficulty || undefined, page, limit: 10}, role: user!.role}))
        }
      } catch (error) {
        toast.error(typeof error === 'string' ? error : 'Failed to create question')
      }
  }
  return (
    <InternalLayout title='Questions' subTitle='Manage assessment question library' sidebarItems={companySidebarItems}>
       <div>
           <div className='flex justify-end mb-5'>
              <button onClick={handleAddQuestion} className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                <Plus className='w-4 h-4' />
                Add Question
              </button>
            </div>

           <div className='bg-white rounded-xl p-4 shadow-md'>
              <Tabs 
                value={type} 
                onChange={((_, v) => setType(v))}
                sx={{
                  mb: 2,
                  "& .MuiTabs-indicator": {display: "none"}
                }}
              >
                <Tab 
                  label="All" 
                  value=''
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    minHeight: 36,
                    backgroundColor: type === "" ? "#6B4705" : "transparent",
                    "&.Mui-selected": {
                      color: type === "" ? "#fff" : "#333"
                    }
                  }}
                />
                {questionType.map((t) => (
                  <Tab 
                    key={t} 
                    label={t.toUpperCase()} 
                    value={t}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      minHeight: 36,
                      backgroundColor: type === t ? "#6B4705" : "transparent",
                      "&.Mui-selected": {
                        color: type === t ? "#fff" : "#333"
                      }
                    }}
                  />
                ))}
              </Tabs>
              <Divider sx={{borderColor: "#6B4705"}}/>
              <Box display="flex" gap={2} my={2}>
                <TextField
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions, categories..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Search sx={{color: '#fff'}} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                      borderRadius: 2,
                      backgroundColor: "#6B4705",
                      "& .MuiInputBase-input": {
                        color: "#fff"
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#fff",
                        opacity: 0.7
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#6B4705"
                        },
                        "&:hover fieldset": {
                          borderColor: "#6B4705"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#6B4705"
                        }
                      }
                    }}
                />
                <TextField 
                  select 
                  label="Category" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  sx={{ 
                    width: 150, 
                    background: "#6B4705", 
                    borderRadius: 3,
                    "& .MuiSelect-select": {
                      color: "#fff"
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff"
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#fff"
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#fff"
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#6B4705"
                      },
                      "&:hover fieldset": {
                        borderColor: "#6B4705"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6B4705"
                      }
                    }
                  }}
                >
                  <MenuItem value="">Category</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select 
                  label="Difficulty" 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)} 
                  sx={{ 
                    width: 150, 
                    background: "#6B4705", 
                    borderRadius: 3,
                    "& .MuiSelect-select": {
                      color: "#fff"
                    },
                    "& .MuiInputLabel-root": {
                      color: "#fff"
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#fff"
                    },
                    "& .MuiSvgIcon-root": {
                      color: "#fff"
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#6B4705"
                      },
                      "&:hover fieldset": {
                        borderColor: "#6B4705"
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#6B4705"
                      }
                    }
                  }}>
                  <MenuItem value="easy">Select Difficulty</MenuItem>
                  {questionDifficulty.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </TextField>
              </Box>
              {questions && questions.length > 0 ? (
               questions?.map((q) => (
                <Card
                  key={q.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 3,
                    background: "#E7D4B0",
                    boxShadow: "none",
                    border: "1px solid #e0c89f"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography fontWeight="bold" fontSize={16}>
                          {q.title}
                        </Typography>
                        <Chip
                          label={q.visibility}
                          size="small"
                          sx={{
                            background: q.visibility === 'pro' 
                                        ? 'linear-gradient(to right, #8822F5, #feb47b)' 
                                        : 'linear-gradient(to right, #ff7e5f, #9057C6)',
                            color: "#fff",
                            fontWeight: 500
                          }}
                        />
                      </Box>
                      <Box display="flex" gap={1.5} mt={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {q.categoryName}
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary">
                          • Used 234 Times
                        </Typography> */}
                      </Box>
                      <Box display="flex" gap={1} mt={1.5}>
                        <Chip
                          label={q.type}
                          size="small"
                          sx={{ background: "#6B4705", color: "#fff" }}
                        />
                        <Chip
                          label={q.difficulty}
                          size="small"
                          sx={{ background: "#274E72", color: "#fff"}}
                        />
                      </Box>
                    </Box>

                    {/* RIGHT ACTIONS */}
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton size="small">
                        <Visibility />
                      </IconButton>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small">
                        <Delete />
                      </IconButton>
                    </Box>

                  </Box>
                </Card>
              ))
            ):(
                <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                  <Typography variant="h6" color="text.secondary">
                    No questions available
                  </Typography>
                </Box>
              )}
              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination count={pagination.question.totalPages} page={page} onChange={(_, v) => setPage(v)} />
              </Box>
            </div>
            <QuestionModal 
               isOpen={isModalOpen}
               mode={modalMode}
               categories={categories}
               initialData={selectedQuestion}
               onSave={handleSaveQuestion}
               onClose={() => {
                 setIsModalOpen(false)
               }}
            />
       </div>
    </InternalLayout>
  )
}

export default CompanyQuestion
