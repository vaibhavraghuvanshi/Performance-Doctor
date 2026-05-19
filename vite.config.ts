import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  /** Must match the Express server URL (see server PORT / server/.env). */
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET?.trim() || "http://127.0.0.1:4000";

  console.info(`[vite] /api → ${apiProxyTarget} (set VITE_API_PROXY_TARGET if the API uses another port)`);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("error", (err, _req, res) => {
              console.error(
                `[vite] /api proxy error (is the backend running at ${apiProxyTarget}?):`,
                err,
              );
              if (res && "writeHead" in res && typeof res.writeHead === "function") {
                try {
                  res.writeHead(502, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      error:
                        "Dev proxy could not reach the API server. Start the server and/or set VITE_API_PROXY_TARGET to its URL.",
                    }),
                  );
                } catch {
                  /* response may already be committed */
                }
              }
            });
          },
        },
      },
    },
  };
});
