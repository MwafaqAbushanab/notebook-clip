// CLIP Knowledge Base - Extracted from CLIP documentation
export const clipKnowledge = {
  overview: {
    name: "CLIP - Credit Line Increase Program",
    organization: "Trellance / Rise Analytics",
    since: "2015-2016",
    turnaround: "2-3 business days",
    approvalRate: "60-70% of eligible members",
    creditBureau: "TransUnion (419 fields)",
    technology: {
      current: "Alteryx workflows",
      future: "Python/dbt migration"
    }
  },

  products: [
    {
      name: "Credit Cards",
      description: "Most common product for CLI analysis",
      requirements: "Minimum 1 year since origination",
      maxLimit: "$20,000",
      riskLevel: "Standard"
    },
    {
      name: "Unsecured Lines of Credit",
      description: "Variable terms LOC products",
      requirements: "Same eligibility criteria apply",
      maxLimit: "Subject to aggregate limits",
      riskLevel: "Higher"
    },
    {
      name: "HELOCs",
      description: "Home Equity Lines of Credit",
      requirements: "Requires property valuation",
      maxLimit: "Different parameters per CU",
      riskLevel: "Collateralized"
    }
  ],

  parameters: {
    eligibility: [
      { name: "Minimum Income", value: "$20,000", description: "Annual gross income floor" },
      { name: "Minimum FICO Score", value: "650", description: "Credit bureau score threshold" },
      { name: "Maximum DTI", value: "50%", description: "Debt-to-Income ceiling" },
      { name: "Minimum Age", value: "21 years", description: "Member age requirement" },
      { name: "Maximum Credit Limit", value: "$20,000", description: "Per-product cap" },
      { name: "Card Origination", value: "> 1 year", description: "Time since account opened" },
      { name: "FICO Drop Threshold", value: "-50 points", description: "Max decline from origination" },
      { name: "Minimum Payment", value: "3%", description: "Min payment requirement" },
      { name: "Days Past Due", value: "0", description: "Must be current" }
    ],
    increaseTiers: [
      { currentLimit: "< $1,000", increaseTo: "$1,500", amount: "+$500 to +$1,500" },
      { currentLimit: "$1,000 - $2,000", increaseTo: "$3,000", amount: "+$1,000 to +$2,000" },
      { currentLimit: "$2,000 - $3,000", increaseTo: "$5,000", amount: "+$2,000 to +$3,000" },
      { currentLimit: "$3,000 - $5,000", increaseTo: "$7,500", amount: "+$2,500 to +$4,500" },
      { currentLimit: "$5,000 - $7,500", increaseTo: "$10,000", amount: "+$2,500 to +$5,000" },
      { currentLimit: "$7,500 - $10,000", increaseTo: "$15,000", amount: "+$5,000 to +$7,500" },
      { currentLimit: "$10,000 - $15,000", increaseTo: "$20,000", amount: "+$5,000 to +$10,000" }
    ],
    aggregateLimits: [
      { scoreRange: "776 - 850", tier: "Excellent", maxAggregate: "$25,000" },
      { scoreRange: "726 - 775", tier: "Good", maxAggregate: "$18,000" },
      { scoreRange: "650 - 725", tier: "Fair", maxAggregate: "$13,000" },
      { scoreRange: "Below 650", tier: "Below Threshold", maxAggregate: "Not Eligible" }
    ]
  },

  exclusions: [
    "Bankruptcy (active or within lookback period)",
    "Charged-off accounts",
    "Active collections",
    "30/60/90 day delinquencies",
    "Fraud alerts on credit file",
    "Deceased indicator",
    "Credit freeze",
    "Overlimit on existing products",
    "Recent CLI (within 6-12 months)"
  ],

  processWorkflow: [
    {
      phase: "Phase 1: Data Preparation",
      steps: [
        { number: 1, title: "Input File Setup", description: "Configure input tool to point to credit union's source data" },
        { number: 2, title: "Update Account Age Formula", description: "Calculate credit limit maximum based on account age (Formula 64)" },
        { number: 3, title: "Look Up CORP ID", description: "Find credit union's CORP ID for TransUnion batch submission" },
        { number: 4, title: "Copy Completed Workflow", description: "Save workflow as new version in client's Workflow folder" },
        { number: 5, title: "Run Initial Workflow", description: "Execute workflow to generate output file" },
        { number: 6, title: "Prepare TransUnion Submission", description: "Verify file format matches TU requirements" }
      ]
    },
    {
      phase: "Phase 2: TransUnion Integration",
      steps: [
        { number: 7, title: "Upload to TransUnion DEG", description: "Submit prepared file for batch processing" },
        { number: 8, title: "Download TransUnion Response", description: "Download response files from DEG" },
        { number: 9, title: "Handle Consumer Statements", description: "Special handling per regulations if received" },
        { number: 10, title: "Copy Files to Processing", description: "Copy all response files to FilesToProcess directory" },
        { number: 11, title: "Open CLIP Step 2 Workflow", description: "Merges TU data with original member data" },
        { number: 12, title: "Configure Input Files", description: "Update input tool to point to downloaded TU files" },
        { number: 13, title: "Verify Inputs", description: "Review sample records to ensure data alignment" },
        { number: 14, title: "Run CLIP Step 2", description: "Execute and monitor for matching errors" }
      ]
    },
    {
      phase: "Phase 3: Parameter Configuration",
      steps: [
        { number: 15, title: "Configure Credit Metrics", description: "Handle credit score ranges (Formula 67)" },
        { number: 16, title: "Apply Exclusion Criteria", description: "Contains exclusion logic (Formula 72)" },
        { number: 17, title: "Configure Income & Payment", description: "Calculate monthly income and payments (Formula 73)" },
        { number: 18, title: "Apply CLI Rules", description: "Nested IF statements for limit increases (Formula 74)" },
        { number: 19, title: "Configure Supplemental Fields", description: "Add optional data fields (Select 260)" },
        { number: 20, title: "Review Summary Statistics", description: "Verify no zeros in key count fields" },
        { number: 21, title: "Generate Output Files", description: "Run final output generation" }
      ]
    },
    {
      phase: "Phase 4: Aggregate Limits",
      steps: [
        { number: 22, title: "Run PC Aggregate Limits", description: "Handle multi-product members (Sort 30)" },
        { number: 23, title: "Configure Credit Limit Buckets", description: "Adjust per client's aggregate limit tiers (Formula 47)" }
      ]
    }
  ],

  macros: [
    { name: "data_extraction_macro()", purpose: "Pull all required data from Snowflake for a specific credit union", outputs: "DataFrame with member/account data, Transaction history, Credit scores" },
    { name: "eligibility_filter_macro()", purpose: "Apply configurable business rules to filter eligible accounts", outputs: "Filtered DataFrame (eligible members), Rejection log with reasons" },
    { name: "utilization_calculation_macro()", purpose: "Calculate current and historical utilization patterns", outputs: "Utilization metrics per account, Trend indicators" },
    { name: "risk_assessment_macro()", purpose: "Calculate composite risk scores for credit line increases", outputs: "Risk score (0-100), Risk band, Contributing factors" },
    { name: "recommendation_engine_macro()", purpose: "Determine optimal credit line increase amounts", outputs: "Recommended new limit, Increase amount, Confidence score" },
    { name: "compliance_check_macro()", purpose: "Validate recommendations against regulatory and policy rules", outputs: "Compliance pass/fail flag, Documentation list, Approval routing" },
    { name: "output_generator_macro()", purpose: "Create standardized output files in multiple formats", outputs: "CSV/Excel files, PDF reports, Summary dashboards" },
    { name: "audit_logging_macro()", purpose: "Track all processing steps for compliance and debugging", outputs: "Detailed audit trail, Performance metrics, Error logs" }
  ],

  filePaths: [
    { purpose: "Run CLIP Workflow", path: "S:\\Prod\\Workflows\\Tools\\Run CLIP.yxwz" },
    { purpose: "CLIP Step 2", path: "S:\\Prod\\Workflows\\Chained Apps\\Clip Step2.yxwz" },
    { purpose: "Direct Source Files", path: "S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\" },
    { purpose: "Files To Process", path: "S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\FilesToProcess" },
    { purpose: "TU Received Files", path: "S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Transunion Received" },
    { purpose: "CORP ID Reference", path: "S:\\Prod\\Inputs\\Reference and Control Tables\\CU Master for Providers.xlsx" },
    { purpose: "Box Client Sharing", path: "https://trellance.app.box.com/folder/305984505328" }
  ],

  kpis: [
    { name: "Total Eligible Accounts", description: "Members meeting all eligibility criteria", target: "Maximize" },
    { name: "Total Approved Accounts", description: "Members receiving CLI approval", target: "60-70% of eligible" },
    { name: "CLI Approval Rate", description: "Approved / Eligible", target: "65-75%" },
    { name: "Avg Credit Line Increase", description: "Average dollar increase per approval", target: "$2,500+" },
    { name: "Incremental Credit Exposure", description: "Total new credit extended", target: "Track monthly" },
    { name: "Processing Accuracy", description: "Error rate in analysis", target: "<1%" }
  ],

  transunionContacts: [
    { name: "Jen Werkley", email: "jen.werkley@transunion.com", role: "Primary Contact" },
    { name: "Abbie Jeremiah", email: "Abbie.Jeremiah@transunion.com", role: "Secondary Contact" }
  ],

  glossary: [
    { term: "CLI", definition: "Credit Line Increase" },
    { term: "CLIP", definition: "Credit Line Increase Program" },
    { term: "CU", definition: "Credit Union" },
    { term: "DEG", definition: "Data Exchange Gateway (TransUnion file transfer)" },
    { term: "DTI", definition: "Debt-to-Income ratio" },
    { term: "FICO", definition: "Fair Isaac Corporation credit score" },
    { term: "HELOC", definition: "Home Equity Line of Credit" },
    { term: "LOC", definition: "Line of Credit" },
    { term: "MDPA", definition: "Member Data Portal Analytics" },
    { term: "PII", definition: "Personally Identifiable Information" },
    { term: "SLA", definition: "Service Level Agreement" },
    { term: "TU", definition: "TransUnion (credit bureau)" },
    { term: "dbt", definition: "Data build tool - open source data transformation framework" },
    { term: "ETL", definition: "Extract, Transform, Load - data processing pattern" },
    { term: "POC", definition: "Proof of Concept" },
    { term: "CI/CD", definition: "Continuous Integration / Continuous Deployment" }
  ],

  automationStrategy: {
    overview: "CLIP Alteryx Automation POC explores three approaches to automate and modernize CLIP processing",
    currentState: {
      manualTouchpoints: "8-12",
      turnaround: "2-3 days",
      throughput: "5-10 CUs/week",
      errorRate: "2-5%"
    },
    futureState: {
      manualTouchpoints: "2-3",
      turnaround: "4-8 hours",
      throughput: "20-30 CUs/week",
      errorRate: "<0.5%"
    },
    approaches: [
      {
        name: "Direct Alteryx Automation",
        description: "PowerShell orchestration of existing Alteryx workflows",
        timeline: "2-4 weeks",
        benefits: ["Minimal changes", "Fastest implementation", "Leverages existing expertise"],
        limitations: ["Alteryx licensing dependency", "Limited parallel processing"]
      },
      {
        name: "Hybrid Alteryx + Python",
        description: "Alteryx for ETL, Python for business logic and orchestration",
        timeline: "4-6 weeks",
        benefits: ["Best of both worlds", "Gradual migration path", "Easier testing"],
        limitations: ["Dual technology maintenance", "Training required"]
      },
      {
        name: "Full Python/dbt Migration",
        description: "Complete modernization with dbt for Snowflake transformations",
        timeline: "8-12 weeks",
        benefits: ["No licensing costs", "Full version control", "Cloud-native scalability"],
        limitations: ["Longer implementation", "Complete rewrite required"]
      }
    ],
    dbtModels: [
      { name: "stg_member_accounts", type: "staging", purpose: "Raw data preparation" },
      { name: "stg_transunion_response", type: "staging", purpose: "TU data parsing" },
      { name: "int_eligibility_filtered", type: "intermediate", purpose: "Eligibility rules" },
      { name: "int_risk_scored", type: "intermediate", purpose: "Risk calculations" },
      { name: "mart_cli_recommendations", type: "mart", purpose: "Final recommendations" },
      { name: "mart_cli_summary", type: "mart", purpose: "Aggregated metrics" }
    ],
    implementationPhases: [
      { phase: 1, name: "Foundation", weeks: "1-3", activities: "Dev environment, config schema, monitoring" },
      { phase: 2, name: "Core Development", weeks: "4-7", activities: "Orchestration, eligibility logic, TU integration" },
      { phase: 3, name: "Integration", weeks: "8-10", activities: "E2E testing, parallel run, performance tuning" },
      { phase: 4, name: "Rollout", weeks: "11-13+", activities: "Pilot CUs, migration, documentation" }
    ]
  },

  alteryxWorkflow: {
    stages: [
      { name: "Input Stage", tools: "1-20", purpose: "Data ingestion, format validation, field mapping" },
      { name: "Data Preparation", tools: "21-50", purpose: "Cleaning, deduplication, unique ID creation" },
      { name: "Eligibility Filtering", tools: "51-80", purpose: "Apply business rules, exclusion criteria" },
      { name: "Analysis", tools: "81-150", purpose: "TU data merge, risk scoring, utilization calc" },
      { name: "Business Rules", tools: "151-200", purpose: "CLI tier logic, aggregate limits" },
      { name: "Output", tools: "201+", purpose: "Report generation, file export" }
    ],
    criticalFormulas: [
      { tool: "Formula (64)", purpose: "Account age calculation" },
      { tool: "Formula (67)", purpose: "Credit score range classification" },
      { tool: "Formula (72)", purpose: "Exclusion logic (bankruptcy, delinquency)" },
      { tool: "Formula (73)", purpose: "Income and payment calculations" },
      { tool: "Formula (74)", purpose: "CLI tier assignment (nested IF statements)" }
    ],
    prioritizationLogic: {
      description: "Sort (30) handles product prioritization for multi-product members",
      rule: "Credit Cards ranked BEFORE Lines of Credit",
      criteria: ["Member unique ID (SSN+DOB)", "Product type priority (CC=1, LOC=2, HELOC=3)", "Current utilization (ascending)"]
    }
  },

  folderSetup: {
    sDrive: {
      basePath: "S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\",
      clientFolder: "PeerNumber_CUName (e.g., 0558_Interfaith)",
      subfolders: ["Year folder (e.g., 2025)", "Workflows folder"]
    },
    box: {
      url: "https://trellance.app.box.com/folder/305984505328",
      path: "Files > Shared > Credit Unions",
      naming: "Same as S: drive - PeerNumber_CreditUnionName",
      fileRequest: "Use File Request feature for client uploads without Box accounts"
    }
  },

  gaps: [
    { id: 1, title: "TransUnion Field Mapping", priority: "Critical", description: "Complete documentation of all 419 TransUnion fields" },
    { id: 2, title: "Adverse Action Letters", priority: "Critical", description: "Templates and procedures for notifying declined members" },
    { id: 3, title: "Credit Freeze Handling", priority: "Critical", description: "Process for members with credit freezes" },
    { id: 4, title: "Income Verification Process", priority: "Critical", description: "How income is verified for DTI calculation" },
    { id: 5, title: "Rush Processing Details", priority: "Medium", description: "Pricing and SLA for rush requests" },
    { id: 6, title: "Parameter Change Approval", priority: "Medium", description: "Who approves parameter changes and how" },
    { id: 7, title: "Data Retention Policy", priority: "Medium", description: "How long data is kept and archival procedures" },
    { id: 8, title: "DR/BC Plan", priority: "Medium", description: "Disaster Recovery / Business Continuity plan" }
  ],

  faq: [
    {
      question: "What is CLIP?",
      answer: "CLIP (Credit Line Increase Program) is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions. Operating since 2015-2016, CLIP identifies members eligible for credit line increases across Credit Cards, Unsecured Lines of Credit, and HELOCs."
    },
    {
      question: "What is the standard turnaround time?",
      answer: "Standard processing is 2-3 business days. Rush processing is available for 1 business day with an additional fee."
    },
    {
      question: "What is the minimum credit score requirement?",
      answer: "The default minimum FICO score is 650. Members below this threshold are not eligible for credit line increases."
    },
    {
      question: "How is the credit line increase amount determined?",
      answer: "Increases are based on tiered logic. For example, accounts with <$1,000 current limit can increase to $1,500, while accounts with $10,000-$15,000 can increase to $20,000 (the maximum)."
    },
    {
      question: "What data is needed from the credit union?",
      answer: "Critical fields include: Account Number, SSN (last 4 or full), First/Last Name, Date of Birth, Current Credit Limit, and Current Balance. Important additional fields include Income, DTI, Days Past Due, and Payment History."
    },
    {
      question: "How many fields does TransUnion provide?",
      answer: "TransUnion provides 419 available fields including FICO score, trade line information, inquiry data, and derogatory records."
    },
    {
      question: "What happens to members with multiple products?",
      answer: "Multi-product members are handled through the PC Aggregate Limits workflow. Credit Cards are prioritized over Lines of Credit when both are tied to the same SSN."
    },
    {
      question: "What are the aggregate limits by credit score?",
      answer: "Excellent (776-850): $25,000 max; Good (726-775): $18,000 max; Fair (650-725): $13,000 max. Below 650 is not eligible."
    },
    {
      question: "Who are the TransUnion contacts?",
      answer: "Primary: Jen Werkley (jen.werkley@transunion.com); Secondary: Abbie Jeremiah (Abbie.Jeremiah@transunion.com)"
    },
    {
      question: "Where are CLIP files stored?",
      answer: "Client source files are stored on the S: drive at S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\. Client sharing is done through Box at trellance.app.box.com."
    }
  ]
};

export default clipKnowledge;
