import type { AnalysisResult } from "../types/analysis";

function triggerDownload(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  a.click();
  URL.revokeObjectURL(url);
}

function issuesMarkdownList(result: AnalysisResult): string {
  if (result.issues.length === 0) {
    return "_No issues recorded._\n";
  }
  return result.issues
    .map((issue, i) => {
      const lines = [
        `#### ${i + 1}. ${issue.title}`,
        "",
        `- **Severity:** ${issue.severity}`,
        `- **Type:** \`${issue.type}\``,
      ];
      if (issue.explanation) {
        lines.push("", issue.explanation);
      }
      if (issue.fix?.description) {
        lines.push("", `**Suggested fix:** ${issue.fix.description}`);
      }
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}

function issuesTextList(result: AnalysisResult): string {
  if (result.issues.length === 0) {
    return "No issues recorded.\n";
  }
  return result.issues
    .map((issue, i) => {
      const parts = [
        `${i + 1}. [${issue.severity.toUpperCase()}] ${issue.title} (${issue.type})`,
        issue.explanation ? `   ${issue.explanation.replace(/\n/g, "\n   ")}` : "",
        issue.fix?.code
          ? `   Suggested code: ${issue.fix.code.slice(0, 200)}${issue.fix.code.length > 200 ? "…" : ""}`
          : "",
      ].filter(Boolean);
      return parts.join("\n");
    })
    .join("\n\n");
}

export function buildTextReport(result: AnalysisResult): string {
  const low = result.issues.filter((i) => i.severity === "low").length;
  return `
React Native Performance Doctor — Analysis Report
Generated: ${new Date().toLocaleString()}
Analyzed at (server): ${result.analyzedAt}

Scores
------
Overall score:     ${result.overallScore}/100
Optimized score:   ${result.optimizedScore}/100
Top bottleneck:    ${result.topBottleneck ?? "—"}

Metrics (current → optimized)
-----------------------------
FPS:          ${result.metrics.fps.current} → ${result.metrics.fps.optimized}
Render time:  ${result.metrics.renderTime.current} → ${result.metrics.renderTime.optimized}
Memory:       ${result.metrics.memory.current} → ${result.metrics.memory.optimized}
Re-renders:   ${result.metrics.reRenders.current} → ${result.metrics.reRenders.optimized}
${result.metrics.seoReadiness ? `SEO / CWV readiness: ${result.metrics.seoReadiness.current} → ${result.metrics.seoReadiness.optimized}` : ""}

Issue counts by severity
------------------------
Critical: ${result.issues.filter((i) => i.severity === "critical").length}
High:     ${result.issues.filter((i) => i.severity === "high").length}
Medium:   ${result.issues.filter((i) => i.severity === "medium").length}
Low:      ${low}

All issues
----------
${issuesTextList(result)}

Optimized code (excerpt)
------------------------
${(result.optimizedCode || "").slice(0, 8000)}${(result.optimizedCode || "").length > 8000 ? "\n… [truncated in text export; use JSON export for full code]" : ""}
`.trim();
}

export function buildMarkdownReport(result: AnalysisResult): string {
  const crit = result.issues.filter((i) => i.severity === "critical").length;
  const high = result.issues.filter((i) => i.severity === "high").length;
  const med = result.issues.filter((i) => i.severity === "medium").length;
  const low = result.issues.filter((i) => i.severity === "low").length;

  return `# Performance Doctor — Analysis Report

**Generated:** ${new Date().toLocaleString()}  
**Analyzed at:** \`${result.analyzedAt}\`

## Scores

| Metric | Value |
|--------|------:|
| Overall score | ${result.overallScore}/100 |
| Optimized score | ${result.optimizedScore}/100 |
| Top bottleneck | ${result.topBottleneck ?? "—"} |

## Metrics (current → optimized)

| | Current | Optimized |
|--|---------|-----------|
| FPS | ${result.metrics.fps.current} | ${result.metrics.fps.optimized} |
| Render time | ${result.metrics.renderTime.current} | ${result.metrics.renderTime.optimized} |
| Memory | ${result.metrics.memory.current} | ${result.metrics.memory.optimized} |
| Re-renders | ${result.metrics.reRenders.current} | ${result.metrics.reRenders.optimized} |
${result.metrics.seoReadiness ? `| SEO / CWV readiness | ${result.metrics.seoReadiness.current} | ${result.metrics.seoReadiness.optimized} |` : ""}

## Issue counts

Critical: **${crit}** · High: **${high}** · Medium: **${med}** · Low: **${low}**

## Issues

${issuesMarkdownList(result)}

## Optimized code

\`\`\`tsx
${result.optimizedCode || "// No optimized code returned"}
\`\`\`
`.trim();
}

export type ReportExportFormat = "txt" | "md" | "json";

export function downloadAnalysisReport(
  result: AnalysisResult,
  format: ReportExportFormat,
): void {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  if (format === "json") {
    triggerDownload(
      JSON.stringify(result, null, 2),
      `performance-report-${stamp}.json`,
      "application/json;charset=utf-8",
    );
    return;
  }
  if (format === "md") {
    triggerDownload(
      buildMarkdownReport(result),
      `performance-report-${stamp}.md`,
      "text/markdown;charset=utf-8",
    );
    return;
  }
  triggerDownload(
    buildTextReport(result),
    `performance-report-${stamp}.txt`,
    "text/plain;charset=utf-8",
  );
}
