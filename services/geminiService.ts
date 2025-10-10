import { GoogleGenAI, Type } from "@google/genai";
import { KeywordData, ContentIdeas } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const keywordGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        clusters: {
            type: Type.ARRAY,
            description: "An array of keyword cluster objects.",
            items: {
                type: Type.OBJECT,
                properties: {
                    clusterName: {
                        type: Type.STRING,
                        description: "A descriptive name for the keyword topic cluster (e.g., 'Beginner Tips', 'Advanced Techniques')."
                    },
                    keywords: {
                        type: Type.ARRAY,
                        description: "An array of keyword objects within this cluster.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                keyword: {
                                    type: Type.STRING,
                                    description: "The specific YouTube keyword."
                                },
                                volume: {
                                    type: Type.STRING,
                                    description: "Estimated search volume on YouTube. Can be 'Low', 'Medium', or 'High'.",
                                    enum: ['Low', 'Medium', 'High']
                                },
                                competition: {
                                    type: Type.STRING,
                                    description: "Estimated competition on YouTube. Can be 'Low', 'Medium', or 'High'.",
                                    enum: ['Low', 'Medium', 'High']
                                },
                                opportunityScore: {
                                    type: Type.INTEGER,
                                    description: "A score from 1 to 100 indicating the keyword's opportunity. Higher scores are better (high volume, low competition)."
                                }
                            },
                             required: ["keyword", "volume", "competition", "opportunityScore"]
                        }
                    }
                },
                required: ["clusterName", "keywords"]
            }
        }
    },
    required: ["clusters"]
};


export const generateKeywordsAndClusters = async (topic: string): Promise<KeywordData> => {
    const prompt = `
        You are a YouTube SEO expert. Your task is to perform keyword research for the topic: "${topic}".
        Provide a detailed list of related keywords, including long-tail keywords. 
        For each keyword, estimate its YouTube search volume (Low, Medium, High) and competition level (Low, Medium, High).
        Then, calculate an 'opportunityScore' from 1 to 100, where 100 is the best opportunity (high volume, low competition).
        Finally, group these keywords into logical, distinct topic clusters. Each cluster must have at least 3 keywords. Create 3 to 5 clusters in total.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: keywordGenerationSchema,
        },
    });

    const jsonText = response.text;
    const parsedData = JSON.parse(jsonText);

    // Validate and sort the data
    if (parsedData && parsedData.clusters) {
      parsedData.clusters.forEach((cluster: { keywords: any[]; }) => {
        if (cluster.keywords) {
          cluster.keywords.sort((a, b) => b.opportunityScore - a.opportunityScore);
        }
      });
      return parsedData as KeywordData;
    }

    throw new Error("Invalid data structure received from API.");
};

const contentIdeasSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A catchy, high-CTR YouTube video title (max 70 characters)."
    },
    description: {
      type: Type.STRING,
      description: "An SEO-optimized YouTube video description (200-300 words) that includes the main keyword and related terms naturally. Use paragraphs for readability."
    },
    tags: {
      type: Type.ARRAY,
      description: "A list of 10-15 relevant YouTube tags, including the main keyword, long-tail variations, and broader topic tags.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["title", "description", "tags"]
};

export const generateContentIdeas = async (keyword: string): Promise<ContentIdeas> => {
    const prompt = `
        You are a YouTube content strategy expert. Generate content ideas for a video based on the keyword: "${keyword}".
        Provide the following:
        1. A catchy, high-CTR (Click-Through Rate) video title that is 70 characters or less.
        2. An SEO-optimized video description between 200 and 300 words. It should naturally incorporate the keyword "${keyword}" and related terms. Format it for readability.
        3. A list of 10 to 15 relevant YouTube tags.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: contentIdeasSchema,
        },
    });

    const jsonText = response.text;
    return JSON.parse(jsonText) as ContentIdeas;
};
