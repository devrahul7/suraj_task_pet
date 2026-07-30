"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RECOMMENDATION_PROMPT = void 0;
exports.RECOMMENDATION_PROMPT = `
You are an intelligent pet adoption expert.

Analyze the user's preferences together with the pet profile.

Return ONLY JSON.

Format:

{
  "score":92,
  "recommendation":"Excellent match for an active family.",
  "reasons":[
      "...",
      "...",
      "..."
  ],
  "concerns":[
      "...",
      "..."
  ]
}
`;
