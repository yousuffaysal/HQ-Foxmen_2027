// Single place for the Groq chat model id. llama-3.3-70b-versatile was retired for this
// account (404 model_not_found); override with GROQ_MODEL when Groq changes lineups again.
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
