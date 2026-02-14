// src/utils/groq.ts

export const GROQ_API_KEY =
  import.meta.env.GROQ_API_KEY;
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Calls the Groq API with the given prompt and returns the LLM's response.
 * @param prompt The prompt to send to Groq.
 * @returns The LLM's message content as a string.
 */
export async function callGroq(prompt: string): Promise<string> {
  try {
    const requestBody = {
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a React Native performance expert. Analyze code and suggest fixes.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2048,
      temperature: 0.2,
    };
    console.log("[Groq] Sending request:", requestBody);
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[Groq] Response status:", response.status);
    if (!response.ok) {
      let errorMsg = await response.text();
      console.error("[Groq] API error:", errorMsg);
      throw new Error(`Groq API error: ${errorMsg}`);
    }

    const data = await response.json();
    console.log("[Groq] Response data:", data);
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Groq API returned an unexpected response format.");
    }
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("[Groq] API call failed:", error);
    throw new Error(error?.message || "Unknown error calling Groq API");
  }
}
