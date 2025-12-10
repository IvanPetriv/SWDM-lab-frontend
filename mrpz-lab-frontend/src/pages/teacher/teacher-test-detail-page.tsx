import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useTestWithAnswers,
  useTestSubmissions,
  useStudentsNotSubmitted,
  useDeleteTest,
} from '../../hooks/tests';
import {
  Loader2,
  ArrowLeft,
  Trash2,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Modal from '../../components/Modal';

export default function TeacherTestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: test, isLoading: testLoading } = useTestWithAnswers(id || '');
  const { data: submissions } = useTestSubmissions(id || '');
  const { data: notSubmitted } = useStudentsNotSubmitted(id || '');
  const deleteTestMutation = useDeleteTest();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(
    null
  );

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTestMutation.mutateAsync(id);
      navigate(-1);
    } catch (error) {
      console.error('Failed to delete test:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isPastDue = test && new Date(test.dueDate) < new Date();

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

  const selectedSubmissionData = submissions?.find(
    (s) => s.id === selectedSubmission
  );

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6'
      >
        <ArrowLeft className='w-5 h-5' />
        Back
      </button>

      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>{test.title}</h1>
            <p className='text-gray-600 mb-4'>{test.description}</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
          >
            <Trash2 className='w-5 h-5' />
            Delete Test
          </button>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          <div className='flex items-center gap-2 text-gray-700'>
            <Calendar className='w-5 h-5' />
            <span>
              Due: {formatDate(test.dueDate)}
              {isPastDue && (
                <span className='ml-2 text-red-500 font-semibold'>
                  (Past Due)
                </span>
              )}
            </span>
          </div>
          <div className='flex items-center gap-2 text-gray-700'>
            <FileText className='w-5 h-5' />
            <span>{test.questions.length} Questions</span>
          </div>
        </div>

        <div className='border-t pt-4'>
          <h2 className='text-xl font-semibold mb-4'>Questions</h2>
          {test.questions.map((question, idx) => (
            <div key={question.id} className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-semibold mb-3'>
                {idx + 1}. {question.questionText}
              </h3>
              <div className='space-y-2'>
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 rounded ${
                      option.isCorrect
                        ? 'bg-green-100 border border-green-300'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      {option.isCorrect && (
                        <CheckCircle className='w-5 h-5 text-green-600' />
                      )}
                      <span>{option.optionText}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <Users className='w-6 h-6' />
            Submissions ({submissions?.length || 0})
          </h2>
          <div className='space-y-3'>
            {submissions && submissions.length > 0 ? (
              submissions.map((submission) => (
                <div
                  key={submission.id}
                  className='p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'
                  onClick={() => setSelectedSubmission(submission.id)}
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <p className='font-semibold'>{submission.studentName}</p>
                      <p className='text-sm text-gray-600'>
                        {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p
                        className={`text-2xl font-bold ${
                          submission.grade >= 70
                            ? 'text-green-600'
                            : submission.grade >= 50
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {submission.grade.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center py-4'>
                No submissions yet
              </p>
            )}
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
            <AlertCircle className='w-6 h-6 text-orange-500' />
            Not Submitted ({notSubmitted?.length || 0})
          </h2>
          <div className='space-y-3'>
            {notSubmitted && notSubmitted.length > 0 ? (
              notSubmitted.map((student) => (
                <div key={student.studentId} className='p-4 border rounded-lg'>
                  <p className='font-semibold'>{student.studentName}</p>
                  <p className='text-sm text-gray-600'>
                    {student.studentEmail}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-center py-4'>
                All students have submitted
              </p>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <h2 className='text-xl font-bold mb-4'>Delete Test</h2>
          <p className='mb-6'>
            Are you sure you want to delete this test? This action cannot be
            undone.
          </p>
          <div className='flex gap-3 justify-end'>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {selectedSubmission && selectedSubmissionData && (
        <Modal onClose={() => setSelectedSubmission(null)}>
          <h2 className='text-xl font-bold mb-4'>
            {selectedSubmissionData.studentName}'s Submission
          </h2>
          <div className='mb-4'>
            <p className='text-gray-600'>
              Submitted: {formatDate(selectedSubmissionData.submittedAt)}
            </p>
            <p className='text-2xl font-bold text-blue-600'>
              Grade: {selectedSubmissionData.grade.toFixed(0)}%
            </p>
          </div>
          <div className='space-y-4 max-h-96 overflow-y-auto'>
            {selectedSubmissionData.answers.map((answer, idx) => (
              <div
                key={answer.questionId}
                className='p-4 bg-gray-50 rounded-lg'
              >
                <h3 className='font-semibold mb-2'>
                  {idx + 1}. {answer.questionText}
                </h3>
                <div
                  className={`p-3 rounded flex items-center gap-2 ${
                    answer.isCorrect
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {answer.isCorrect ? (
                    <CheckCircle className='w-5 h-5' />
                  ) : (
                    <XCircle className='w-5 h-5' />
                  )}
                  <span>{answer.selectedOptionText}</span>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
