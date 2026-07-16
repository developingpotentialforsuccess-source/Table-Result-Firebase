import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, systemInstruction, model = "gemini-3-flash-preview" } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const text = response.text;
      
      res.json({ text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error.message || "Failed to generate content" });
    }
  });

  app.post("/api/ai/parse-level", async (req, res) => {
    try {
      const { text } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Parse this grading structure text:
"${text}"

Return a JSON object representing a 'Level'.
Structure:
{
  "name": "Level Name",
  "subjects": [
    {
      "name": "Subject Name",
      "categories": [
        {
          "name": "Category Name",
          "weight": number (0-100),
          "itemCount": number,
          "isMidterm": boolean (true if it is a Midterm Exam),
          "isFinal": boolean (true if it is a Final Exam),
          "midtermWeight": number (optional, weight when in midterm mode),
          "finalWeight": number (optional, weight when in final test mode)
        }
      ]
    }
  ]
}

Context:
- Look for terms like 'Mini test', 'Midterm', 'Final', 'Termly Result'.
- If the text lists subjects like 'Speaking', 'Vocabulary' under a test, create those as Subjects or Categories depending on how the user grouped them.
- If it's for 'Level 6' or 'Level 7', use that as the name.
- Be precise with percentages.
- For itemCount, if not specified, default to 1.`,
        config: {
          responseMimeType: "application/json",
        }
      });

      res.json(JSON.parse(response.text));
    } catch (error: any) {
      console.error("Parse level error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
