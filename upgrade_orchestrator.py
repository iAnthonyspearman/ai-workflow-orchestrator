from pathlib import Path

Path("public").mkdir(exist_ok=True)
Path("api").mkdir(exist_ok=True)

index_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Workflow Orchestrator</title>
  <link rel="stylesheet" href="/style.css" />
</head>
<body>
  <main class="page">
    <header class="topbar">
      <div>
        <p class="eyebrow">AI Systems Lab</p>
        <h1>AI Workflow Orchestrator</h1>
      </div>
      <span class="badge">Execution Intelligence</span>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">From messy input to structured action</p>
        <h2>Paste anything. Get a clear AI-powered execution plan.</h2>
        <p class="subtext">
          Business ideas, customer notes, copied text, project problems, career goals, support issues, or vague thoughts.
          This system turns raw input into priorities, risks, tasks, timeline, metrics, and executive next steps.
        </p>
      </div>

      <div class="panel">
        <label>Workflow Mode</label>
        <select id="mode">
          <option>General Answer + Action Plan</option>
          <option>Business Workflow</option>
          <option>Customer Support Workflow</option>
          <option>Project Execution Plan</option>
          <option>AI Solutions Engineering Plan</option>
          <option>Career / LinkedIn Strategy</option>
        </select>

        <label>Paste Anything Here</label>
        <textarea id="prompt" placeholder="Paste any notes, question, business problem, copied text, or project idea..."></textarea>

        <button id="demoBtn" class="secondary">Use Executive Demo</button>
        <button id="generateBtn">Generate Workflow</button>

        <div id="loading" class="loading">
          <div class="pulse"></div>
          <p>AI agents are organizing the workflow...</p>
        </div>
      </div>
    </section>

    <section class="results" id="results">
      <div class="result-header">
        <div>
          <p class="eyebrow">Generated Workflow</p>
          <h2 id="title">Awaiting mission input</h2>
        </div>
        <span id="status" class="badge">Idle</span>
      </div>

      <div class="grid">
        <article><h3>Executive Summary</h3><p id="summary">Enter a prompt to begin.</p></article>
        <article><h3>Priorities</h3><ul id="priorities"><li>Waiting...</li></ul></article>
        <article><h3>Risks</h3><ul id="risks"><li>Waiting...</li></ul></article>
        <article><h3>Action Steps</h3><ul id="actions"><li>Waiting...</li></ul></article>
        <article><h3>Timeline</h3><ul id="timeline"><li>Waiting...</li></ul></article>
        <article><h3>Success Metrics</h3><ul id="metrics"><li>Waiting...</li></ul></article>
        <article class="wide"><h3>Final Recommendation</h3><p id="recommendation">Recommendation will appear here.</p></article>
      </div>
    </section>

    <footer>Built by Anthony Spearman - AI Workflow Orchestration Demo</footer>
  </main>

  <script src="/app.js"></script>
</body>
</html>
"""

css = """
:root {
  --bg: #040816;
  --card: rgba(255,255,255,.07);
  --line: rgba(255,255,255,.16);
  --text: #f8fbff;
  --muted: #aeb9d6;
  --cyan: #72e8ff;
  --purple: #a78bfa;
  --green: #6fffc2;
  --gold: #ffd166;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, Segoe UI, Arial, sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 10% 10%, rgba(114,232,255,.25), transparent 30%),
    radial-gradient(circle at 85% 15%, rgba(167,139,250,.22), transparent 28%),
    radial-gradient(circle at 50% 95%, rgba(255,209,102,.15), transparent 32%),
    var(--bg);
}

.page {
  width: min(1220px, 94vw);
  margin: auto;
  padding: 28px 0 42px;
}

.topbar, .result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.eyebrow {
  color: var(--cyan);
  text-transform: uppercase;
  letter-spacing: .22em;
  font-size: 11px;
  font-weight: 900;
  margin: 0 0 8px;
}

h1, h2, h3 { margin: 0; }

.badge {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 10px 14px;
  background: rgba(255,255,255,.06);
  color: var(--muted);
  font-size: 13px;
}

.hero {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 20px;
  margin-top: 24px;
}

.hero-copy, .panel, .results article, .results {
  border: 1px solid var(--line);
  background: linear-gradient(180deg, rgba(255,255,255,.09), rgba(255,255,255,.04));
  border-radius: 28px;
  box-shadow: 0 28px 90px rgba(0,0,0,.4);
  backdrop-filter: blur(18px);
}

.hero-copy {
  padding: 42px;
  min-height: 470px;
}

.hero-copy h2 {
  font-size: clamp(44px, 6vw, 78px);
  line-height: .92;
  letter-spacing: -.07em;
  max-width: 780px;
}

.subtext {
  color: #dbe5ff;
  line-height: 1.75;
  max-width: 680px;
  margin-top: 22px;
}

.panel {
  padding: 30px;
}

label {
  display: block;
  margin: 18px 0 8px;
  color: #dce6ff;
  font-size: 12px;
  font-weight: 900;
}

select, textarea {
  width: 100%;
  border: 1px solid var(--line);
  background: rgba(0,0,0,.32);
  color: var(--text);
  border-radius: 18px;
  padding: 15px;
  outline: none;
}

textarea {
  min-height: 230px;
  resize: vertical;
  line-height: 1.6;
}

button {
  width: 100%;
  margin-top: 14px;
  padding: 15px;
  border: 0;
  border-radius: 18px;
  font-weight: 1000;
  cursor: pointer;
  color: #06101f;
  background: linear-gradient(135deg, var(--cyan), var(--purple), var(--gold));
}

.secondary {
  color: var(--text);
  border: 1px solid var(--line);
  background: rgba(255,255,255,.09);
}

.loading {
  display: none;
  margin-top: 16px;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 14px;
  color: var(--muted);
}

.loading.active { display: block; }

.pulse {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--cyan), var(--purple), var(--gold));
  animation: pulse 1.1s infinite alternate;
}

@keyframes pulse {
  from { transform: scaleX(.35); opacity: .55; transform-origin: left; }
  to { transform: scaleX(1); opacity: 1; transform-origin: left; }
}

.results {
  margin-top: 20px;
  padding: 28px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 20px;
}

article {
  padding: 20px;
  min-height: 150px;
}

article h3 {
  color: var(--cyan);
  font-size: 13px;
  letter-spacing: .15em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

article p, li {
  color: #dce6ff;
  line-height: 1.55;
  font-size: 14px;
}

.wide { grid-column: span 3; }

footer {
  margin-top: 28px;
  text-align: center;
  color: var(--muted);
  font-size: 12px;
}

@media(max-width: 900px) {
  .hero, .grid { grid-template-columns: 1fr; }
  .wide { grid-column: span 1; }
  .topbar, .result-header { align-items: flex-start; flex-direction: column; }
}
"""

app_js = """
const $ = (id) => document.getElementById(id);

function fillList(id, items) {
  const el = $(id);
  el.innerHTML = "";
  (items && items.length ? items : ["No items returned."]).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function fallback(prompt) {
  return {
    title: "Workflow Generated",
    executiveSummary: "The input has been converted into a practical execution plan. The system identified the need to clarify the objective, prioritize next actions, reduce risk, and create measurable progress.",
    priorities: ["Clarify the main goal", "Identify the highest-value action", "Organize the work into phases"],
    risks: ["Missing context may reduce precision", "No clear owner may delay execution", "Success metrics may need confirmation"],
    actions: ["Summarize the goal in one sentence", "Create the first three tasks", "Set a checkpoint", "Review and improve"],
    timeline: ["Now: define the desired outcome", "Next: complete the first priority", "Then: measure results and adjust"],
    metrics: ["Clear next step created", "Risks identified", "Execution path defined"],
    recommendation: "Begin with the simplest high-impact step, then build structure around the results."
  };
}

async function generate() {
  const prompt = $("prompt").value.trim() || "Create a useful workflow from a blank or unclear idea.";
  const mode = $("mode").value;

  $("loading").classList.add("active");
  $("status").textContent = "Thinking";
  $("title").textContent = "Building workflow...";

  try {
    const res = await fetch("/api/orchestrate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ prompt, mode })
    });

    const data = await res.json();
    const result = data.result || fallback(prompt);

    $("title").textContent = result.title || "Workflow Generated";
    $("summary").textContent = result.executiveSummary || "Workflow created.";
    fillList("priorities", result.priorities);
    fillList("risks", result.risks);
    fillList("actions", result.actions);
    fillList("timeline", result.timeline);
    fillList("metrics", result.metrics);
    $("recommendation").textContent = result.recommendation || "Move forward with the highest-impact next step.";
    $("status").textContent = "Complete";
  } catch (err) {
    const result = fallback(prompt);
    $("title").textContent = result.title;
    $("summary").textContent = result.executiveSummary;
    fillList("priorities", result.priorities);
    fillList("risks", result.risks);
    fillList("actions", result.actions);
    fillList("timeline", result.timeline);
    fillList("metrics", result.metrics);
    $("recommendation").textContent = result.recommendation;
    $("status").textContent = "Fallback Active";
  } finally {
    $("loading").classList.remove("active");
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

$("generateBtn").addEventListener("click", generate);

$("demoBtn").addEventListener("click", () => {
  $("mode").value = "AI Solutions Engineering Plan";
  $("prompt").value = "A company has support tickets, sales notes, project updates, and process issues scattered across emails, docs, and spreadsheets. They want AI to organize the chaos, identify repeated problems, create action steps, reduce manual work, and show leaders what should be fixed first.";
});
"""

api_js = """
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt = "", mode = "General Answer + Action Plan" } = req.body || {};
    const safePrompt = String(prompt || "").trim() || "The user gave little input. Create a useful starter workflow.";

    const systemPrompt = `
You are an elite AI Workflow Orchestrator for AI Solutions Engineering.
Turn ANY user input into structured execution intelligence.

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

    const userPrompt = `MODE: ${mode}\\nRAW INPUT:\\n${safePrompt}`;

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
"""

Path("public/index.html").write_text(index_html, encoding="utf-8")
Path("public/style.css").write_text(css, encoding="utf-8")
Path("public/app.js").write_text(app_js, encoding="utf-8")
Path("api/orchestrate.js").write_text(api_js, encoding="utf-8")
Path(".gitignore").write_text(".env\n.env.local\n.vercel\nnode_modules\n.DS_Store\n", encoding="utf-8")

print("AI Workflow Orchestrator upgrade complete.")
