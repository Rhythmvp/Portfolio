'use server';

import type { PageContent } from '@/lib/types';
import { personalizeContent } from '@/ai/flows/personalize-content';

type PersonalizePageContentInput = {
  interactionData: string;
  currentContent: string;
};

export async function personalizePageContent(input: PersonalizePageContentInput): Promise<PageContent | null> {
  try {
    const result = await personalizeContent(input);
    if (result && result.personalizedContent) {
      try {
        // The AI might return malformed JSON. We'll validate it by parsing.
        const parsedContent = JSON.parse(result.personalizedContent);
        return parsedContent as PageContent;
      } catch (parseError) {
        console.error("AI personalization returned malformed JSON:", result.personalizedContent);
        console.error("Parse error:", parseError);
        // Optionally, you could attempt to fix common JSON issues here
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("AI personalization failed:", error);
    // Return null if parsing fails or any other error occurs
    return null;
  }
}
