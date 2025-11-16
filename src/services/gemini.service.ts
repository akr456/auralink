
import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private ai: GoogleGenAI;
  private state = inject(StateService);

  constructor() {
    // IMPORTANT: This relies on `process.env.API_KEY` being set in the environment.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY environment variable not set.');
      // In a real app, you'd handle this more gracefully.
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey! });
  }

  async getAuraSuggestions(): Promise<void> {
    this.state.isLoading.set(true);
    try {
      const existingAuras = this.state.auras().map(a => a.name).join(', ');
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the existing interests (${existingAuras}), suggest 3 new, niche, and interesting topics for a tech-savvy social media user.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                }
              }
            }
          }
        }
      });
      const jsonStr = response.text.trim();
      const result = JSON.parse(jsonStr);
      if (result.suggestions && Array.isArray(result.suggestions)) {
        this.state.addAuras(result.suggestions);
      }
    } catch (error) {
      console.error('Error getting Aura suggestions:', error);
      // You could add a user-facing error signal here.
    } finally {
      this.state.isLoading.set(false);
    }
  }

  async enhancePost(postText: string): Promise<string> {
    if (!postText.trim()) return '';
    this.state.isEnhancing.set(true);
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Rewrite this social media post to be more engaging and concise. Add 2-3 relevant hashtags at the end. Post: "${postText}"`,
      });
      return response.text.trim();
    } catch (error) {
      console.error('Error enhancing post:', error);
      return postText; // Return original text on error
    } finally {
      this.state.isEnhancing.set(false);
    }
  }
}
