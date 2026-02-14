import type { Issue } from "./issue";

export interface Metrics {
  fps: {
    current: number;
    optimized: number;
  };
  renderTime: {
    current: string;
    optimized: string;
  };
  memory: {
    current: string;
    optimized: string;
  };
  reRenders: {
    current: number;
    optimized: number;
  };
}

export interface AnalysisResult {
  overallScore: number;
  optimizedScore: number;
  issues: Issue[];
  metrics: Metrics;
  optimizedCode: string;
  topBottleneck: string | null;
  analyzedAt: string;
}

export type Platform = "ios" | "android" | "both";

export type Screen = "input" | "diagnosis" | "comparison" | "summary";
