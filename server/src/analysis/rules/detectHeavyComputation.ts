import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

/**
 * Detects heavy computation (loops, Array.map/filter/reduce) inside function components or render methods
 */
export function detectHeavyComputation(path: NodePath, issues: any[]) {
  // Detect for/while loops or Array.map/filter/reduce in function components
  if (
    path.isForStatement() ||
    path.isWhileStatement() ||
    path.isDoWhileStatement()
  ) {
    issues.push({
      id: `heavy-computation-${path.node.start}`,
      severity: "medium",
      type: "heavy-computation",
      title: `Heavy computation (loop) detected in render`,
      location: { start: path.node.start, end: path.node.end },
      impact: {},
      explanation: `Loops inside render or function components can cause performance issues. Move heavy computation outside render or memoize results.`,
    });
  }
  // Detect Array.map/filter/reduce in render
  if (path.isCallExpression()) {
    const callee = path.node.callee;
    if (
      t.isMemberExpression(callee) &&
      t.isIdentifier(callee.property) &&
      ["map", "filter", "reduce"].includes(callee.property.name)
    ) {
      issues.push({
        id: `heavy-computation-${path.node.start}`,
        severity: "medium",
        type: "heavy-computation",
        title: `Heavy computation (${callee.property.name}) detected in render`,
        location: { start: path.node.start, end: path.node.end },
        impact: {},
        explanation: `Array.${callee.property.name} inside render or function components can cause performance issues. Move heavy computation outside render or memoize results.`,
      });
    }
  }
}
