
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
2. Medicine Sourcing: When recommending treatment, ALWAYS suggest where to buy it in Lesotho. Mention "Agrivet clinics", "Co-operatives (Co-ops)", "Local Pharmacies", or "Animal Health Suppliers" in major districts like Maseru, Leribe, and Mafeteng.
3. Feed & Nutrition: Advise on feed stages (Starter, Grower, Finisher) and organic supplements (Aloe/Lekhala, Moringa).
4. Weather: Warn about risks like Frost (Serame) and Heat (Mocheso) which kills broilers.
5. Market Scope: Only discuss items related to Poultry and Rabbit farming. Do not provide info on unrelated topics like fashion, electronics, or non-farming services.
`;

// Standard initialization per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

let chatSession: Chat | null = null;

const FALLBACK_INSIGHTS_EN = `
# The Wealth of the Village: Poultry in Lesotho

Poultry farming is the heartbeat of rural Lesotho. Beyond simple food production, it represents a primary source of liquid capital for Basotho households.

## The Khoho ea Sesotho Legacy
Indigenous chickens (*Khoho ea Sesotho*) are more than just birds; they are a cultural asset. Traditionally used in ceremonies and as gifts, their resilience to Lesotho's harsh winters and ability to forage makes them an ideal organic asset. While broilers provide quick turnover, "Sesotho" birds provide long-term security.

## The Economic Shift
In recent years, the move toward specialized broiler and layer production in districts like Maseru and Leribe has transformed the economy. However, high input costs (especially imported feed) remain a challenge. MorafoAI encourages the integration of organic supplements like *Lekhala* (Aloe) and *Moringa* to reduce mortality and improve bird health naturally.

## Market Trends
Current market data suggests a growing preference for farm-gate sales. Consumers in Lesotho increasingly value the freshness of "live-sale" poultry over frozen imports, creating a massive opportunity for local producers to dominate the domestic market.
`;

const FALLBACK_INSIGHTS_ST = `
# Letlotlo la Motse: Temo ea Likhoho Lesotho

Temo ea likhoho ke motheo oa bophelo mahaeng a Lesotho. Hase feela tsela ea ho fumana lijo, empa ke letlotlo le ka fetoloang chelete kapele malapeng a Basotho.

## Moqoqo oa Khoho ea Sesotho
Likhoho tsa Sesotho ke letlotlo la rona la tlhaho. Li khona ho mamella serame sa rona se kotsi le ho iphelisa ka ho fula. Le ha likhoho tsa broiler li tlisa chelete kapele, khoho ea Sesotho e fana ka tšireletso ea nako e telele.

## Phetoho ea Moruo
Lilemong tsa morao tjena, temo ea likhoho tsa nama (broilers) le tsa mahe (layers) e eketsehile haholo literekeng tse kang Maseru le Leribe. Leha ho le joalo, theko e phahameng ea lijo tse tsoang kantle e ntse e le phephetso. MorafoAI e khothaletsa tšebeliso ea litlhare tsa tlhaho tse kang *Lekhala* le *Moringa* ho fokotsa mafu.

## Maikutlo a Maraka
Batho ba Lesotho ba se ba rata ho reka likhoho tse phelang ho feta tse hoammeng tse tsoang kantle. Sena se fa lihoai tsa rona monyetla o moholo oa ho hapa maraka a naha ka lijo tse hloekileng le tse ncha.
`;

const FALLBACK_MARKET_PRICES: MarketItem[] = [
    { name: "Khoho ea Sesotho (Big Breeds)", price: 250, unit: "each", trend: "up", prediction: "High demand for breeding" },
    { name: "Basotho Chicken (Live)", price: 120, unit: "each", trend: "stable", prediction: "Standard local price" },
    { name: "Broiler (Live - Full grown)", price: 90, unit: "each", trend: "up", prediction: "Feed costs rising" },
    { name: "Egg Tray (Large - 30s)", price: 65, unit: "tray", trend: "stable", prediction: "Consistent demand" },
    { name: "Day Old Chicks (Broiler)", price: 1100, unit: "box of 100", trend: "up", prediction: "Import costs high" },
    { name: "Rabbit (Live - Meat)", price: 150, unit: "each", trend: "down", prediction: "Market saturated" },
    { name: "Poultry Feed (Starter 50kg)", price: 480, unit: "bag", trend: "up", prediction: "Grain prices up" }
];

export const getChatSession = (): Chat => {
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
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
            contents: [{
                role: 'user',
                parts: [{ text: messageContent }, { inlineData: { mimeType, data } }]
            }]
        });
    } else {
        response = await chat.sendMessage({ message: messageContent });
    }
    return response.text || "No response";
  } catch (error) {
    return language === 'st' ? "Phoso ea khokahano." : "Connection error.";
  }
};

export const analyzeHealthImage = async (imageBase64: string, userNotes: string, animalType: string, language: Language = 'en'): Promise<string> => {
    try {
        const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
        const data = imageBase64.split(',')[1];
        const langPrompt = language === 'st' ? "Reply in Southern Sotho." : "Reply in English.";
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType, data } },
                    { text: `Analyze health of this sick ${animalType}. Notes: ${userNotes}. 
                    ${langPrompt}
                    1. Likely diagnosis.
                    2. Recommended medicine (Specifically mention where to buy it in Lesotho, e.g., Agrivet, Pharmacies, Co-ops).
                    3. Organic home remedies.
                    4. Prevention tips.` }
                ]
            },
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        return response.text || "Analysis failed.";
    } catch (error) {
        return "Error analyzing image.";
    }
}

export const getMarketInsights = async (): Promise<MarketItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate current Lesotho Poultry market prices in JSON format.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            price: { type: Type.NUMBER },
                            unit: { type: Type.STRING },
                            trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
                            prediction: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        return response.text ? JSON.parse(response.text) : FALLBACK_MARKET_PRICES;
    } catch (error) {
        return FALLBACK_MARKET_PRICES;
    }
}

export const getFakeMarketListings = async (): Promise<MarketListing[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate 15 realistic POULTRY/RABBIT ONLY marketplace listings for Lesotho.",
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
            return listings.map(l => ({ ...l, isVerified: Math.random() > 0.6 }));
        }
        return [];
    } catch (error) {
        return [];
    }
}

export const getCulturalEconomicInsights = async (language: Language = 'en'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Write an article on Lesotho Poultry Economics. Language: ${language === 'st' ? 'Sesotho' : 'English'}.`,
        });
        return response.text || (language === 'st' ? FALLBACK_INSIGHTS_ST : FALLBACK_INSIGHTS_EN);
    } catch (error) {
        return language === 'st' ? FALLBACK_INSIGHTS_ST : FALLBACK_INSIGHTS_EN;
    }
}

export const getWeatherRisk = async (lat?: number, lng?: number, language: Language = 'en'): Promise<WeatherRisk> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Poultry weather risk for Lesotho. Lang: ${language === 'st' ? 'Sesotho' : 'English'}.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['Mocheso', 'Serame', 'Komello', 'Pula', 'Sefako', 'None'] },
                        level: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                        advice: { type: Type.STRING },
                        locationName: { type: Type.STRING }
                    }
                }
            }
        });
        return response.text ? JSON.parse(response.text) : { type: 'None', level: 'Low', advice: "Normal" };
    } catch (error) {
        return { type: 'None', level: 'Low', advice: "Normal" };
    }
}
