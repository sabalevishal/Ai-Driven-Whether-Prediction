import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini API client with required header
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI-Driven Weather Prediction System",
    version: "2.0.0-TY-BTech-AI&DS",
    timestamp: new Date().toISOString(),
  });
});

// Gemini Weather Assistant endpoint with Google Search Grounding support
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, weatherContext, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAIClient();

    const systemInstruction = `You are the "Meteorological AI Research Assistant" for an AI-Driven Weather Prediction System (TY B.Tech AI & Data Science project).
You provide highly accurate, scientifically grounded weather explanations, risk warnings, and machine learning model insights.
Current Weather Context in System:
${weatherContext ? JSON.stringify(weatherContext, null, 2) : "No specific parameters provided."}

Your goals:
1. Answer weather queries directly, concisely, and accurately.
2. If asked about rain, heatwaves, storms, or travel safety, provide exact percentage risks, meteorological rationale (e.g. pressure drops, dew point convergence, humidity saturation, CAPE index), and actionable safety recommendations.
3. If asked about AI/ML algorithms (Linear Regression, Random Forest, XGBoost, LSTM, Hybrid Ensemble), explain the technical mathematics and why certain models perform better under time-series vs tabular conditions.
4. Format responses cleanly with crisp markdown, bullet points, and key bold metrics. Keep responses helpful and under 300 words unless detailed analysis is requested.`;

    // Call Gemini 3.7 Flash with Google Search Grounding
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I was unable to analyze the meteorological conditions. Please try again.";

    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri);

    return res.json({
      reply: replyText,
      sources: webSources,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/chat:", error);
    return res.status(500).json({
      error: "Failed to generate AI response",
      details: error.message,
    });
  }
});

// Gemini Deep Weather Analysis & Risk Assessment endpoint
app.post("/api/gemini/deep-analysis", async (req, res) => {
  try {
    const { weatherData, selectedModel, city } = req.body;

    const ai = getAIClient();

    const prompt = `Perform a comprehensive meteorological & machine learning evaluation for:
Location: ${city || "Selected Region"}
Model Selected: ${selectedModel || "Hybrid Ensemble"}
Weather Parameters:
- Temperature: ${weatherData.temperature}°C
- Humidity: ${weatherData.humidity}%
- Atmospheric Pressure: ${weatherData.pressure} hPa
- Wind Speed: ${weatherData.windSpeed} km/h
- Dew Point: ${weatherData.dewPoint}°C
- Cloud Cover: ${weatherData.cloudCover}%
- Rainfall Probability: ${weatherData.rainProbability}%
- Visibility: ${weatherData.visibility} km

Provide a structured 4-part synthesis:
1. **Atmospheric Physics & Synoptic Summary**: Explain the physical interaction between temperature, dew point depression, and pressure gradient.
2. **AI/ML Model Reasoning**: Why did the ${selectedModel} model arrive at this prediction? Highlight feature weights.
3. **Severe Weather Risk Detection**: Explicitly list any hazards (Flash flood, Heat exhaustion, Gale winds, Smog/Visibility) with severity levels (Low, Moderate, High, Severe).
4. **Actionable Community & Agronomy Advisory**: Practical advice for daily life, travel, and agriculture.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({
      analysis: response.text,
    });
  } catch (error: any) {
    console.error("Error in /api/gemini/deep-analysis:", error);
    return res.status(500).json({
      error: "Failed to run deep analysis",
      details: error.message,
    });
  }
});

// Start server with Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Weather Prediction AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
