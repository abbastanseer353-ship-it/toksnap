'use server';
/**
 * @fileOverview A Genkit flow for generating image metadata (alt-text and tags) from an uploaded image.
 *
 * - generateImageMetadata - A function that handles the image metadata generation process.
 * - ImageUploadInput - The input type for the generateImageMetadata function.
 * - ImageMetadataOutput - The return type for the generateImageMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageUploadInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a user's upload, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageUploadInput = z.infer<typeof ImageUploadInputSchema>;

const ImageMetadataOutputSchema = z.object({
  altText: z.string().describe('Descriptive alt-text for the image.'),
  tags: z.array(z.string()).describe('A list of relevant categorization tags for the image.'),
});
export type ImageMetadataOutput = z.infer<typeof ImageMetadataOutputSchema>;

export async function generateImageMetadata(
  input: ImageUploadInput
): Promise<ImageMetadataOutput> {
  return generateImageMetadataFlow(input);
}

const generateImageMetadataPrompt = ai.definePrompt({
  name: 'generateImageMetadataPrompt',
  input: {schema: ImageUploadInputSchema},
  output: {schema: ImageMetadataOutputSchema},
  prompt: `You are an AI assistant tasked with analyzing images to generate descriptive alt-text and relevant categorization tags.

Based on the provided image, output a concise alt-text description that accurately represents the visual content, and a list of up to 5 categorization tags that would help in discovery and organization.

Image: {{media url=photoDataUri}}`,
});

const generateImageMetadataFlow = ai.defineFlow(
  {
    name: 'generateImageMetadataFlow',
    inputSchema: ImageUploadInputSchema,
    outputSchema: ImageMetadataOutputSchema,
  },
  async input => {
    const {output} = await generateImageMetadataPrompt(input);
    return output!;
  }
);
