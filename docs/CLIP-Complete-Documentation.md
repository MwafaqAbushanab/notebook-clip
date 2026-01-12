# CLIP (Credit Line Increase Program) - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Products](#products)
3. [Eligibility Requirements](#eligibility-requirements)
4. [Credit Line Increase Tiers](#credit-line-increase-tiers)
5. [Aggregate Limits](#aggregate-limits)
6. [Exclusion Criteria](#exclusion-criteria)
7. [Process Workflow](#process-workflow)
8. [TransUnion Integration](#transunion-integration)
9. [Alteryx Workflow Structure](#alteryx-workflow-structure)
10. [Automation Strategy](#automation-strategy)
11. [Folder Setup & File Management](#folder-setup--file-management)
12. [KPIs & Metrics](#kpis--metrics)
13. [Risks & Mitigation](#risks--mitigation)
14. [Glossary](#glossary)

---

## Overview

**CLIP (Credit Line Increase Program)** is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions.

| Attribute | Value |
|-----------|-------|
| Organization | Trellance / Rise Analytics |
| Operating Since | 2015-2016 |
| Standard Turnaround | 2-3 business days |
| Typical Approval Rate | 60-70% of eligible members |
| Credit Bureau Partner | TransUnion (419 fields) |
| Current Technology | Alteryx workflows |
| Future Technology | Python/dbt migration |

### Value Proposition

**For Credit Unions:**
- Increase revenue through expanded credit availability
- Improve member satisfaction with proactive offers
- Optimize credit portfolio performance

**For Members:**
- Access to additional credit when needed
- Recognition of good payment history
- No hard inquiry required (soft pull)

**For Trellance:**
- Recurring revenue stream
- Strengthened client relationships
- Scalable analytics service

---

## Products

CLIP analyzes three product types:

### 1. Credit Cards
- **Description:** Most common product for CLI analysis
- **Requirements:** Minimum 1 year since origination
- **Maximum Limit:** $20,000
- **Risk Level:** Standard

### 2. Unsecured Lines of Credit (LOC)
- **Description:** Variable terms LOC products
- **Requirements:** Same eligibility criteria apply
- **Maximum Limit:** Subject to aggregate limits
- **Risk Level:** Higher

### 3. HELOCs (Home Equity Lines of Credit)
- **Description:** Collateralized home equity products
- **Requirements:** Requires property valuation
- **Maximum Limit:** Different parameters per credit union
- **Risk Level:** Collateralized (lower risk)

---

## Eligibility Requirements

| Parameter | Value | Description |
|-----------|-------|-------------|
| Minimum Income | $20,000 | Annual gross income floor |
| Minimum FICO Score | 650 | Credit bureau score threshold |
| Maximum DTI | 50% | Debt-to-Income ceiling |
| Minimum Age | 21 years | Member age requirement |
| Maximum Credit Limit | $20,000 | Per-product cap |
| Card Origination | > 1 year | Time since account opened |
| FICO Drop Threshold | -50 points | Max decline from origination |
| Minimum Payment | 3% | Min payment requirement |
| Days Past Due | 0 | Must be current |

---

## Credit Line Increase Tiers

| Current Limit | New Limit | Increase Amount |
|---------------|-----------|-----------------|
| < $1,000 | $1,500 | +$500 to +$1,500 |
| $1,000 - $2,000 | $3,000 | +$1,000 to +$2,000 |
| $2,000 - $3,000 | $5,000 | +$2,000 to +$3,000 |
| $3,000 - $5,000 | $7,500 | +$2,500 to +$4,500 |
| $5,000 - $7,500 | $10,000 | +$2,500 to +$5,000 |
| $7,500 - $10,000 | $15,000 | +$5,000 to +$7,500 |
| $10,000 - $15,000 | $20,000 (max) | +$5,000 to +$10,000 |

---

## Aggregate Limits

Members with multiple products are subject to aggregate limits based on credit score tier:

| Score Range | Tier | Maximum Aggregate |
|-------------|------|-------------------|
| 776 - 850 | Excellent | $25,000 |
| 726 - 775 | Good | $18,000 |
| 650 - 725 | Fair | $13,000 |
| Below 650 | Below Threshold | Not Eligible |

**Priority Rule:** When aggregate capacity is limited, Credit Cards receive increases before Lines of Credit.

---

## Exclusion Criteria

Members are **automatically excluded** from CLIP if they have:

1. Bankruptcy (active or within lookback period)
2. Charged-off accounts
3. Active collections
4. 30/60/90 day delinquencies
5. Fraud alerts on credit file
6. Deceased indicator
7. Credit freeze
8. Overlimit on existing products
9. Recent CLI (within 6-12 months)

---

## Process Workflow

### Phase 1: Data Preparation

| Step | Title | Description |
|------|-------|-------------|
| 1 | Input File Setup | Configure input tool to point to credit union's source data |
| 2 | Update Account Age Formula | Calculate credit limit maximum based on account age (Formula 64) |
| 3 | Look Up CORP ID | Find credit union's CORP ID for TransUnion batch submission |
| 4 | Copy Completed Workflow | Save workflow as new version in client's Workflow folder |
| 5 | Run Initial Workflow | Execute workflow to generate output file |
| 6 | Prepare TransUnion Submission | Verify file format matches TU requirements |

### Phase 2: TransUnion Integration

| Step | Title | Description |
|------|-------|-------------|
| 7 | Upload to TransUnion DEG | Submit prepared file for batch processing |
| 8 | Download TransUnion Response | Download response files from DEG |
| 9 | Handle Consumer Statements | Special handling per regulations if received |
| 10 | Copy Files to Processing | Copy all response files to FilesToProcess directory |
| 11 | Open CLIP Step 2 Workflow | Merges TU data with original member data |
| 12 | Configure Input Files | Update input tool to point to downloaded TU files |
| 13 | Verify Inputs | Review sample records to ensure data alignment |
| 14 | Run CLIP Step 2 | Execute and monitor for matching errors |

### Phase 3: Parameter Configuration

| Step | Title | Description |
|------|-------|-------------|
| 15 | Configure Credit Metrics | Handle credit score ranges (Formula 67) |
| 16 | Apply Exclusion Criteria | Contains exclusion logic (Formula 72) |
| 17 | Configure Income & Payment | Calculate monthly income and payments (Formula 73) |
| 18 | Apply CLI Rules | Nested IF statements for limit increases (Formula 74) |
| 19 | Configure Supplemental Fields | Add optional data fields (Select 260) |
| 20 | Review Summary Statistics | Verify no zeros in key count fields |
| 21 | Generate Output Files | Run final output generation |

### Phase 4: Aggregate Limits

| Step | Title | Description |
|------|-------|-------------|
| 22 | Run PC Aggregate Limits | Handle multi-product members (Sort 30) |
| 23 | Configure Credit Limit Buckets | Adjust per client's aggregate limit tiers (Formula 47) |

---

## TransUnion Integration

### Key Information
- **Available Fields:** 419
- **Submission Method:** Data Exchange Gateway (DEG)
- **Response Time:** Typically same day

### Contacts

| Name | Email | Role |
|------|-------|------|
| Jen Werkley | jen.werkley@transunion.com | Primary Contact |
| Abbie Jeremiah | Abbie.Jeremiah@transunion.com | Secondary Contact |

### Credentialing Scenarios

1. **Active Subscriber Code** - Can proceed directly
2. **Inactive Subscriber Code** - Request reactivation (may need new Subscriber Release Form)
3. **New to TransUnion** - Send intro email, 3-4 week credentialing timeline

### Important Rules
- Submit ONE file at a time to TransUnion
- TransUnion always names output files: `OLB.EDTOUT.TWNTWCDT.OUTPUT`
- Volume-based pricing: Trellance charges based on volume, passes cost to client

---

## Alteryx Workflow Structure

### Workflow Stages

| Stage | Tool Numbers | Purpose |
|-------|--------------|---------|
| Input Stage | 1-20 | Data ingestion, format validation, field mapping |
| Data Preparation | 21-50 | Cleaning, deduplication, unique ID creation |
| Eligibility Filtering | 51-80 | Apply business rules, exclusion criteria |
| Analysis | 81-150 | TransUnion data merge, risk scoring, utilization calc |
| Business Rules | 151-200 | CLI tier logic, aggregate limits |
| Output | 201+ | Report generation, file export |

### Critical Formula Tools

| Tool | Purpose |
|------|---------|
| Formula (64) | Account age calculation - determines time since origination |
| Formula (67) | Credit score range classification - assigns risk tiers |
| Formula (72) | Exclusion logic - flags bankruptcy, delinquency, collections |
| Formula (73) | Income and payment calculations - converts annual to monthly |
| Formula (74) | CLI tier assignment - nested IF statements for increase amounts |

### Prioritization Logic (Sort 30)
- **Rule:** Credit Cards ranked BEFORE Lines of Credit
- **Criteria:**
  1. Member unique ID (SSN+DOB)
  2. Product type priority (CC=1, LOC=2, HELOC=3)
  3. Current utilization (ascending)

---

## Automation Strategy

### Current vs Future State

| Metric | Current | Future |
|--------|---------|--------|
| Manual Touchpoints | 8-12 | 2-3 |
| Turnaround Time | 2-3 days | 4-8 hours |
| Throughput | 5-10 CUs/week | 20-30 CUs/week |
| Error Rate | 2-5% | <0.5% |

### Three Automation Approaches

#### Approach 1: Direct Alteryx Automation
- **Timeline:** 2-4 weeks
- **Description:** PowerShell orchestration of existing Alteryx workflows
- **Benefits:** Minimal changes, fastest implementation, leverages existing expertise
- **Limitations:** Alteryx licensing dependency, limited parallel processing

#### Approach 2: Hybrid Alteryx + Python
- **Timeline:** 4-6 weeks
- **Description:** Alteryx for ETL, Python for business logic and orchestration
- **Benefits:** Best of both worlds, gradual migration path, easier testing
- **Limitations:** Dual technology maintenance, training required

#### Approach 3: Full Python/dbt Migration
- **Timeline:** 8-12 weeks
- **Description:** Complete modernization with dbt for Snowflake transformations
- **Benefits:** No licensing costs, full Git version control, cloud-native scalability
- **Limitations:** Longer implementation, complete rewrite required

### dbt Model Structure

| Model | Type | Purpose |
|-------|------|---------|
| stg_member_accounts | staging | Raw data preparation |
| stg_transunion_response | staging | TU data parsing |
| int_eligibility_filtered | intermediate | Eligibility rules |
| int_risk_scored | intermediate | Risk calculations |
| mart_cli_recommendations | mart | Final recommendations |
| mart_cli_summary | mart | Aggregated metrics |

### Implementation Phases

| Phase | Weeks | Activities |
|-------|-------|------------|
| 1 - Foundation | 1-3 | Dev environment, config schema, monitoring framework |
| 2 - Core Development | 4-7 | Orchestration, eligibility logic, TU integration |
| 3 - Integration | 8-10 | E2E testing, parallel run, performance tuning |
| 4 - Rollout | 11-13+ | Pilot CUs, gradual migration, documentation |

---

## Folder Setup & File Management

### S: Drive Structure

```
S:\Products\CLIP (Credit Line Increase Program)\
├── Inputs\
│   ├── Direct Source Files\
│   │   ├── PeerNumber_CUName\
│   │   │   ├── 2025\
│   │   │   └── Workflows\
│   │   └── FilesToProcess\
│   └── Transunion Received\
│       └── Consumer Statements\
└── ...
```

### Box Cloud Setup
- **URL:** https://trellance.app.box.com/folder/305984505328
- **Path:** Files > Shared > Credit Unions
- **Naming:** PeerNumber_CreditUnionName (e.g., 0558_Interfaith)
- **Feature:** Use File Request to let clients upload without Box accounts

### File Request Process
1. Navigate to client folder in Box
2. Click 'File Request' button
3. Set description explaining what files are needed
4. Copy the generated link
5. Send link to credit union contact

---

## KPIs & Metrics

### Core KPIs

| KPI | Description | Target |
|-----|-------------|--------|
| Total Eligible Accounts | Members meeting all eligibility criteria | Maximize |
| Total Approved Accounts | Members receiving CLI approval | 60-70% of eligible |
| CLI Approval Rate | Approved / Eligible | 65-75% |
| Avg Credit Line Increase | Average dollar increase per approval | $2,500+ |
| Incremental Credit Exposure | Total new credit extended | Track monthly |
| Processing Accuracy | Error rate in analysis | <1% |

### Operational Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Turnaround Time | 2-3 days | 4-8 hours |
| Manual Touchpoints | 8-12 | 2-3 |
| Error Rate | 2-5% | <0.5% |
| Throughput | 5-10 CUs/week | 20-30 CUs/week |

---

## Risks & Mitigation

### Credit Union Risks

| Risk | Mitigation |
|------|------------|
| Credit Risk Exposure | Conservative parameters, ongoing monitoring |
| Regulatory Compliance (ECOA/FCRA) | Proper adverse action notices, documentation |
| Portfolio Concentration | Aggregate limits by credit tier |

### Operational Risks

| Risk | Mitigation |
|------|------------|
| Data Quality Issues | Automated validation, data profiling |
| TransUnion API Failures | Retry logic, manual fallback procedures |
| Processing Delays | Monitoring, alerting, SLA tracking |
| Parameter Misconfiguration | Configuration review process, testing |
| Duplicate Handling Errors | Unique ID validation, deduplication |
| Security/PII Exposure | Encryption, access controls, audit logging |

---

## Glossary

| Term | Definition |
|------|------------|
| CLI | Credit Line Increase |
| CLIP | Credit Line Increase Program |
| CU | Credit Union |
| DEG | Data Exchange Gateway (TransUnion file transfer) |
| DTI | Debt-to-Income ratio |
| FICO | Fair Isaac Corporation credit score |
| HELOC | Home Equity Line of Credit |
| IM | Implementation Manager |
| LOC | Line of Credit |
| MDPA | Member Data Portal Analytics |
| PII | Personally Identifiable Information |
| SLA | Service Level Agreement |
| TU | TransUnion (credit bureau) |
| dbt | Data build tool - open source data transformation framework |
| ETL | Extract, Transform, Load - data processing pattern |
| POC | Proof of Concept |
| CI/CD | Continuous Integration / Continuous Deployment |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | CLIP Knowledge Dashboard | Initial comprehensive documentation |

---

*This documentation is maintained by the CLIP Knowledge Dashboard. For questions, use the AI-powered chat feature.*
