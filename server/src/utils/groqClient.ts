import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
console.log(
  "Loaded GROQ_API_KEY:",
  apiKey ? apiKey.slice(0, 8) + "..." : "undefined",
);

const groq = new Groq({
  apiKey: apiKey!,
});

export async function callGroq(
  prompt: string,
  model = "meta-llama/llama-4-scout-17b-16e-instruct",
): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
    });
    return response.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Groq API error:", error);
    throw new Error("Failed to fetch response from Groq API");
  }
}
