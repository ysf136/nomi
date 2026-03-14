import "dotenv/config";
import express from "express";
import cors from "cors";
import { Anthropic } from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  INCIDENT_SYSTEM_PROMPT,
  INCIDENT_USER_PROMPT,
  COMPLIANCE_SYSTEM_PROMPT,
  COMPLIANCE_USER_PROMPT,
  AVV_SYSTEM_PROMPT,
  AVV_USER_PROMPT,
} from "./prompts.js";

export const app = express();
const port = Number(process.env.AI_SERVER_PORT || 5174);

// ── Security Headers ────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.removeHeader("X-Powered-By");
  next();
});

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
if (!anthropicApiKey) {
  console.warn("ANTHROPIC_API_KEY missing. AI endpoints will fail.");
}

const anthropic = new Anthropic({ apiKey: anthropicApiKey });

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;
const rateBuckets = new Map();

function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || "unknown";
  const bucket = rateBuckets.get(key) || { count: 0, start: now };

  if (now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.count = 0;
    bucket.start = now;
  }

  bucket.count += 1;
  rateBuckets.set(key, bucket);

  if (bucket.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ message: "Rate limit exceeded" });
  }

  return next();
}

const incidentSchema = z.object({
  description: z.string().min(10),
  incidentType: z.string().min(2),
  affectedPeople: z.string().min(1),
  actionsTaken: z.string().optional(),
  date: z.string(),
  time: z.string(),
});

const complianceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  useCases: z.array(z.string()).optional(),
  exposure: z.string().optional(),
});

const avvSchema = z.object({
  documentText: z.string().min(50),
  fileName: z.string().min(1),
  fileSizeKB: z.number().int().positive().max(10_240).optional(),
});

async function callClaude(systemPrompt, userPrompt, modelOverride, hasExamples = false) {
  const response = await anthropic.messages.create({
    model: modelOverride || process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
    max_tokens: hasExamples ? 1200 : 800,
    temperature: 0.2,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  return text;
}

function parseModelJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Model response is not valid JSON");
  }
}

app.post("/api/incident-assistant", rateLimit, async (req, res) => {
  try {
    if (req.body.provider && req.body.provider !== "claude") {
      return res.status(400).json({ message: "Unsupported provider" });
    }
    const payload = incidentSchema.parse(req.body.incident);
    const examples = Array.isArray(req.body.examples) ? req.body.examples.slice(0, 3) : [];
    const userPrompt = INCIDENT_USER_PROMPT(payload, examples);
    const result = await callClaude(INCIDENT_SYSTEM_PROMPT, userPrompt, req.body.model, examples.length > 0);
    res.json(parseModelJson(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI processing failed" });
  }
});

app.post("/api/compliance-assistant", rateLimit, async (req, res) => {
  try {
    if (req.body.provider && req.body.provider !== "claude") {
      return res.status(400).json({ message: "Unsupported provider" });
    }
    const payload = complianceSchema.parse(req.body.system);
    const examples = Array.isArray(req.body.examples) ? req.body.examples.slice(0, 3) : [];
    const userPrompt = COMPLIANCE_USER_PROMPT(payload, examples);
    const result = await callClaude(COMPLIANCE_SYSTEM_PROMPT, userPrompt, req.body.model, examples.length > 0);
    res.json(parseModelJson(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI processing failed" });
  }
});

app.post("/api/avv-assistant", rateLimit, async (req, res) => {
  try {
    if (req.body.provider && req.body.provider !== "claude") {
      return res.status(400).json({ message: "Unsupported provider" });
    }
    const payload = avvSchema.parse(req.body.avv);
    const examples = Array.isArray(req.body.examples) ? req.body.examples.slice(0, 3) : [];
    const userPrompt = AVV_USER_PROMPT(payload, examples);
    const result = await callClaude(AVV_SYSTEM_PROMPT, userPrompt, req.body.model, examples.length > 0);
    res.json(parseModelJson(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI processing failed" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`AI server running on ${port}`);
  });
}
