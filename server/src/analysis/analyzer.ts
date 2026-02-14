// import {
//   detectFlatList,
//   detectHeavyComputation,
//   detectInlineFunctions,
//   detectInlineObjects,
//   detectMissingKeyExtractor,
//   detectMissingMemo,
// } from "./rules";
// import { parse } from "@babel/parser";
// import traverse from "@babel/traverse";
// import type { AnalysisResult } from "../types/analysis";
// import { callGroq } from "../utils/groqClient";
// import {
//   estimateFPS,
//   estimateRenderTime,
//   estimateMemory,
//   estimateReRenders,
//   calculatePerformanceScore,
// } from "./metrics";

// export function analyzeCode(code: string): AnalysisResult {
//   const ast = parse(code, {
//     sourceType: "module",
//     plugins: ["typescript", "jsx"],
//   });
//   const issues: any[] = [];
//   traverse(ast, {
//     enter(path: any) {
//       detectFlatList(path, issues);
//       detectHeavyComputation(path, issues);
//       detectInlineFunctions(path, issues);
//       detectInlineObjects(path, issues);
//       detectMissingKeyExtractor(path, issues);
//       detectMissingMemo(path, issues);
//     },
//   });
//   // Metrics & scoring
//   const fps = estimateFPS(issues);
//   const renderTime = estimateRenderTime(issues);
//   const memory = estimateMemory(issues);
//   const reRenders = estimateReRenders(issues);
//   const score = calculatePerformanceScore(issues);
//   let topSeverity = -1;
//   let topBottleneck = null;
//   const severityMap: Record<string, number> = {
//     critical: 3,
//     high: 2,
//     medium: 1,
//     low: 0,
//   };
//   for (const issue of issues) {
//     if (severityMap[issue.severity] > topSeverity) {
//       topSeverity = severityMap[issue.severity];
//       topBottleneck = issue.title;
//     }
//   }
//   return {
//     overallScore: score,
//     optimizedScore: 100,
//     issues,
//     metrics: {
//       fps,
//       renderTime,
//       memory,
//       reRenders,
//     },
//     optimizedCode: "",
//     topBottleneck,
//     analyzedAt: new Date().toISOString(),
//   };
// }

// // Async Groq-powered analyzer
// export async function analyzeCodeWithGroq(
//   code: string,
// ): Promise<AnalysisResult> {
//   const prompt = `
// Analyze the following React Native code for performance issues.
// Return a JSON array of issues, each with title, severity, explanation, and suggested fix.
// After the JSON, output ONLY the optimized version of the code in a Markdown code block (start with \`\`\`jsx and end with \`\`\`).
// DO NOT include any explanation or text outside the JSON and code block.

// Code to analyze:
// ${code}
// `;
//   let issues: any[] = [];
//   let optimizedCode = "";
//   let topBottleneck = null;
//   try {
//     console.log("[Groq] About to call Groq LLM...");
//     const responseText = await callGroq(prompt);
//     console.log("[Groq] LLM response received:", responseText);
//     // Extract issues JSON (robust to trailing characters)
//     const match = responseText.match(/\[.*?\]/s);
//     if (match) {
//       let jsonStr = match[0];
//       try {
//         issues = JSON.parse(jsonStr);
//       } catch (jsonErr) {
//         // Try to trim after last closing bracket
//         const lastBracket = jsonStr.lastIndexOf("]");
//         if (lastBracket !== -1) {
//           jsonStr = jsonStr.slice(0, lastBracket + 1);
//           issues = JSON.parse(jsonStr);
//         } else {
//           throw jsonErr;
//         }
//       }
//     } else {
//       console.warn("[Groq] No issues JSON found in response.");
//     }
//     if (issues.length > 0) {
//       topBottleneck = issues[0].title;
//     }
//     // Extract only the code block after the JSON array
//     let codeBlockMatch = responseText.match(
//       /\[.*?\][\s\S]*?```(?:jsx|tsx|js)?\s*([\s\S]*?)```/i,
//     );
//     if (!codeBlockMatch) {
//       // Fallback: try to find any code block
//       codeBlockMatch = responseText.match(
//         /```(?:jsx|tsx|js)?\s*([\s\S]*?)```/i,
//       );
//     }
//     if (codeBlockMatch) {
//       optimizedCode = codeBlockMatch[1].trim();
//       // Optionally, further trim to start at first import/export/function/const/let/var
//       const codeStart = optimizedCode.search(
//         /^(import |export |function |const |let |var )/m,
//       );
//       if (codeStart > 0) {
//         optimizedCode = optimizedCode.slice(codeStart);
//       }
//       // Remove trailing markdown or text after the last closing brace/paren
//       const lastBrace = Math.max(
//         optimizedCode.lastIndexOf("}"),
//         optimizedCode.lastIndexOf(">"),
//       );
//       if (lastBrace !== -1 && lastBrace + 1 < optimizedCode.length) {
//         optimizedCode = optimizedCode.slice(0, lastBrace + 1);
//       }
//       optimizedCode = optimizedCode.trim();
//       console.log(
//         "[Groq] Extracted and formatted optimized code:",
//         optimizedCode,
//       );
//     } else {
//       console.warn("[Groq] No code block found in LLM response.");
//     }
//   } catch (err) {
//     console.error("[Groq] API error in analyzer:", err);
//     issues = [
//       {
//         title: "Groq API Error",
//         severity: "critical",
//         explanation: "Failed to analyze code.",
//         suggestedFix: "Check API key and network.",
//       },
//     ];
//     topBottleneck = "Groq API Error";
//   }
//   const fps = estimateFPS(issues);
//   const renderTime = estimateRenderTime(issues);
//   const memory = estimateMemory(issues);
//   const reRenders = estimateReRenders(issues);
//   const score = calculatePerformanceScore(issues);
//   return {
//     overallScore: score,
//     optimizedScore: 100,
//     issues,
//     metrics: {
//       fps,
//       renderTime,
//       memory,
//       reRenders,
//     },
//     optimizedCode,
//     topBottleneck,
//     analyzedAt: new Date().toISOString(),
//   };
// }

import {
  detectFlatList,
  detectHeavyComputation,
  detectInlineFunctions,
  detectInlineObjects,
  detectMissingKeyExtractor,
  detectMissingMemo,
} from "./rules";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import type { AnalysisResult } from "../types/analysis";
import { callGroq } from "../utils/groqClient";
import {
  estimateFPS,
  estimateRenderTime,
  estimateMemory,
  estimateReRenders,
  calculatePerformanceScore,
} from "./metrics";

export function analyzeCode(code: string): AnalysisResult {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
  const issues: any[] = [];
  traverse(ast, {
    enter(path: any) {
      detectFlatList(path, issues);
      detectHeavyComputation(path, issues);
      detectInlineFunctions(path, issues);
      detectInlineObjects(path, issues);
      detectMissingKeyExtractor(path, issues);
      detectMissingMemo(path, issues);
    },
  });
  // Metrics & scoring
  const fps = estimateFPS(issues);
  const renderTime = estimateRenderTime(issues);
  const memory = estimateMemory(issues);
  const reRenders = estimateReRenders(issues);
  const score = calculatePerformanceScore(issues);
  let topSeverity = -1;
  let topBottleneck = null;
  const severityMap: Record<string, number> = {
    critical: 3,
    high: 2,
    medium: 1,
    low: 0,
  };
  for (const issue of issues) {
    if (severityMap[issue.severity] > topSeverity) {
      topSeverity = severityMap[issue.severity];
      topBottleneck = issue.title;
    }
  }
  return {
    overallScore: score,
    optimizedScore: 100,
    issues,
    metrics: {
      fps,
      renderTime,
      memory,
      reRenders,
    },
    optimizedCode: "",
    topBottleneck,
    analyzedAt: new Date().toISOString(),
  };
}

/**
 * Extracts JSON array from LLM response text
 */
function extractIssuesJSON(responseText: string): any[] {
  try {
    // Try to find JSON array in the response
    const match = responseText.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    if (!match) {
      console.warn("[Groq] No issues JSON array found in response.");
      return [];
    }

    let jsonStr = match[0];

    // Try parsing directly
    try {
      return JSON.parse(jsonStr);
    } catch (jsonErr) {
      // Try to fix common JSON issues
      // Remove trailing commas
      jsonStr = jsonStr.replace(/,(\s*[}\]])/g, "$1");

      // Try parsing again
      try {
        return JSON.parse(jsonStr);
      } catch (err2) {
        // Last resort: find the last valid closing bracket
        const lastBracket = jsonStr.lastIndexOf("]");
        if (lastBracket !== -1) {
          jsonStr = jsonStr.slice(0, lastBracket + 1);
          return JSON.parse(jsonStr);
        }
        throw err2;
      }
    }
  } catch (err) {
    console.error("[Groq] Failed to parse issues JSON:", err);
    return [];
  }
}

/**
 * Extracts code block from LLM response, removing JSON and markdown artifacts
 */
function extractOptimizedCode(responseText: string): string {
  try {
    console.log("[Groq] Starting code extraction...");

    // Strategy 1: Find code block that comes AFTER the JSON array
    // Split by the JSON array first to get everything after it
    const jsonMatch = responseText.match(/\[\s*\{[\s\S]*?\}\s*\]/);
    let textAfterJSON = responseText;

    if (jsonMatch) {
      const jsonEndIndex = jsonMatch.index! + jsonMatch[0].length;
      textAfterJSON = responseText.slice(jsonEndIndex);
      console.log("[Groq] Extracted text after JSON array");
    }

    // Strategy 2: Find code block with various markdown formats
    const codeBlockPatterns = [
      /```(?:jsx|tsx|javascript|typescript|js|ts|react)\s*\n([\s\S]*?)```/i,
      /```\s*\n([\s\S]*?)```/,
      /```([\s\S]*?)```/,
    ];

    let extractedCode = "";

    for (const pattern of codeBlockPatterns) {
      const match = textAfterJSON.match(pattern);
      if (match && match[1]) {
        extractedCode = match[1].trim();
        console.log("[Groq] Found code block with pattern:", pattern);
        break;
      }
    }

    // Strategy 3: If no code block found, try to extract everything after JSON
    // that looks like code (starts with import/export/function/const/etc)
    if (!extractedCode && textAfterJSON.trim()) {
      const codeStart = textAfterJSON.search(
        /^\s*(import |export |function |const |let |var |class |interface |type )/m,
      );

      if (codeStart !== -1) {
        extractedCode = textAfterJSON.slice(codeStart).trim();
        console.log("[Groq] Extracted code without markdown block");
      }
    }

    if (!extractedCode) {
      console.warn("[Groq] No code block found in LLM response.");
      return "";
    }

    // Clean up the extracted code
    extractedCode = cleanExtractedCode(extractedCode);

    console.log("[Groq] Successfully extracted optimized code");
    return extractedCode;
  } catch (err) {
    console.error("[Groq] Error extracting optimized code:", err);
    return "";
  }
}

/**
 * Cleans up extracted code by removing artifacts and normalizing formatting
 */
function cleanExtractedCode(code: string): string {
  // Remove any remaining markdown code fence markers
  code = code.replace(
    /^```(?:jsx|tsx|javascript|typescript|js|ts|react)?\s*\n?/i,
    "",
  );
  code = code.replace(/```\s*$/, "");

  // Remove any JSON-like content that might have leaked in
  // (remove lines that look like JSON objects/arrays at the start)
  const lines = code.split("\n");
  let startIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    // Skip lines that are pure JSON artifacts
    if (
      trimmed.match(/^[\[\{]/) ||
      trimmed.match(/^"(title|severity|explanation|suggestedFix)":/)
    ) {
      startIndex = i + 1;
    } else if (
      trimmed.match(
        /^(import |export |function |const |let |var |class |interface |type |\/\/|\/\*)/,
      )
    ) {
      // Found start of actual code
      break;
    }
  }

  if (startIndex > 0) {
    code = lines.slice(startIndex).join("\n");
  }

  // Trim the code to end at the last meaningful code character
  // (remove any trailing markdown or explanatory text)
  const lastMeaningfulIndex = Math.max(
    code.lastIndexOf("}"),
    code.lastIndexOf(">"),
    code.lastIndexOf(";"),
  );

  if (lastMeaningfulIndex !== -1) {
    // Check if there's substantial content after this point
    const afterLast = code.slice(lastMeaningfulIndex + 1).trim();
    // If what's after is just whitespace or looks like markdown/explanation, cut it
    if (
      !afterLast ||
      afterLast.match(/^(```|Here|This|The|Note:|Explanation:)/i)
    ) {
      code = code.slice(0, lastMeaningfulIndex + 1);
    }
  }

  return code.trim();
}

// Async Groq-powered analyzer
export async function analyzeCodeWithGroq(
  code: string,
): Promise<AnalysisResult> {
  const prompt = `
Analyze the following React Native code for performance issues.

YOU MUST respond in this EXACT format:
1. First, output a JSON array of issues with this structure:
[
  {
    "title": "Issue name",
    "severity": "critical|high|medium|low",
    "explanation": "Why this is an issue",
    "suggestedFix": "How to fix it"
  }
]

2. Then, IMMEDIATELY after the JSON array, output the optimized code in a markdown code block like this:
\`\`\`jsx
// Your optimized code here
\`\`\`

DO NOT include any explanatory text between the JSON and the code block.
DO NOT include any text after the code block.

Code to analyze:
${code}
`;

  let issues: any[] = [];
  let optimizedCode = "";
  let topBottleneck = null;

  try {
    console.log("[Groq] About to call Groq LLM...");
    const responseText = await callGroq(prompt);
    console.log(
      "[Groq] LLM response received (first 500 chars):",
      responseText.slice(0, 500),
    );

    // Extract issues JSON
    issues = extractIssuesJSON(responseText);

    if (issues.length > 0) {
      topBottleneck = issues[0].title;
      console.log(
        `[Groq] Found ${issues.length} issues, top bottleneck: ${topBottleneck}`,
      );
    } else {
      console.warn("[Groq] No issues found in response");
    }

    // Extract optimized code
    optimizedCode = extractOptimizedCode(responseText);

    if (!optimizedCode) {
      console.warn("[Groq] Failed to extract optimized code, using original");
      optimizedCode = code; // Fallback to original code
    }
  } catch (err) {
    console.error("[Groq] API error in analyzer:", err);
    issues = [
      {
        title: "Groq API Error",
        severity: "critical",
        explanation: "Failed to analyze code with AI.",
        suggestedFix: "Check API key, network connection, and try again.",
      },
    ];
    topBottleneck = "Groq API Error";
    optimizedCode = code; // Return original code on error
  }

  const fps = estimateFPS(issues);
  const renderTime = estimateRenderTime(issues);
  const memory = estimateMemory(issues);
  const reRenders = estimateReRenders(issues);
  const score = calculatePerformanceScore(issues);

  return {
    overallScore: score,
    optimizedScore: 100,
    issues,
    metrics: {
      fps,
      renderTime,
      memory,
      reRenders,
    },
    optimizedCode,
    topBottleneck,
    analyzedAt: new Date().toISOString(),
  };
}
