import OpenAI from "openai";
import { config } from "./environment";

export const openai = new OpenAI({
  apiKey: config.openaiApiKey || "dummy_key_for_development",
});