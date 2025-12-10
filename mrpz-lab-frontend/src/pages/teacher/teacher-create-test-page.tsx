import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCreateTest } from '../../hooks/tests';
import { useGenerateTestQuestions } from '../../hooks/ai/use-ai';
import { useCourseWithFiles } from '../../hooks/admin/use-courses';
import {
  Loader2,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Save,
  Sparkles,
} from 'lucide-react';
import type { CreateQuestionDto } from '../../types/api-dtos';
import Modal from '../../components/Modal';

export default function TeacherCreateTestPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const createTestMutation = useCreateTest();
  const generateQuestionsMutation = useGenerateTestQuestions();
  const { data: course } = useCourseWithFiles(courseId || '');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<CreateQuestionDto[]>([]);
  const [error, setError] = useState('');
  
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiNumQuestions, setAiNumQuestions] = useState(5);
  const [aiError, setAiError] = useState('');

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].questionText = text;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setQuestions(updated);
  };

  const updateOptionText = (
    questionIndex: number,
    optionIndex: number,
    text: string
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].optionText = text;
    setQuestions(updated);
  };

  const toggleCorrect = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].isCorrect =
      !updated[questionIndex].options[optionIndex].isCorrect;
    setQuestions(updated);
  };

  const handleGenerateQuestions = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic for the questions');
      return;
    }
    
    if (aiNumQuestions < 1 || aiNumQuestions > 20) {
      setAiError('Number of questions must be between 1 and 20');
      return;
    }

    setAiError('');
    try {
      const result = await generateQuestionsMutation.mutateAsync({
        topic: aiTopic,
        numberOfQuestions: aiNumQuestions,
        courseContext: course?.description,
      });

      // Add generated questions to existing questions
      setQuestions([...questions, ...result.questions]);
      setShowAIModal(false);
      setAiTopic('');
      setAiNumQuestions(5);
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : 'Failed to generate questions. Please try again.'
      );
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (!dueDate) {
      setError('Due date is required');
      return;
    }
    if (questions.length === 0) {
      setError('At least one question is required');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      if (q.options.length < 2) {
        setError(`Question ${i + 1} must have at least 2 options`);
        return;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        setError(`Question ${i + 1} must have at least one correct answer`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].optionText.trim()) {
          setError(`Question ${i + 1}, option ${j + 1} text is required`);
          return;
        }
      }
    }

    try {
      await createTestMutation.mutateAsync({
        courseId: courseId!,
        title,
        description,
        dueDate,
        questions,
      });
      navigate(`/teacher/courses/${courseId}`);
    } catch (error: unknown) {
      setError(
        error instanceof Error && 'response' in error && error.response
          ? (error.response as { data?: { message?: string } }).data?.message ||
              'Failed to create test. Please try again.'
          : 'Failed to create test. Please try again.'
      );
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-5 h-5' />
        Back
      </button>

      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-3xl font-bold mb-6'>Create Test</h1>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6'>
            {error}
          </div>
        )}

        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Title *
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter test title'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter test description'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Due Date *
            </label>
            <input
              type='datetime-local'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div className='border-t pt-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Questions</h2>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowAIModal(true)}
                  className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
                >
                  <Sparkles className='w-4 h-4' />
                  Generate with AI
                </button>
                <button
                  onClick={addQuestion}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                >
                  <Plus className='w-4 h-4' />
                  Add Question
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <p className='text-gray-500 py-4'>
                No questions yet. Click "Add Question" to get started.
              </p>
            ) : (
              <div className='space-y-6'>
                {questions.map((question, qIdx) => (
                  <div
                    key={qIdx}
                    className='border border-gray-200 rounded-lg p-4 bg-gray-50'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <h3 className='font-semibold'>Question {qIdx + 1}</h3>
                      <button
                        onClick={() => removeQuestion(qIdx)}
                        className='text-red-600 hover:bg-red-50 p-1 rounded'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>

                    <div className='mb-4'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Question Text *
                      </label>
                      <input
                        type='text'
                        value={question.questionText}
                        onChange={(e) =>
                          updateQuestionText(qIdx, e.target.value)
                        }
                        maxLength={1000}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                        placeholder='Enter question'
                      />
                    </div>

                    <div>
                      <div className='flex items-center justify-between mb-2'>
                        <label className='block text-sm font-medium text-gray-700'>
                          Options * (Check correct answer(s))
                        </label>
                        <button
                          onClick={() => addOption(qIdx)}
                          className='text-sm text-blue-600 hover:text-blue-700'
                        >
                          + Add Option
                        </button>
                      </div>
                      <div className='space-y-2'>
                        {question.options.map((option, oIdx) => (
                          <div key={oIdx} className='flex items-center gap-2'>
                            <button
                              onClick={() => toggleCorrect(qIdx, oIdx)}
                              className={`p-1 rounded ${
                                option.isCorrect
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                              }`}
                            >
                              <CheckCircle
                                className='w-5 h-5'
                                fill={
                                  option.isCorrect ? 'currentColor' : 'none'
                                }
                              />
                            </button>
                            <input
                              type='text'
                              value={option.optionText}
                              onChange={(e) =>
                                updateOptionText(qIdx, oIdx, e.target.value)
                              }
                              maxLength={500}
                              className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
                              placeholder={`Option ${oIdx + 1}`}
                            />
                            {question.options.length > 2 && (
                              <button
                                onClick={() => removeOption(qIdx, oIdx)}
                                className='text-red-600 hover:bg-red-50 p-1 rounded'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='flex gap-3 justify-end pt-6 border-t'>
            <button
              onClick={() => navigate(-1)}
              className='px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createTestMutation.isPending}
              className='flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {createTestMutation.isPending ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Creating...
                </>
              ) : (
                <>
                  <Save className='w-4 h-4' />
                  Create Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showAIModal && (
        <Modal onClose={() => setShowAIModal(false)}>
          <h2 className='text-xl font-bold mb-4'>Generate Questions with AI</h2>
          
          {aiError && (
            <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4 text-sm'>
              {aiError}
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                What topic should the questions cover? *
              </label>
              <textarea
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                rows={3}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
                placeholder='E.g., Object-oriented programming concepts in C#, Database normalization, etc.'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                How many questions? (1-20) *
              </label>
              <input
                type='number'
                value={aiNumQuestions}
                onChange={(e) => setAiNumQuestions(parseInt(e.target.value) || 1)}
                min={1}
                max={20}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Each question will have 4 options with 1 correct answer
              </p>
            </div>

            <div className='bg-purple-50 border border-purple-200 rounded-lg p-3'>
              <p className='text-sm text-purple-800'>
                <strong>Note:</strong> AI-generated questions will be added to your existing questions. 
                You can review and edit them before creating the test.
              </p>
            </div>

            <div className='flex gap-3 justify-end pt-4 border-t'>
              <button
                onClick={() => setShowAIModal(false)}
                disabled={generateQuestionsMutation.isPending}
                className='px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQuestions}
                disabled={generateQuestionsMutation.isPending || !aiTopic.trim()}
                className='flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {generateQuestionsMutation.isPending ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className='w-4 h-4' />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
