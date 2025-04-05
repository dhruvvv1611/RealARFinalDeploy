import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const getGeminiResponse = async (prompt) => {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat:free",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;

    // ✅ Console log the reply
    console.log("DeepSeek says:", reply);

    return reply;

  } catch (error) {
    console.error("DeepSeek API Error:", error);
    return "Error getting response";
  }
};
