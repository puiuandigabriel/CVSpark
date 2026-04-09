import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";

    switch (action) {
      case "improve-summary":
        prompt = `You are a professional CV/resume writer. Improve this professional summary to be more impactful, concise, and keyword-rich. Keep it to 2-3 sentences maximum.

Current summary: "${data.summary}"
Job title: "${data.jobTitle || "Professional"}"

Return ONLY the improved summary text, no quotes, no explanations.`;
        break;

      case "add-keywords":
        prompt = `You are a CV optimization expert. Based on this CV data, suggest 8-10 relevant industry keywords that should be added to strengthen the CV.

Job title: "${data.jobTitle || "Professional"}"
Current skills: ${data.skills?.join(", ") || "none listed"}
Summary: "${data.summary || ""}"

Return ONLY a comma-separated list of keywords, nothing else.`;
        break;

      case "fix-grammar":
        prompt = `You are a professional editor. Fix all grammar, spelling, punctuation, and tense consistency issues in this CV text. Make sure all bullet points start with strong action verbs in past tense (unless current role).

Text to fix:
"""
Summary: ${data.summary || ""}
${data.experiences
  ?.map(
    (e: { title: string; company: string; bullets: string[] }) =>
      `${e.title} at ${e.company}: ${e.bullets?.join("; ") || ""}`
  )
  .join("\n")}
"""

Return ONLY a JSON object with this structure (no markdown code blocks):
{"summary": "corrected summary", "experiences": [{"bullets": ["corrected bullet 1", "corrected bullet 2"]}]}`;
        break;

      case "make-concise":
        prompt = `You are a CV optimization expert. Make this CV content more concise and punchy. Remove redundant phrases, tighten each bullet point, and ensure maximum impact with minimum words.

Summary: "${data.summary || ""}"
Experience bullets: ${JSON.stringify(data.experiences?.map((e: { bullets: string[] }) => e.bullets) || [])}

Return ONLY a JSON object with this structure (no markdown code blocks):
{"summary": "concise summary", "experiences": [{"bullets": ["concise bullet 1", "concise bullet 2"]}]}`;
        break;

      case "improve-bullets":
        prompt = `You are a professional CV writer. Improve these job experience bullet points to be more impactful. Use strong action verbs, quantify achievements where possible, and highlight results.

Job title: "${data.title || ""}"
Company: "${data.company || ""}"
Current bullets:
${data.bullets?.map((b: string, i: number) => `${i + 1}. ${b}`).join("\n") || "No bullets yet"}

${data.bullets?.filter(Boolean).length === 0 ? `Generate 3-4 strong bullet points for a ${data.title || "professional"} at ${data.company || "a company"}.` : "Improve the existing bullets."}

Return ONLY the improved bullet points, one per line, no numbering, no dashes, no explanations.`;
        break;

      case "generate-cover-letter":
        prompt = `You are an expert cover letter writer. Write a professional, personalized cover letter for this job application.

Company: "${data.company}"
Role: "${data.role}"
Candidate name: "${data.fullName || "[Your Name]"}"
Candidate job title: "${data.jobTitle || ""}"
Key skills: ${data.skills?.join(", ") || "not specified"}
Summary: "${data.summary || ""}"

Write a compelling 3-4 paragraph cover letter. Be specific to the role and company. Do not use generic filler. Start with "Dear Hiring Manager," and end with "Sincerely,\n${data.fullName || "[Your Name]"}".

Return ONLY the cover letter text.`;
        break;

      case "chat":
        prompt = `You are an AI CV assistant helping someone build their resume. Be helpful, specific, and actionable. Keep responses concise (2-4 sentences max).

Their CV data:
- Name: ${data.fullName || "Not set"}
- Job title: ${data.jobTitle || "Not set"}
- Skills: ${data.skills?.join(", ") || "None"}
- Experience count: ${data.experiences?.length || 0}

Their message: "${data.message}"

Respond helpfully and concisely.`;
        break;

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}
