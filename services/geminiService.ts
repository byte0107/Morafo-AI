
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage, MarketItem, WeatherRisk, MarketListing, Language } from "../types";

const SYSTEM_INSTRUCTION = `
You are MorafoAI, an advanced Poultry & Rabbit Farming Assistant created by Morafo Poultry Co in Lesotho.

Your goal is to help Basotho farmers master poultry (Broilers, Layers, Free-range/Khoho ea Sesotho) and Rabbit farming.

LANGUAGES:
You are bilingual. You must be able to speak fluently in English and Sesotho (Southern Sotho).
If the user speaks Sesotho, reply in Sesotho. If English, reply in English.
Always use respectful terms (Ntate, M'e, Khotso).

CORE RESPONSIBILITIES:
1. Poultry & Rabbit Health: Identify diseases specifically in chickens (Newcastle, Coccidiosis, Flu, Gumboro) and Rabbits (Snuffles, Ear mites).
2. Feed & Nutrition: Advise on feed stages (Starter, Grower, Finisher) and organic supplements (Aloe/Lekhala, Moringa).
3. Weather: Warn about risks like Frost (Serame) and Heat (Mocheso) which kills broilers.
4. Market: Provide insights on prices for eggs, live chickens, and meat.

TONE:
- Professional, encouraging, and locally relevant.
- Assume the user is in Lesotho.
- Use metric units (kg, Celsius).
`;

// Use Vite environment variable for API Key to prevent 'process is not defined' error in browser
const apiKey = (import.meta as any).env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

let chatSession: Chat | null = null;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (text: string, imageBase64?: string, language: Language = 'en'): Promise<string> => {
  const chat = getChatSession();

  try {
    let response: GenerateContentResponse;
    const langInstruction = language === 'st' ? " (Please reply in Sesotho)" : "";
    const messageContent = text + langInstruction;

    if (imageBase64) {
        const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        const data = imageBase64.split(',')[1];
        
        response = await chat.sendMessage({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: messageContent },
                        { inlineData: { mimeType, data } }
                    ]
                }
            ]
        });

    } else {
        response = await chat.sendMessage({ message: messageContent });
    }
    
    return response.text || (language === 'st' ? "Ke kopa tšoarelo, ha kea utloisisa. Ke kopa o phete hape." : "I didn't quite understand that. Could you please rephrase?");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeHealthImage = async (imageBase64: string, userNotes: string, animalType: string, language: Language = 'en'): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash';
        const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        const data = imageBase64.split(',')[1];
        
        const langPrompt = language === 'st' 
            ? "Provide the diagnosis and advice strictly in Southern Sotho (Sesotho)." 
            : "Provide the diagnosis and advice in English.";

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: `Analyze this image of a sick ${animalType}. Farmer notes: ${userNotes}. 
                    ${langPrompt}
                    1. What is likely wrong? (Focus on Poultry/Rabbit common diseases in Southern Africa).
                    2. Clinical treatment (Antibiotics, etc available in Lesotho). 
                    3. Organic/Home remedy (e.g., Lekhala, Garlic). 
                    4. Prevention.` }
                ]
            },
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            }
        });
        return response.text || (language === 'st' ? "Ha ke khone ho hlahloba setšoantšo sena hajoale." : "I cannot analyze this image right now.");
    } catch (error) {
        console.error("Diagnosis Error:", error);
        throw error;
    }
}

export const getMarketInsights = async (): Promise<MarketItem[]> => {
    try {
        // Expanded list for Lesotho context with specific instruction for Basotho Chicken
        const prompt = `Generate a list of current estimated market prices (LSL/Maloti) in Lesotho specializing in Poultry.
        MUST INCLUDE: 
        1. "Khoho ea Sesotho (Big Breeds)" - specifically mention Brown Sussex, Brahma, Buff Orpington. Price ~250.
        2. Basotho Chicken (Live - Ordinary)
        3. Broiler (Live - Full grown)
        4. Egg Tray (Large - 30s)
        5. Day Old Chicks (Broiler - per box of 100)
        6. Rabbit (Live - Meat breed)
        7. 50kg Poultry Feed (Starter)
        8. 50kg Poultry Feed (Finisher)
        9. Lucerne Bale
        10. Sunflower Cake (kg)
        
        Indicate if price is trending up or down.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Product name" },
                            price: { type: Type.NUMBER, description: "Price in Maloti" },
                            unit: { type: Type.STRING, description: "Unit e.g., kg, tray, each" },
                            trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
                            prediction: { type: Type.STRING, description: "Short reason for trend or breed details" }
                        }
                    }
                }
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text) as MarketItem[];
        }
        return [];
    } catch (error) {
        console.error("Market Data Error:", error);
        return [];
    }
}

export const getFakeMarketListings = async (): Promise<MarketListing[]> => {
    try {
        const prompt = `Generate exactly 20 realistic marketplace listings suitable for a Lesotho Poultry Farmers Facebook group. 
        Mix of Selling and Buying. 
        Use real Lesotho districts/towns.
        Items must be POULTRY/RABBIT focused: Day old chicks, Point of Lay, Cobb 500, Boschveld, Cages, Drinkers, Feeds, Rabbits (Chinchilla/New Zealand).
        Prices should be realistic in Maloti (M) or 'Negotiable'.
        Seller names should sound like local Basotho names.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            item: { type: Type.STRING },
                            price: { type: Type.STRING },
                            location: { type: Type.STRING },
                            seller: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['selling', 'buying'] },
                            time: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        if (response.text) {
            const listings = JSON.parse(response.text) as MarketListing[];
            return listings.map(l => ({
                ...l,
                isVerified: Math.random() > 0.6
            }));
        }
        return [];
    } catch (error) {
        return [];
    }
}

export const getCulturalEconomicInsights = async (language: Language = 'en'): Promise<string> => {
    // Fallback content in case API fails or returns empty.
    const FALLBACK_CONTENT_EN = `
# Poultry Farming: The Basotho Way & Modern Economics
Poultry farming in Lesotho is transforming from a backyard hobby into a cornerstone of agricultural economic growth.
### The Economic Shift
With the rising cost of red meat, chicken has become the primary source of protein for Basotho families.
### Khotso, Pula, Nala: The Organic Advantage
Basotho have a unique advantage: our traditional knowledge. The market is shifting towards organic produce.
    `;

    const FALLBACK_CONTENT_ST = `
# Tlhahiso ea Likhoho: Mokhoa oa Basotho le Moruo
Temo ea likhoho Lesotho e fetoha ho tloha ho hoba mokhoa oa ho iphelisa feela ho ba khoebo e kholo ea moruo.
### Phetoho ea Moruo
Ka lebaka la ho nyoloha ha litheko tsa nama e khubelu, nama ea khoho e se e le eona mohloli o ka sehloohong oa protheine malapeng a Basotho.
### Khotso, Pula, Nala: Molemo oa Tlhaho
Basotho ba na le monyetla o ikhethang: tsebo ea rona ea setso. 'Maraka o batla lihlahisoa tsa tlhaho (organic).
    `;

    const fallback = language === 'st' ? FALLBACK_CONTENT_ST : FALLBACK_CONTENT_EN;

    try {
        const langInstruction = language === 'st' 
            ? "Write strictly in Southern Sotho (Sesotho)." 
            : "Write in English.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, engaging article (approx 300 words) titled "Poultry Farming: The Basotho Way & Modern Economics".
            ${langInstruction}
            
            Key Points to cover:
            1. Current economic trends in Lesotho poultry (Profitability of Eggs vs Meat).
            2. Cultural practices: How traditional methods (Free range/Khoho ea Sesotho) are becoming premium markets.
            3. Mention the use of "Lekhala" (Aloe) as a cultural strength in organic farming.
            4. Encouragement for youth to see poultry as a business.
            
            Format with Markdown headers.`,
        });

        if (response.text && response.text.length > 50) {
            return response.text;
        }
        return fallback;
    } catch (error) {
        console.error("Insights error", error);
        return fallback;
    }
}

export const getWeatherRisk = async (lat?: number, lng?: number, language: Language = 'en'): Promise<WeatherRisk> => {
     try {
        let locationContext = "Lesotho generally";
        if (lat && lng) {
            locationContext = `coordinates ${lat}, ${lng}`;
        }
        
        const langInstruction = language === 'st' ? "Sesotho" : "English";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the current season and weather in ${locationContext}, what is the single biggest weather risk for POULTRY farmers today? Choose from: Heat (Mocheso), Frost (Serame), Drought, Heavy Rain, Hail. Provide specific advice for Chickens in ${langInstruction}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['Mocheso', 'Serame', 'Komello', 'Pula', 'Sefako', 'None'] },
                        level: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                        advice: { type: Type.STRING, description: `Specific actionable advice in ${langInstruction}` },
                        locationName: { type: Type.STRING, description: "Name of the district or area" }
                    }
                }
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text) as WeatherRisk;
        }
        return { type: 'None', level: 'Low', advice: 'Conditions are stable. Continue monitoring.' };
    } catch (error) {
        console.error("Weather Risk Error:", error);
        return { type: 'None', level: 'Low', advice: 'Could not fetch weather data.' };
    }
}
