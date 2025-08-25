'use server';

/**
 * @fileOverview AI-powered content personalization based on visitor interaction.
 *
 * This flow analyzes visitor behavior (scroll depth, click patterns) and dynamically adjusts the website's content
 * and aesthetics to match the viewer's interests.
 *
 * - personalizeContent - A function that handles the content personalization process.
 * - PersonalizeContentInput - The input type for the personalizeContent function.
 * - PersonalizeContentOutput - The return type for the personalizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeContentInputSchema = z.object({
  interactionData: z
    .string()
    .describe(
      'A JSON string containing visitor interaction data, including scroll depth, click patterns, and time spent on different sections of the website.'
    ),
  currentContent: z
    .string()
    .describe(
      'A JSON string representing the current content and aesthetics of the website.'
    ),
});
export type PersonalizeContentInput = z.infer<typeof PersonalizeContentInputSchema>;

const PersonalizeContentOutputSchema = z.object({
  personalizedContent: z
    .string()
    .describe(
      'A JSON string representing the personalized content and aesthetics of the website, optimized for the visitor based on their interaction data.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation from the AI regarding the content adjustments and why they were made for this specific visitor based on their interaction data.'
    ),
});
export type PersonalizeContentOutput = z.infer<typeof PersonalizeContentOutputSchema>;

export async function personalizeContent(input: PersonalizeContentInput): Promise<PersonalizeContentOutput> {
  return personalizeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeContentPrompt',
  input: {schema: PersonalizeContentInputSchema},
  output: {schema: PersonalizeContentOutputSchema},
  prompt: `You are an AI-powered web content personalization expert. You analyze visitor interaction data and dynamically adjust website content and aesthetics to match the viewer's interests.

  Here's the visitor interaction data:
  {{interactionData}}

  Here's the current website content and aesthetics:
  {{currentContent}}

  Based on the interaction data, personalize the website content and aesthetics to better engage the visitor.  Focus on highlighting information most relevant to their interests and improve overall user experience. Provide a reasoning for each content adjustment.

  Return the personalized content and aesthetics as a JSON string and the reasoning for the changes in the "reasoning" field.
  Make sure that the personalizedContent field is a valid JSON.
  `,
});

const personalizeContentFlow = ai.defineFlow(
  {
    name: 'personalizeContentFlow',
    inputSchema: PersonalizeContentInputSchema,
    outputSchema: PersonalizeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
