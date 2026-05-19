export type Severity = "critical" | "high" | "medium" | "low";

export type IssueType =
  | "inline-function"
  | "inline-object"
  | "missing-key-extractor"
  | "missing-memo"
  | "hook-dependencies"
  | "heavy-computation"
  | "missing-get-item-layout"
  | "llm-insight"
  | "flatlist"
  | "flatlist-tuning"
  | "flatlist-key-index"
  | "sectionlist"
  | "sectionlist-key-extractor"
  | "bridge-native-call"
  | "json-stringify-cost"
  | "native-event-emitter"
  | "image-dimensions"
  | "usecallback-empty-deps-jsx"
  | "react-unsafe-html"
  | "react-find-dom-node"
  | "next-ssr-gssp"
  | "next-ssr-gsp"
  | "next-ssr-gspaths"
  | "bundle-lodash"
  | "bundle-mui-icons"
  | "seo-next-head-title"
  | "cwv-img-layout"
  | "cwv-blocking-script";

export interface Location {
  start: number;
  end: number;
}

export interface Impact {
  fps?: {
    current: number;
    optimized: number;
  };
  renderTime?: {
    current: string;
    optimized: string;
  };
  memory?: {
    current: string;
    optimized: string;
  };
}

export interface Fix {
  description: string;
  code: string;
  alternatives?: string[];
}

export interface Issue {
  id: string;
  severity: Severity;
  type: IssueType;
  title: string;
  location: Location;
  impact: Impact;
  explanation?: string;
  fix?: Fix;
  codeSnippet?: string;
}
