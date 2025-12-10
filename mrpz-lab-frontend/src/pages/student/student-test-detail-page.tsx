import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  useTestById,
  useSubmitTest,
  useMySubmissions,
} from '../../hooks/tests';
import {
  Loader2,
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
} from 'lucide-react';

export default function StudentTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: test, isLoading: testLoading } = useTestById(id || '');
  const { data: mySubmissions } = useMySubmissions();
  const submitTestMutation = useSubmitTest();

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [submitError, setSubmitError] = useState('');
  const [showResults, setShowResults] = useState(false);

  const mySubmission = mySubmissions?.find((s) => s.testId === id);
  const isPastDue = test && new Date(test.dueDate) < new Date();
  const canSubmit = !mySubmission && !isPastDue;

  useEffect(() => {
    if (mySubmission) {
      setShowResults(true);
    }
  }, [mySubmission]);

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!test || !id) return;

    const allAnswered = test.questions.every(
      (q) => selectedAnswers[q.id] !== undefined
    );

    if (!allAnswered) {
      setSubmitError('Please answer all questions before submitting.');
      return;
    }

    try {
      const answers = Object.entries(selectedAnswers).map(
        ([questionId, selectedOptionId]) => ({
          questionId,
          selectedOptionId,
        })
      );

      await submitTestMutation.mutateAsync({
        testId: id,
        answers,
      });

      setShowResults(true);
      setSubmitError('');
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error && 'response' in error && error.response
          ? (error.response as { data?: { message?: string } }).data?.message ||
              'Failed to submit test. Please try again.'
          : 'Failed to submit test. Please try again.'
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (testLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-blue-500' />
      </div>
    );
  }

  if (!test) {
    return (
      <div className='max-w-7xl mx-auto p-6'>
        <p className='text-red-500'>Test not found</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-5 h-5' />
        Back
      </button>

      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h1 className='text-3xl font-bold mb-2'>{test.title}</h1>
        <p className='text-gray-600 mb-4'>{test.description}</p>

        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='flex items-center gap-2 text-gray-700'>
            <Calendar className='w-5 h-5' />
            <span>Due: {formatDate(test.dueDate)}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-700'>
            <FileText className='w-5 h-5' />
            <span>{test.questions.length} Questions</span>
          </div>
        </div>

        {mySubmission && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
            <p className='font-semibold text-blue-900'>Test Submitted</p>
            <p className='text-blue-700'>
              Submitted: {formatDate(mySubmission.submittedAt)}
            </p>
            <p className='text-2xl font-bold text-blue-600 mt-2'>
              Grade: {mySubmission.grade.toFixed(0)}%
            </p>
          </div>
        )}

        {isPastDue && !mySubmission && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='w-5 h-5 text-red-600' />
              <p className='font-semibold text-red-900'>
                This test is past due and can no longer be submitted.
              </p>
            </div>
          </div>
        )}
      </div>

      {showResults && mySubmission ? (
        <div className='space-y-6'>
          <h2 className='text-2xl font-bold'>Your Results</h2>
          {mySubmission.answers.map((answer, idx) => (
            <div
              key={answer.questionId}
              className='bg-white rounded-lg shadow-md p-6'
            >
              <h3 className='font-semibold mb-4'>
                {idx + 1}. {answer.questionText}
              </h3>
              <div
                className={`p-4 rounded-lg flex items-center gap-2 ${
                  answer.isCorrect
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-red-100 border border-red-300'
                }`}
              >
                {answer.isCorrect ? (
                  <CheckCircle className='w-5 h-5 text-green-600' />
                ) : (
                  <XCircle className='w-5 h-5 text-red-600' />
                )}
                <div>
                  <p className='font-semibold'>Your answer:</p>
                  <p>{answer.selectedOptionText}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='space-y-6'>
          {test.questions.map((question, idx) => (
            <div
              key={question.id}
              className='bg-white rounded-lg shadow-md p-6'
            >
              <h3 className='font-semibold mb-4'>
                {idx + 1}. {question.questionText}
              </h3>
              <div className='space-y-3'>
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAnswers[question.id] === option.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50 border-gray-200'
                    } ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type='radio'
                      name={question.id}
                      value={option.id}
                      checked={selectedAnswers[question.id] === option.id}
                      onChange={() =>
                        handleAnswerChange(question.id, option.id)
                      }
                      disabled={!canSubmit}
                      className='mr-3'
                    />
                    {option.optionText}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {submitError && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-red-800'>{submitError}</p>
            </div>
          )}

          {canSubmit && (
            <button
              onClick={handleSubmit}
              disabled={submitTestMutation.isPending}
              className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {submitTestMutation.isPending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className='w-5 h-5' />
                  Submit Test
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
