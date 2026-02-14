import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

export function detectMissingMemo(path: NodePath, issues: any[]) {
  if (!path.isFunctionDeclaration()) return;
  if (!path.node.id) return;
  if (!path.parentPath.isProgram()) return;

  const componentName = path.node.id.name; // ✅ now fully safe

  let returnsJSX = false;

  path.traverse({
    ReturnStatement(returnPath) {
      const arg = returnPath.node.argument;
      if (arg && (t.isJSXElement(arg) || t.isJSXFragment(arg))) {
        returnsJSX = true;
      }
    },
  });

  if (!returnsJSX) return;

  const program = path.parentPath;
  let isMemoized = false;

  program.traverse({
    ExportDefaultDeclaration(exportPath) {
      const decl = exportPath.node.declaration;

      if (
        t.isCallExpression(decl) &&
        t.isMemberExpression(decl.callee) &&
        t.isIdentifier(decl.callee.object, { name: "React" }) &&
        t.isIdentifier(decl.callee.property, { name: "memo" }) &&
        decl.arguments.length > 0 &&
        t.isIdentifier(decl.arguments[0], { name: componentName })
      ) {
        isMemoized = true;
      }
    },
  });

  if (!isMemoized) {
    issues.push({
      id: `missing-memo-${componentName}`,
      severity: "medium",
      type: "missing-memo",
      title: `Component '${componentName}' is not wrapped in React.memo`,
      location: {
        start: path.node.start,
        end: path.node.end,
      },
      impact: {},
      explanation: `Function component '${componentName}' returns JSX but is not wrapped in React.memo. This may cause unnecessary re-renders if used in lists or as children.`,
    });
  }
}
