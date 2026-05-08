
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt = "", mode = "General Answer + Action Plan" } = req.body || {};
    const safePrompt = String(prompt || "").trim() || "The user gave little input. Create a useful starter workflow.";

    const modeInstructions = {
  "General Answer + Action Plan": "Answer the user's question clearly first, then turn the answer into a practical action plan.",
  "Business Workflow": "Focus on business operations, revenue, process improvement, ownership, repeatable workflow, and leadership clarity.",
  "Customer Support Workflow": "Focus on customer pain points, ticket triage, escalation path, root causes, response quality, and support improvement.",
  "Project Execution Plan": "Focus on project phases, deliverables, deadlines, blockers, dependencies, launch readiness, and execution order.",
  "AI Solutions Engineering Plan": "Focus on how AI can solve the business problem through workflow design, automation, API logic, data inputs, outputs, and implementation steps.",
  "Career / LinkedIn Strategy": "Focus on career positioning, recruiter value, portfolio framing, skill proof, messaging, and next professional action."
};

const selectedInstruction = modeInstructions[mode] || modeInstructions["General Answer + Action Plan"];

    const systemPrompt = `
You are an elite AI Workflow Orchestrator for AI Solutions Engineering.
Turn ANY user input into structured execution intelligence.

MODE-SPECIFIC BEHAVIOR:
${selectedInstruction}

Return ONLY valid JSON:
{
  "title": "short title",
  "executiveSummary": "clear paragraph",
  "priorities": ["item", "item", "item"],
  "risks": ["item", "item", "item"],
  "actions": ["item", "item", "item", "item"],
  "timeline": ["item", "item", "item"],
  "metrics": ["item", "item", "item"],
  "recommendation": "final executive recommendation"
}

Rules:
- Accept messy, copied, pasted, incomplete, vague, business, school, career, or project input.
- If information is missing, infer a useful starter plan and state what should be confirmed.
- Keep it practical, professional, and recruiter-demo ready.
`;

    const userPrompt = `MODE: ${mode}\nRAW INPUT:\n${safePrompt}`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(500).json({ error: "OpenAI request failed", details: data });
    }

    const content = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return res.status(200).json({ result: parsed });
  } catch (error) {
    return res.status(500).json({ error: "Workflow orchestration failed", message: error.message });
  }
}
