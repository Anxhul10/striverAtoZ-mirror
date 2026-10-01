const STORAGE_KEY = "a2z-sheet-progress-v1";
const REFERENCE_TOTALS = { total: 474, Easy: 151, Medium: 187, Hard: 136 };
// Deliberately not persisted: a fresh page load starts with every section collapsed.
// Re-renders during this page session preserve the user's expanded sections.
const expandedTopics = new Set();
const state = loadState();
let revisionOnly = false;
let noteProblemId = null;

const $ = (selector) => document.querySelector(selector);
const topicList = $("#topicList");

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function problemId(topicIndex, problemIndex) {
  return `${topicIndex}:${problemIndex}`;
}
function getProblemState(id) {
  return state[id] || {};
}
function allProblems() {
  return DATA.flatMap((topic, ti) =>
    topic.problems.map((problem, pi) => ({
      ...problem,
      id: problemId(ti, pi),
      topic: topic.topic,
      topicIndex: ti,
      problemIndex: pi,
    })),
  );
}
function difficultyOf(problem) {
  return ["Easy", "Medium", "Hard"].includes(problem.difficulty)
    ? problem.difficulty
    : "Unspecified";
}
function updateOverview() {
  const problems = allProblems();
  const solved = problems.filter((p) => getProblemState(p.id).done).length;
  const total = REFERENCE_TOTALS.total;
  const percent = total ? Math.round((solved / total) * 100) : 0;
  $("#solvedCount").textContent = solved;
  $("#totalCount").textContent = total;
  $("#progressPercent").textContent = `${percent}%`;
  $("#progressRing").style.background =
    `conic-gradient(var(--orange) ${percent * 3.6}deg, #303034 0deg)`;
  ["Easy", "Medium", "Hard"].forEach((level) => {
    const group = problems.filter((p) => difficultyOf(p) === level);
    $("#" + level.toLowerCase() + "Count").textContent = group.filter(
      (p) => getProblemState(p.id).done,
    ).length;
    $("#" + level.toLowerCase() + "Total").textContent =
      `/${REFERENCE_TOTALS[level]}`;
  });
}
function matchesFilters(problem) {
  const query = $("#searchInput").value.trim().toLowerCase();
  const filter = $("#statusFilter").value;
  const difficulty = $("#difficultyFilter").value;
  const ps = getProblemState(problem.id);
  if (
    query &&
    !`${problem.name} ${problem.topic} ${problem.platform}`
      .toLowerCase()
      .includes(query)
  )
    return false;
  if (filter === "todo" && ps.done) return false;
  if (filter === "done" && !ps.done) return false;
  if (difficulty !== "all" && difficultyOf(problem) !== difficulty)
    return false;
  if (revisionOnly && !ps.revision) return false;
  return true;
}
function makeCell(content, className = "") {
  const td = document.createElement("td");
  if (className) td.className = className;
  if (content instanceof Node) td.append(content);
  else td.textContent = content;
  return td;
}
function makeProblemRow(problem) {
  const ps = getProblemState(problem.id);
  const tr = document.createElement("tr");
  if (ps.done) tr.classList.add("done-row");

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "problem-check";
  check.checked = !!ps.done;
  check.setAttribute("aria-label", `Mark ${problem.name} complete`);
  check.addEventListener("change", () => {
    state[problem.id] = { ...getProblemState(problem.id), done: check.checked };
    saveState();
    render();
  });
  tr.append(makeCell(check));

  const name = document.createElement("a");
  name.className = "problem-name";
  name.textContent = problem.name;

  const articleId = problem.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  name.href = `article.html?id=${articleId}`;

  tr.append(makeCell(name));
  const solve = document.createElement("a");
  solve.className = "solve-link";
  solve.href = problem.url || "#";
  solve.target = "_blank";
  solve.rel = "noopener noreferrer";
  solve.textContent = "Solve";
  solve.setAttribute("aria-label", `Open ${problem.name}`);
  tr.append(makeCell(solve));

  const platform = document.createElement("span");
  platform.className = "platform-tag";
  platform.textContent = problem.platform || "—";
  tr.append(makeCell(platform));

  const resource = document.createElement("a");
  resource.className = "resource-link";
  resource.href = problem.url || "#";
  resource.target = "_blank";
  resource.rel = "noopener noreferrer";
  resource.textContent = "↗";
  resource.title = `Open ${problem.platform || "problem"} resource`;
  tr.append(makeCell(resource));

  const note = document.createElement("button");
  note.className = `note-button ${ps.note ? "has-note" : ""}`;
  note.type = "button";
  note.textContent = "⊕";
  note.title = ps.note ? "Edit note" : "Add note";
  note.setAttribute("aria-label", `${note.title} for ${problem.name}`);
  note.addEventListener("click", () => openNote(problem));
  tr.append(makeCell(note));

  const star = document.createElement("button");
  star.className = `star-button ${ps.revision ? "active" : ""}`;
  star.type = "button";
  star.textContent = ps.revision ? "★" : "☆";
  star.title = ps.revision ? "Remove from revision" : "Add to revision";
  star.setAttribute("aria-label", star.title);
  star.addEventListener("click", () => {
    state[problem.id] = {
      ...getProblemState(problem.id),
      revision: !ps.revision,
    };
    saveState();
    render();
  });
  tr.append(makeCell(star));

  const difficulty = document.createElement("span");
  const level = difficultyOf(problem);
  difficulty.className = `difficulty-pill ${level.toLowerCase()}`;
  difficulty.textContent = level === "Unspecified" ? "—" : level;
  tr.append(makeCell(difficulty));
  return tr;
}
function render() {
  updateOverview();
  topicList.replaceChildren();
  const queryActive =
    $("#searchInput").value.trim() ||
    revisionOnly ||
    $("#statusFilter").value !== "all" ||
    $("#difficultyFilter").value !== "all";
  let visibleTotal = 0;

  DATA.forEach((topic, ti) => {
    const visible = topic.problems
      .map((p, pi) => ({ ...p, id: problemId(ti, pi) }))
      .filter(matchesFilters);
    if (!visible.length) return;
    visibleTotal += visible.length;
    const solved = topic.problems.filter(
      (p, pi) => getProblemState(problemId(ti, pi)).done,
    ).length;

    const section = document.createElement("section");
    section.className = `topic${expandedTopics.has(ti) ? "" : " collapsed"}`;
    const heading = document.createElement("div");
    heading.className = "topic-heading";
    heading.setAttribute("role", "button");
    heading.setAttribute("tabindex", "0");
    heading.setAttribute("aria-expanded", String(expandedTopics.has(ti)));
    const chevron = document.createElement("span");
    chevron.className = "chevron";
    chevron.textContent = "⌄";
    const title = document.createElement("span");
    title.className = "topic-title";
    title.textContent = topic.topic;
    const summary = document.createElement("span");
    summary.className = "topic-summary";
    const track = document.createElement("span");
    track.className = "topic-track";
    const fill = document.createElement("span");
    fill.style.width = `${topic.problems.length ? (solved / topic.problems.length) * 100 : 0}%`;
    track.append(fill);
    const count = document.createElement("span");
    count.textContent = `${solved} / ${topic.problems.length}`;
    summary.append(track, count);
    heading.append(chevron, title, summary);

    const content = document.createElement("div");
    content.className = "topic-content";
    const wrap = document.createElement("div");
    wrap.className = "problem-table-wrap";
    const table = document.createElement("table");
    table.className = "problem-table";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    [
      "Status",
      "Problem",
      "Solve",
      "Platform",
      "Resource",
      "Note",
      "Revision",
      "Difficulty",
    ].forEach((label) => {
      const th = document.createElement("th");
      th.textContent = label;
      headerRow.append(th);
    });
    thead.append(headerRow);
    const tbody = document.createElement("tbody");
    visible.forEach((p) => tbody.append(makeProblemRow(p)));
    table.append(thead, tbody);
    wrap.append(table);
    content.append(wrap);
    section.append(heading, content);
    const toggle = () => {
      if (expandedTopics.has(ti)) expandedTopics.delete(ti);
      else expandedTopics.add(ti);
      section.classList.toggle("collapsed", !expandedTopics.has(ti));
      heading.setAttribute("aria-expanded", String(expandedTopics.has(ti)));
    };
    heading.addEventListener("click", toggle);
    heading.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
    topicList.append(section);
  });
  if (!visibleTotal) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = revisionOnly
      ? "No revision problems yet. Use the star beside a problem to add it here."
      : "No problems match the current filters.";
    topicList.append(empty);
  }
}
function openNote(problem) {
  noteProblemId = problem.id;
  $("#noteTitle").textContent = problem.name;
  $("#noteText").value = getProblemState(problem.id).note || "";
  $("#noteDialog").showModal();
}
$("#noteForm").addEventListener("submit", (e) => {
  if (e.submitter && e.submitter.id === "saveNoteBtn") {
    e.preventDefault();
    state[noteProblemId] = {
      ...getProblemState(noteProblemId),
      note: $("#noteText").value.trim(),
    };
    saveState();
    $("#noteDialog").close();
    render();
  }
});
$("#searchInput").addEventListener("input", render);
$("#statusFilter").addEventListener("change", render);
$("#difficultyFilter").addEventListener("change", render);
$("#allTab").addEventListener("click", () => setView(false));
$("#revisionTab").addEventListener("click", () => setView(true));
function setView(revision) {
  revisionOnly = revision;
  $("#allTab").classList.toggle("active", !revision);
  $("#revisionTab").classList.toggle("active", revision);
  $("#allTab").setAttribute("aria-selected", String(!revision));
  $("#revisionTab").setAttribute("aria-selected", String(revision));
  render();
}
$("#randomBtn").addEventListener("click", () => {
  const candidates = allProblems().filter(matchesFilters);
  if (!candidates.length) return;
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  const topicSection = [...document.querySelectorAll(".topic")].find(
    (el) => el.querySelector(".topic-title")?.textContent === picked.topic,
  );
  if (topicSection) {
    topicSection.classList.remove("collapsed");
    topicSection.scrollIntoView({ behavior: "smooth", block: "center" });
    const rows = [...topicSection.querySelectorAll("tbody tr")];
    const index = candidates
      .filter((p) => p.topic === picked.topic)
      .findIndex((p) => p.id === picked.id);
    rows[index]?.classList.add("random-highlight");
    setTimeout(() => rows[index]?.classList.remove("random-highlight"), 1500);
  }
  window.open(picked.url, "_blank", "noopener");
});
$("#resetBtn").addEventListener("click", () => {
  if (
    !confirm(
      "Reset all completion, revision, and note data saved in this browser?",
    )
  )
    return;
  Object.keys(state).forEach((key) => delete state[key]);
  saveState();
  render();
});
$("#exportBtn").addEventListener("click", () => {
  const blob = new Blob(
    [
      JSON.stringify(
        { version: 1, exportedAt: new Date().toISOString(), progress: state },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "striver-a2z-progress.json";
  a.click();
  URL.revokeObjectURL(url);
});
$("#importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const imported =
      parsed.progress && typeof parsed.progress === "object"
        ? parsed.progress
        : parsed;
    if (!imported || typeof imported !== "object" || Array.isArray(imported))
      throw new Error("Invalid format");
    Object.keys(state).forEach((key) => delete state[key]);
    Object.entries(imported).forEach(([key, value]) => {
      if (/^\d+:\d+$/.test(key) && value && typeof value === "object")
        state[key] = value;
    });
    saveState();
    render();
    alert("Progress imported.");
  } catch {
    alert(
      "Could not import this file. Please choose a valid progress JSON export.",
    );
  }
  event.target.value = "";
});
render();
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadArticle() {
  const response = await fetch(`articles/${id}.md`);

  if (!response.ok) {
    document.getElementById("article-content").textContent =
      "Article not found";
    return;
  }

  const markdown = await response.text();

  document.getElementById("article-content").innerHTML = marked.parse(markdown);
}

loadArticle();
