import express from "express";
import cors from "cors";
import helmet from "helmet";
import { json } from "express";

import { errorHandler } from "./middleware/errorHandler";
import { analyzeCode, analyzeCodeWithGroq } from "./analysis/analyzer";

const app = express();

app.use(cors());
app.use(helmet());
app.use(json());

app.post("/analyze", (req, res, next) => {
  (async () => {
    try {
      const { code } = req.body;
      if (typeof code !== "string") {
        return res
          .status(400)
          .json({ error: "Missing or invalid 'code' in request body" });
      }
      // If ?ai=1 is present, use Groq-powered analysis
      if (req.query.ai === "1") {
        const result = await analyzeCodeWithGroq(code);
        res.json(result);
      } else {
        const result = analyzeCode(code);
        res.json(result);
      }
    } catch (err) {
      next(err);
    }
  })();
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
