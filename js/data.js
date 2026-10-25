/* CareerAI knowledge base: skills, aliases and career roles.
   Salary figures are indicative Indian market ranges (LPA = lakh per annum)
   for 0-3 years of experience and are meant for planning only. */

const SKILLS = {
  // Analytics & BI
  "SQL":               { cat: "Analytics", aliases: ["sql", "mysql", "postgresql", "postgres", "t-sql", "pl/sql", "sql server", "bigquery"] },
  "Excel":             { cat: "Analytics", aliases: ["excel", "ms excel", "advanced excel", "vlookup", "xlookup", "pivot table", "pivot tables", "spreadsheets"] },
  "Power BI":          { cat: "Analytics", aliases: ["power bi", "powerbi", "dax", "power query"] },
  "Tableau":           { cat: "Analytics", aliases: ["tableau"] },
  "Python":            { cat: "Analytics", aliases: ["python", "pandas", "numpy", "matplotlib", "seaborn", "jupyter"] },
  "R":                 { cat: "Analytics", aliases: ["r programming", "rstudio", "tidyverse", "ggplot"] },
  "Statistics":        { cat: "Analytics", aliases: ["statistics", "statistical", "hypothesis testing", "regression", "a/b testing", "ab testing", "anova"] },
  "Machine Learning":  { cat: "Analytics", aliases: ["machine learning", "scikit-learn", "sklearn", "predictive model", "classification", "clustering"] },
  "Data Visualization":{ cat: "Analytics", aliases: ["data visualization", "data visualisation", "dashboards", "dashboard", "visualization", "visualisation"] },
  "ETL / Data Pipelines": { cat: "Analytics", aliases: ["etl", "data pipeline", "data pipelines", "airflow", "data warehouse", "data warehousing"] },
  "Google Analytics":  { cat: "Marketing", aliases: ["google analytics", "ga4", "universal analytics"] },

  // Finance
  "Financial Modeling":{ cat: "Finance", aliases: ["financial modeling", "financial modelling", "dcf", "three statement", "3-statement", "lbo"] },
  "Valuation":         { cat: "Finance", aliases: ["valuation", "comparable companies", "comps", "precedent transactions"] },
  "Budgeting & Forecasting": { cat: "Finance", aliases: ["budgeting", "forecasting", "fp&a", "variance analysis", "budget"] },
  "Accounting":        { cat: "Finance", aliases: ["accounting", "ifrs", "gaap", "ind as", "tally", "bookkeeping"] },
  "Financial Analysis":{ cat: "Finance", aliases: ["financial analysis", "ratio analysis", "financial statements", "balance sheet", "p&l", "cash flow"] },

  // Marketing
  "Digital Marketing": { cat: "Marketing", aliases: ["digital marketing", "online marketing", "performance marketing"] },
  "SEO":               { cat: "Marketing", aliases: ["seo", "search engine optimization", "search engine optimisation"] },
  "SEM / Paid Ads":    { cat: "Marketing", aliases: ["sem", "google ads", "meta ads", "facebook ads", "ppc", "paid media", "adwords"] },
  "Social Media":      { cat: "Marketing", aliases: ["social media", "instagram", "linkedin marketing", "content calendar", "smm"] },
  "Content Marketing": { cat: "Marketing", aliases: ["content marketing", "copywriting", "content strategy", "content creation", "blog"] },
  "Market Research":   { cat: "Marketing", aliases: ["market research", "consumer research", "survey", "competitor analysis", "competitive analysis"] },
  "CRM":               { cat: "Marketing", aliases: ["crm", "salesforce", "hubspot", "zoho"] },

  // Business & management
  "Business Analysis": { cat: "Business", aliases: ["business analysis", "business analyst", "requirements gathering", "brd", "user stories"] },
  "Project Management":{ cat: "Business", aliases: ["project management", "pmp", "jira", "scrum", "agile", "kanban"] },
  "Product Management":{ cat: "Business", aliases: ["product management", "product roadmap", "prd", "product manager"] },
  "Strategy":          { cat: "Business", aliases: ["strategy", "strategic", "swot", "porter", "pestel", "business model"] },
  "Stakeholder Management": { cat: "Business", aliases: ["stakeholder", "stakeholders", "client management", "client facing"] },
  "Process Improvement": { cat: "Business", aliases: ["process improvement", "lean", "six sigma", "process mapping", "bpmn"] },

  // Tech
  "JavaScript / React":{ cat: "Tech", aliases: ["javascript", "react", "reactjs", "react.js", "node", "typescript"] },
  "Cloud":             { cat: "Tech", aliases: ["aws", "azure", "gcp", "google cloud", "cloud"] },
  "Generative AI":     { cat: "Tech", aliases: ["generative ai", "genai", "llm", "chatgpt", "prompt engineering", "openai", "claude"] },

  // Soft skills
  "Communication":     { cat: "Soft", aliases: ["communication", "presentation", "public speaking", "storytelling"] },
  "Leadership":        { cat: "Soft", aliases: ["leadership", "led a team", "team lead", "managed a team", "mentored"] },
  "Problem Solving":   { cat: "Soft", aliases: ["problem solving", "problem-solving", "analytical thinking", "critical thinking"] }
};

/* Each role: core skills carry weights (1-3); nice skills add a bonus. */
const ROLES = [
  {
    id: "bi-analyst", title: "Business Intelligence (BI) Analyst / Power BI Developer", family: "Analytics",
    desc: "Turns company data into dashboards and reports that leaders use to make decisions.",
    core: { "SQL": 3, "Power BI": 3, "Excel": 2, "Data Visualization": 2, "Statistics": 1 },
    nice: ["Tableau", "Python", "ETL / Data Pipelines", "Communication", "Business Analysis"],
    salary: [5, 10], growth: "High", demand: 92
  },
  {
    id: "powerbi-dev", title: "Power BI Developer", family: "Analytics",
    desc: "Builds data models, DAX measures and enterprise Power BI reports.",
    core: { "Power BI": 3, "SQL": 3, "ETL / Data Pipelines": 2, "Excel": 1, "Data Visualization": 2 },
    nice: ["Cloud", "Python", "Statistics"],
    salary: [5, 11], growth: "High", demand: 88
  },
  {
    id: "data-analyst", title: "Data Analyst", family: "Analytics",
    desc: "Cleans, analyses and explains data to answer business questions.",
    core: { "SQL": 3, "Excel": 2, "Python": 2, "Statistics": 2, "Data Visualization": 2 },
    nice: ["Power BI", "Tableau", "Machine Learning", "Communication"],
    salary: [4, 9], growth: "High", demand: 95
  },
  {
    id: "business-analyst", title: "Business Analyst", family: "Business",
    desc: "Bridges business teams and tech teams by defining requirements and improving processes.",
    core: { "Business Analysis": 3, "Excel": 2, "SQL": 2, "Stakeholder Management": 2, "Communication": 2 },
    nice: ["Power BI", "Process Improvement", "Project Management", "Data Visualization"],
    salary: [5, 10], growth: "High", demand: 90
  },
  {
    id: "fin-analyst", title: "Financial Analyst", family: "Finance",
    desc: "Analyses financial performance, builds models and supports investment decisions.",
    core: { "Financial Modeling": 3, "Excel": 3, "Financial Analysis": 3, "Accounting": 1, "Valuation": 2 },
    nice: ["Power BI", "SQL", "Budgeting & Forecasting", "Communication"],
    salary: [5, 11], growth: "Medium", demand: 80
  },
  {
    id: "fpa-analyst", title: "FP&A Analyst", family: "Finance",
    desc: "Owns budgets, forecasts and variance analysis for business units.",
    core: { "Budgeting & Forecasting": 3, "Excel": 3, "Financial Modeling": 2, "Financial Analysis": 2 },
    nice: ["Power BI", "SQL", "Accounting", "Stakeholder Management"],
    salary: [6, 12], growth: "Medium", demand: 76
  },
  {
    id: "marketing-analyst", title: "Marketing Analyst", family: "Marketing",
    desc: "Measures campaign performance and finds which channels drive growth.",
    core: { "Google Analytics": 3, "Excel": 2, "Digital Marketing": 2, "SQL": 2, "Data Visualization": 2 },
    nice: ["Power BI", "SEM / Paid Ads", "Statistics", "Market Research"],
    salary: [4, 9], growth: "High", demand: 84
  },
  {
    id: "digital-marketing-mgr", title: "Digital Marketing Executive / Manager", family: "Marketing",
    desc: "Plans and runs SEO, paid and social campaigns to grow a brand online.",
    core: { "Digital Marketing": 3, "SEO": 2, "SEM / Paid Ads": 2, "Social Media": 2, "Google Analytics": 2 },
    nice: ["Content Marketing", "CRM", "Market Research", "Communication"],
    salary: [4, 9], growth: "Medium", demand: 82
  },
  {
    id: "product-analyst", title: "Product Analyst", family: "Business",
    desc: "Uses product data and experiments to shape what gets built next.",
    core: { "SQL": 3, "Statistics": 2, "Product Management": 2, "Data Visualization": 2, "Excel": 1 },
    nice: ["Python", "Google Analytics", "Communication", "Business Analysis"],
    salary: [7, 14], growth: "High", demand: 78
  },
  {
    id: "mgmt-consultant", title: "Management Consultant (Analyst)", family: "Business",
    desc: "Solves strategic problems for clients using research, analysis and structured thinking.",
    core: { "Strategy": 3, "Excel": 2, "Communication": 3, "Problem Solving": 2, "Market Research": 2 },
    nice: ["Financial Modeling", "Stakeholder Management", "Data Visualization", "Leadership"],
    salary: [8, 16], growth: "Medium", demand: 70
  },
  {
    id: "project-manager", title: "Project / Program Coordinator", family: "Business",
    desc: "Keeps projects on time and on budget by coordinating people and plans.",
    core: { "Project Management": 3, "Stakeholder Management": 2, "Communication": 2, "Excel": 1, "Leadership": 2 },
    nice: ["Process Improvement", "Business Analysis", "Problem Solving"],
    salary: [5, 10], growth: "Medium", demand: 74
  },
  {
    id: "ai-business-analyst", title: "AI / Analytics Solutions Analyst", family: "Analytics",
    desc: "Applies GenAI and analytics tools to automate and improve business workflows.",
    core: { "Generative AI": 3, "Python": 2, "Business Analysis": 2, "SQL": 2, "Data Visualization": 1 },
    nice: ["Machine Learning", "Cloud", "Power BI", "Communication"],
    salary: [7, 15], growth: "Very High", demand: 86
  }
];

/* Learning suggestions per skill (free or low-cost, widely available). */
const LEARN = {
  "SQL": "Practise joins, GROUP BY and window functions on a free platform (e.g. SQLBolt, HackerRank SQL track) and finish 30 problems.",
  "Power BI": "Complete Microsoft Learn's free Power BI path (PL-300 prep) and publish one dashboard.",
  "Excel": "Master XLOOKUP, pivot tables, Power Query and one dynamic dashboard.",
  "Python": "Learn pandas for cleaning and analysis; complete one end-to-end notebook on a public dataset.",
  "Statistics": "Cover descriptive stats, hypothesis testing and regression (Khan Academy is free).",
  "Tableau": "Build two vizzes on Tableau Public using the free desktop edition.",
  "Data Visualization": "Recreate three business dashboards and write a one-line insight for each chart.",
  "ETL / Data Pipelines": "Learn Power Query and basic data modelling (star schema); automate one refreshable dataset.",
  "Machine Learning": "Take an intro scikit-learn course and build one prediction model with a clear business use.",
  "Google Analytics": "Earn the free Google Analytics certification via Skillshop.",
  "Financial Modeling": "Build a 3-statement model and a DCF for a listed Indian company.",
  "Valuation": "Value one company using DCF and comparable multiples; write a one-page memo.",
  "Budgeting & Forecasting": "Create a monthly budget vs actual model with variance commentary.",
  "Accounting": "Revise the three financial statements and how they link.",
  "Financial Analysis": "Do a ratio analysis of two competitors from their annual reports.",
  "Digital Marketing": "Complete Google's free Digital Marketing fundamentals course.",
  "SEO": "Audit one website's SEO and write ten prioritised fixes.",
  "SEM / Paid Ads": "Earn the free Google Ads Search certification.",
  "Social Media": "Plan a 30-day content calendar and measure engagement for one page.",
  "Content Marketing": "Publish three LinkedIn articles on your specialisation.",
  "Market Research": "Run a short survey (Google Forms) and present findings in a one-page brief.",
  "CRM": "Explore HubSpot's free CRM and its free certification.",
  "Business Analysis": "Write a BRD and user stories for a real process (e.g. college admissions).",
  "Project Management": "Learn Agile/Scrum basics and run one project on a free Jira/Trello board.",
  "Product Management": "Write a one-page PRD for a feature in an app you use daily.",
  "Strategy": "Apply SWOT, Porter's Five Forces and PESTEL to one industry case.",
  "Stakeholder Management": "Lead one cross-team activity and document how you aligned stakeholders.",
  "Process Improvement": "Map one process end-to-end and propose a lean improvement.",
  "JavaScript / React": "Build and deploy one small React app on GitHub Pages.",
  "Cloud": "Complete a free cloud fundamentals course (AWS Cloud Practitioner Essentials or Azure AZ-900 path).",
  "Generative AI": "Build one GenAI workflow (prompted report, chatbot or automation) and document the business impact.",
  "Communication": "Present one analysis in five slides and record a three-minute walkthrough.",
  "Leadership": "Take ownership of a club, event or team deliverable this term.",
  "Problem Solving": "Practise 10 case interview problems using a structured framework."
};
