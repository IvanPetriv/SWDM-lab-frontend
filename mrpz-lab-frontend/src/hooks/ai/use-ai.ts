import { useMutation } from '@tanstack/react-query';
import { generatePostContent, generatePostImage, generateTestQuestions } from '../../api/ai';

export const useGeneratePostContent = () => {
  return useMutation({
    mutationFn: generatePostContent,
  });
};

export const useGeneratePostImage = () => {
  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      generatePostImage(title, content),
  });
};

export const useGenerateTestQuestions = () => {
  return useMutation({
    mutationFn: ({
      topic,
      numberOfQuestions,
      courseContext,
    }: {
      topic: string;
      numberOfQuestions: number;
      courseContext?: string;
    }) => generateTestQuestions(topic, numberOfQuestions, courseContext),
  });
};
