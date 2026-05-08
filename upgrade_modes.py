from pathlib import Path

app_path = Path("public/app.js")
api_path = Path("api/orchestrate.js")

app_js = app_path.read_text(encoding="utf-8")

app_js = app_js.replace(
'''const $ = (id) => document.getElementById(id);''',
'''const $ = (id) => document.getElementById(id);

const modePrompts = {
  "General Answer + Action Plan": {
    placeholder: "Ask anything or paste any copied text. The system will answer clearly and turn it into action steps.",
    demo: "I have a lot going on and need to organize my thoughts into a clear plan. Help me understand the main issue, what matters most, what risks exist, and what I should do next."
  },
  "Business Workflow": {
    placeholder: "Paste a business goal, sales issue, operations problem, or growth idea...",
    demo: "A small business is losing follow-up opportunities because customer notes, tasks, and owner decisions are scattered across texts, spreadsheets, and emails. Build a workflow to organize leads, assign follow-ups, reduce missed opportunities, and improve revenue execution."
  },
  "Customer Support Workflow": {
    placeholder: "Paste support tickets, customer complaints, service issues, or escalation notes...",
    demo: "Customers keep contacting support about delayed responses, unclear updates, and repeated billing confusion. Create a support workflow that identifies root causes, organizes escalation steps, improves response time, and gives leadership a clean improvement plan."
  },
  "Project Execution Plan": {
    placeholder: "Paste a project idea, assignment, deadline, launch plan, or team objective...",
    demo: "We need to launch a new AI demo site this week. The work includes UI improvements, API testing, GitHub cleanup, Vercel deployment, LinkedIn positioning, and final demo validation. Build a project execution plan."
  },
  "AI Solutions Engineering Plan": {
    placeholder: "Paste a company problem that AI could solve, messy process notes, or an automation idea...",
    demo: "A company has support tickets, sales notes, project updates, and process issues scattered across emails, docs, and spreadsheets. They want AI to organize the chaos, identify repeated problems, create action steps, reduce manual work, and show leaders what should be fixed first."
  },
  "Career / LinkedIn Strategy": {
    placeholder: "Paste a career goal, LinkedIn post idea, job description, recruiter message, or portfolio update...",
    demo: "I am building a portfolio for AI Solutions Engineering. I need to position my projects so recruiters understand that I can turn business problems into AI-powered workflows, demos, APIs, and execution systems."
  }
};

function applyModeExperience() {
  const mode = $("mode").value;
  const config = modePrompts[mode];
  if (!config) return;
  $("prompt").placeholder = config.placeholder;
}

$("mode").addEventListener("change", applyModeExperience);
applyModeExperience();'''
)

app_js = app_js.replace(
'''$("demoBtn").addEventListener("click", () => {
  $("mode").value = "AI Solutions Engineering Plan";
  $("prompt").value = "A company has support tickets, sales notes, project updates, and process issues scattered across emails, docs, and spreadsheets. They want AI to organize the chaos, identify repeated problems, create action steps, reduce manual work, and show leaders what should be fixed first.";
});''',
'''$("demoBtn").addEventListener("click", () => {
  const mode = $("mode").value;
  const config = modePrompts[mode] || modePrompts["General Answer + Action Plan"];
  $("prompt").value = config.demo;
  applyModeExperience();
});'''
)

app_path.write_text(app_js, encoding="utf-8")

api_js = api_path.read_text(encoding="utf-8")

api_js = api_js.replace(
'''const systemPrompt = `
You are an elite AI Workflow Orchestrator for AI Solutions Engineering.
Turn ANY user input into structured execution intelligence.''',
'''const modeInstructions = {
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
${selectedInstruction}'''
)

api_path.write_text(api_js, encoding="utf-8")

print("Mode-specific workflow experiences upgraded.")
