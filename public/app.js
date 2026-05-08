
const $ = (id) => document.getElementById(id);

const modeContent = {
  "General Answer + Action Plan": {
    demo: "I need help organizing a situation into a clear answer and practical next steps.",
    placeholder: "Ask anything or paste any copied text...",
    fallback: {
      title: "General Answer + Action Plan",
      executiveSummary: "This mode gives a clear answer first, then turns the answer into practical next steps so the user knows what to do next.",
      priorities: ["Understand the main question", "Give a direct answer", "Turn the answer into action"],
      risks: ["The request may be too broad", "Important context may be missing", "The next step may need confirmation"],
      actions: ["Summarize the issue", "Answer the core question", "List next steps", "Confirm what should happen next"],
      timeline: ["Now: clarify the question", "Next: act on the best step", "Then: review results"],
      metrics: ["Question answered", "Next step identified", "Confusion reduced"],
      recommendation: "Start with the clearest answer, then move immediately into one practical action."
    }
  },

  "Business Workflow": {
    demo: "A business is losing revenue because customer notes, follow-ups, and decisions are scattered across texts, spreadsheets, and emails.",
    placeholder: "Paste a business goal, revenue issue, sales process, or operations problem...",
    fallback: {
      title: "Business Workflow Plan",
      executiveSummary: "This mode turns a business problem into an operating workflow focused on revenue, ownership, process clarity, and repeatable execution.",
      priorities: ["Identify the business outcome", "Map the current process gap", "Assign ownership and follow-up steps"],
      risks: ["Revenue may leak through missed follow-ups", "No clear owner may slow execution", "Manual tracking may create inconsistency"],
      actions: ["Define the revenue or operations goal", "Create a repeatable follow-up process", "Assign owners to each step", "Track results weekly"],
      timeline: ["Today: identify the process gap", "This week: build the workflow", "Next week: measure improvement"],
      metrics: ["Follow-up completion rate", "Revenue opportunities recovered", "Process cycle time reduced"],
      recommendation: "Build the workflow around the business outcome first, then automate the repeated steps."
    }
  },

  "Customer Support Workflow": {
    demo: "Customers keep contacting support about delayed responses, unclear updates, and repeated billing confusion.",
    placeholder: "Paste support tickets, customer complaints, escalation notes, or service issues...",
    fallback: {
      title: "Customer Support Workflow",
      executiveSummary: "This mode organizes customer issues into a support workflow focused on triage, root cause, escalation, resolution quality, and customer experience.",
      priorities: ["Classify the customer issue", "Identify root causes", "Create an escalation and resolution path"],
      risks: ["Customers may churn if response time stays slow", "Repeated issues may hide a deeper process problem", "Support teams may lack clear escalation rules"],
      actions: ["Group tickets by issue type", "Identify repeated complaints", "Create response templates", "Escalate high-risk customers", "Track resolution time"],
      timeline: ["Now: triage incoming issues", "24 hours: resolve urgent cases", "This week: fix repeated root causes"],
      metrics: ["First response time", "Resolution time", "Customer satisfaction", "Repeat ticket reduction"],
      recommendation: "Start by identifying the top repeated customer issue, then build a faster triage and escalation workflow around it."
    }
  },

  "Project Execution Plan": {
    demo: "We need to launch a new AI demo site this week with UI improvements, API testing, GitHub cleanup, Vercel deployment, and LinkedIn positioning.",
    placeholder: "Paste a project goal, deadline, assignment, launch plan, or team objective...",
    fallback: {
      title: "Project Execution Plan",
      executiveSummary: "This mode converts a project goal into phases, tasks, blockers, deadlines, and launch-ready execution steps.",
      priorities: ["Define the final deliverable", "Break work into phases", "Identify blockers before launch"],
      risks: ["Scope may expand too much", "Testing may be skipped", "Deployment issues may delay launch"],
      actions: ["Create project phases", "List deliverables", "Assign deadlines", "Test the final version", "Prepare launch materials"],
      timeline: ["Phase 1: plan and structure", "Phase 2: build and test", "Phase 3: deploy and present"],
      metrics: ["Deliverables completed", "Bugs resolved", "Deployment successful", "Demo ready"],
      recommendation: "Move in phases: build the core first, test the workflow second, then polish for launch."
    }
  },

  "AI Solutions Engineering Plan": {
    demo: "A company has support tickets, sales notes, project updates, and process issues scattered across emails, docs, and spreadsheets.",
    placeholder: "Paste a company problem that AI could solve, messy process notes, or automation idea...",
    fallback: {
      title: "AI Solutions Engineering Plan",
      executiveSummary: "This mode translates a business problem into an AI solution design with inputs, workflow logic, API behavior, outputs, automation opportunities, and implementation steps.",
      priorities: ["Define the business problem", "Identify data inputs", "Design the AI workflow output"],
      risks: ["Bad input data may weaken results", "The workflow may lack human review", "The solution may not connect to real business action"],
      actions: ["Collect messy business inputs", "Create prompt and API logic", "Structure AI output into useful sections", "Add review and approval steps", "Deploy and test with real examples"],
      timeline: ["Discovery: define the problem", "Prototype: build the AI workflow", "Deployment: test and launch", "Optimization: improve outputs"],
      metrics: ["Manual work reduced", "Output accuracy improved", "Workflow completion time reduced", "Business decisions supported"],
      recommendation: "Design the AI system around the business decision it helps people make, not just around text generation."
    }
  },

  "Career / LinkedIn Strategy": {
    demo: "I am building a portfolio for AI Solutions Engineering and need recruiters to understand my projects, skills, and value.",
    placeholder: "Paste a career goal, LinkedIn post, job description, recruiter message, or portfolio update...",
    fallback: {
      title: "Career and LinkedIn Strategy",
      executiveSummary: "This mode turns career goals into recruiter-facing positioning, portfolio messaging, proof of skills, and next professional actions.",
      priorities: ["Clarify the target role", "Translate projects into business value", "Create recruiter-friendly proof"],
      risks: ["Messaging may sound too broad", "Projects may not clearly show business impact", "Recruiters may not understand the technical value"],
      actions: ["Define the target AI role", "Rewrite project descriptions around outcomes", "Update LinkedIn headline and featured projects", "Create a short recruiter pitch", "Apply to aligned roles"],
      timeline: ["Today: update positioning", "This week: polish portfolio", "Next week: begin outreach"],
      metrics: ["Profile views", "Recruiter responses", "Applications submitted", "Interviews booked"],
      recommendation: "Position every project as proof that you can turn business problems into working AI systems."
    }
  }
};

function applyModeExperience() {
  const mode = $("mode").value;
  const data = modeContent[mode];
  if (!data) return;
  $("prompt").placeholder = data.placeholder;
}

function fillList(id, items) {
  const el = $(id);
  el.innerHTML = "";
  (items && items.length ? items : ["No items returned."]).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function render(result) {
  $("title").textContent = result.title || "Workflow Generated";
  $("summary").textContent = result.executiveSummary || "Workflow created.";
  fillList("priorities", result.priorities);
  fillList("risks", result.risks);
  fillList("actions", result.actions);
  fillList("timeline", result.timeline);
  fillList("metrics", result.metrics);
  $("recommendation").textContent = result.recommendation || "Move forward with the highest-impact next step.";
}

function getModeFallback() {
  const mode = $("mode").value;
  return modeContent[mode]?.fallback || modeContent["General Answer + Action Plan"].fallback;
}

async function generate() {
  const mode = $("mode").value;
  const prompt = $("prompt").value.trim() || modeContent[mode]?.demo || "Create a useful workflow.";

  $("loading").classList.add("active");
  $("status").textContent = "Thinking";
  $("title").textContent = "Building " + mode + "...";

  try {
    const res = await fetch("/api/orchestrate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ prompt, mode })
    });

    const data = await res.json();

    if (!res.ok || !data.result) {
      render(getModeFallback());
      $("status").textContent = "Mode Demo Active";
    } else {
      render(data.result);
      $("status").textContent = "Complete";
    }
  } catch (err) {
    render(getModeFallback());
    $("status").textContent = "Mode Demo Active";
  } finally {
    $("loading").classList.remove("active");
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

$("mode").addEventListener("change", applyModeExperience);

$("generateBtn").addEventListener("click", generate);

$("demoBtn").addEventListener("click", () => {
  const mode = $("mode").value;
  $("prompt").value = modeContent[mode]?.demo || modeContent["General Answer + Action Plan"].demo;
  applyModeExperience();
});

applyModeExperience();
