/* CareerAI analysis engine — runs fully in the browser, no server or API key. */

const Engine = (() => {
  const esc = s => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

  // Pre-compile one regex per skill from its aliases.
  const SKILL_RX = Object.fromEntries(
    Object.entries(SKILLS).map(([name, s]) => [
      name,
      new RegExp("(?<![a-z0-9])(" + s.aliases.map(esc).join("|") + ")(?![a-z0-9])", "gi")
    ])
  );

  function extractSkills(text) {
    const found = {};
    for (const [name, rx] of Object.entries(SKILL_RX)) {
      const hits = text.match(rx);
      if (hits) found[name] = hits.length;
    }
    return found; // { skillName: mentionCount }
  }

  function extractProfile(text) {
    const t = " " + text.replace(/\s+/g, " ") + " ";
    const lower = t.toLowerCase();

    // Name: first short line that looks like a name.
    let name = "";
    for (const line of text.split(/\n/).map(l => l.trim()).filter(Boolean).slice(0, 5)) {
      if (/^[A-Za-z][A-Za-z.' -]{2,40}$/.test(line) && line.split(" ").length <= 4 && !/resume|curriculum|cv/i.test(line)) { name = line; break; }
    }

    const email = (t.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0];

    // Experience: explicit "x years", else count internships.
    let years = 0;
    const ym = [...lower.matchAll(/(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/g)].map(m => parseFloat(m[1])).filter(n => n < 40);
    if (ym.length) years = Math.max(...ym);
    const internships = (lower.match(/intern(ship)?/g) || []).length;

    const edu = [];
    [["MBA", /\bmba\b|master of business/], ["PGDM", /\bpgdm\b/], ["B.Tech / B.E.", /b\.?\s?tech|b\.?e\.?\s|bachelor of engineering/],
     ["B.Com", /b\.?\s?com\b/], ["BBA", /\bbba\b/], ["B.Sc", /b\.?\s?sc\b/], ["BCA", /\bbca\b/], ["M.Com", /m\.?\s?com\b/],
     ["CA / CFA", /\bcfa\b|chartered accountant/]].forEach(([label, rx]) => { if (rx.test(lower)) edu.push(label); });

    let stage = "Student / Fresher";
    if (years >= 5) stage = "Experienced (5+ yrs)";
    else if (years >= 2) stage = "Early career (2-5 yrs)";
    else if (years >= 1 || internships >= 2) stage = "Entry level (0-2 yrs)";

    return { name, email, years, internships, education: edu, stage, skills: extractSkills(text), wordCount: text.trim().split(/\s+/).length };
  }

  function scoreRole(role, skillSet) {
    const coreTotal = Object.values(role.core).reduce((a, b) => a + b, 0);
    let coreHave = 0;
    const matched = [], gaps = [];
    for (const [sk, w] of Object.entries(role.core)) {
      if (skillSet.has(sk)) { coreHave += w; matched.push(sk); } else gaps.push({ skill: sk, weight: w });
    }
    const niceHave = role.nice.filter(s => skillSet.has(s));
    const score = Math.round((coreHave / coreTotal) * 80 + (niceHave.length / role.nice.length) * 20);
    gaps.sort((a, b) => b.weight - a.weight);
    return { role, score, matched, niceHave, gaps, niceGaps: role.nice.filter(s => !skillSet.has(s)) };
  }

  function rankRoles(skillNames) {
    const set = new Set(skillNames);
    return ROLES.map(r => scoreRole(r, set)).sort((a, b) => b.score - a.score || b.role.demand - a.role.demand);
  }

  function fitLabel(score) {
    if (score >= 75) return ["Strong fit", "good"];
    if (score >= 55) return ["Good fit", "ok"];
    if (score >= 35) return ["Stretch", "warn"];
    return ["Long shot", "bad"];
  }

  function readiness(profile, top) {
    // Blend of top-role fit, breadth of skills and experience.
    const breadth = Math.min(Object.keys(profile.skills).length / 15, 1) * 100;
    const exp = Math.min((profile.years + profile.internships * 0.4) / 3, 1) * 100;
    return Math.round(top.score * 0.6 + breadth * 0.25 + exp * 0.15);
  }

  function whatIf(currentSkills, added) {
    const before = rankRoles(currentSkills);
    const after = rankRoles([...new Set([...currentSkills, ...added])]);
    const bMap = Object.fromEntries(before.map(r => [r.role.id, r.score]));
    return after.map(r => ({ ...r, before: bMap[r.role.id], delta: r.score - bMap[r.role.id] }));
  }

  /* 16 tasks across four 4-week phases, built from the target role's gaps. */
  function actionPlan(target, profile) {
    const gaps = target.gaps.map(g => g.skill);
    const nice = target.niceGaps;
    const learn = [...gaps, ...nice].slice(0, 6);
    while (learn.length < 6) learn.push(target.matched[learn.length % Math.max(target.matched.length, 1)] || "Communication");
    const role = target.role.title;
    const tip = s => LEARN[s] || ("Strengthen " + s + " through a short course and one applied exercise.");

    return [
      { phase: "Weeks 1-4 · Foundations", tasks: [
        { t: "Learn " + learn[0], d: tip(learn[0]) },
        { t: "Learn " + learn[1], d: tip(learn[1]) },
        { t: "Rewrite your CV for " + role, d: "Lead with impact numbers and mirror the keywords: " + Object.keys(target.role.core).join(", ") + "." },
        { t: "Optimise your LinkedIn profile", d: "Headline = target role + top 3 skills; add a featured project and turn on Open to Work." }
      ]},
      { phase: "Weeks 5-8 · Build proof", tasks: [
        { t: "Learn " + learn[2], d: tip(learn[2]) },
        { t: "Portfolio project #1", d: "Pick a public dataset relevant to " + target.role.family.toLowerCase() + " and solve one business question end to end." },
        { t: "Publish your work", d: "Put the project on GitHub and write a short LinkedIn post explaining the insight." },
        { t: "Learn " + learn[3], d: tip(learn[3]) }
      ]},
      { phase: "Weeks 9-12 · Credentials & network", tasks: [
        { t: "Earn one recognised certificate", d: "Choose the certificate most cited in " + role + " job posts and finish it." },
        { t: "Portfolio project #2", d: "Build a second project that uses " + learn[4] + " and shows a decision it supports." },
        { t: "Connect with 20 people in the role", d: "Send short, specific notes to alumni and practitioners; ask one question each." },
        { t: "Two informational interviews", d: "Ask what a typical week looks like and which skills they would learn first." }
      ]},
      { phase: "Weeks 13-16 · Apply & convert", tasks: [
        { t: "Shortlist 25 target companies", d: "Mix product firms, consulting, and analytics teams in large Indian companies." },
        { t: "Apply to 5 roles per week", d: "Tailor the top third of your CV for each posting; track everything in one sheet." },
        { t: "Interview practice", d: "Prepare STAR stories for 6 situations and a 2-minute walkthrough of each project." },
        { t: "Technical round prep: " + learn[5], d: tip(learn[5]) }
      ]}
    ];
  }

  function summary(p, t) {
    const sk = Object.keys(p.skills);
    const tools = ["Power BI", "Excel", "Python", "SQL", "Tableau", "Financial Modeling", "Google Analytics"].filter(x => sk.includes(x));
    const strong = t.matched.length >= Object.keys(t.role.core).length - 1;
    let s = `Your profile shows ${sk.length} relevant skills` + (tools.length ? `, with hands-on ${tools.slice(0, 4).join(", ")}` : "") + ". ";
    s += `It lines up ${strong ? "well" : "partly"} with ${t.role.title} (${t.score}% match)`;
    s += t.gaps.length ? `; the main gap to close is ${t.gaps.map(g => g.skill).slice(0, 2).join(" and ")}.` : " and covers every core skill.";
    if (p.years < 1) s += " Adding quantified results and more work experience will strengthen applications.";
    return s;
  }

  return { summary, extractProfile, rankRoles, scoreRole, fitLabel, readiness, whatIf, actionPlan };
})();
