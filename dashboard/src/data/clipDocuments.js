// CLIP Document Chunks for Vector Embeddings
// Each chunk is a self-contained piece of information that can be retrieved

export const clipDocuments = [
  // OVERVIEW SECTION
  {
    id: "overview-1",
    title: "What is CLIP",
    category: "Overview",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `CLIP (Credit Line Increase Program) is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions. Operating since 2015-2016, CLIP identifies members eligible for credit line increases across multiple lending products including Credit Cards, Unsecured Lines of Credit, and HELOCs. The program has a standard turnaround of 2-3 business days with a typical approval rate of 60-70% of eligible members.`
  },
  {
    id: "overview-2",
    title: "CLIP Value Proposition",
    category: "Overview",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `CLIP provides value to three stakeholders: For Credit Unions - increase revenue, improve member satisfaction, optimize credit portfolio. For Members - access to additional credit when needed, recognition of good payment history. For Trellance - recurring revenue stream, strengthened client relationships.`
  },
  {
    id: "overview-3",
    title: "CLIP Technology Stack",
    category: "Overview",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `CLIP currently uses Alteryx workflows for processing, with a planned migration to Python/dbt in the future. The credit bureau partner is TransUnion which provides 419 available fields. Data is stored in Snowflake using TR_ANALYTICS_* schemas for enterprise clients.`
  },

  // PRODUCTS SECTION
  {
    id: "products-1",
    title: "Credit Cards Product",
    category: "Products",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Credit Cards are the most common product for CLI analysis. Requirements include minimum 1 year since origination. The maximum individual limit is $20,000. Credit cards are subject to aggregate limits by credit score tier and represent the standard risk tier.`
  },
  {
    id: "products-2",
    title: "Unsecured Lines of Credit Product",
    category: "Products",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Unsecured Lines of Credit (LOC) have variable terms and represent a higher risk tier than credit cards. The same eligibility criteria apply as credit cards. LOCs are combined with other products for aggregate limit calculations.`
  },
  {
    id: "products-3",
    title: "HELOCs Product",
    category: "Products",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `HELOCs (Home Equity Lines of Credit) are collateralized products with a different risk profile than unsecured products. They may have different parameters per credit union and require property valuation consideration. The collateral provides security reducing risk.`
  },

  // ELIGIBILITY PARAMETERS
  {
    id: "params-1",
    title: "Minimum Income Requirement",
    category: "Parameters",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `The minimum income requirement for CLIP eligibility is $20,000 annual gross income. This is the income floor that members must meet to be considered for a credit line increase. Income verification methods may vary by credit union.`
  },
  {
    id: "params-2",
    title: "Credit Score Requirements",
    category: "Parameters",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `The minimum FICO score for CLIP eligibility is 650. This is the credit bureau score threshold. Members below 650 are not eligible for credit line increases. A FICO drop threshold of -50 points from origination to current also applies as an exclusion.`
  },
  {
    id: "params-3",
    title: "DTI and Age Requirements",
    category: "Parameters",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `The maximum Debt-to-Income (DTI) ratio allowed is 50%. Members with DTI above this ceiling are not eligible. The minimum age requirement is 21 years for member eligibility in the CLIP program.`
  },
  {
    id: "params-4",
    title: "Account Age and Payment Requirements",
    category: "Parameters",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Card origination must be greater than 1 year (12 months) since the account was opened. The minimum payment requirement is 3%. Days Past Due must be 0 - members must be current on all payments to be eligible.`
  },
  {
    id: "params-5",
    title: "Maximum Credit Limit",
    category: "Parameters",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `The maximum credit limit per product is $20,000. This is the per-product cap that cannot be exceeded regardless of other factors. Individual products cannot exceed this limit.`
  },

  // CREDIT LINE INCREASE TIERS
  {
    id: "tiers-1",
    title: "Low Limit Increase Tiers",
    category: "Increase Tiers",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `For accounts with current limits below $1,000, the new limit increases to $1,500 (increase of +$500 to +$1,500). For limits between $1,000-$2,000, increases to $3,000 (increase of +$1,000 to +$2,000). For limits $2,000-$3,000, increases to $5,000 (increase of +$2,000 to +$3,000).`
  },
  {
    id: "tiers-2",
    title: "Mid Limit Increase Tiers",
    category: "Increase Tiers",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `For accounts with current limits between $3,000-$5,000, the new limit increases to $7,500 (increase of +$2,500 to +$4,500). For limits $5,000-$7,500, increases to $10,000 (increase of +$2,500 to +$5,000).`
  },
  {
    id: "tiers-3",
    title: "High Limit Increase Tiers",
    category: "Increase Tiers",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `For accounts with current limits between $7,500-$10,000, the new limit increases to $15,000 (increase of +$5,000 to +$7,500). For limits $10,000-$15,000, increases to $20,000 which is the maximum (increase of +$5,000 to +$10,000).`
  },

  // AGGREGATE LIMITS BY CREDIT SCORE
  {
    id: "aggregate-1",
    title: "Excellent Credit Score Aggregate Limit",
    category: "Aggregate Limits",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `For members with credit scores in the Excellent tier (776-850), the maximum aggregate limit across all products is $25,000. This is the highest aggregate exposure allowed in the CLIP program.`
  },
  {
    id: "aggregate-2",
    title: "Good Credit Score Aggregate Limit",
    category: "Aggregate Limits",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `For members with credit scores in the Good tier (726-775), the maximum aggregate limit across all products is $18,000.`
  },
  {
    id: "aggregate-3",
    title: "Fair Credit Score Aggregate Limit",
    category: "Aggregate Limits",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `For members with credit scores in the Fair tier (650-725), the maximum aggregate limit across all products is $13,000. This is the minimum tier eligible for credit line increases.`
  },
  {
    id: "aggregate-4",
    title: "Below Threshold Credit Score",
    category: "Aggregate Limits",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Members with credit scores below 650 are in the Below Threshold tier and are NOT eligible for credit line increases. They do not qualify for any aggregate limit and are excluded from CLIP analysis.`
  },

  // EXCLUSION CRITERIA
  {
    id: "exclusions-1",
    title: "Bankruptcy and Charge-off Exclusions",
    category: "Exclusions",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Members with bankruptcy (active or within the lookback period) are excluded from CLIP. Members with charged-off accounts are also excluded. These are hard stop exclusion criteria that cannot be overridden.`
  },
  {
    id: "exclusions-2",
    title: "Collections and Delinquency Exclusions",
    category: "Exclusions",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Members with active collections are excluded from CLIP. Any 30, 60, or 90 day delinquencies result in exclusion. Members must have 0 days past due to be eligible.`
  },
  {
    id: "exclusions-3",
    title: "Fraud and Security Exclusions",
    category: "Exclusions",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Members with fraud alerts on their credit file are excluded from CLIP. Members with a deceased indicator are excluded. Members with a credit freeze in place are also excluded from processing.`
  },
  {
    id: "exclusions-4",
    title: "Account Status Exclusions",
    category: "Exclusions",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Members who are overlimit on existing products are excluded from CLIP. Members who received a recent credit line increase within 6-12 months are also excluded to prevent too frequent increases.`
  },

  // DATA REQUIREMENTS
  {
    id: "data-1",
    title: "Critical Data Fields Required",
    category: "Data Requirements",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Critical fields that must be provided include: Account Number (unique account identifier), SSN (last 4 or full for TransUnion pull), First Name, Last Name, Date of Birth (for age verification), Current Credit Limit (existing limit amount), and Current Balance (outstanding balance).`
  },
  {
    id: "data-2",
    title: "Important Data Fields",
    category: "Data Requirements",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Important fields that should be provided include: Income (annual gross income), DTI (Debt-to-Income ratio), Days Past Due (current delinquency status), Product Type (CC, LOC, HELOC), Origination Date (account open date), FICO Score (if available from credit union), and Payment History (recent payment behavior).`
  },
  {
    id: "data-3",
    title: "Unique Identifier Creation",
    category: "Data Requirements",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `The Unique ID is created by combining Last 4 SSN + Date of Birth (MMDDYYYY). Example: 1234 + 03151985 = 123403151985. This allows duplicate detection across products and aggregate exposure calculation for members with multiple products.`
  },

  // DATA SOURCES
  {
    id: "sources-1",
    title: "MDPA Portal Data Source",
    category: "Data Sources",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `The MDPA Portal is a self-service data upload option. It requires standardized format and provides automated validation. This is best for recurring analyses where the credit union regularly submits data in a consistent format.`
  },
  {
    id: "sources-2",
    title: "Consulting Engagement Data Source",
    category: "Data Sources",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Consulting engagements provide custom data handling with flexible formats accepted. Manual validation is performed by analysts. This is best for one-time deep dives or credit unions with non-standard data formats.`
  },
  {
    id: "sources-3",
    title: "Direct Snowflake Connection",
    category: "Data Sources",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Enterprise clients can use direct Snowflake connection. Data is automatically pulled via TR_ANALYTICS_* schemas. This is best for high-volume recurring analyses where automation is critical.`
  },

  // TRANSUNION INTEGRATION
  {
    id: "tu-1",
    title: "TransUnion Overview",
    category: "TransUnion",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `TransUnion provides 419 available fields for credit bureau data. Batch submission is done via the Data Exchange Gateway (DEG). Real-time credit pulls are available for individual requests. Data includes FICO score, trade lines, inquiries, and derogatory records. All TransUnion codes are stored in Snowflake (table managed by James). Internal documentation includes a 150-page code reference in Admin Folder.`
  },
  {
    id: "tu-2",
    title: "TransUnion Key Data Points",
    category: "TransUnion",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Key data points retrieved from TransUnion include: Credit scores (FICO), Trade line information, Payment history, Inquiry data, Public records (bankruptcy, foreclosure), Collections, Credit utilization across all accounts, and Credit-to-Debt ratio (DTI).`
  },
  {
    id: "tu-3",
    title: "TransUnion Contacts",
    category: "TransUnion",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `TransUnion primary contact is Jen Werkley at jen.werkley@transunion.com. Secondary contact is Abbie Jeremiah at Abbie.Jeremiah@transunion.com. Contact them for credentialing, batch processing issues, or subscriber code questions.`
  },
  {
    id: "tu-4",
    title: "TransUnion Credentialing Scenarios",
    category: "TransUnion",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Scenario 1: CU has active TransUnion subscriber code - can proceed directly. Scenario 2: CU has inactive subscriber code (inactive after ~1 year of no activity) - request reactivation via email, may need new Subscriber Release Form. Scenario 3: CU is brand new to TransUnion - send intro email, TU credentials the CU (3-4 weeks timeline).`
  },
  {
    id: "tu-5",
    title: "TransUnion Subscriber Release Forms",
    category: "TransUnion",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Two standard forms are used: 1) TransUnion Subscriber Code Release Form_Trellance.pdf - for CLIP credit line increase projects. 2) TransUnion Subscriber Code Release Form_Trellance - CS Only.pdf - for Data enrichment and Loan Grading projects.`
  },
  {
    id: "tu-6",
    title: "TransUnion File Processing Rules",
    category: "TransUnion",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Important rules: Submit ONE file at a time to TransUnion (they process in unpredictable order). TransUnion always names output files OLB.EDTOUT.TWNTWCDT.OUTPUT. Credentials and attributes arrive in secure files - store on shared drive. Volume-based pricing: TransUnion charges Trellance based on volume; Trellance passes cost to client.`
  },

  // PROCESS WORKFLOW - PHASE 1
  {
    id: "process-1-1",
    title: "Process Phase 1: Input File Setup",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Step 1 - Input File Setup: Open the Run CLIP workflow at S:\\Prod\\Workflows\\Tools\\Run CLIP.yxwz. Navigate to input tool near top of workflow. Configure the input file path to point to the credit union's source data. File location pattern: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\PeerNumber_CUName\\Year\\`
  },
  {
    id: "process-1-2",
    title: "Process Phase 1: Account Age Formula",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Step 2 - Update Account Age Formula: Locate Formula (64) which appears early in the workflow. This calculates credit limit maximum based on account age. Review and adjust age requirements per client specifications.`
  },
  {
    id: "process-1-3",
    title: "Process Phase 1: CORP ID Lookup",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Step 3 - Look Up CORP ID: Locate tool that references S:\\Prod\\Inputs\\Reference and Control Tables\\CU Master for Providers.xlsx. Find the credit union's CORP ID in the Peer column. This ID is used for TransUnion batch submission. Example: Look up peer number 0016 for Palmetto Citizens.`
  },
  {
    id: "process-1-4",
    title: "Process Phase 1: Save and Run",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Steps 4-6: Save workflow as new version in client's Workflow folder (e.g., S:\\Products\\CLIP...\\PeerNumber_CUName\\Workflow(s)). Execute the workflow to generate output file. Monitor for errors. Prepare the output file for TransUnion submission - verify format matches TU requirements.`
  },

  // PROCESS WORKFLOW - PHASE 2
  {
    id: "process-2-1",
    title: "Process Phase 2: TransUnion Upload",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Step 7 - Upload to TransUnion DEG: Access TransUnion Data Exchange Gateway (DEG). Navigate to file upload section. Submit the prepared file for batch processing. Important: Note submission timestamp for tracking.`
  },
  {
    id: "process-2-2",
    title: "Process Phase 2: Download TU Response",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Steps 8-10: Wait for TU batch processing to complete (typically same day). Download response files from DEG. Save to S:\\Products\\CLIP...\\Inputs\\Transunion Received. If Consumer Statements file received, save to Consumer Statements subfolder. Copy all files to FilesToProcess directory.`
  },
  {
    id: "process-2-3",
    title: "Process Phase 2: CLIP Step 2",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Steps 11-14: Open S:\\Prod\\Workflows\\Chained Apps\\Clip Step2.yxwz - this merges TU data with original member data. Update input tool to point to downloaded TU files. Verify date fields parse correctly. Review sample records to ensure SSN/DOB matching is working. Run CLIP Step 2 and monitor for matching errors.`
  },

  // PROCESS WORKFLOW - PHASE 3
  {
    id: "process-3-1",
    title: "Process Phase 3: Configure Formulas",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Steps 15-18: Formula (67) handles credit score ranges and metrics. Formula (72) contains exclusion logic (bankruptcy, delinquency, etc.). Formula (73) calculates monthly income from annual figures and minimum monthly payments. Formula (74) contains nested IF statements for CLI tier structure - CRITICAL to adjust per client parameters.`
  },
  {
    id: "process-3-2",
    title: "Process Phase 3: Output Generation",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Steps 19-21: Select (260) adds supplemental data fields like Aggregate Spend Over Past 12 Months and Max Aggregate Bankcard Balance. Check Summary tools near end of workflow - verify no zeros in key count fields. Review approval/rejection ratios. Generate output files and verify all created successfully.`
  },

  // PROCESS WORKFLOW - PHASE 4
  {
    id: "process-4-1",
    title: "Process Phase 4: Aggregate Limits",
    category: "Process Workflow",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Steps 22-23: Run PC Aggregate Limits workflow for members with multiple products. Sort (30) handles prioritization - PRIORITY RULE: Credit Card ranked BEFORE Line of Credit. This ensures credit cards get limit increases first when member has both products tied to same SSN. Formula (47) configures credit limit bucket configurations per client's aggregate limit tiers.`
  },

  // AUTOMATION MACROS
  {
    id: "macro-1",
    title: "Data Extraction Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `data_extraction_macro() - Purpose: Pull all required data from Snowflake for a specific credit union. Inputs: Tenant ID (TR_ANALYTICS_*), Lookback period, Date range. Outputs: DataFrame with member/account data, Transaction history, Credit scores. Key Logic: Multi-schema query handling, Data type validation, Null handling, Deduplication.`
  },
  {
    id: "macro-2",
    title: "Eligibility Filter Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `eligibility_filter_macro() - Purpose: Apply configurable business rules to filter eligible accounts. Inputs: Raw member/account data, Config rules dictionary. Outputs: Filtered DataFrame (eligible members), Rejection log with reasons. Key Logic: Account age calculation, Payment history validation, Balance/limit checks, Status exclusions.`
  },
  {
    id: "macro-3",
    title: "Utilization Calculation Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `utilization_calculation_macro() - Purpose: Calculate current and historical utilization patterns. Inputs: Account balance data, Credit limit data, Historical snapshots. Outputs: Utilization metrics per account, Trend indicators. Key Logic: Current utilization %, Average utilization (6-month), Volatility score, High balance identification.`
  },
  {
    id: "macro-4",
    title: "Risk Assessment Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `risk_assessment_macro() - Purpose: Calculate composite risk scores for credit line increases. Inputs: Credit scores, Payment history, Income data, Derogatory records. Outputs: Risk score (0-100), Risk band (Low/Medium/High), Contributing factors. Key Logic: Weighted scoring model, Recent inquiry impact, Bankruptcy/foreclosure flags, Income stability.`
  },
  {
    id: "macro-5",
    title: "Recommendation Engine Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `recommendation_engine_macro() - Purpose: Determine optimal credit line increase amounts. Inputs: Eligible accounts, Risk scores, Current limits, Strategy config. Outputs: Recommended new limit, Increase amount, Confidence score, Approval routing. Key Logic: Strategy selection (percentage/fixed/tiered), Cap application, Post-increase utilization projection, ROI estimation.`
  },
  {
    id: "macro-6",
    title: "Compliance Check Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `compliance_check_macro() - Purpose: Validate recommendations against regulatory and policy rules. Inputs: Recommended increases, Compliance rules, Member aggregated exposure. Outputs: Compliance pass/fail flag, Required documentation list, Approval level routing. Key Logic: Regulatory limit checks (e.g., TILA), Internal policy validation, Cross-product exposure, Documentation requirements.`
  },
  {
    id: "macro-7",
    title: "Output Generator Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `output_generator_macro() - Purpose: Create standardized output files in multiple formats. Inputs: Approved list, Analysis data, Config settings. Outputs: CSV/Excel files, PDF reports, Summary dashboards. Key Logic: Template-based report generation, Multi-format export, Data quality metrics, Visualization creation.`
  },
  {
    id: "macro-8",
    title: "Audit Logging Macro",
    category: "Automation",
    source: "CLIP_Automation-POC.pdf",
    content: `audit_logging_macro() - Purpose: Track all processing steps for compliance and debugging. Inputs: Processing events, Config used, Results summary. Outputs: Detailed audit trail, Performance metrics, Error logs. Key Logic: Timestamp all events, Parameter logging, Record counts at each stage, Execution time tracking.`
  },

  // FILE PATHS
  {
    id: "files-1",
    title: "Key Workflow File Paths",
    category: "File Paths",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Run CLIP Workflow: S:\\Prod\\Workflows\\Tools\\Run CLIP.yxwz. CLIP Step 2: S:\\Prod\\Workflows\\Chained Apps\\Clip Step2.yxwz. CORP ID Reference: S:\\Prod\\Inputs\\Reference and Control Tables\\CU Master for Providers.xlsx.`
  },
  {
    id: "files-2",
    title: "Input and Output File Paths",
    category: "File Paths",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Direct Source Files: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\. Files To Process: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\FilesToProcess. TU Received Files: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Transunion Received. Consumer Statements: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Transunion Received\\Consumer Statements.`
  },
  {
    id: "files-3",
    title: "Box File Sharing",
    category: "File Paths",
    source: "Mercy CLIP Notes.pdf",
    content: `Box is used to securely share files with credit union clients. URL: https://trellance.app.box.com/folder/305984505328. Path: Files > Shared > Credit Unions. Client folder naming: PeerNumber_CreditUnionName (consistent with S: drive). Use File Request feature to let clients upload without needing Box accounts.`
  },

  // FOLDER SETUP
  {
    id: "folder-1",
    title: "Client Folder Setup",
    category: "Folder Setup",
    source: "Mercy CLIP Notes.pdf",
    content: `Base directory: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\. Create client folder with naming convention: PeerNumber_CreditUnionName (e.g., 0558_Interfaith, 0016_Palmetto Citizens). Inside client folder create: Year folder (e.g., 2025, 2026) and Workflows folder for saved workflow copies.`
  },

  // KPIs
  {
    id: "kpi-1",
    title: "Core KPIs",
    category: "KPIs",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Core CLIP KPIs: Total Eligible Accounts (members meeting all eligibility criteria - maximize). Total Approved Accounts (members receiving CLI approval - target 60-70% of eligible). CLI Approval Rate (Approved/Eligible - target 65-75%). Avg Credit Line Increase (average dollar increase per approval - target $2,500+). Incremental Credit Exposure (total new credit extended - track monthly). Processing Accuracy (error rate in analysis - target <1%).`
  },
  {
    id: "kpi-2",
    title: "Operational Metrics",
    category: "KPIs",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Operational Metrics: Turnaround Time - Current 2-3 days, Target 4-8 hours. Manual Touchpoints - Current 8-12, Target 2-3. Error Rate - Current 2-5%, Target <0.5%. Throughput - Current 5-10 CUs/week, Target 20-30 CUs/week.`
  },

  // RISKS
  {
    id: "risk-1",
    title: "Credit Union Risks",
    category: "Risks",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Credit Union Risks: 1) Credit Risk Exposure - members may default after increase. Mitigation: conservative parameters, ongoing monitoring. 2) Regulatory Compliance - ECOA/FCRA requirements must be met. Mitigation: proper adverse action notices, documentation. Note: Fair Lending analysis is a separate Trellance product. 3) Portfolio Concentration - over-exposure in certain segments. Mitigation: aggregate limits by credit tier.`
  },
  {
    id: "risk-2",
    title: "Operational Risks",
    category: "Risks",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Operational Risks: Data Quality Issues (bad input leads to bad recommendations), TransUnion API Failures (cannot complete processing), Processing Delays (miss SLA commitments), Parameter Misconfiguration (wrong thresholds applied), Duplicate Handling Errors (same member gets multiple offers), Version Control Issues (lost workflow changes), Security/PII Exposure (data breach risk), Staff Knowledge Gaps (key person leaves). Mitigations include automation, validation, monitoring, documentation, and cross-training.`
  },

  // GAPS
  {
    id: "gap-1",
    title: "Critical Documentation Gaps",
    category: "Gaps",
    source: "CLIP_Gap_Analysis.md",
    content: `Critical gaps identified: 1) TransUnion Field Mapping - 419 fields not fully documented, reference to 150-page internal doc but not consolidated. 2) Adverse Action Letters - no templates or procedures for notifying declined members. 3) Credit Freeze Handling - process not documented. 4) Income Verification Process - how income is verified for DTI calculation is unclear.`
  },
  {
    id: "gap-2",
    title: "Medium Priority Gaps",
    category: "Gaps",
    source: "CLIP_Gap_Analysis.md",
    content: `Medium priority gaps: Rush Processing Details (pricing and SLA not documented). Parameter Change Approval Workflow (governance unclear). Data Retention Policy (not documented). Disaster Recovery/Business Continuity plan missing. Error Handling Procedures incomplete. CLIP Packages Details (2 packages mentioned but never detailed). Snowflake Schema Documentation for TR_ANALYTICS_* schemas.`
  },

  // SALES CHANNELS
  {
    id: "sales-1",
    title: "MDPA Portal Channel",
    category: "Sales Channels",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `MDPA Portal (Self-Service): Credit union logs into portal. Uploads member data in standard format. System auto-processes. Results available in portal. Best for: recurring analyses, standardized approach.`
  },
  {
    id: "sales-2",
    title: "Consulting Engagement Channel",
    category: "Sales Channels",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Consulting Engagement (Custom): Discovery and scoping phase. Custom configuration. Analysis and processing. Report and presentation. Best for: new clients, complex requirements, one-time deep dives.`
  },
  {
    id: "sales-3",
    title: "Enterprise Channel",
    category: "Sales Channels",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Enterprise/Recurring (Batch): Scheduled trigger (calendar/cron). Automated data pull from Snowflake. Automated processing. Automated delivery. Best for: large CUs, high volume, where full automation is valuable.`
  },

  // CLIENT ONBOARDING
  {
    id: "onboard-1",
    title: "Client Onboarding Steps",
    category: "Onboarding",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Onboarding workflow: 1) PM/AM receives client request and confirms contract. 2) Request & Project Opening. 3) Implementation Manager (IM) assigned. 4) Kick-off meeting with client. 5) Environment preparation. 6) Load client files in Alteryx. 7) Internal validation. 8) User portal admin training. 9) Push data to dashboards. 10) Final checks. 11) Client data review. 12) Close project and transition to support.`
  },
  {
    id: "onboard-2",
    title: "Onboarding Contacts",
    category: "Onboarding",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Key onboarding contacts: Onboarding Lead - John W (overall coordination). Onboarding Support - Kayla (client communication), Paolo (technical setup). Workspace Admin - Rob-Logan (AWS Workspaces provisioning). Shared Drive Access - Manish (BOX and S: drive permissions). SQL Database Access - Venkat, Onome, Mercy, Chris, Jon.`
  },

  // POWERBI MIGRATION
  {
    id: "migration-1",
    title: "Tableau to PowerBI Migration",
    category: "Migration",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `Trellance is migrating analytics dashboards from Tableau to PowerBI. Credit unions being migrated include MainStreet, OTIS, Central Virginia FCU, NorthWest, and others. Benefits include unified Microsoft ecosystem, cost optimization, enhanced collaboration, improved data connectivity with native Snowflake connector, self-service analytics, mobile experience, advanced AI capabilities, better governance, and scalability.`
  },

  // GLOSSARY
  {
    id: "glossary-1",
    title: "CLIP Glossary - Common Terms",
    category: "Glossary",
    source: "CLIP_Master_Document_NotebookLM.md",
    content: `CLI = Credit Line Increase. CLIP = Credit Line Increase Program. CU = Credit Union. DEG = Data Exchange Gateway (TransUnion file transfer). DTI = Debt-to-Income ratio. FICO = Fair Isaac Corporation credit score. HELOC = Home Equity Line of Credit. IM = Implementation Manager. LOC = Line of Credit. MDPA = Member Data Portal Analytics. PII = Personally Identifiable Information. SLA = Service Level Agreement. TU = TransUnion. Utilization = Balance / Credit Limit ratio.`
  },

  // ALTERYX AUTOMATION POC - From PDF Documentation
  {
    id: "automation-overview-1",
    title: "Alteryx Automation Strategy Overview",
    category: "Automation Strategy",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `The CLIP Alteryx Automation POC explores three automation approaches: 1) Direct Alteryx Automation using PowerShell orchestration, 2) Hybrid approach combining Alteryx with Python for complex logic, and 3) Full Python/dbt Migration for complete modernization. The goal is to reduce manual touchpoints from 8-12 to 2-3, reduce turnaround from 2-3 days to 4-8 hours, and increase throughput from 5-10 CUs/week to 20-30 CUs/week.`
  },
  {
    id: "automation-overview-2",
    title: "Current vs Future State Comparison",
    category: "Automation Strategy",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Current State: Manual workflow execution, 8-12 manual touchpoints, 2-3 day turnaround, 5-10 CUs/week capacity, 2-5% error rate. Future State: Automated scheduling, 2-3 manual touchpoints (data review, approval), 4-8 hour turnaround, 20-30 CUs/week capacity, <0.5% error rate. Key enablers: Configuration-driven processing, automated TransUnion integration, parallel processing, real-time monitoring.`
  },
  {
    id: "automation-approach-1",
    title: "Approach 1: Direct Alteryx Automation",
    category: "Automation Approaches",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Direct Alteryx Automation uses PowerShell scripts to orchestrate Alteryx workflows. Benefits: Minimal changes to existing workflows, fastest implementation (2-4 weeks), leverages existing Alteryx expertise. Limitations: Still dependent on Alteryx licensing, limited parallel processing, harder to version control. Best for: Organizations wanting quick wins with existing infrastructure.`
  },
  {
    id: "automation-approach-2",
    title: "Approach 2: Hybrid Alteryx + Python",
    category: "Automation Approaches",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Hybrid approach keeps Alteryx for data preparation but adds Python for complex business logic, orchestration, and reporting. Benefits: Best of both worlds, gradual migration path, easier testing of business rules. Components: Python orchestrator script, Alteryx for ETL, Python for eligibility rules, Python for report generation. Implementation timeline: 4-6 weeks.`
  },
  {
    id: "automation-approach-3",
    title: "Approach 3: Full Python/dbt Migration",
    category: "Automation Approaches",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Complete modernization using Python and dbt (data build tool). Benefits: No Alteryx licensing costs, full version control with Git, cloud-native scalability, easier testing and CI/CD. Components: dbt for data transformations in Snowflake, Python for orchestration and business logic, Airflow/Prefect for scheduling. Timeline: 8-12 weeks. Best for: Long-term strategic investment.`
  },
  {
    id: "automation-powershell",
    title: "PowerShell Orchestrator Script",
    category: "Automation Code",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `PowerShell orchestrator example: The script accepts parameters for credit union ID, workflow path, and output directory. It validates inputs, logs execution start, runs Alteryx workflow using AlteryxEngineCmd.exe, captures output, handles errors with try/catch, and logs completion status. Key commands: Start-Process for Alteryx execution, Out-File for logging, Send-MailMessage for notifications.`
  },
  {
    id: "automation-python-generator",
    title: "Python Workflow Generator",
    category: "Automation Code",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Python workflow generator dynamically creates Alteryx workflows from configuration. It reads credit_unions.json for CU-specific parameters, generates XML workflow definitions, sets input/output paths based on conventions, configures formulas with CU-specific thresholds, and saves workflows to designated folders. This enables scaling to many CUs without manual workflow copies.`
  },
  {
    id: "automation-config-structure",
    title: "Configuration File Structure",
    category: "Automation Configuration",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Configuration stored in credit_unions.json: Each CU entry contains: cu_id (peer number), cu_name, min_fico_score, max_dti, min_income, min_account_age_months, max_credit_limit, products array (credit_card, loc, heloc booleans), custom_exclusions array, transunion_subscriber_code, output_format preference. This enables parameterized processing without workflow modification.`
  },
  {
    id: "automation-dbt-models",
    title: "dbt Model Structure for CLIP",
    category: "Automation dbt",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `dbt project structure: models/staging/stg_member_accounts.sql (raw data preparation), models/staging/stg_transunion_response.sql (TU data parsing), models/intermediate/int_eligibility_filtered.sql (eligibility rules), models/intermediate/int_risk_scored.sql (risk calculations), models/marts/mart_cli_recommendations.sql (final recommendations), models/marts/mart_cli_summary.sql (aggregated metrics). Each model is tested with dbt tests.`
  },
  {
    id: "automation-alteryx-python-mapping",
    title: "Alteryx to Python/SQL Mapping",
    category: "Automation Migration",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Alteryx tool to Python/SQL equivalents: Input Data → pandas.read_csv() or Snowflake connector. Filter → DataFrame.query() or SQL WHERE. Formula → DataFrame.assign() or SQL CASE WHEN. Select → DataFrame[columns] or SQL SELECT. Sort → DataFrame.sort_values() or SQL ORDER BY. Join → DataFrame.merge() or SQL JOIN. Summarize → DataFrame.groupby().agg() or SQL GROUP BY. Output Data → DataFrame.to_csv() or Snowflake write.`
  },
  {
    id: "automation-timeline",
    title: "Implementation Timeline",
    category: "Automation Implementation",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Phase 1 (Weeks 1-3): Foundation - Set up dev environment, create config schema, build monitoring framework. Phase 2 (Weeks 4-7): Core Development - Implement orchestration, convert eligibility logic, build TransUnion integration. Phase 3 (Weeks 8-10): Integration - End-to-end testing, parallel run with current process, performance tuning. Phase 4 (Weeks 11-13+): Rollout - Pilot with 2-3 CUs, gradual migration, documentation and training.`
  },
  {
    id: "automation-success-metrics",
    title: "Automation Success Metrics",
    category: "Automation KPIs",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Success metrics: Processing Time - Target <8 hours (from 2-3 days). Error Rate - Target <0.5% (from 2-5%). Throughput - Target 20-30 CUs/week (from 5-10). Manual Touchpoints - Target 2-3 (from 8-12). Code Coverage - Target >90% for Python components. Uptime - Target 99.5% for automated processing. Cost per Analysis - Target 40% reduction from current baseline.`
  },

  // BOX AND FOLDER SETUP - From Mercy CLIP Notes
  {
    id: "folder-setup-1",
    title: "Amazon Workspace Folder Setup",
    category: "Folder Setup",
    source: "Mercy CLIP Notes.pdf",
    content: `On Amazon Workspace Shared Drive (S: drive), create client folder structure: S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\PeerNumber_CUName\\. Inside, create Year folder (e.g., 2025) and Workflows folder. Example: S:\\Products\\CLIP...\\0558_Interfaith\\2025\\ and S:\\Products\\CLIP...\\0558_Interfaith\\Workflows\\. Consistent naming with Box folder is critical.`
  },
  {
    id: "folder-setup-2",
    title: "Box Cloud Setup for Client Sharing",
    category: "Folder Setup",
    source: "Mercy CLIP Notes.pdf",
    content: `Box URL: https://trellance.app.box.com/folder/305984505328. Path: Files > Shared > Credit Unions. Create client folder with same naming as S: drive: PeerNumber_CreditUnionName. Use File Request feature to allow clients to upload files without needing Box accounts. File Request generates a unique link clients can use to securely upload data files.`
  },
  {
    id: "folder-setup-3",
    title: "File Request Process",
    category: "Folder Setup",
    source: "Mercy CLIP Notes.pdf",
    content: `To create Box File Request: Navigate to client folder in Box. Click 'File Request' button. Set description explaining what files are needed. Copy the generated link. Send link to credit union contact. Files uploaded via this link appear in the specified folder. Benefits: No Box account needed for client, secure upload, organized storage, automatic notifications.`
  },
  {
    id: "processing-input-1",
    title: "Processing Input Files Workflow",
    category: "Input Processing",
    source: "Mercy CLIP Notes.pdf",
    content: `When CU uploads files to Box: 1) Download files from Box to local machine. 2) Copy to S: drive client folder (correct year subfolder). 3) Open Run CLIP workflow. 4) Update input tool path to new file location. 5) Verify data format matches expected schema. 6) Check for any data quality issues. 7) Run workflow and monitor for errors. Document any client-specific data quirks for future reference.`
  },

  // ALTERYX WORKFLOW STRUCTURE
  {
    id: "workflow-structure-1",
    title: "Alteryx Workflow Component Structure",
    category: "Alteryx Workflow",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `CLIP Alteryx workflow structure: Input Stage (tools 1-20) - Data ingestion, format validation, field mapping. Data Preparation Stage (tools 21-50) - Cleaning, deduplication, unique ID creation. Eligibility Filtering Stage (tools 51-80) - Apply business rules, exclusion criteria. Analysis Stage (tools 81-150) - TransUnion data merge, risk scoring, utilization calc. Business Rules Stage (tools 151-200) - CLI tier logic, aggregate limits. Output Stage (tools 201+) - Report generation, file export.`
  },
  {
    id: "workflow-structure-2",
    title: "Critical Alteryx Formula Tools",
    category: "Alteryx Workflow",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Key Formula tools in CLIP workflow: Formula (64) - Account age calculation, determines time since origination. Formula (67) - Credit score range classification, assigns risk tiers. Formula (72) - Exclusion logic, flags bankruptcy/delinquency/collections. Formula (73) - Income and payment calculations, converts annual to monthly, calculates min payment. Formula (74) - CLI tier assignment, nested IF statements for increase amounts. These are the most critical tools requiring CU-specific customization.`
  },
  {
    id: "workflow-structure-3",
    title: "Alteryx Sort and Prioritization Logic",
    category: "Alteryx Workflow",
    source: "CLIP Alteryx Automation POC.pdf",
    content: `Sort (30) in PC Aggregate Limits workflow handles product prioritization for members with multiple products. Priority rule: Credit Cards are ranked BEFORE Lines of Credit. This ensures credit cards receive limit increases first when aggregate capacity is limited. Sort criteria: 1) Member unique ID (SSN+DOB), 2) Product type priority (CC=1, LOC=2, HELOC=3), 3) Current utilization (ascending). This maximizes value for members while managing risk.`
  },

  // TRAINING GUIDE DOCUMENTS
  {
    id: "training-overview",
    title: "CLIP Training Guide Overview",
    category: "Training",
    source: "CLIP_Training_Guide.md",
    content: `The CLIP Training Guide is a comprehensive training manual covering all aspects of the Credit Line Increase Program. It includes 16 chapters: Program Overview, Products & Eligibility, Data Requirements, Parameters & Business Rules, Process Workflow, Detailed CLIP Run Process (Step-by-Step), Folder Setup & File Management, Automation Framework, Output Interpretation, Troubleshooting, Best Practices, TransUnion Credentialing, Client Onboarding Process, Tableau to PowerBI Migration, Gaps to Be Filled, and Quick Reference.`
  },
  {
    id: "training-products",
    title: "Training Guide - Products and Eligibility",
    category: "Training",
    source: "CLIP_Training_Guide.md",
    content: `Training guide covers three supported products: Credit Cards (most common, 1+ year origination, max $20K), Unsecured Lines of Credit (higher risk tier, variable terms), and HELOCs (collateralized, different risk profile). Credit score tier limits: Excellent (776-850) gets $25K max aggregate, Good (726-775) gets $18K, Fair (650-725) gets $13K, Below 650 is not eligible.`
  },
  {
    id: "training-data-requirements",
    title: "Training Guide - Data Requirements",
    category: "Training",
    source: "CLIP_Training_Guide.md",
    content: `Training guide details required data fields. Critical fields: Account Number, SSN (last 4 or full), First Name, Last Name, Date of Birth, Current Credit Limit, Current Balance. Important fields: Income, DTI, Days Past Due, Product Type, Origination Date, FICO Score, Payment History. Data sources include MDPA Portal (self-service), Consulting Engagements (custom), and Direct Snowflake Connection (enterprise).`
  },
  {
    id: "training-parameters",
    title: "Training Guide - Parameters and Business Rules",
    category: "Training",
    source: "CLIP_Training_Guide.md",
    content: `Training guide standard eligibility thresholds: Minimum Income $20,000, Minimum FICO Score 650, Maximum DTI 50%, Minimum Age 21 years, Maximum Credit Limit $20,000, Card Origination > 1 year, FICO Drop Threshold -50 points. These parameters are configurable per credit union based on their risk appetite.`
  },
  {
    id: "training-troubleshooting",
    title: "Training Guide - Troubleshooting",
    category: "Training",
    source: "CLIP_Training_Guide.md",
    content: `The training guide includes troubleshooting guidance for common issues: data format mismatches, TransUnion connection problems, workflow errors, parameter misconfiguration, and output validation issues. Best practices include validating data before processing, keeping workflows versioned, documenting client-specific configurations, and maintaining audit trails.`
  },

  // MIND MAP DOCUMENTS
  {
    id: "mindmap-overview",
    title: "CLIP Mind Map Overview",
    category: "Mind Map",
    source: "CLIP_Mind_Map.md",
    content: `The CLIP Mind Map provides a visual structure of the entire Credit Line Increase Program. It branches into six main areas: Products (Credit Cards, Unsecured LOC, HELOCs), Data Sources (MDPA Portal, Consulting, Client Files, TransUnion), Parameters & Rules (eligibility thresholds, increase tiers, aggregate limits), Process Workflow (5 phases), Outputs & KPIs, and Technology Stack.`
  },
  {
    id: "mindmap-products",
    title: "Mind Map - Products Branch",
    category: "Mind Map",
    source: "CLIP_Mind_Map.md",
    content: `Mind Map Products Branch visualizes three product types: Credit Cards (most common, 1+ year origination, max $20K), Unsecured Lines of Credit (standard LOC, variable terms, higher risk tier), and HELOCs (Home Equity LOC, collateralized, different risk profile). Each product has specific eligibility criteria and risk considerations.`
  },
  {
    id: "mindmap-data-sources",
    title: "Mind Map - Data Sources Branch",
    category: "Mind Map",
    source: "CLIP_Mind_Map.md",
    content: `Mind Map Data Sources Branch shows primary sources (MDPA Portal - automated/standardized, Consulting Engagements - custom analysis, Client Files - direct uploads), Credit Bureau integration (TransUnion with 419 fields, real-time pulls, FICO, DTI, trade lines), and required data fields categorized as Critical (Account Number, SSN, Name, DOB, Limits) and Important (Income, DTI, Days Past Due, Product Type).`
  },
  {
    id: "mindmap-parameters",
    title: "Mind Map - Parameters Branch",
    category: "Mind Map",
    source: "CLIP_Mind_Map.md",
    content: `Mind Map Parameters Branch visualizes eligibility thresholds (Min Income $20K, Min FICO 650, Max DTI 50%, Min Age 21, Max Credit $20K, Card Origination >1 year, FICO Drop -50 points), Credit Line Increase Tiers (7 tiers from <$1K to $15K), and Aggregate Limits by Credit Score (Excellent $25K, Good $18K, Fair $13K).`
  },
  {
    id: "mindmap-exclusions",
    title: "Mind Map - Exclusion Criteria",
    category: "Mind Map",
    source: "CLIP_Mind_Map.md",
    content: `Mind Map exclusion criteria branch shows hard stop exclusions: Bankruptcy (active or recent), Charge-offs, Collections (active), Delinquency (30/60/90 days), Fraud alert on file, Deceased indicator, Credit freeze, Overlimit on existing products, Recent CLI (within 6-12 months).`
  },

  // VALUE STREAM MAP DOCUMENTS
  {
    id: "vsm-overview",
    title: "Value Stream Map Overview",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `The CLIP Value Stream Map documents the end-to-end flow from Credit Union request to results delivery. Current lead time is 2-3 business days. The value flow shows: Credit Union (Customer) → Trellance/Rise (Service Provider) → Credit Union (Results). The map identifies value-adding activities, wait times, and improvement opportunities.`
  },
  {
    id: "vsm-current-state",
    title: "Value Stream Map - Current State",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `Current State Value Stream has 5 phases: Phase 1 Sales & Onboarding (1-5 days for new clients), Phase 2 Data Collection (2-4 hours cycle + 0-24 hours wait), Phase 3 Credit Bureau Pull (4-8 hours + 0-4 hours wait), Phase 4 Analysis & Decision (4-8 hours + 0-2 hours wait), Phase 5 Output Delivery (2-4 hours + 0-1 hour wait). Total: 8-12 manual touchpoints.`
  },
  {
    id: "vsm-metrics",
    title: "Value Stream Metrics",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `Value Stream Metrics comparison: Total Lead Time current 2-3 days, target 4-8 hours (75% reduction). Processing Time current 8-16 hours, target 2-4 hours (75% reduction). Wait Time current 1-2 days, target 1-2 hours (90% reduction). Manual Touchpoints current 8-12, target 2-3 (75% reduction). Error Rate current 2-5%, target <0.5% (80% reduction). Throughput current 5-10 CUs/week, target 20-30 CUs/week (200% increase).`
  },
  {
    id: "vsm-channel-mdpa",
    title: "Value Stream - MDPA Portal Channel",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `MDPA Portal Value Stream: Access (5 min) → Upload (15-30 min) → Process (4-8 hours batch) → Deliver (immediate). Value: self-service, standardized, automated, scalable, instant access, downloadable. Waste: learning curve, format issues, re-uploads, batch delays, no rush option, limited customization.`
  },
  {
    id: "vsm-channel-consulting",
    title: "Value Stream - Consulting Channel",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `Consulting Engagement Value Stream: Scope (1-3 days) → Design (1-2 days) → Execute (1-3 days) → Present (1-2 hours). Value: custom fit, strategic input, relationship building, tailored rules, expert analysis, deep dive, insights, recommendations. Waste: long cycle, resource heavy, manual config, rework possible, one-off work, scheduling delays.`
  },
  {
    id: "vsm-channel-enterprise",
    title: "Value Stream - Enterprise Channel",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `Enterprise/Recurring Value Stream: Scheduled trigger (calendar/cron) → Automated data pull from Snowflake → Automated processing → Automated delivery. Best for large credit unions with high volume where full automation provides the most value. Uses TR_ANALYTICS_* schemas for direct data access.`
  },
  {
    id: "vsm-waste-identification",
    title: "Value Stream - Waste Identification",
    category: "Value Stream",
    source: "CLIP_Value_Stream_Map.md",
    content: `Value Stream waste categories identified: Waiting (queue times, batch processing delays, analyst availability), Defects (data format issues, parameter misconfigurations, re-work), Over-processing (manual steps that could be automated), Motion (file transfers between systems), Inventory (backlog of pending analyses). Kaizen opportunities: automation, standardization, parallel processing.`
  },

  // TRANSUNION TIMELINE VARIABILITY - Important operational note
  {
    id: "tu-timeline-variability",
    title: "TransUnion Credit Bureau Pull Timeline Variability",
    category: "TransUnion",
    source: "Operational Knowledge",
    content: `IMPORTANT: While the documented cycle time for Credit Bureau Pull is 4-8 hours, actual processing time can take UP TO 2 WEEKS depending on how responsive the credit union or TransUnion is. Factors affecting timeline include: CU response time for subscriber code activation, TransUnion batch processing queue depth, CU data file preparation delays, Subscriber code reactivation requests, and communication delays between parties. Plan for potential 2-week delays when scheduling CLIP analyses.`
  },
  {
    id: "tu-credentialing-timeline",
    title: "TransUnion Credentialing Extended Timeline",
    category: "TransUnion",
    source: "Operational Knowledge",
    content: `TransUnion credentialing and credit bureau pulls have variable timelines: New CU credentialing takes 3-4 weeks (documented). Inactive subscriber code reactivation varies based on TU responsiveness. Credit bureau pull can take 4-8 hours (ideal) up to 2 WEEKS (worst case) depending on CU and TU responsiveness. Always communicate variable timelines to clients and build buffer into project schedules.`
  },

  // MEETING TRANSCRIPT CHUNKS - Auto-generated from video transcriptions
  {
    id: "meeting2-chunk-1",
    title: "CLIP Meeting 3 - Parameters and Thresholds Discussion",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `Discussion of CLIP limit thresholds and parameter setup. When mapping the current credit score, if you can either adjust the formula or deactivate individual formulas so they don't fail. The default max is 20,000 for CLIP limit max. There are multiple thresholds to pay attention to during CLIP analysis with a client. Credit ranges can be adjusted, and members want to ensure maximum aggregate limit does not exceed certain values based on credit score ranges.`
  },
  {
    id: "meeting2-chunk-2",
    title: "CLIP Meeting 3 - Aggregate Limits and Monthly Spend",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `For members with 776+ credit score who have both credit card of $20,000 and line of credit of $6,000, that's above the $25K max aggregate, so one value must be lowered. Monthly spend analysis is important - if a member isn't using their credit card because they have a $5,000 limit but their monthly spend is closer to $10,000, the limit should be increased to at least $10,000 to bring the card to top of wallet.`
  },
  {
    id: "meeting2-chunk-3",
    title: "CLIP Meeting 3 - Income and FICO Requirements",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `Minimum income requirement of $20,000 is applied - if income equals zero or empty, or if income estimator is less than 20 (thousands), they are disqualified. Minimum FICO score is 650, with threshold at 649. DTI maximum is 50%. Age requirements: minimum 21 years, maximum 100 years. Card must be held for at least 1 year (365 days).`
  },
  {
    id: "meeting2-chunk-4",
    title: "CLIP Meeting 3 - Additional Client Parameters",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `Client requested additional parameters: Number of bankruptcies in past 24 months must be zero. Number of trades 60+ days past due in 24 months must be zero. Number of trades 90+ days past due - but if a loan is 90 days past due, at one point it was 60 days past due, so only 60 days filter is needed. Reposition trades must be non-existent.`
  },
  {
    id: "meeting2-chunk-5",
    title: "CLIP Meeting 3 - TransUnion Data Fields",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `We receive 419 fields from TransUnion. You can fine-tune parameters as you see fit. There's metadata dictionary on shared drive with field information. The programs are successful because we've spent time cherry-picking the most relevant attributes to see best results from hundreds of analyses run in the past. Some information doesn't make sense for credit cards but there's good information for enhancement.`
  },
  {
    id: "meeting2-chunk-6",
    title: "CLIP Meeting 3 - Credit Score Direction Matters",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `There's a big difference between a 650 credit score going UP vs a 650 credit score coming DOWN. Just because someone was a bad borrower at some point doesn't mean they are today. Some members with reposition trades have 700+ scores - it's crazy not to give someone in the 700s an increase unless they're maxing out the card. That's how we find the correct borrowers.`
  },
  {
    id: "meeting2-chunk-7",
    title: "CLIP Meeting 3 - Credit Line Increase Buckets",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `Credit line increase tiers: Less than $1,000 moves to $1,500. $1,000-$2,000 moves to $3,000. $3,000-$5,000 moves to $5,000. $5,000-$7,500 moves to $7,500. Then $7,500 goes straight to $10,000. Takes minimum of $2,500 plus the limit up to maximum of $20,000.`
  },
  {
    id: "meeting2-chunk-8",
    title: "CLIP Meeting 3 - Engagement Timeline",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `The average lifecycle from saying 'we're going to do this' until delivery (outside of contracting) is about 2-3 days. One person can initiate and finish the process end-to-end. The only externality is waiting on TransUnion. There's no handover to other processes or persons - send data to TransUnion, get information back, continue to finish line.`
  },
  {
    id: "meeting2-chunk-9",
    title: "CLIP Meeting 3 - Account Review and Automatic Increases",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `These credit line increases are automatic - like when your credit card company sends a letter saying they increased your limit from $5,000 to $7,500 without you doing anything. These are looked at under the principle purpose of account review. Periodically credit unions are allowed to pull credit to see where members stand. We do NOT recommend automatic credit line decreases as best practice.`
  },
  {
    id: "meeting2-chunk-10",
    title: "CLIP Meeting 3 - Output Validation",
    category: "Meeting Transcripts",
    source: "CLIP Meeting 3 (Oct 30, 2025)",
    content: `After analysis, about 74% of cards analyzed are receiving or being recommended to receive credit line increases. Important to verify outputs: Looking for zeros in duplicate record counts, verifying no collection inquiries, checking public bankruptcies are zero, number of reposition trades is zero. Also check months since most recent credit card delinquency.`
  },
  {
    id: "meeting3-chunk-1",
    title: "Finish CLIP Session 1 - Aggregate Limit Complexity",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 1 (Oct 31, 2025)",
    content: `When members have multiple products: if Justin Todd has a 650 credit score with both a credit card and line of credit, the aggregate limit between those two cannot exceed $13,000 (for that tier). If credit card was $5,000 and line of credit was $5,000 and they qualified, they could only get up to $3,000 increase because they're already at $10,000.`
  },
  {
    id: "meeting3-chunk-2",
    title: "Finish CLIP Session 1 - Multiple Product Scenarios",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 1 (Oct 31, 2025)",
    content: `Complex scenarios encountered: Some users have multiple credit cards. Some have credit card and line of credit. Some have multiple lines of credit. Some have multiple credit cards AND multiple lines of credit. Decision was made to rank credit card above line of credit for increases - if the member is at aggregate limit already, we don't do anything. If not, we increase credit card over line of credit.`
  },
  {
    id: "meeting3-chunk-3",
    title: "Finish CLIP Session 1 - Filtering by Credit Tier",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 1 (Oct 31, 2025)",
    content: `Aggregate limits vary by credit tier: 776+ credit score has $25,000 max aggregate. 726-775 has $18,000 max. 650-725 has $13,000 max. If current credit limit is already at max for their bucket, they are filtered out. Formula checks: if credit score is between bounds AND sum of credit limit exceeds max for that tier, assign filter value of 1 to disqualify.`
  },
  {
    id: "meeting3-chunk-4",
    title: "Finish CLIP Session 1 - Single vs Multiple Lines",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 1 (Oct 31, 2025)",
    content: `10,399 records were single credit card or single line of credit - these get increases right away since aggregate limit check isn't needed. For multiple lines: 4,400 were already at max aggregate limit, removed from qualifier list. Remaining records with multiple products needed complex logic to determine which line to increase.`
  },
  {
    id: "meeting3-chunk-5",
    title: "Finish CLIP Session 1 - DQ Decisions",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 1 (Oct 31, 2025)",
    content: `Decision codes used: 'DQ above max aggregate limit' for those already at max. 'DQ line of credit for credit card' when member has both products and we're prioritizing credit card increase. For members with only lines of credit (no credit card), they get the proposed increase on the LC since there's no CC to prioritize.`
  },
  {
    id: "meeting3-chunk-6",
    title: "Finish CLIP Session 1 - Complex Workflow Needed",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 1 (Oct 31, 2025)",
    content: `This CLIP was more complicated than normal. Standard process usually takes 3-4 hours. This engagement took about 8 hours due to additional parameters: aggregate limits by credit tier, monthly spend consideration, and multi-product handling. These are ad-hoc requests for extra consideration of parameters that aren't part of standard process.`
  },
  {
    id: "meeting4-chunk-1",
    title: "Finish CLIP Session 2 - Final Decision Categories",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 2 (Oct 31, 2025)",
    content: `Five decision values used: 'Proposed line' for straight approvals (13,843 records). 'DQ line of credit for credit card' (3,434 records). 'DQ above max aggregate' (1,180 records). 'Duplicate credit card for review' and 'Duplicate line of credit for review' for edge cases needing manual review.`
  },
  {
    id: "meeting4-chunk-2",
    title: "Finish CLIP Session 2 - Volume Analysis",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 2 (Oct 31, 2025)",
    content: `Started with 33,000 loans in portfolio. 18,796 qualified for line increase based on normal CLIP process. With additional aggregate limit parameters: 13,843 records received proposed line increases. Would have increased 18,000+ loans but client parameters limited output significantly. Still recommending 13,000 should get increased.`
  },
  {
    id: "meeting4-chunk-3",
    title: "Finish CLIP Session 2 - Edge Cases Handling",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 2 (Oct 31, 2025)",
    content: `For members with two credit cards or two lines of credit: 22 loans flagged for credit union review. We didn't get information on how to determine which line to increase (oldest card? highest balance? highest credit limit?). These were marked 'duplicate for review' - still qualify but client decides which to increase.`
  },
  {
    id: "meeting4-chunk-4",
    title: "Finish CLIP Session 2 - Client Communication",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 2 (Oct 31, 2025)",
    content: `Proposed limit field is what we suggest they increase to. Client can adjust as they see fit - they know their members. We always allow them to choose. If they want different logic (e.g., increase oldest card, highest balance), we can implement that in future workflows. Decision field added to explain reasoning for each loan.`
  },
  {
    id: "meeting4-chunk-5",
    title: "Finish CLIP Session 2 - Lessons Learned",
    category: "Meeting Transcripts",
    source: "Finish CLIP Session 2 (Oct 31, 2025)",
    content: `Key insight: Client gave parameters that limited results dramatically. Max aggregate by tier plus multi-product constraints significantly reduced eligible loans. Important to clarify ALL parameters upfront. Need to track which loans actually get increased for future analysis to measure performance of line increases.`
  }
];

// Categories for organization
export const categories = [
  "Overview",
  "Products",
  "Parameters",
  "Increase Tiers",
  "Aggregate Limits",
  "Exclusions",
  "Data Requirements",
  "Data Sources",
  "TransUnion",
  "Process Workflow",
  "Automation",
  "Automation Strategy",
  "Automation Approaches",
  "Automation Code",
  "Automation Configuration",
  "Automation dbt",
  "Automation Migration",
  "Automation Implementation",
  "Automation KPIs",
  "Alteryx Workflow",
  "File Paths",
  "Folder Setup",
  "Input Processing",
  "KPIs",
  "Risks",
  "Gaps",
  "Sales Channels",
  "Onboarding",
  "Migration",
  "Glossary",
  "Training",
  "Mind Map",
  "Value Stream",
  "Meeting Transcripts"
];

// Sources for citation
export const sources = [
  { id: "master", name: "CLIP_Master_Document_NotebookLM.md", type: "markdown", description: "Master documentation consolidated from all CLIP materials" },
  { id: "automation", name: "CLIP_Automation-POC.pdf", type: "pdf", description: "Proof of concept for CLIP automation framework" },
  { id: "alteryx", name: "CLIP Alteryx Automation POC.pdf", type: "pdf", description: "Alteryx workflow automation documentation" },
  { id: "mercy", name: "Mercy CLIP Notes.pdf", type: "pdf", description: "Operational notes and procedures from team member Mercy" },
  { id: "gap", name: "CLIP_Gap_Analysis.md", type: "markdown", description: "Gap analysis identifying missing documentation" },
  { id: "training", name: "CLIP_Training_Guide.md", type: "markdown", description: "Comprehensive training manual for CLIP" },
  { id: "mindmap", name: "CLIP_Mind_Map.md", type: "markdown", description: "Visual mind map of CLIP components" },
  { id: "vsm", name: "CLIP_Value_Stream_Map.md", type: "markdown", description: "Value stream mapping for CLIP process" },
  { id: "operational", name: "Operational Knowledge", type: "knowledge", description: "Additional operational knowledge from team discussions and user feedback" },
  // Meeting Recordings - Video files used for training
  { id: "meeting2", name: "CLIP Meeting 3 (Oct 30, 2025)", type: "video", description: "Meeting recording covering CLIP process walkthrough and team discussion", file: "2.) CLIP - meeting 3-20251030_140207-Meeting Recording - Copy.mp4", duration: "~45 min", size: "237 MB" },
  { id: "meeting3", name: "Finish CLIP Session 1 (Oct 31, 2025)", type: "video", description: "First CLIP completion session - detailed process review and Q&A", file: "3. ) Finish CLIP-20251031_131617-Meeting Recording (1) - Copy.mp4", duration: "~40 min", size: "201 MB" },
  { id: "meeting4", name: "Finish CLIP Session 2 (Oct 31, 2025)", type: "video", description: "Second CLIP completion session - final walkthrough and wrap-up", file: "4.) Finish CLIP-20251031_151052-Meeting Recording - Copy.mp4", duration: "~45 min", size: "234 MB" }
];

export default clipDocuments;
