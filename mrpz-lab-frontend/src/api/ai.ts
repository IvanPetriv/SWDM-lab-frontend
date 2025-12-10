import { generateText, streamText, generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

export interface GenerateTextResponse {
  content: string;
}

export const streamPostContent = async (prompt: string) => {
  const { textStream } = await streamText({
    model: google('gemini-2.5-flash'),
    prompt: `Generate content for a course post based on this request: "${prompt}".
    
    CRITICAL INSTRUCTIONS:
    - Output ONLY plain text.
    - NO Markdown formatting (no bold, no italics, no headers, no bullet points symbols like * or - unless absolutely necessary for a list, but prefer plain numbering).
    - NO hashtags.
    - NO emojis.
    - NO social media slang.
    - Keep the tone professional and academic.`,
  });
  return textStream;
};

export const generatePostContent = async (prompt: string): Promise<string> => {
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  });
  return text;
};

export const generatePostImage = async (
  title: string,
  content: string
): Promise<Blob> => {
  const result = (await generateText({
    model: google('gemini-2.5-flash-image'),
    prompt: `Create a picture that represents this post:\nTitle: ${title}\nContent: ${content}`,
  })) as any;

  console.log(result);
  if (result.files && result.files.length > 0) {
    const file = result.files[0];
    if (file.mediaType.startsWith('image/')) {
      return new Blob([file.uint8Array], { type: file.mediaType });
    }
  }

  throw new Error('No image generated');
};

export interface GeneratedQuestion {
  questionText: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
}

export interface GenerateTestResponse {
  questions: GeneratedQuestion[];
}

export const generateTestQuestions = async (
  topic: string,
  numberOfQuestions: number,
  courseContext?: string
): Promise<GenerateTestResponse> => {
  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      questions: z.array(
        z.object({
          questionText: z.string().describe('The question text'),
          options: z.array(
            z.object({
              optionText: z.string().describe('The option text'),
              isCorrect: z.boolean().describe('Whether this option is the correct answer'),
            })
          ).describe('4 options for the question, exactly one should be correct'),
        })
      ).describe(`List of ${numberOfQuestions} questions`),
    }),
    prompt: `Generate ${numberOfQuestions} multiple-choice questions about "${topic}".
    ${courseContext ? `Context: ${courseContext}` : ''}
    
    Requirements:
    - University level difficulty
    - Professional academic tone`,
  });

  return object;
};
