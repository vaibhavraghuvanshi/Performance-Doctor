import type { Issue } from "../types/issue";
import type { AnalysisResult } from "../types/analysis";

// Mock Issues
export const mockIssues: Issue[] = [
  {
    id: "1",
    severity: "critical",
    type: "inline-function",
    title: "Inline Function in FlatList renderItem",
    location: { start: 45, end: 52 },
    impact: {
      fps: { current: 30, optimized: 60 },
      renderTime: { current: "180ms", optimized: "45ms" },
      memory: { current: "45MB", optimized: "38MB" },
    },
    explanation:
      "Creating a new arrow function on every render causes FlatList to think each item has changed, triggering unnecessary re-renders of all visible items. In a 100-item list, this means 100+ component re-renders on every parent state change.",
    fix: {
      description:
        "Extract the function outside of render using useCallback with an empty dependency array. This ensures the same function reference is used across renders.",
      code: `const renderItem = useCallback(
  ({ item }) => <ProductCard product={item} />,
  []
);

<FlatList
  data={products}
  renderItem={renderItem}
/>`,
      alternatives: [
        "Move renderItem to a separate component",
        "Use React.memo on the child component",
        "Extract as a module-level function if no dependencies",
      ],
    },
    codeSnippet: `<FlatList
  data={products}
  renderItem={({ item }) => (
    <ProductCard product={item} />
  )}
/>`,
  },
  {
    id: "2",
    severity: "critical",
    type: "missing-key-extractor",
    title: "Missing keyExtractor with Stable Keys",
    location: { start: 45, end: 52 },
    impact: {
      fps: { current: 40, optimized: 60 },
      renderTime: { current: "150ms", optimized: "50ms" },
    },
    explanation:
      "Without a stable keyExtractor, FlatList uses array indices as keys. When items are added/removed, indices change and React can't properly track components, causing full re-renders instead of smart updates.",
    fix: {
      description:
        "Add a keyExtractor that returns a unique, stable identifier for each item.",
      code: `const keyExtractor = useCallback(
  (item) => item.id.toString(),
  []
);

<FlatList
  data={products}
  keyExtractor={keyExtractor}
/>`,
      alternatives: [
        "Use item.id directly if items have unique IDs",
        "Combine multiple fields for uniqueness",
      ],
    },
    codeSnippet: `<FlatList
  data={products}
  // Missing keyExtractor!
/>`,
  },
  {
    id: "3",
    severity: "high",
    type: "hook-dependencies",
    title: "Heavy Computation in useEffect without Dependencies",
    location: { start: 28, end: 35 },
    impact: {
      fps: { current: 45, optimized: 60 },
      renderTime: { current: "120ms", optimized: "60ms" },
    },
    explanation:
      "Running expensive sorting operations on every render blocks the JavaScript thread, making the UI feel sluggish. This should be memoized or moved to a useMemo hook.",
    fix: {
      description:
        "Wrap the expensive computation in useMemo with proper dependencies.",
      code: `const sortedProducts = useMemo(() => {
  return products.sort((a, b) => 
    b.price - a.price
  );
}, [products]);`,
      alternatives: [
        "Move computation to backend/API",
        "Use a web worker for heavy processing",
      ],
    },
    codeSnippet: `function ProductList() {
  const sortedProducts = products.sort(
    (a, b) => b.price - a.price
  );
  // Runs on every render!
}`,
  },
  {
    id: "4",
    severity: "high",
    type: "missing-memo",
    title: "Missing React.memo on Pure Component",
    location: { start: 12, end: 25 },
    impact: {
      fps: { current: 48, optimized: 60 },
      renderTime: { current: "100ms", optimized: "55ms" },
    },
    explanation:
      "Component re-renders even when props haven't changed because it's not wrapped in React.memo.",
    fix: {
      description:
        "Wrap the component with React.memo to prevent unnecessary re-renders.",
      code: `export const ProductCard = React.memo(({ product }) => {
  return <View>...</View>;
});`,
    },
  },
  {
    id: "5",
    severity: "medium",
    type: "inline-object",
    title: "Inline Style Object in Render",
    location: { start: 67, end: 70 },
    impact: {
      fps: { current: 52, optimized: 60 },
      renderTime: { current: "85ms", optimized: "65ms" },
    },
    explanation:
      "Creating new style objects on every render causes unnecessary style recalculations.",
    fix: {
      description: "Move style objects outside the component or use useMemo.",
      code: `const containerStyle = { flex: 1, padding: 16 };

<View style={containerStyle}>`,
    },
  },
  {
    id: "6",
    severity: "medium",
    type: "missing-get-item-layout",
    title: "Missing getItemLayout for Fixed-Height Items",
    location: { start: 45, end: 52 },
    impact: {
      fps: { current: 55, optimized: 60 },
    },
    explanation:
      "FlatList has to measure each item individually. For fixed-height items, providing getItemLayout significantly improves scroll performance.",
    fix: {
      description: "Add getItemLayout if your list items have a fixed height.",
      code: `const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

<FlatList
  getItemLayout={getItemLayout}
/>`,
    },
  },
];

// Mock Analysis Result
export const mockAnalysisResult: AnalysisResult = {
  overallScore: 42,
  optimizedScore: 89,
  issues: mockIssues,
  metrics: {
    fps: {
      current: 30,
      optimized: 60,
    },
    renderTime: {
      current: "180ms",
      optimized: "45ms",
    },
    memory: {
      current: "45MB",
      optimized: "32MB",
    },
    reRenders: {
      current: 120,
      optimized: 12,
    },
  },
  optimizedCode: `import React, { useCallback, useMemo } from 'react';
import { FlatList, View, Text } from 'react-native';

const ProductScreen = ({ products }) => {
  // ✅ Fixed: Extract renderItem with useCallback
  const renderItem = useCallback(
    ({ item }) => <ProductCard product={item} />,
    []
  );

  // ✅ Fixed: Add stable keyExtractor
  const keyExtractor = useCallback(
    (item) => item.id.toString(),
    []
  );

  // ✅ Fixed: Memoize expensive computation
  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => b.price - a.price);
  }, [products]);

  // ✅ Fixed: Add getItemLayout for fixed heights
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={sortedProducts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};

// ✅ Fixed: Wrap component with React.memo
export default React.memo(ProductScreen);`,
  topBottleneck: "Unnecessary Re-renders",
  analyzedAt: new Date().toISOString(),
};

// Example buggy code
export const exampleBuggyCode = `import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';

const ProductScreen = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts(userId).then(setProducts);
  }, []); // ⚠️ Missing userId dependency!

  // ⚠️ Expensive computation in render
  const sortedProducts = products.sort((a, b) => b.price - a.price);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={sortedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={{ padding: 16, marginBottom: 8 }}
          >
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProductScreen;`;
