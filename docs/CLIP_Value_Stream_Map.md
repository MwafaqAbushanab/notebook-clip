# CLIP Value Stream Map

## End-to-End Value Stream Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIP VALUE STREAM MAP                                                         │
│                              Credit Line Increase Program - Trellance/Rise Analytics                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                              VALUE FLOW
    ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                                           │
    │   CREDIT UNION                    TRELLANCE/RISE                           CREDIT UNION                   │
    │   (Customer)                      (Service Provider)                       (Customer)                     │
    │                                                                                                           │
    │   ┌─────────────┐                ┌────────────────────┐                   ┌─────────────┐                │
    │   │   REQUEST   │───────────────▶│     ANALYSIS       │──────────────────▶│   RESULTS   │                │
    │   │   INPUT     │                │     PROCESSING     │                   │   OUTPUT    │                │
    │   └─────────────┘                └────────────────────┘                   └─────────────┘                │
    │                                                                                                           │
    │   Lead Time: 2-3 Business Days                                                                            │
    │                                                                                                           │
    └──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Value Stream - Current State

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CURRENT STATE VALUE STREAM                                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                  │
│  PHASE 1                PHASE 2              PHASE 3              PHASE 4              PHASE 5                  │
│  ────────              ────────             ────────             ────────             ────────                  │
│                                                                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   SALES &    │    │    DATA      │    │   CREDIT     │    │   ANALYSIS   │    │   OUTPUT     │              │
│  │  ONBOARDING  │───▶│  COLLECTION  │───▶│   BUREAU     │───▶│     &        │───▶│  DELIVERY    │              │
│  │              │    │              │    │  PULL        │    │  DECISION    │    │              │              │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                  │                   │                   │                   │                        │
│         ▼                  ▼                   ▼                   ▼                   ▼                        │
│                                                                                                                  │
│  ACTORS:               ACTORS:              ACTORS:              ACTORS:              ACTORS:                   │
│  • Sales Team          • CU IT/Data         • TransUnion         • Data Analyst       • Data Analyst           │
│  • Account Mgr         • Data Analyst       • Data Analyst       • QA Reviewer        • Account Mgr            │
│  • CU Lending Mgr                                                                                               │
│                                                                                                                  │
│  ACTIVITIES:           ACTIVITIES:          ACTIVITIES:          ACTIVITIES:          ACTIVITIES:               │
│  • Initial contact     • Receive data       • Submit batch       • Apply parameters   • Generate reports       │
│  • Requirements        • Validate format    • API connection     • Eligibility        • Quality review         │
│  • Parameter setup     • Clean/transform    • Retrieve scores    • Utilization calc   • Email delivery         │
│  • Contract/SOW        • Create unique ID   • Parse 419 fields   • Risk scoring       • Client call            │
│                        • Load to system     • Merge datasets     • Recommendations    • Archive files          │
│                                                                  • Compliance check                             │
│                                                                                                                  │
│  CYCLE TIME:           CYCLE TIME:          CYCLE TIME:          CYCLE TIME:          CYCLE TIME:               │
│  1-5 days              2-4 hours            4-8 hours            4-8 hours            2-4 hours                 │
│  (new clients)                                                                                                   │
│                                                                                                                  │
│  WAIT TIME:            WAIT TIME:           WAIT TIME:           WAIT TIME:           WAIT TIME:                │
│  Variable              0-24 hours           0-4 hours            0-2 hours            0-1 hour                  │
│  (client response)     (queue)              (batch processing)   (analyst avail)      (review queue)            │
│                                                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Value Stream Metrics

| Metric | Current State | Target State | Improvement |
|--------|---------------|--------------|-------------|
| **Total Lead Time** | 2-3 days | 4-8 hours | 75% reduction |
| **Processing Time** | 8-16 hours | 2-4 hours | 75% reduction |
| **Wait Time** | 1-2 days | 1-2 hours | 90% reduction |
| **Manual Touchpoints** | 8-12 | 2-3 | 75% reduction |
| **Error Rate** | 2-5% | <0.5% | 80% reduction |
| **Throughput** | 5-10 CUs/week | 20-30 CUs/week | 200% increase |

---

## Sales Channel Value Streams

### Channel 1: MDPA Portal (Self-Service)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           MDPA PORTAL VALUE STREAM                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   CU Logs into         CU Uploads          System Auto-         Results Available       │
│   MDPA Portal    ───▶  Member Data   ───▶  Processes      ───▶  in Portal              │
│                                                                                          │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐              │
│   │ ACCESS  │         │ UPLOAD  │         │ PROCESS │         │ DELIVER │              │
│   └─────────┘         └─────────┘         └─────────┘         └─────────┘              │
│       │                   │                   │                   │                     │
│       ▼                   ▼                   ▼                   ▼                     │
│   5 min               15-30 min           4-8 hours           Immediate                 │
│                                           (batch)                                        │
│                                                                                          │
│   VALUE:              VALUE:              VALUE:              VALUE:                    │
│   • Self-service      • Standardized      • Automated         • Instant access         │
│   • No wait           • Validated         • Consistent        • Downloadable           │
│   • Available 24/7    • Error-checked     • Scalable          • Historical view        │
│                                                                                          │
│   WASTE:              WASTE:              WASTE:              WASTE:                    │
│   • Learning curve    • Format issues     • Batch delays      • Limited customization  │
│                       • Re-uploads        • No rush option                              │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Channel 2: Consulting Engagement (Custom)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                        CONSULTING ENGAGEMENT VALUE STREAM                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   Discovery &         Custom              Analysis &           Report &                 │
│   Scoping       ───▶  Configuration ───▶  Processing    ───▶  Presentation            │
│                                                                                          │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐              │
│   │ SCOPE   │         │ DESIGN  │         │ EXECUTE │         │ PRESENT │              │
│   └─────────┘         └─────────┘         └─────────┘         └─────────┘              │
│       │                   │                   │                   │                     │
│       ▼                   ▼                   ▼                   ▼                     │
│   1-3 days            1-2 days            1-3 days            1-2 hours                 │
│                                                                                          │
│   VALUE:              VALUE:              VALUE:              VALUE:                    │
│   • Custom fit        • Tailored rules    • Expert analysis   • Insights               │
│   • Strategic input   • Risk appetite     • Multiple products • Recommendations        │
│   • Relationship      • Special handling  • Deep dive         • Q&A session            │
│                                                                                          │
│   WASTE:              WASTE:              WASTE:              WASTE:                    │
│   • Long cycle        • Manual config     • One-off work      • Scheduling             │
│   • Resource heavy    • Rework possible   • Not reusable      • Travel (if onsite)     │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Channel 3: Enterprise/Recurring (Batch)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                         ENTERPRISE RECURRING VALUE STREAM                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   Scheduled           Auto Data           Automated            Auto                     │
│   Trigger       ───▶  Pull          ───▶  Processing    ───▶  Delivery                 │
│                                                                                          │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐              │
│   │ TRIGGER │         │ EXTRACT │         │ ANALYZE │         │ SEND    │              │
│   └─────────┘         └─────────┘         └─────────┘         └─────────┘              │
│       │                   │                   │                   │                     │
│       ▼                   ▼                   ▼                   ▼                     │
│   Automatic           30-60 min           2-4 hours           15 min                    │
│   (calendar)                                                                             │
│                                                                                          │
│   VALUE:              VALUE:              VALUE:              VALUE:                    │
│   • Predictable       • Direct connect    • No intervention   • Consistent timing      │
│   • No manual start   • Fresh data        • Standardized      • Multiple formats       │
│   • SLA-driven        • Snowflake schemas • Auditable         • Automated alerts       │
│                                                                                          │
│   WASTE:              WASTE:              WASTE:              WASTE:                    │
│   • Fixed schedule    • Connection issues • Config drift      • Email failures         │
│   • Can't rush        • Schema changes    • No flexibility    • Wrong recipients       │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Process Flow (Per Credit Union)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DETAILED PROCESS FLOW                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤

START: Credit Union Analysis Run
│
├──► STEP 1: INITIALIZATION
│    ├── Load CU-specific config file
│    ├── Validate required parameters
│    ├── Establish database connections (Snowflake TR_ANALYTICS_*)
│    └── Initialize logging
│
├──► STEP 2: DATA EXTRACTION [MACRO: data_extraction_macro()]
│    ├── Extract member demographics
│    ├── Pull account balances & history
│    ├── Get transaction patterns (6-12 months)
│    ├── Retrieve credit scores
│    ├── Load payment history
│    └── Apply exclusion lists
│    │
│    └──► Output: raw_member_data DataFrame
│
├──► STEP 3: ELIGIBILITY SCREENING [MACRO: eligibility_filter_macro()]
│    ├── Account age check (>= minimum months)
│    ├── Payment history validation (no 30+ day lates)
│    ├── Minimum balance requirements
│    ├── Credit score threshold (>=650 default)
│    ├── Debt-to-income ratio check (<=50% default)
│    └── Exclude charged-off/collections
│    │
│    └──► Output: eligible_members, rejection_log
│
├──► STEP 4: UTILIZATION ANALYSIS [MACRO: utilization_calculation_macro()]
│    ├── Calculate current utilization %
│    ├── Analyze utilization trends
│    ├── Identify high utilizers (>70%)
│    ├── Calculate available credit headroom
│    └── Segment by utilization bands
│    │
│    └──► Output: utilization_metrics
│
├──► STEP 5: RISK ASSESSMENT [MACRO: risk_assessment_macro()]
│    ├── Credit score banding
│    ├── Income verification check
│    ├── Employment stability
│    ├── Recent inquiry analysis
│    ├── Bankruptcy/foreclosure screening
│    └── Calculate composite risk score (0-100)
│    │
│    └──► Output: risk_scores, risk_bands (Low/Medium/High)
│
├──► STEP 6: RECOMMENDATION ENGINE [MACRO: recommendation_engine_macro()]
│    ├── Determine increase method:
│    │   • Percentage-based (e.g., 20-50%)
│    │   • Fixed amount tiers
│    │   • Income-based limits
│    ├── Apply business rule caps
│    ├── Calculate new utilization post-increase
│    └── Generate confidence score
│    │
│    └──► Output: recommendations (new_limit, increase_amount, confidence)
│
├──► STEP 7: COMPLIANCE & VALIDATION [MACRO: compliance_check_macro()]
│    ├── Regulatory limit checks (e.g., TILA)
│    ├── Internal policy validation
│    ├── Cross-account exposure check
│    ├── Documentation requirements
│    └── Approval threshold routing
│    │
│    └──► Output: final_approved_list, compliance_flags
│
├──► STEP 8: OUTPUT GENERATION [MACRO: output_generator_macro()]
│    ├── Create approved members list (CSV/Excel)
│    ├── Generate detailed analysis report
│    ├── Produce rejection report with reasons
│    ├── Executive summary dashboard
│    ├── Data quality metrics
│    └── Audit trail documentation
│    │
│    └──► Output: approved_list.csv, analysis_report.xlsx, rejection_details.csv, executive_summary.pdf
│
├──► STEP 9: POST-PROCESSING [MACRO: audit_logging_macro()]
│    ├── Send email notifications
│    ├── Upload to shared drive/S3
│    ├── Update tracking database
│    ├── Archive input parameters
│    └── Generate performance metrics
│
└──► END: Analysis Complete

└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Information Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    INFORMATION FLOW                                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤

    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                    INPUT LAYER                                                  │
    │                                                                                                 │
    │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
    │   │ CU Config   │   │ Member/Acct │   │ TransUnion  │   │ Exclusion   │   │ Reference   │     │
    │   │ (JSON/YAML) │   │ Data        │   │ Credit Data │   │ Lists       │   │ Data        │     │
    │   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘     │
    │          │                 │                 │                 │                 │             │
    └──────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────┘
               │                 │                 │                 │                 │
               ▼                 ▼                 ▼                 ▼                 ▼
    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                   PROCESSING ENGINE                                             │
    │                                                                                                 │
    │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
    │   │ Data        │   │ Eligibility │   │ Utilization │   │ Risk        │   │ Recommend-  │     │
    │   │ Extraction  │──▶│ Filter      │──▶│ Calculator  │──▶│ Assessment  │──▶│ ation       │     │
    │   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘     │
    │                                                                                   │             │
    │                                                                                   ▼             │
    │                                                                           ┌─────────────┐     │
    │                                                                           │ Compliance  │     │
    │                                                                           │ Check       │     │
    │                                                                           └──────┬──────┘     │
    │                                                                                  │             │
    └──────────────────────────────────────────────────────────────────────────────────┼─────────────┘
                                                                                       │
                                                                                       ▼
    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                    OUTPUT LAYER                                                 │
    │                                                                                                 │
    │   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
    │   │ Approved    │   │ Rejection   │   │ Analysis    │   │ Executive   │   │ Audit       │     │
    │   │ List        │   │ Details     │   │ Report      │   │ Summary     │   │ Trail       │     │
    │   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘     │
    │                                                                                                 │
    └────────────────────────────────────────────────────────────────────────────────────────────────┘
               │                 │                 │                 │                 │
               ▼                 ▼                 ▼                 ▼                 ▼
    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                   MONITORING & ALERTING                                         │
    │                                                                                                 │
    │   • Email notifications on completion                                                           │
    │   • Error alerts and failure notifications                                                      │
    │   • Performance metrics and runtime stats                                                       │
    │   • Data quality threshold alerts                                                               │
    │                                                                                                 │
    └────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Value Stream Waste Analysis (7 Wastes of Lean)

| Waste Type | Current State Examples | Improvement Opportunities |
|------------|------------------------|---------------------------|
| **Overproduction** | Creating reports no one reads | Configurable output preferences per CU |
| **Waiting** | Queue time for analyst availability | Automated processing, parallel execution |
| **Transport** | Manual file transfers between systems | Direct Snowflake connections, automated uploads |
| **Extra Processing** | Re-running due to parameter errors | Validation at input, config templates |
| **Inventory** | Backlog of CU requests | Scalable automation, self-service portal |
| **Motion** | Switching between tools/systems | Unified automation framework |
| **Defects** | Data errors, wrong parameters | Input validation, audit trails, QA checks |

---

## Future State Value Stream

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FUTURE STATE VALUE STREAM                                                     │
│                              (With Modular Macro-Driven Automation)                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │  SCHEDULED   │    │  AUTOMATED   │    │  AUTOMATED   │    │  AUTOMATED   │    │  AUTOMATED   │              │
│  │  TRIGGER     │───▶│  DATA PULL   │───▶│  PROCESSING  │───▶│  QA CHECK    │───▶│  DELIVERY    │              │
│  │              │    │              │    │  (8 Macros)  │    │              │    │              │              │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                  │                   │                   │                   │                        │
│         ▼                  ▼                   ▼                   ▼                   ▼                        │
│   No human needed    Direct Snowflake    Parallel CU        Auto validation    Email + S3 upload              │
│   Calendar/cron      TR_ANALYTICS_*      execution          Data quality       Multiple formats               │
│                                          Reusable macros    Alerts on issues   Audit trail                    │
│                                                                                                                  │
│  CYCLE TIME:           CYCLE TIME:          CYCLE TIME:          CYCLE TIME:          CYCLE TIME:               │
│  0 (automated)         30-60 min            1-2 hours            15 min               15 min                    │
│                                                                                                                  │
│  WAIT TIME:            WAIT TIME:           WAIT TIME:           WAIT TIME:           WAIT TIME:                │
│  0                     0                    0                    0                    0                         │
│                                                                                                                  │
│                                                                                                                  │
│  KEY BENEFITS:                                                                                                  │
│  ─────────────                                                                                                  │
│  1. Modularity: Each macro is independent and testable                                                          │
│  2. Reusability: Same macros work across all credit unions                                                      │
│  3. Configurability: Business rules in config files, not code                                                   │
│  4. Scalability: Easy to add new credit unions                                                                  │
│  5. Maintainability: Changes to logic in one place                                                              │
│  6. Auditability: Comprehensive logging and tracking                                                            │
│  7. Transparency: Clear data lineage                                                                            │
│  8. Flexibility: Multiple output formats and delivery methods                                                   │
│                                                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Macro Library Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MACRO LIBRARY (Reusable Components)                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                                  │
│   ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐│
│   │  data_extraction_      │  │  eligibility_filter_   │  │  utilization_          │  │  risk_assessment_      ││
│   │  macro()               │  │  macro()               │  │  calculation_macro()   │  │  macro()               ││
│   ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤│
│   │ IN:                    │  │ IN:                    │  │ IN:                    │  │ IN:                    ││
│   │ • tenant_id            │  │ • raw_member_data      │  │ • account_balance_data │  │ • credit_scores        ││
│   │ • lookback_period      │  │ • config_rules         │  │ • credit_limit_data    │  │ • payment_history      ││
│   │ • date_range           │  │                        │  │ • historical_snapshots │  │ • income_data          ││
│   ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤│
│   │ OUT:                   │  │ OUT:                   │  │ OUT:                   │  │ OUT:                   ││
│   │ • DataFrame with       │  │ • filtered_DataFrame   │  │ • utilization_metrics  │  │ • risk_score (0-100)   ││
│   │   member/account data  │  │ • rejection_log        │  │ • trend_indicators     │  │ • risk_band            ││
│   │ • transaction_history  │  │                        │  │                        │  │ • contributing_factors ││
│   │ • credit_scores        │  │                        │  │                        │  │                        ││
│   └────────────────────────┘  └────────────────────────┘  └────────────────────────┘  └────────────────────────┘│
│                                                                                                                  │
│   ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐│
│   │  recommendation_       │  │  compliance_check_     │  │  output_generator_     │  │  audit_logging_        ││
│   │  engine_macro()        │  │  macro()               │  │  macro()               │  │  macro()               ││
│   ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤│
│   │ IN:                    │  │ IN:                    │  │ IN:                    │  │ IN:                    ││
│   │ • eligible_accounts    │  │ • recommendations      │  │ • approved_list        │  │ • processing_events    ││
│   │ • risk_scores          │  │ • compliance_rules     │  │ • analysis_data        │  │ • config_used          ││
│   │ • current_limits       │  │ • member_exposure      │  │ • config_settings      │  │ • results_summary      ││
│   │ • strategy_config      │  │                        │  │                        │  │                        ││
│   ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤  ├────────────────────────┤│
│   │ OUT:                   │  │ OUT:                   │  │ OUT:                   │  │ OUT:                   ││
│   │ • new_limit            │  │ • pass/fail_flag       │  │ • CSV/Excel files      │  │ • detailed_audit_trail ││
│   │ • increase_amount      │  │ • documentation_list   │  │ • PDF reports          │  │ • performance_metrics  ││
│   │ • confidence_score     │  │ • approval_routing     │  │ • summary_dashboards   │  │ • error_logs           ││
│   │ • approval_routing     │  │                        │  │                        │  │                        ││
│   └────────────────────────┘  └────────────────────────┘  └────────────────────────┘  └────────────────────────┘│
│                                                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Value Stream Metrics & KPIs

| KPI | Definition | Current | Target |
|-----|------------|---------|--------|
| **Total Eligible Accounts** | Members meeting all eligibility criteria | Varies | Maximize |
| **Total Approved Accounts** | Members receiving CLI approval | Varies | 60-70% of eligible |
| **CLI Approval Rate** | Approved / Eligible | 50-60% | 65-75% |
| **Avg Credit Line Increase** | Average dollar increase per approval | $2,000 | $2,500 |
| **Incremental Credit Exposure** | Total new credit extended | Varies | Track monthly |
| **Risk Score Distribution** | Breakdown by credit score tier | Monitor | Balance risk/reward |
| **Processing Accuracy** | Error rate in analysis | 2-5% | <1% |
| **Turnaround Time** | Request to delivery | 2-3 days | 4-8 hours |
| **CU Satisfaction** | Client satisfaction score | 80% | 95% |

---

*Document Generated: January 2026*
*Source: Consolidated from meeting transcripts, POC documents, and training materials*
