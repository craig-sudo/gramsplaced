import { GoogleGenAI, Type } from "@google/genai";
import { CalendarEvent, WellnessLog, Project, ShoppingItem, TaskStatus, MealPlanDay, LiveScore } from '../types';

// FIX: Initialize GoogleGenAI with API_KEY from environment variables directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GroundedSearchResult {
  answer: string;
  sources: { title: string; uri: string }[];
}

export const getGroundedSuggestions = async (query: string): Promise<GroundedSearchResult> => {
  // FIX: Removed check for API_KEY as it's a hard requirement from the environment.
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide helpful information about: ${query}. Focus on practical tips and resources relevant for family caregivers.`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const answer = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => web && web.uri && web.title)
      .map(web => ({ uri: web.uri as string, title: web.title as string }));

    return { answer, sources };
  } catch (error) {
    console.error("Error fetching grounded suggestions:", error);
    return {
      answer: "Sorry, I encountered an error while trying to get suggestions. Please try again later.",
      sources: []
    };
  }
};

export interface WeeklyUpdateContext {
  calendarEvents: CalendarEvent[];
  wellnessLogs: WellnessLog[];
  project: Project;
  shoppingList: ShoppingItem[];
}

export const generateWeeklyUpdate = async (context: WeeklyUpdateContext): Promise<string> => {
  const { calendarEvents, wellnessLogs, project, shoppingList } = context;

  // Take the next 3 upcoming, non-birthday events
  const upcomingEventsText = calendarEvents
    .filter(e => e.type === 'Shift')
    .slice(0, 3)
    .map(e => `- ${e.day} @ ${e.time}: ${e.title} (with ${e.assignee?.name || 'unassigned'})`)
    .join('\n');

  // Take the most recent 2 logs
  const recentLogsText = wellnessLogs
    .slice(0, 2)
    .map(l => `- From ${l.author.name}: "${l.content}"`)
    .join('\n');

  const projectTasksText = project.tasks
    .filter(t => t.status !== TaskStatus.Done)
    .map(t => `- ${t.title} (Status: ${t.status})`)
    .join('\n');

  const shoppingListText = shoppingList.length > 0
    ? shoppingList.map(item => `- ${item.name} (added by ${item.addedBy.name})`).join('\n')
    : 'The list is all clear!';

  const prompt = `
You are the friendly voice of "Gram's House Hub". Your task is to generate a warm, concise, and informative weekly update newsletter for the family. The tone should be conversational and encouraging, like a quick check-in.

Here's the data for this week:

**Upcoming Care Shifts:**
${upcomingEventsText}

**Recent Wellness Updates for Gram:**
${recentLogsText}

**Project Update (${project.title}):**
${projectTasksText}

**Shared Shopping List:**
${shoppingListText}

**Instructions:**
1. Start with a friendly, personal greeting like "Hey family!" or "Hey there! It's Gram's House checking in with a quick update for the week."
2. Summarize the key information from each section above into a cohesive, easy-to-read message. Use short paragraphs.
3. Keep it brief and positive.
4. Gently highlight what's needed from the family (e.g., "Just a heads-up on the shopping list..." or "Let's keep up the great work on the bathroom!").
5. End with a warm closing like "Thanks for everything you do!" or "Have a wonderful week!".

Generate the newsletter content now. Do not use markdown formatting like '###' or '**'. Use plain text and paragraphs.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating weekly update:", error);
    return "Sorry, I couldn't generate the update right now. Please try again later.";
  }
};


export const generateMealPlan = async (query: string): Promise<MealPlanDay[]> => {
  const prompt = `You are a helpful assistant creating a simple, healthy, and easy-to-prepare 3-day meal plan, primarily for an elderly person. The user has provided the following preference: "${query}".
  
  Please generate a meal plan in the specified JSON format. Keep the meal descriptions brief (e.g., "Oatmeal with berries", "Grilled chicken salad", "Baked salmon with roasted vegetables").`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              meals: {
                type: Type.OBJECT,
                properties: {
                  breakfast: { type: Type.STRING },
                  lunch: { type: Type.STRING },
                  dinner: { type: Type.STRING },
                },
                required: ["breakfast", "lunch", "dinner"]
              },
            },
            required: ["day", "meals"]
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (jsonText.startsWith('[') && jsonText.endsWith(']')) {
      return JSON.parse(jsonText) as MealPlanDay[];
    }
    console.error("Failed to parse meal plan JSON:", jsonText);
    return [];
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return [];
  }
};

export const generateMemoryStory = async (imageBase64: string, mimeType: string, prompt: string): Promise<string> => {
    const fullPrompt = `Based on this image and the user's note, write a short, heartfelt story about this memory as if you're recounting it for a family photo album.
User's note: "${prompt}"
Keep the story to 2-4 sentences. The tone should be warm and nostalgic.`;

    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };
        const textPart = { text: fullPrompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error generating memory story:", error);
        return "There was a problem creating the story for this memory. Please try again.";
    }
};

export const getLiveGameScore = async (opponent: string): Promise<LiveScore | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Get the live score for the Montreal Canadiens vs ${opponent} hockey game. Respond with only the data in this exact format, without any extra text or explanation: MTL_SCORE,OPPONENT_SCORE,PERIOD,TIME_REMAINING. For example: 3,1,2,10:45`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    const text = response.text?.trim();

    if (!text) {
      console.warn("No text response from Gemini for live score.");
      return null;
    }

    const parts = text.split(',');

    if (parts.length === 4) {
      return {
        mtlScore: parts[0],
        opponentScore: parts[1],
        period: parts[2],
        timeRemaining: parts[3],
      };
    }
    console.warn("Could not parse score from Gemini:", text);
    return null;
  } catch (error) {
    console.error("Error fetching live score:", error);
    return null;
  }
};