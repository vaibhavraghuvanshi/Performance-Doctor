const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface AnalysisResult {
  overallScore: number;
  optimizedScore: number;
  issues: any[];
  metrics: any;
  optimizedCode: string;
  topBottleneck: string | null;
  analyzedAt?: string;
}

export async function analyzeCode(
  code: string,
  platform: string,
): Promise<AnalysisResult> {
  // Use Groq-powered analysis by adding ?ai=1
  const response = await fetch(`${API_URL}/analyze?ai=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, platform }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Analysis failed");
  }

  return response.json();
}
