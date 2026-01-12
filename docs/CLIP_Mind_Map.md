# CLIP (Credit Line Increase Program) Mind Map

## Overview Structure

```
                                    ┌─────────────────────────────────────┐
                                    │     CLIP - Credit Line Increase     │
                                    │            Program                   │
                                    │     (Trellance/Rise Analytics)      │
                                    │         Since 2015-2016             │
                                    └─────────────────┬───────────────────┘
                                                      │
        ┌─────────────────┬───────────────┬──────────┴──────────┬───────────────┬─────────────────┐
        │                 │               │                     │               │                 │
        ▼                 ▼               ▼                     ▼               ▼                 ▼
   ┌─────────┐      ┌─────────┐    ┌───────────┐         ┌───────────┐   ┌───────────┐    ┌───────────┐
   │ Products │      │ Data    │    │ Parameters│         │ Process   │   │ Outputs   │    │ Technology│
   │          │      │ Sources │    │ & Rules   │         │ Workflow  │   │ & KPIs    │    │ Stack     │
   └────┬────┘      └────┬────┘    └─────┬─────┘         └─────┬─────┘   └─────┬─────┘    └─────┬─────┘
        │                │               │                     │               │                │
```

---

## 1. PRODUCTS BRANCH

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PRODUCTS                                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐                     │
│   │  Credit Cards   │    │   Unsecured     │    │     HELOCs      │                     │
│   │                 │    │ Lines of Credit │    │                 │                     │
│   └────────┬────────┘    └────────┬────────┘    └────────┬────────┘                     │
│            │                      │                      │                               │
│            ▼                      ▼                      ▼                               │
│   • Most common product   • Standard LOC        • Home Equity LOC                       │
│   • 1+ year origination   • Variable terms      • Collateralized                        │
│   • Max $20K limit        • Higher risk tier    • Different risk profile                │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DATA SOURCES BRANCH

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  DATA SOURCES                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌───────────────────────────────────────────────────────────────────────────────┐     │
│   │                         PRIMARY SOURCES                                        │     │
│   ├───────────────────────────────────────────────────────────────────────────────┤     │
│   │                                                                                │     │
│   │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                     │     │
│   │   │    MDPA     │     │ Consulting  │     │   Client    │                     │     │
│   │   │   Portal    │     │ Engagements │     │   Files     │                     │     │
│   │   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                     │     │
│   │          │                   │                   │                             │     │
│   │          ▼                   ▼                   ▼                             │     │
│   │   • Automated data    • Custom analysis   • Direct uploads                    │     │
│   │   • Portal access     • Tailored params   • Variable formats                  │     │
│   │   • Standardized      • Project-based     • Manual processing                 │     │
│   │                                                                                │     │
│   └───────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
│   ┌───────────────────────────────────────────────────────────────────────────────┐     │
│   │                      CREDIT BUREAU (TransUnion)                                │     │
│   ├───────────────────────────────────────────────────────────────────────────────┤     │
│   │                                                                                │     │
│   │   • 419 available fields from TransUnion                                       │     │
│   │   • Real-time credit pulls                                                     │     │
│   │   • FICO Score data                                                            │     │
│   │   • DTI calculations                                                           │     │
│   │   • Trade line information                                                     │     │
│   │   • Inquiry data                                                               │     │
│   │                                                                                │     │
│   └───────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
│   ┌───────────────────────────────────────────────────────────────────────────────┐     │
│   │                         REQUIRED DATA FIELDS                                   │     │
│   ├───────────────────────────────────────────────────────────────────────────────┤     │
│   │                                                                                │     │
│   │   CRITICAL (Must Have)           │   IMPORTANT (Should Have)                  │     │
│   │   ─────────────────────          │   ────────────────────────                 │     │
│   │   • Account Number               │   • Income                                 │     │
│   │   • SSN (Last 4 or Full)         │   • DTI                                    │     │
│   │   • First Name / Last Name       │   • Days Past Due                          │     │
│   │   • Date of Birth                │   • Product Type                           │     │
│   │   • Current Credit Limit         │   • Origination Date                       │     │
│   │   • Current Balance              │   • FICO Score (if available)              │     │
│   │                                  │   • Payment History                        │     │
│   │                                                                                │     │
│   └───────────────────────────────────────────────────────────────────────────────┘     │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. PARAMETERS & RULES BRANCH

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              PARAMETERS & RULES                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                     STANDARD ELIGIBILITY THRESHOLDS                              │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   Parameter               │ Standard Value  │ Notes                             │   │
│   │   ────────────────────────┼─────────────────┼──────────────────────────────     │   │
│   │   Minimum Income          │ $20,000         │ Annual gross income               │   │
│   │   Minimum FICO Score      │ 650             │ Credit bureau score               │   │
│   │   Maximum DTI             │ 50%             │ Debt-to-Income ratio              │   │
│   │   Minimum Age             │ 21 years        │ Member age requirement            │   │
│   │   Maximum Credit Limit    │ $20,000         │ Per product cap                   │   │
│   │   Card Origination        │ > 1 year        │ Time since product opened         │   │
│   │   FICO Drop Threshold     │ -50 points      │ From origination to current       │   │
│   │   Minimum Payment         │ 3%              │ Min payment threshold             │   │
│   │   Days Past Due           │ 0               │ Current on all payments           │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                      CREDIT LINE INCREASE TIERS                                  │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   Current Limit          │ Increase To      │ Increase Amount                   │   │
│   │   ───────────────────────┼──────────────────┼────────────────────────────────   │   │
│   │   < $1,000               │ $1,500           │ +$500 to +$1,500                  │   │
│   │   $1,000 - $2,000        │ $3,000           │ +$1,000 to +$2,000                │   │
│   │   $2,000 - $3,000        │ $5,000           │ +$2,000 to +$3,000                │   │
│   │   $3,000 - $5,000        │ $7,500           │ +$2,500 to +$4,500                │   │
│   │   $5,000 - $7,500        │ $10,000          │ +$2,500 to +$5,000                │   │
│   │   $7,500 - $10,000       │ $15,000          │ +$5,000 to +$7,500                │   │
│   │   $10,000 - $15,000      │ $20,000          │ +$5,000 to +$10,000               │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                   MAX AGGREGATE LIMITS BY CREDIT SCORE                           │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   Credit Score Range     │ Max Aggregate Limit                                  │   │
│   │   ───────────────────────┼──────────────────────────────────────────────────    │   │
│   │   776 - 850 (Excellent)  │ $25,000                                              │   │
│   │   726 - 775 (Good)       │ $18,000                                              │   │
│   │   650 - 725 (Fair)       │ $13,000                                              │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                         EXCLUSION CRITERIA                                       │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   • Bankruptcy (active or recent)                                                │   │
│   │   • Charged-off accounts                                                         │   │
│   │   • Collections activity                                                         │   │
│   │   • Recent delinquencies (30/60/90 days)                                         │   │
│   │   • Fraud alerts on credit file                                                  │   │
│   │   • Deceased indicator                                                           │   │
│   │   • Credit freeze in place                                                       │   │
│   │   • Overlimit on existing products                                               │   │
│   │   • Recent credit limit increase (within 6-12 months)                            │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. PROCESS WORKFLOW BRANCH

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               PROCESS WORKFLOW                                           │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                        HIGH-LEVEL PROCESS FLOW                                   │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐ │   │
│   │   │  DATA    │───▶│ TRANS-   │───▶│ ANALYSIS │───▶│ DECISION │───▶│ OUTPUT   │ │   │
│   │   │  INPUT   │    │ UNION    │    │ ENGINE   │    │ ENGINE   │    │ DELIVERY │ │   │
│   │   └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘ │   │
│   │        │               │               │               │               │        │   │
│   │        ▼               ▼               ▼               ▼               ▼        │   │
│   │   • Member data   • Credit pull   • Parameter     • Approve/      • Reports   │   │
│   │   • Account info  • 419 fields    • application   • Reject        • Lists     │   │
│   │   • Validation    • FICO score    • Scoring       • Tier assign   • Delivery  │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                   DETAILED ALTERYX WORKFLOW STAGES                               │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   STAGE 1: DATA PREPARATION                                                      │   │
│   │   ─────────────────────────────                                                  │   │
│   │   • Input Tool → Read member/account data                                        │   │
│   │   • Data Cleansing Tool → Standardize formats                                    │   │
│   │   • Select Tool → Choose required fields                                         │   │
│   │   • Formula Tool → Create unique identifiers (SSN + DOB)                         │   │
│   │                                                                                  │   │
│   │   STAGE 2: TRANSUNION INTEGRATION                                                │   │
│   │   ───────────────────────────────                                                │   │
│   │   • Download Tool → API call to TransUnion                                       │   │
│   │   • JSON Parse Tool → Parse credit bureau response                               │   │
│   │   • Cross Tab Tool → Restructure credit data                                     │   │
│   │   • Join Tool → Merge credit data with member data                               │   │
│   │                                                                                  │   │
│   │   STAGE 3: ANALYSIS & SCORING                                                    │   │
│   │   ───────────────────────────                                                    │   │
│   │   • Multi-Row Formula → Calculate rolling metrics                                │   │
│   │   • Filter Tool → Apply eligibility criteria                                     │   │
│   │   • Formula Tool → Calculate DTI, payment ratios                                 │   │
│   │   • Summarize Tool → Aggregate multi-product members                             │   │
│   │                                                                                  │   │
│   │   STAGE 4: DECISIONING                                                           │   │
│   │   ───────────────────                                                            │   │
│   │   • Filter Tool → Apply hard exclusions                                          │   │
│   │   • Formula Tool → Determine increase tier                                       │   │
│   │   • Union Tool → Combine approved streams                                        │   │
│   │   • Unique Tool → Handle duplicates/multi-product                                │   │
│   │                                                                                  │   │
│   │   STAGE 5: OUTPUT GENERATION                                                     │   │
│   │   ──────────────────────────                                                     │   │
│   │   • Output Data Tool → Generate approved list                                    │   │
│   │   • Output Data Tool → Generate rejected list with reasons                       │   │
│   │   • Render Tool → Create executive summary                                       │   │
│   │   • Email Tool → Deliver to client                                               │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                          TURNAROUND TIME                                         │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   Standard Processing: 2-3 Business Days                                         │   │
│   │                                                                                  │   │
│   │   Day 1: Data receipt, validation, TransUnion batch submission                   │   │
│   │   Day 2: Credit data processing, analysis, decisioning                           │   │
│   │   Day 3: QA review, output generation, delivery                                  │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. OUTPUTS & KPIs BRANCH

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                OUTPUTS & KPIs                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                          DELIVERABLES                                            │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │   │
│   │   │  Approved List  │    │  Rejected List  │    │   Executive     │             │   │
│   │   │                 │    │                 │    │    Summary      │             │   │
│   │   └────────┬────────┘    └────────┬────────┘    └────────┬────────┘             │   │
│   │            │                      │                      │                       │   │
│   │            ▼                      ▼                      ▼                       │   │
│   │   • Member details        • Member details       • Campaign overview            │   │
│   │   • Current limit         • Rejection reason     • Approval rate                │   │
│   │   • New limit             • Failed criteria      • Total exposure               │   │
│   │   • Increase amount       • Recommendation       • Tier distribution            │   │
│   │   • Credit score tier                            • Risk metrics                 │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                     KEY PERFORMANCE INDICATORS                                   │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   KPI                           │ Description                                    │   │
│   │   ──────────────────────────────┼────────────────────────────────────────────── │   │
│   │   Total Eligible Accounts       │ Members meeting all eligibility criteria      │   │
│   │   Total Approved Accounts       │ Members receiving CLI approval                │   │
│   │   CLI Approval Rate             │ Approved / Eligible (target: 60-70%)          │   │
│   │   Avg Credit Line Increase      │ Average dollar increase per approval          │   │
│   │   Incremental Credit Exposure   │ Total new credit extended                     │   │
│   │   Risk Score Distribution       │ Breakdown by credit score tier                │   │
│   │   Processing Accuracy           │ Error rate in analysis (target: <1%)          │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. TECHNOLOGY STACK BRANCH

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                                            │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                      CURRENT STATE (Alteryx-Based)                               │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                       │   │
│   │   │  Alteryx    │     │  SQL Server │     │   Excel/    │                       │   │
│   │   │  Designer   │     │  Database   │     │   CSV       │                       │   │
│   │   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                       │   │
│   │          │                   │                   │                               │   │
│   │          ▼                   ▼                   ▼                               │   │
│   │   • Workflow design   • Data storage      • Input/Output                        │   │
│   │   • Data processing   • Client configs    • Deliverables                        │   │
│   │   • TransUnion API    • Historical data   • Manual review                       │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                    AUTOMATION OPTIONS                                            │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   OPTION 1: Direct Alteryx Automation (1-2 weeks)                               │   │
│   │   ──────────────────────────────────────────────                                │   │
│   │   • PowerShell orchestration                                                    │   │
│   │   • Alteryx Engine CLI                                                          │   │
│   │   • JSON configuration files                                                    │   │
│   │   • Minimal code changes                                                        │   │
│   │                                                                                  │   │
│   │   OPTION 2: Hybrid Alteryx + Python (4-6 weeks)                                 │   │
│   │   ─────────────────────────────────────────────                                 │   │
│   │   • Python workflow generator                                                   │   │
│   │   • Alteryx for core processing                                                 │   │
│   │   • Python for pre/post processing                                              │   │
│   │   • Enhanced monitoring                                                         │   │
│   │                                                                                  │   │
│   │   OPTION 3: Full Python/dbt Migration (8-12 weeks)                              │   │
│   │   ────────────────────────────────────────────────                              │   │
│   │   • Complete Python rewrite                                                     │   │
│   │   • dbt for transformations                                                     │   │
│   │   • Snowflake/cloud data warehouse                                              │   │
│   │   • Full orchestration (Airflow/Prefect)                                        │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│   │                    PROPOSED FOLDER STRUCTURE                                     │   │
│   ├─────────────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                                  │   │
│   │   CLIP_ALTERYX_AUTOMATION/                                                       │   │
│   │   ├── workflows/                                                                │   │
│   │   │   ├── templates/          # Master workflow templates                       │   │
│   │   │   └── runtime/            # Generated CU-specific workflows                 │   │
│   │   ├── config/                                                                   │   │
│   │   │   ├── credit_unions.json  # CU-specific configurations                      │   │
│   │   │   ├── database_connections.json                                             │   │
│   │   │   └── email_config.json                                                     │   │
│   │   ├── scripts/                                                                  │   │
│   │   │   ├── orchestrator.ps1    # Main orchestration script                       │   │
│   │   │   ├── workflow_generator.py                                                 │   │
│   │   │   ├── alteryx_executor.py                                                   │   │
│   │   │   └── post_processor.py                                                     │   │
│   │   ├── inputs/                                                                   │   │
│   │   │   ├── exclusion_lists/                                                      │   │
│   │   │   └── reference_data/                                                       │   │
│   │   ├── outputs/                                                                  │   │
│   │   │   └── YYYY-MM/CU_XXX/     # Organized by date and CU                        │   │
│   │   ├── logs/                                                                     │   │
│   │   └── monitoring/                                                               │   │
│   │                                                                                  │   │
│   └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. STAKEHOLDERS & ROLES

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            STAKEHOLDERS & ROLES                                          │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   INTERNAL (Trellance/Rise)                                                             │
│   ─────────────────────────                                                             │
│   • Data Analysts - Run CLIP analyses, configure parameters                             │
│   • Implementation Team - Client onboarding, setup                                       │
│   • Account Managers - Client relationships, escalations                                 │
│   • Sales Team - New client acquisition                                                  │
│   • Technical Support - Issue resolution                                                 │
│                                                                                          │
│   EXTERNAL (Credit Unions)                                                              │
│   ────────────────────────                                                              │
│   • Lending Managers - Approve CLI campaigns, set risk appetite                         │
│   • IT/Data Teams - Provide member data, receive outputs                                │
│   • Marketing Teams - Member communication campaigns                                     │
│   • Compliance Officers - Regulatory review, ECOA/FCRA                                  │
│                                                                                          │
│   SALES CHANNELS                                                                        │
│   ──────────────                                                                        │
│   • MDPA Portal Users - Self-service through portal                                     │
│   • Consulting Engagements - Custom analysis projects                                   │
│   • Enterprise Clients - Large CUs with custom needs                                    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. RISKS & CONSIDERATIONS

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           RISKS & CONSIDERATIONS                                         │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   CREDIT UNION RISKS                    │   OPERATIONAL RISKS                           │
│   ─────────────────────                 │   ────────────────────                        │
│   • Credit Risk Exposure                │   • Data Quality Issues                       │
│   • Regulatory Compliance (ECOA/FCRA)   │   • TransUnion API Failures                   │
│   • Portfolio Concentration             │   • Processing Delays                         │
│                                         │   • Parameter Misconfiguration                │
│                                         │   • Duplicate Handling Errors                 │
│                                         │   • Version Control Issues                    │
│                                         │   • Security/PII Exposure                     │
│                                         │   • Staff Knowledge Gaps                      │
│                                                                                          │
│   MITIGATION STRATEGIES                                                                 │
│   ─────────────────────                                                                 │
│   • Automated validation rules                                                          │
│   • Dual review process for large campaigns                                             │
│   • Comprehensive audit logging                                                         │
│   • Regular parameter review cadence                                                    │
│   • Standardized documentation                                                          │
│   • Cross-training team members                                                         │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference Summary

| Aspect | Details |
|--------|---------|
| **Program** | Credit Line Increase Program (CLIP) |
| **Since** | 2015-2016 |
| **Owner** | Trellance / Rise Analytics |
| **Products** | Credit Cards, Unsecured LOC, HELOCs |
| **Data Sources** | MDPA Portal, Consulting, Client Files |
| **Credit Bureau** | TransUnion (419 fields) |
| **Min FICO** | 650 |
| **Min Income** | $20,000 |
| **Max DTI** | 50% |
| **Turnaround** | 2-3 business days |
| **Technology** | Alteryx (current), Python/dbt (future) |

---

*Document Generated: January 2026*
*Source: Consolidated from meeting transcripts, training materials, and technical documentation*
