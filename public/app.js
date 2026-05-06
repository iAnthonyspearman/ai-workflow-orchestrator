const goalInput = document.getElementById("goal");
const modeInput = document.getElementById("mode");
const generateBtn = document.getElementById("generateBtn");
const demoBtn = document.getElementById("demoBtn");
const results = document.getElementById("results");
const loadingState = document.getElementById("loadingState");
const resultTitle = document.getElementById("resultTitle");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const connectionStatus = document.getElementById("connectionStatus");

const HISTORY_KEY = "ai-workflow-orchestrator-history";

let priorityChartInstance = null;
let riskChartInstance = null;
let categoryChartInstance = null;

function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

function saveHistory(item) {
  const history = getHistory();
  const updatedHistory = [item, ...history].slice(0, 8);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

function renderHistory() {
  const history = getHistory();

  if (!history.length) {
    historyList.innerHTML = `<p class="empty-state">No saved workflows yet.</p>`;
    return;
  }

  historyList.innerHTML = history
    .map((item, index) => {
      return `
        <div class="history-item" data-index="${index}">
          <strong>${escapeHTML(item.mode)}</strong>
          <p>${escapeHTML(item.goal.slice(0, 90))}${item.goal.length > 90 ? "..." : ""}</p>
        </div>
      `;
    })
    .join("");

  document.querySelectorAll(".history-item").forEach((item) => {
    item.addEventListener("click", () => {
      const index = Number(item.dataset.index);
      const selected = getHistory()[index];

      if (selected) {
        renderWorkflow(selected.workflow);
        resultTitle.textContent = selected.workflow.goalSummary || "Generated Workflow";
      }
    });
  });
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  loadingState.classList.toggle("hidden", !isLoading);
  results.classList.toggle("hidden", isLoading);
  connectionStatus.textContent = isLoading ? "Generating" : "Ready";
}

async function generateWorkflow() {
  const goal = goalInput.value.trim();
  const mode = modeInput.value;

  if (!goal) {
    results.innerHTML = `
      <div class="welcome-card">
        <h3>Enter a goal first</h3>
        <p>Please type a business goal, customer problem, or operational challenge before generating a workflow.</p>
      </div>
    `;
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/generate-workflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goal,
        mode
      })
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `The server did not return JSON. Server said: ${responseText.slice(0, 220)}`
      );
    }

    if (!response.ok) {
      throw new Error(data.details || data.error || "Unable to generate workflow.");
    }

    const workflow = data.workflow;

    renderWorkflow(workflow);

    resultTitle.textContent = workflow.goalSummary || "Generated Workflow";

    saveHistory({
      goal,
      mode,
      workflow,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    results.innerHTML = `
      <div class="welcome-card">
        <h3>Workflow generation failed</h3>
        <p>${escapeHTML(error.message)}</p>
        <p class="small-note">Check your terminal for the backend error. Also confirm .env.local has OPENAI_API_KEY and OPENAI_MODEL.</p>
      </div>
    `;
  } finally {
    setLoading(false);
  }
}

function renderWorkflow(workflow) {
  destroyCharts();

  results.innerHTML = `
    <div class="summary-card">
      <p class="eyebrow">Goal Summary</p>
      <h3>${escapeHTML(workflow.goalSummary || "No summary provided")}</h3>
      <p>${escapeHTML(workflow.businessContext || "")}</p>
    </div>

    <div class="workflow-card">
      <p class="eyebrow">Workflow Strategy</p>
      <h3>Execution Strategy</h3>
      <p>${escapeHTML(workflow.workflowStrategy || "")}</p>
    </div>

    <div class="analytics-card">
      <p class="eyebrow">Visual Execution Analytics</p>
      <h3>Workflow Intelligence Dashboard</h3>
      <p>
        These charts convert the AI-generated workflow into visual business intelligence, helping leaders quickly understand priorities, risk exposure, and work categories.
      </p>

      <div class="analytics-grid">
        <div class="chart-card">
          <h4>Priority Breakdown</h4>
          <div class="chart-wrap">
            <canvas id="priorityChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <h4>Risk Impact</h4>
          <div class="chart-wrap">
            <canvas id="riskChart"></canvas>
          </div>
        </div>

        <div class="chart-card wide">
          <h4>Task Category Distribution</h4>
          <div class="chart-wrap">
            <canvas id="categoryChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="workflow-card">
      <p class="eyebrow">Next Best Action</p>
      <h3>${escapeHTML(workflow.nextBestAction || "No next action provided")}</h3>
    </div>

    <div class="card-grid">
      <div class="workflow-card">
        <p class="eyebrow">Timeline</p>
        <h3>Execution Phases</h3>
        <div class="timeline-list">
          ${renderTimeline(workflow.timeline || [])}
        </div>
      </div>

      <div class="workflow-card">
        <p class="eyebrow">Success Metrics</p>
        <h3>How to Measure Progress</h3>
        <div class="metric-list">
          ${renderMetrics(workflow.successMetrics || [])}
        </div>
      </div>
    </div>

    <div class="workflow-card">
      <p class="eyebrow">Task Board</p>
      <h3>AI-Generated Execution Board</h3>
      <div class="task-board">
        ${renderTaskColumn("High Priority", workflow.tasks || [], "High")}
        ${renderTaskColumn("Medium Priority", workflow.tasks || [], "Medium")}
        ${renderTaskColumn("Low Priority", workflow.tasks || [], "Low")}
      </div>
    </div>

    <div class="workflow-card">
      <p class="eyebrow">Risk Review</p>
      <h3>Risks and Mitigations</h3>
      <div class="risk-list">
        ${renderRisks(workflow.risks || [])}
      </div>
    </div>
  `;

  renderCharts(workflow);
}

function renderTimeline(timeline) {
  if (!timeline.length) {
    return `<p>No timeline provided.</p>`;
  }

  return timeline
    .map((item) => {
      return `
        <div class="timeline-item">
          <span>${escapeHTML(item.timeframe || "")}</span>
          <strong>${escapeHTML(item.phase || "")}</strong>
          <p>${escapeHTML(item.objective || "")}</p>
        </div>
      `;
    })
    .join("");
}

function renderMetrics(metrics) {
  if (!metrics.length) {
    return `<p>No metrics provided.</p>`;
  }

  return metrics
    .map((metric) => {
      return `
        <div class="metric-card">
          <p>${escapeHTML(metric)}</p>
        </div>
      `;
    })
    .join("");
}

function renderTaskColumn(title, tasks, priority) {
  const filteredTasks = tasks.filter((task) => task.priority === priority);

  return `
    <div class="task-column">
      <h4>${escapeHTML(title)}</h4>
      ${
        filteredTasks.length
          ? filteredTasks.map(renderTask).join("")
          : `<p class="empty-state">No ${priority.toLowerCase()} priority tasks.</p>`
      }
    </div>
  `;
}

function renderTask(task) {
  return `
    <div class="task-card">
      <h5>${escapeHTML(task.title || "Untitled Task")}</h5>
      <p>${escapeHTML(task.description || "")}</p>
      <div class="task-meta">
        <span class="badge ${getPriorityClass(task.priority)}">${escapeHTML(task.priority || "Medium")}</span>
        <span class="badge badge-category">${escapeHTML(task.category || "General")}</span>
        <span class="badge badge-category">${escapeHTML(task.status || "Pending")}</span>
      </div>
    </div>
  `;
}

function renderRisks(risks) {
  if (!risks.length) {
    return `<p>No risks provided.</p>`;
  }

  return risks
    .map((item) => {
      return `
        <div class="risk-card">
          <span class="badge ${getPriorityClass(item.impact)}">${escapeHTML(item.impact || "Medium")} Impact</span>
          <strong>${escapeHTML(item.risk || "")}</strong>
          <p>${escapeHTML(item.mitigation || "")}</p>
        </div>
      `;
    })
    .join("");
}

function renderCharts(workflow) {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js is not loaded.");
    return;
  }

  const tasks = Array.isArray(workflow.tasks) ? workflow.tasks : [];
  const risks = Array.isArray(workflow.risks) ? workflow.risks : [];

  const priorityCounts = countByValue(tasks, "priority", ["High", "Medium", "Low"]);
  const riskCounts = countByValue(risks, "impact", ["High", "Medium", "Low"]);
  const categoryCounts = countDynamicValues(tasks, "category");

  const textColor = "#cbd5e1";
  const gridColor = "rgba(148, 163, 184, 0.16)";

  const priorityCanvas = document.getElementById("priorityChart");
  const riskCanvas = document.getElementById("riskChart");
  const categoryCanvas = document.getElementById("categoryChart");

  if (priorityCanvas) {
    priorityChartInstance = new Chart(priorityCanvas, {
      type: "doughnut",
      data: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            data: [priorityCounts.High, priorityCounts.Medium, priorityCounts.Low],
            backgroundColor: [
              "rgba(251, 113, 133, 0.85)",
              "rgba(251, 191, 36, 0.85)",
              "rgba(52, 211, 153, 0.85)"
            ],
            borderColor: "rgba(15, 23, 42, 0.95)",
            borderWidth: 4,
            hoverOffset: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 18
            }
          }
        }
      }
    });
  }

  if (riskCanvas) {
    riskChartInstance = new Chart(riskCanvas, {
      type: "bar",
      data: {
        labels: ["High", "Medium", "Low"],
        datasets: [
          {
            label: "Risks",
            data: [riskCounts.High, riskCounts.Medium, riskCounts.Low],
            backgroundColor: [
              "rgba(251, 113, 133, 0.75)",
              "rgba(251, 191, 36, 0.75)",
              "rgba(52, 211, 153, 0.75)"
            ],
            borderColor: [
              "rgba(251, 113, 133, 1)",
              "rgba(251, 191, 36, 1)",
              "rgba(52, 211, 153, 1)"
            ],
            borderWidth: 1,
            borderRadius: 12
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: textColor
            },
            grid: {
              color: "transparent"
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              precision: 0
            },
            grid: {
              color: gridColor
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  if (categoryCanvas) {
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    categoryChartInstance = new Chart(categoryCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Tasks",
            data,
            backgroundColor: "rgba(103, 232, 249, 0.72)",
            borderColor: "rgba(103, 232, 249, 1)",
            borderWidth: 1,
            borderRadius: 12
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              precision: 0
            },
            grid: {
              color: gridColor
            }
          },
          y: {
            ticks: {
              color: textColor
            },
            grid: {
              color: "transparent"
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

function destroyCharts() {
  if (priorityChartInstance) {
    priorityChartInstance.destroy();
    priorityChartInstance = null;
  }

  if (riskChartInstance) {
    riskChartInstance.destroy();
    riskChartInstance = null;
  }

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
    categoryChartInstance = null;
  }
}

function countByValue(items, key, expectedValues) {
  const counts = {};

  expectedValues.forEach((value) => {
    counts[value] = 0;
  });

  items.forEach((item) => {
    const value = item[key];

    if (counts[value] !== undefined) {
      counts[value] += 1;
    }
  });

  return counts;
}

function countDynamicValues(items, key) {
  const counts = {};

  items.forEach((item) => {
    const rawValue = item[key] || "General";
    const value = String(rawValue).trim() || "General";

    counts[value] = (counts[value] || 0) + 1;
  });

  if (!Object.keys(counts).length) {
    counts.General = 0;
  }

  return counts;
}

function getPriorityClass(priority) {
  if (priority === "High") return "badge-high";
  if (priority === "Low") return "badge-low";
  return "badge-medium";
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function useDemoExample() {
  modeInput.value = "Sales Enablement";
  goalInput.value =
    "Help a professional sports sales team improve follow-up with interested fans, identify high-value ticket opportunities, and turn community engagement into stronger ticket sales and partnership conversations.";
}

generateBtn.addEventListener("click", generateWorkflow);
demoBtn.addEventListener("click", useDemoExample);
clearHistoryBtn.addEventListener("click", clearHistory);

renderHistory();