/* CareerAI — UI controller (vanilla JS, no build step). */

const OWNER_RESUME = `Divya Sharma
MBA, Ajeenkya DY Patil University (ADYPU) - Business Intelligence & Analytics and Financial Modeling for Corporate Decisions

SUMMARY
Analytics-oriented MBA student with a journalism background, which helps in explaining data clearly to business audiences.

EXPERIENCE
Digital Marketing Intern, Shoppers Stop
- Supported digital marketing and social media campaigns and tracked KPI performance

PROJECTS
- Power BI sales dashboard with DAX measures and KPI tracking
- Power BI dashboard on business performance with data visualization and storytelling
- DCF valuation and financial modeling of a listed company in Excel
- Python data pipeline using pandas to clean and prepare data
- CareerAI: generative AI career strategy web app built with React

SKILLS
Power BI, DAX, Advanced Excel, Financial Modeling, DCF, Python, React, Data Visualization, Digital Marketing, Social Media, Communication, Storytelling

CERTIFICATIONS
Five recent certifications in Power BI, analytics and finance`;

const SAMPLE_RESUME = `Aarav Mehta
aarav.mehta@example.com | Pune, India

MBA (Business Analytics & Finance), 2025-2027
B.Com, 2022

SUMMARY
MBA student focused on business intelligence and data-driven decision making. Comfortable turning raw data into dashboards and clear recommendations.

EXPERIENCE
Digital Marketing Intern, Retail Brand (3 months)
- Managed social media content calendar and tracked campaign results in Google Analytics
- Built an Excel dashboard with pivot tables that cut weekly reporting time by 40%
- Ran competitor analysis and market research for a festive campaign

Analytics Intern, Startup (2 months)
- Created Power BI reports with DAX measures for sales performance
- Cleaned data in Python (pandas) for a customer churn study

PROJECTS
- Financial modeling: built a DCF valuation of a listed FMCG company
- Generative AI: used ChatGPT and prompt engineering to automate report summaries

SKILLS
Excel, Power BI, Python, Google Analytics, Digital Marketing, Social Media, Financial Modeling, Communication, Presentation, Problem solving`;

const App = (() => {
  const KEY = "careerai.v1";
  let S = load();
  // First visit: open on the owner's own career dashboard.
  if (!S.profile) {
    S = { resumeText: OWNER_RESUME, status: "Student", goal: "Land my first role", interest: "Analytics",
          profile: Engine.extractProfile(OWNER_RESUME), target: "bi-analyst", done: {}, added: [] };
  }
  const $ = sel => document.querySelector(sel);
  const main = () => $("#main");
  const h = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage unavailable: keep in memory */ }
  }

  /* ---------- derived data ---------- */
  const skills = () => Object.keys(S.profile?.skills || {});
  const ranked = () => Engine.rankRoles(skills());
  const target = () => {
    const r = ranked();
    return r.find(x => x.role.id === S.target) || r[0];
  };
  const plan = () => Engine.actionPlan(target(), S.profile);
  const planProgress = () => {
    const done = Object.values(S.done || {}).filter(Boolean).length;
    return { done, pct: Math.round((done / 16) * 100) };
  };

  /* ---------- routing ---------- */
  const VIEWS = { dashboard, profile, resume, options, strategy, compare, whatif, plan: planView, report };

  function go(view) {
    if (!S.profile) view = "onboard";
    S.view = view; save();
    document.querySelectorAll("#nav a").forEach(a => {
      a.classList.toggle("active", a.dataset.view === view);
      a.classList.toggle("locked", !S.profile);
    });
    $("#sidebar").classList.remove("open");
    main().innerHTML = view === "onboard" ? onboard() : VIEWS[view]();
    bind(view);
    window.scrollTo(0, 0);
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  }

  /* ---------- views ---------- */
  function onboard() {
    return `
      <p class="eyebrow">Welcome to CareerAI</p>
      <h1>Tell us a little. We'll do the rest.</h1>
      <p class="lead">Upload your resume and CareerAI extracts your skills, flags gaps, ranks the roles you fit best and builds a 16-week action plan. Everything runs in your browser — nothing is uploaded anywhere.</p>
      <div class="grid g2">
        <div class="card">
          <h2>Your resume</h2>
          <div class="drop" id="drop">
            <div style="font-size:28px">📄</div>
            <p style="margin:6px 0 2px"><strong>Choose a file</strong> or drag it here</p>
            <p class="small" style="margin:0">PDF, Word (.docx) or .txt</p>
            <input type="file" id="file" accept=".pdf,.docx,.txt" hidden>
          </div>
          <p class="small" id="fileName"></p>
          <div class="or">— or paste the text —</div>
          <textarea id="resumeText" placeholder="Paste your resume text here...">${h(S.resumeText || "")}</textarea>
          <div class="err" id="err"></div>
        </div>
        <div class="card">
          <h2>About you</h2>
          <div class="field"><label for="status">Current status</label>
            <select id="status">
              ${["Student", "Fresher / Recent graduate", "Working professional", "Career switcher"].map(o => `<option ${S.status === o ? "selected" : ""}>${o}</option>`).join("")}
            </select></div>
          <div class="field"><label for="goal">Main career goal</label>
            <select id="goal">
              ${["Land my first role", "Switch to a new field", "Grow in my current field", "Explore my options"].map(o => `<option ${S.goal === o ? "selected" : ""}>${o}</option>`).join("")}
            </select></div>
          <div class="field"><label for="interest">Field you're most drawn to (optional)</label>
            <select id="interest">
              <option value="">No preference</option>
              ${["Analytics", "Finance", "Marketing", "Business"].map(o => `<option ${S.interest === o ? "selected" : ""}>${o}</option>`).join("")}
            </select></div>
          <div class="row" style="margin-top:8px">
            <button class="btn" id="analyse">Analyse my career →</button>
            <button class="btn sec" id="sample">Try a sample resume</button>
          </div>
        </div>
      </div>`;
  }

  function dashboard() {
    const r = ranked(), t = target(), p = S.profile;
    const ready = Engine.readiness(p, r[0]);
    const prog = planProgress();
    const [fit, cls] = Engine.fitLabel(t.score);
    return `
      <p class="eyebrow">Hi ${h((p.name || "there").split(" ")[0])}</p>
      <h1>Your Career Growth Dashboard</h1>
      <p class="lead">${h(Engine.summary(p, t))}</p>
      <div class="grid g3">
        <div class="card hero" style="grid-column: span 2">
          <p class="eyebrow">Recommended direction</p>
          <h2>${h(t.role.title)}</h2>
          <p>${h(t.role.desc)} You already have ${t.matched.length} of ${Object.keys(t.role.core).length} core skills${t.gaps.length ? `; the key gap is <b>${h(t.gaps[0].skill)}</b>` : ""}.</p>
          <div class="row"><button class="btn light" data-go="strategy">See strategy →</button><button class="btn light" data-go="plan">Open action plan</button></div>
        </div>
        <div class="card" style="text-align:center">
          <div class="ring" style="background:conic-gradient(var(--accent) ${prog.pct * 3.6}deg, #edf1f7 0)"><span>${prog.pct}%</span></div>
          <p style="margin:10px 0 0;font-weight:600">Action plan completion</p>
          <p class="small" style="margin:0">${prog.done} of 16 tasks done</p>
        </div>
      </div>
      <div class="grid g4">
        <div class="card stat"><div class="num">${ready}</div><div class="lbl">Career readiness score /100</div></div>
        <div class="card stat"><div class="num">${skills().length}</div><div class="lbl">Skills detected</div></div>
        <div class="card stat"><div class="num">${t.score}%</div><div class="lbl">Fit for target role <span class="badge ${cls}">${fit}</span></div></div>
        <div class="card stat"><div class="num">${t.gaps.length}</div><div class="lbl">Core skill gaps to close</div></div>
      </div>
      <div class="grid g2">
        <div class="card"><h2>Top role matches</h2>${r.slice(0, 4).map((x, i) => roleRow(x, i)).join("")}
          <button class="btn sec" data-go="options" style="margin-top:8px">View all ${r.length} roles</button></div>
        <div class="card"><h2>Close these gaps first</h2>
          ${t.gaps.length ? t.gaps.map(g => `<div style="margin-bottom:12px"><span class="chip gap">${h(g.skill)}</span><p class="small" style="margin:6px 0 0">${h(LEARN[g.skill] || "")}</p></div>`).join("") : `<p>You cover every core skill for this role. Focus on proof: projects, certificates and applications.</p>`}
          <button class="btn sec" data-go="whatif">Run a what-if scenario</button></div>
      </div>`;
  }

  function roleRow(x, i) {
    const [fit, cls] = Engine.fitLabel(x.score);
    return `<div class="role-row" data-role="${x.role.id}">
      <span class="rank">${i + 1}</span>
      <div><h3>${h(x.role.title)}</h3><span class="badge ${cls}">${fit}</span> <span class="small">₹${x.role.salary[0]}-${x.role.salary[1]} LPA · ${x.role.growth} growth</span></div>
      <div class="bar"><i style="width:${x.score}%"></i></div>
      <span class="pct">${x.score}%</span></div>`;
  }

  function profile() {
    const p = S.profile, have = new Set(skills());
    const all = Object.keys(SKILLS).filter(s => !have.has(s));
    return `
      <p class="eyebrow">My profile</p>
      <h1>${h(p.name || "Your profile")}</h1>
      <p class="lead">This is what CareerAI understood from your resume. Fix anything it missed — every page updates instantly.</p>
      <div class="grid g4">
        <div class="card stat"><div class="num" style="font-size:20px">${h(p.stage)}</div><div class="lbl">Career stage</div></div>
        <div class="card stat"><div class="num">${p.years || 0}</div><div class="lbl">Years of experience stated</div></div>
        <div class="card stat"><div class="num">${p.internships}</div><div class="lbl">Internship mentions</div></div>
        <div class="card stat"><div class="num" style="font-size:20px">${h(p.education.join(", ") || "—")}</div><div class="lbl">Education detected</div></div>
      </div>
      <div class="card"><h2>Your skills <span class="small">(click to remove)</span></h2>
        <div class="chips">${[...have].map(s => `<button class="chip have" data-remove="${h(s)}">${h(s)} ✕</button>`).join("") || "<p>No skills detected yet.</p>"}</div></div>
      <div class="card"><h2>Add skills CareerAI missed</h2>
        <div class="chips">${all.map(s => `<button class="chip" data-add="${h(s)}">+ ${h(s)}</button>`).join("")}</div></div>
      <div class="card"><h2>Preferences</h2>
        <div class="grid g3">
          <div><label>Status</label><select id="pStatus">${["Student", "Fresher / Recent graduate", "Working professional", "Career switcher"].map(o => `<option ${S.status === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div><label>Goal</label><select id="pGoal">${["Land my first role", "Switch to a new field", "Grow in my current field", "Explore my options"].map(o => `<option ${S.goal === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
          <div><label>Preferred field</label><select id="pInterest"><option value="">No preference</option>${["Analytics", "Finance", "Marketing", "Business"].map(o => `<option ${S.interest === o ? "selected" : ""}>${o}</option>`).join("")}</select></div>
        </div></div>`;
  }

  function resume() {
    const p = S.profile, text = S.resumeText || "";
    const byCat = {};
    for (const s of skills()) (byCat[SKILLS[s].cat] ||= []).push(s);
    const metrics = (text.match(/\d+\s?%|₹\s?\d|\$\s?\d|\b\d{2,}\b/g) || []).length;
    const verbs = (text.match(/\b(led|built|created|managed|designed|improved|reduced|increased|launched|analy[sz]ed|developed|automated|delivered)\b/gi) || []).length;
    const checks = [
      [p.wordCount >= 250 && p.wordCount <= 900, `Length: ${p.wordCount} words`, "Aim for 300-700 words for one page."],
      [metrics >= 3, `Quantified results: ${metrics} numbers found`, "Add numbers to show impact (%, ₹, time saved, users)."],
      [verbs >= 5, `Action verbs: ${verbs}`, "Start bullets with verbs like built, led, improved, automated."],
      [!!p.email, p.email ? "Contact email present" : "No email found", "Put email and LinkedIn at the top."],
      [skills().length >= 8, `Skill keywords: ${skills().length}`, "Add a skills section listing tools by name (SQL, Power BI...)."],
      [/project/i.test(text), /project/i.test(text) ? "Projects section present" : "No projects section", "Add 2-3 projects with a business outcome."]
    ];
    const score = Math.round(checks.filter(c => c[0]).length / checks.length * 100);
    return `
      <p class="eyebrow">Resume analysis</p>
      <h1>How your resume reads</h1>
      <p class="lead">Skills grouped by area, plus a quick check of what recruiters and applicant-tracking systems look for.</p>
      <div class="grid g2">
        <div class="card"><h2>Skills by area</h2>
          ${Object.entries(byCat).map(([c, list]) => `<p class="small" style="margin:10px 0 6px;font-weight:600">${c}</p><div class="chips">${list.map(s => `<span class="chip have">${h(s)}${p.skills[s] > 1 ? ` ×${p.skills[s]}` : ""}</span>`).join("")}</div>`).join("") || "<p>No skills detected.</p>"}
        </div>
        <div class="card"><h2>Resume strength: ${score}/100</h2>
          <div class="bar" style="margin-bottom:14px"><i style="width:${score}%"></i></div>
          ${checks.map(([ok, label, fix]) => `<div style="margin-bottom:10px"><b>${ok ? "✅" : "⚠️"} ${h(label)}</b>${ok ? "" : `<div class="small">${fix}</div>`}</div>`).join("")}
        </div>
      </div>`;
  }

  function options() {
    let r = ranked();
    return `
      <p class="eyebrow">Career options</p>
      <h1>Roles ranked for you</h1>
      <p class="lead">Match = how many of the role's core skills you have (weighted by importance) plus a bonus for nice-to-have skills. Click a role to build its strategy.</p>
      <div class="card">${r.map((x, i) => roleRow(x, i)).join("")}</div>
      <p class="small">Salary ranges are indicative Indian market figures for 0-3 years of experience.</p>`;
  }

  function strategy() {
    const t = target(), r = ranked();
    const [fit, cls] = Engine.fitLabel(t.score);
    const top3 = t.gaps.slice(0, 3).map(g => g.skill);
    const strengths = t.matched.slice(0, 3);
    return `
      <p class="eyebrow">Strategy builder</p>
      <h1>Your strategy for ${h(t.role.title)}</h1>
      <div class="field" style="max-width:420px"><label>Target role</label>
        <select id="targetSel">${r.map(x => `<option value="${x.role.id}" ${x.role.id === t.role.id ? "selected" : ""}>${h(x.role.title)} — ${x.score}%</option>`).join("")}</select></div>
      <div class="grid g3">
        <div class="card stat"><div class="num">${t.score}%</div><div class="lbl">Current fit <span class="badge ${cls}">${fit}</span></div></div>
        <div class="card stat"><div class="num">₹${t.role.salary[0]}-${t.role.salary[1]}</div><div class="lbl">LPA, entry level (indicative)</div></div>
        <div class="card stat"><div class="num">${t.role.growth}</div><div class="lbl">Demand outlook</div></div>
      </div>
      <div class="grid g2">
        <div class="card"><h2>Skill map</h2>
          <p class="small">Core skills you have</p><div class="chips">${t.matched.map(s => `<span class="chip have">${h(s)}</span>`).join("") || "—"}</div>
          <p class="small" style="margin-top:12px">Core gaps (most important first)</p><div class="chips">${t.gaps.map(g => `<span class="chip gap">${h(g.skill)}</span>`).join("") || "None 🎉"}</div>
          <p class="small" style="margin-top:12px">Nice-to-have to stand out</p><div class="chips">${t.niceGaps.map(s => `<span class="chip nice">${h(s)}</span>`).join("") || "All covered"}</div>
        </div>
        <div class="card"><h2>Your positioning</h2>
          <p>“${h(S.status)} with strengths in ${h(strengths.join(", ") || "core business skills")}, building toward ${h(t.role.title)} by adding ${h(top3.join(", ") || "portfolio proof")}.”</p>
          <h3 style="margin-top:16px">Three moves that matter most</h3>
          <ol>
            <li>${top3[0] ? `Close the <b>${h(top3[0])}</b> gap first — it carries the most weight for this role.` : "Turn your skills into 2 portfolio projects with clear business outcomes."}</li>
            <li>Build one project that uses ${h([...strengths.slice(0, 1), ...top3.slice(0, 1)].join(" + ") || "your top skills")} on a real business question.</li>
            <li>Apply in waves: tailor your CV keywords to ${h(Object.keys(t.role.core).slice(0, 3).join(", "))}.</li>
          </ol>
          <button class="btn" data-go="plan">Open my 16-task plan →</button>
        </div>
      </div>`;
  }

  function compare() {
    const r = ranked();
    const a = r.find(x => x.role.id === S.cmpA) || r[0];
    const b = r.find(x => x.role.id === S.cmpB) || r[1];
    const sel = (id, cur) => `<select id="${id}">${r.map(x => `<option value="${x.role.id}" ${x.role.id === cur.role.id ? "selected" : ""}>${h(x.role.title)}</option>`).join("")}</select>`;
    const rows = [
      ["Your fit", x => `<b>${x.score}%</b> <span class="badge ${Engine.fitLabel(x.score)[1]}">${Engine.fitLabel(x.score)[0]}</span>`],
      ["What you'd do", x => h(x.role.desc)],
      ["Entry salary (indicative)", x => `₹${x.role.salary[0]}-${x.role.salary[1]} LPA`],
      ["Demand outlook", x => h(x.role.growth) + ` · demand index ${x.role.demand}/100`],
      ["Skills you have", x => x.matched.map(s => `<span class="chip have">${h(s)}</span>`).join(" ") || "—"],
      ["Gaps to close", x => x.gaps.map(g => `<span class="chip gap">${h(g.skill)}</span>`).join(" ") || "None"],
      ["Est. time to job-ready", x => `${Math.max(1, x.gaps.reduce((n, g) => n + g.weight, 0)) * 3} weeks`]
    ];
    return `
      <p class="eyebrow">Compare careers</p>
      <h1>Side-by-side comparison</h1>
      <p class="lead">Pick any two roles to see the trade-offs. Time to job-ready assumes ~3 weeks of focused effort per weighted skill gap.</p>
      <div class="card"><div class="grid g2" style="margin-bottom:6px"><div><label>Career A</label>${sel("cmpA", a)}</div><div><label>Career B</label>${sel("cmpB", b)}</div></div>
      <div class="table-wrap"><table><thead><tr><th style="width:22%"></th><th>${h(a.role.title)}</th><th>${h(b.role.title)}</th></tr></thead>
      <tbody>${rows.map(([l, f]) => `<tr><th>${l}</th><td>${f(a)}</td><td>${f(b)}</td></tr>`).join("")}</tbody></table></div>
      <p style="margin-bottom:0"><b>Verdict:</b> ${a.score === b.score ? "Both are equally reachable — choose by interest and salary." : `${h((a.score > b.score ? a : b).role.title)} is closer to your current profile by ${Math.abs(a.score - b.score)} points.`}</p></div>`;
  }

  function whatif() {
    const added = S.added || [];
    const have = new Set(skills());
    const candidates = Object.keys(SKILLS).filter(s => !have.has(s));
    const res = Engine.whatIf(skills(), added).slice(0, 8);
    return `
      <p class="eyebrow">What-if scenarios</p>
      <h1>What if you learned…</h1>
      <p class="lead">Select skills you're considering. CareerAI recalculates every role match so you can see which skill pays off most.</p>
      <div class="card"><h2>Pick skills to add</h2>
        <div class="chips">${candidates.map(s => `<button class="chip ${added.includes(s) ? "sel" : ""}" data-toggle="${h(s)}">${added.includes(s) ? "✓ " : "+ "}${h(s)}</button>`).join("")}</div>
        ${added.length ? `<button class="btn sec" id="clearWI" style="margin-top:12px">Clear selection</button>` : ""}</div>
      <div class="card"><h2>Impact on your matches</h2>
        <div class="table-wrap"><table><thead><tr><th>Role</th><th>Before</th><th>After</th><th>Change</th></tr></thead><tbody>
        ${res.map(x => `<tr><td><b>${h(x.role.title)}</b></td><td style="min-width:110px">${x.before}%<div class="bar"><i style="width:${x.before}%"></i></div></td><td style="min-width:110px">${x.score}%<div class="bar after"><i style="width:${x.score}%"></i></div></td><td class="delta">${x.delta ? "+" + x.delta : "—"}</td></tr>`).join("")}
        </tbody></table></div>
        ${added.length ? "" : `<p class="small">Tip: try <b>${h(bestSingle())}</b> — it lifts your matches the most of any single skill.</p>`}</div>`;
  }

  function bestSingle() {
    const base = ranked().reduce((n, x) => n + x.score, 0);
    let best = "SQL", gain = -1;
    for (const s of Object.keys(SKILLS)) {
      if (skills().includes(s)) continue;
      const g = Engine.rankRoles([...skills(), s]).slice(0, 5).reduce((n, x) => n + x.score, 0) - ranked().slice(0, 5).reduce((n, x) => n + x.score, 0);
      if (g > gain) { gain = g; best = s; }
    }
    return best;
  }

  function planView() {
    const t = target(), prog = planProgress();
    let n = 0;
    return `
      <p class="eyebrow">My action plan</p>
      <h1>16 tasks to ${h(t.role.title)}</h1>
      <p class="lead">A 16-week plan built from your gaps. Tick tasks as you go — progress is saved on this device.</p>
      <div class="card"><div class="row" style="justify-content:space-between"><b>${prog.done} of 16 done</b><span class="small">${prog.pct}%</span></div>
        <div class="bar" style="margin-top:8px"><i style="width:${prog.pct}%"></i></div></div>
      <div class="grid g2">${plan().map(ph => `<div class="card phase"><h3>${h(ph.phase)}</h3>
        ${ph.tasks.map(tk => { const id = "t" + (n++); const d = !!(S.done || {})[id]; return `<label class="task ${d ? "done" : ""}"><input type="checkbox" data-task="${id}" ${d ? "checked" : ""}><div><div class="tt">${h(tk.t)}</div><div class="small">${h(tk.d)}</div></div></label>`; }).join("")}
      </div>`).join("")}</div>`;
  }

  function report() {
    const p = S.profile, r = ranked(), t = target();
    const ready = Engine.readiness(p, r[0]);
    const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    return `
      <div class="row no-print" style="justify-content:flex-end;margin-bottom:12px">
        <button class="btn sec" id="dl">Download report (.html)</button>
        <button class="btn" onclick="window.print()">Save as PDF</button>
      </div>
      <div class="card report" id="reportBody">
        <p class="eyebrow">AI Career Report · ${date}</p>
        <h1>Career strategy for ${h(p.name || "you")}</h1>
        <p class="small">${h(S.status)} · Goal: ${h(S.goal)} · Stage: ${h(p.stage)}</p>

        <h2>1. Summary</h2>
        <p>Your career readiness score is <b>${ready}/100</b>. Based on ${skills().length} skills found in your resume, your strongest direction is <b>${h(r[0].role.title)}</b> (${r[0].score}% match), followed by ${h(r[1].role.title)} (${r[1].score}%) and ${h(r[2].role.title)} (${r[2].score}%).
        ${t.gaps.length ? `The single most valuable skill to add next is <b>${h(t.gaps[0].skill)}</b>.` : "You already cover the core skills for your target; focus on proof and applications."}</p>

        <h2>2. Your skills</h2>
        <p>${h(skills().join(", ") || "None detected")}.</p>

        <h2>3. Top role matches</h2>
        <ol>${r.slice(0, 5).map(x => `<li><b>${h(x.role.title)}</b> — ${x.score}% match, ₹${x.role.salary[0]}-${x.role.salary[1]} LPA, ${h(x.role.growth)} demand. Gaps: ${h(x.gaps.map(g => g.skill).join(", ") || "none")}.</li>`).join("")}</ol>

        <h2>4. Target role: ${h(t.role.title)}</h2>
        <p>${h(t.role.desc)} You have ${h(t.matched.join(", ") || "none of the core skills yet")}. To be job-ready, close: ${h(t.gaps.map(g => g.skill).join(", ") || "no core gaps")}. To stand out, add: ${h(t.niceGaps.join(", ") || "—")}.</p>

        <h2>5. 16-week action plan</h2>
        ${plan().map(ph => `<h3>${h(ph.phase)}</h3><ul>${ph.tasks.map(tk => `<li><b>${h(tk.t)}</b> — ${h(tk.d)}</li>`).join("")}</ul>`).join("")}

        <h2>6. Notes</h2>
        <p class="small">Generated by CareerAI in your browser using rule-based skill matching across ${ROLES.length} roles and ${Object.keys(SKILLS).length} skills. Salary figures are indicative entry-level ranges for India and should be checked against current postings.</p>
      </div>`;
  }

  /* ---------- events ---------- */
  function bind(view) {
    document.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
    document.querySelectorAll("[data-role]").forEach(b => b.onclick = () => { S.target = b.dataset.role; S.done = {}; save(); go("strategy"); });

    if (view === "onboard") {
      const drop = $("#drop"), file = $("#file");
      drop.onclick = () => file.click();
      drop.ondragover = e => { e.preventDefault(); drop.classList.add("over"); };
      drop.ondragleave = () => drop.classList.remove("over");
      drop.ondrop = e => { e.preventDefault(); drop.classList.remove("over"); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };
      file.onchange = () => file.files[0] && readFile(file.files[0]);
      $("#sample").onclick = () => { $("#resumeText").value = SAMPLE_RESUME; $("#fileName").textContent = "Sample resume loaded."; };
      $("#analyse").onclick = analyse;
    }
    if (view === "profile") {
      document.querySelectorAll("[data-remove]").forEach(b => b.onclick = () => { delete S.profile.skills[b.dataset.remove]; save(); go("profile"); });
      document.querySelectorAll("[data-add]").forEach(b => b.onclick = () => { S.profile.skills[b.dataset.add] = 1; save(); go("profile"); });
      $("#pStatus").onchange = e => { S.status = e.target.value; save(); };
      $("#pGoal").onchange = e => { S.goal = e.target.value; save(); };
      $("#pInterest").onchange = e => { S.interest = e.target.value; save(); };
    }
    if (view === "strategy") $("#targetSel").onchange = e => { S.target = e.target.value; S.done = {}; save(); go("strategy"); };
    if (view === "compare") {
      $("#cmpA").onchange = e => { S.cmpA = e.target.value; save(); go("compare"); };
      $("#cmpB").onchange = e => { S.cmpB = e.target.value; save(); go("compare"); };
    }
    if (view === "whatif") {
      document.querySelectorAll("[data-toggle]").forEach(b => b.onclick = () => {
        const s = b.dataset.toggle; S.added = S.added || [];
        S.added = S.added.includes(s) ? S.added.filter(x => x !== s) : [...S.added, s]; save(); go("whatif");
      });
      const c = $("#clearWI"); if (c) c.onclick = () => { S.added = []; save(); go("whatif"); };
    }
    if (view === "plan") document.querySelectorAll("[data-task]").forEach(cb => cb.onchange = () => {
      S.done = S.done || {}; S.done[cb.dataset.task] = cb.checked; save();
      cb.closest(".task").classList.toggle("done", cb.checked);
      const p = planProgress();
      main().querySelector(".card b").textContent = `${p.done} of 16 done`;
      main().querySelector(".card .small").textContent = p.pct + "%";
      main().querySelector(".card .bar i").style.width = p.pct + "%";
    });
    if (view === "report") $("#dl").onclick = downloadReport;
  }

  async function readFile(f) {
    const err = $("#err"); err.textContent = "";
    $("#fileName").textContent = "Reading " + f.name + "…";
    try {
      let text = "";
      const ext = f.name.split(".").pop().toLowerCase();
      if (ext === "pdf") {
        if (!window.pdfjsLib) throw new Error("PDF reader didn't load — paste your resume text instead.");
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const c = await (await pdf.getPage(i)).getTextContent();
          text += c.items.map(it => it.str + (it.hasEOL ? "\n" : " ")).join("") + "\n";
        }
      } else if (ext === "docx") {
        if (!window.mammoth) throw new Error("Word reader didn't load — paste your resume text instead.");
        text = (await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() })).value;
      } else {
        text = await f.text();
      }
      if (text.trim().length < 50) throw new Error("Couldn't read much text from that file (it may be a scanned image). Paste the text instead.");
      $("#resumeText").value = text.trim();
      $("#fileName").textContent = "✓ Loaded " + f.name;
    } catch (e) {
      $("#fileName").textContent = "";
      err.textContent = e.message;
    }
  }

  function analyse() {
    const text = $("#resumeText").value.trim();
    if (text.length < 80) { $("#err").textContent = "Please upload or paste your resume (at least a few lines)."; return; }
    S.resumeText = text;
    S.status = $("#status").value; S.goal = $("#goal").value; S.interest = $("#interest").value;
    S.profile = Engine.extractProfile(text);
    // Default target: best match, nudged toward the preferred field when close.
    const r = Engine.rankRoles(Object.keys(S.profile.skills));
    const pref = S.interest && r.find(x => x.role.family === S.interest && x.score >= r[0].score - 10);
    S.target = (pref || r[0]).role.id;
    S.done = {}; S.added = [];
    save();
    go("dashboard");
  }

  function downloadReport() {
    const css = [...document.styleSheets].map(s => { try { return [...s.cssRules].map(r => r.cssText).join("\n"); } catch { return ""; } }).join("\n");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>CareerAI Report</title><style>${css} body{padding:30px}</style></head><body>${$("#reportBody").outerHTML}</body></html>`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = "CareerAI-Report.html";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function init() {
    document.querySelectorAll("#nav a").forEach(a => a.onclick = () => go(a.dataset.view));
    $("#menuBtn").onclick = () => $("#sidebar").classList.toggle("open");
    $("#restart").onclick = () => { if (confirm("Clear your analysis and start over?")) { S = {}; save(); go("onboard"); } };
    const fromHash = location.hash.slice(1);
    go(VIEWS[fromHash] ? fromHash : (S.view && VIEWS[S.view] ? S.view : "dashboard"));
  }

  return { init };
})();

App.init();
