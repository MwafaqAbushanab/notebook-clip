# CLIP - Credit Line Increase Program
## Comprehensive Master Document for NotebookLM
### Trellance / Rise Analytics

---

# PART 1: PROGRAM OVERVIEW

## What is CLIP?
CLIP (Credit Line Increase Program) is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions. Operating since 2015-2016, CLIP identifies members eligible for credit line increases across multiple lending products including Credit Cards, Unsecured Lines of Credit, and HELOCs.

## Key Facts
- **Program Age**: Since 2015-2016
- **Standard Turnaround**: 2-3 business days
- **Typical Approval Rate**: 60-70% of eligible members
- **Credit Bureau Partner**: TransUnion (419 fields available)
- **Primary Technology**: Alteryx workflows (current), Python/dbt migration (future)

## Value Proposition
- **For Credit Unions**: Increase revenue, improve member satisfaction, optimize credit portfolio
- **For Members**: Access to additional credit when needed, recognition of good payment history
- **For Trellance**: Recurring revenue stream, strengthened client relationships

---

# PART 2: PRODUCTS AND ELIGIBILITY

## Supported Products

### Credit Cards
- Most common product for CLI analysis
- Minimum 1 year since origination required
- Maximum individual limit: $20,000
- Subject to aggregate limits by credit score tier

### Unsecured Lines of Credit
- Variable terms
- Higher risk tier than credit cards
- Same eligibility criteria apply
- Combined with other products for aggregate limits

### HELOCs (Home Equity Lines of Credit)
- Collateralized product
- Different risk profile
- May have different parameters per credit union
- Requires property valuation consideration

## Credit Score Tier Limits

| Credit Score Range | Tier Name | Max Aggregate Limit |
|-------------------|-----------|---------------------|
| 776 - 850 | Excellent | $25,000 |
| 726 - 775 | Good | $18,000 |
| 650 - 725 | Fair | $13,000 |
| Below 650 | Below Threshold | Not Eligible |

---

# PART 3: DATA REQUIREMENTS

## Required Data Fields

### Critical Fields (Must Have)
1. **Account Number** - Unique account identifier
2. **SSN** - Last 4 or full (for TransUnion pull)
3. **First Name** - Member first name
4. **Last Name** - Member last name
5. **Date of Birth** - For age verification
6. **Current Credit Limit** - Existing limit amount
7. **Current Balance** - Outstanding balance

### Important Fields (Should Have)
1. **Income** - Annual gross income
2. **DTI** - Debt-to-Income ratio
3. **Days Past Due** - Current delinquency status
4. **Product Type** - CC, LOC, HELOC
5. **Origination Date** - Account open date
6. **FICO Score** - If available from credit union
7. **Payment History** - Recent payment behavior

## Data Sources

### MDPA Portal
- Self-service data upload
- Standardized format required
- Automated validation
- Best for recurring analyses

### Consulting Engagements
- Custom data handling
- Flexible formats accepted
- Manual validation
- Best for one-time deep dives

### Direct Snowflake Connection
- Enterprise clients
- Automated data pull via TR_ANALYTICS_* schemas
- Best for high-volume recurring analyses

## Creating Unique Identifiers
Unique ID = Last 4 SSN + Date of Birth (MMDDYYYY)
Example: 1234 + 03151985 = 123403151985

This allows duplicate detection across products and aggregate exposure calculation.

---

# PART 4: PARAMETERS AND BUSINESS RULES

## Standard Eligibility Thresholds

| Parameter | Default Value | Description |
|-----------|--------------|-------------|
| Minimum Income | $20,000 | Annual gross income floor |
| Minimum FICO Score | 650 | Credit bureau score threshold |
| Maximum DTI | 50% | Debt-to-Income ceiling |
| Minimum Age | 21 years | Member age requirement |
| Maximum Credit Limit | $20,000 | Per-product cap |
| Card Origination | > 1 year | Time since account opened |
| FICO Drop Threshold | -50 points | Max decline from origination |
| Minimum Payment | 3% | Min payment requirement |
| Days Past Due | 0 | Must be current |

## Credit Line Increase Tiers

| Current Limit | Increase To | Increase Amount |
|---------------|-------------|-----------------|
| < $1,000 | $1,500 | +$500 to +$1,500 |
| $1,000 - $2,000 | $3,000 | +$1,000 to +$2,000 |
| $2,000 - $3,000 | $5,000 | +$2,000 to +$3,000 |
| $3,000 - $5,000 | $7,500 | +$2,500 to +$4,500 |
| $5,000 - $7,500 | $10,000 | +$2,500 to +$5,000 |
| $7,500 - $10,000 | $15,000 | +$5,000 to +$7,500 |
| $10,000 - $15,000 | $20,000 | +$5,000 to +$10,000 |

## Exclusion Criteria (Hard Stops)
- Bankruptcy (active or within lookback period)
- Charged-off accounts
- Active collections
- 30/60/90 day delinquencies
- Fraud alerts on credit file
- Deceased indicator
- Credit freeze
- Overlimit on existing products
- Recent CLI (within 6-12 months)

---

# PART 5: PROCESS WORKFLOW

## High-Level Process Flow

1. **DATA INPUT** - Receive member/account data from credit union
2. **TRANSUNION PULL** - Submit batch credit pull, retrieve 419 fields
3. **ANALYSIS ENGINE** - Apply parameters, calculate eligibility
4. **DECISION ENGINE** - Determine approval/rejection, assign increase tier
5. **OUTPUT DELIVERY** - Generate reports, deliver to client

## Detailed Process Steps

### Step 1: Initialization
- Load credit union-specific configuration
- Validate required parameters
- Establish database connections (Snowflake TR_ANALYTICS_*)
- Initialize logging

### Step 2: Data Extraction
- Pull member demographics
- Extract account balances and history
- Get transaction patterns (6-12 months)
- Retrieve internal credit scores
- Apply exclusion lists

### Step 3: TransUnion Integration
- Submit batch credit pull request
- Receive 419 available fields
- Parse and validate response
- Merge with member data using unique identifier

### Step 4: Eligibility Screening
- Account age check (>= minimum months)
- Payment history validation (no 30+ day lates)
- Balance/limit checks
- Credit score threshold (>=650 default)
- DTI calculation and check (<=50% default)
- Exclude charged-off/collections

### Step 5: Utilization Analysis
- Calculate current utilization percentage
- Analyze historical utilization trends
- Identify high utilizers (>70%)
- Calculate available credit headroom
- Segment by utilization bands

### Step 6: Risk Assessment
- Credit score banding (Low/Medium/High)
- Income verification check
- Employment stability evaluation
- Recent inquiry analysis
- Bankruptcy/foreclosure screening
- Calculate composite risk score (0-100)

### Step 7: Recommendation Engine
- Determine increase strategy (percentage/fixed/tiered)
- Apply business rule caps
- Calculate post-increase utilization
- Generate confidence score

### Step 8: Compliance Check
- Regulatory limit verification (TILA)
- Internal policy validation
- Cross-product exposure check
- Approval routing determination

### Step 9: Output Generation
- Approved list with details
- Rejection report with reasons
- Executive summary dashboard
- Data quality metrics
- Audit trail documentation

### Step 10: Delivery
- Email notifications
- File upload (S3/shared drive)
- Database update
- Archive processing

---

# PART 6: AUTOMATION FRAMEWORK

## Macro Library Architecture

The automation framework uses 8 reusable macros:

### 1. data_extraction_macro()
- **Purpose**: Pull all required data from Snowflake for a specific credit union
- **Inputs**: Tenant ID (TR_ANALYTICS_*), Lookback period, Date range
- **Outputs**: DataFrame with member/account data, Transaction history, Credit scores
- **Key Logic**: Multi-schema query handling, Data type validation, Null handling, Deduplication

### 2. eligibility_filter_macro()
- **Purpose**: Apply configurable business rules to filter eligible accounts
- **Inputs**: Raw member/account data, Config rules dictionary
- **Outputs**: Filtered DataFrame (eligible members), Rejection log with reasons
- **Key Logic**: Account age calculation, Payment history validation, Balance/limit checks, Status exclusions

### 3. utilization_calculation_macro()
- **Purpose**: Calculate current and historical utilization patterns
- **Inputs**: Account balance data, Credit limit data, Historical snapshots
- **Outputs**: Utilization metrics per account, Trend indicators
- **Key Logic**: Current utilization %, Average utilization (6-month), Volatility score, High balance identification

### 4. risk_assessment_macro()
- **Purpose**: Calculate composite risk scores for credit line increases
- **Inputs**: Credit scores, Payment history, Income data, Derogatory records
- **Outputs**: Risk score (0-100), Risk band (Low/Medium/High), Contributing factors
- **Key Logic**: Weighted scoring model, Recent inquiry impact, Bankruptcy/foreclosure flags, Income stability

### 5. recommendation_engine_macro()
- **Purpose**: Determine optimal credit line increase amounts
- **Inputs**: Eligible accounts, Risk scores, Current limits, Strategy config
- **Outputs**: Recommended new limit, Increase amount, Confidence score, Approval routing
- **Key Logic**: Strategy selection (percentage/fixed/tiered), Cap application, Post-increase utilization projection, ROI estimation

### 6. compliance_check_macro()
- **Purpose**: Validate recommendations against regulatory and policy rules
- **Inputs**: Recommended increases, Compliance rules, Member aggregated exposure
- **Outputs**: Compliance pass/fail flag, Required documentation list, Approval level routing
- **Key Logic**: Regulatory limit checks (e.g., TILA), Internal policy validation, Cross-product exposure, Documentation requirements

### 7. output_generator_macro()
- **Purpose**: Create standardized output files in multiple formats
- **Inputs**: Approved list, Analysis data, Config settings
- **Outputs**: CSV/Excel files, PDF reports, Summary dashboards
- **Key Logic**: Template-based report generation, Multi-format export, Data quality metrics, Visualization creation

### 8. audit_logging_macro()
- **Purpose**: Track all processing steps for compliance and debugging
- **Inputs**: Processing events, Config used, Results summary
- **Outputs**: Detailed audit trail, Performance metrics, Error logs
- **Key Logic**: Timestamp all events, Parameter logging, Record counts at each stage, Execution time tracking

## Folder Structure

```
CLIP_AUTOMATION/
├── config/
│   ├── global_config.yaml
│   ├── credit_unions/
│   │   ├── CU_001_config.json
│   │   └── config_template.json
│   └── business_rules/
├── src/
│   ├── macros/
│   ├── core/
│   └── orchestration/
├── inputs/
│   ├── reference_data/
│   └── manual_overrides/
├── outputs/
│   └── YYYY-MM/CU_XXX/
├── logs/
├── tests/
├── docs/
└── sql/
```

## Running Analysis

```bash
# Run for single credit union
python run_clip_analysis.py --cu CU_001 --run-date 2025-01-01

# Run for all credit unions
python run_clip_analysis.py --all --run-date 2025-01-01

# Dry run (validation only)
python run_clip_analysis.py --cu CU_001 --dry-run
```

---

# PART 7: DETAILED CLIP RUN PROCESS (OPERATIONAL PROCEDURES)

## Overview
This section documents the exact step-by-step process for running CLIP analysis using Alteryx workflows. These are the operational procedures used by analysts.

## Phase 1: Data Preparation & Input Setup (Steps 1-6)

### Step 1: Input File Setup
- Open the Run CLIP workflow: `S:\Prod\Workflows\Tools\Run CLIP.yxwz`
- Navigate to input tool near top of workflow
- Configure the input file path to point to the credit union's source data
- File location pattern: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\PeerNumber_CUName\Year\`

### Step 2: Update Account Age Formula
- Locate Formula (64) - appears early in workflow
- This calculates credit limit maximum based on account age
- Review and adjust age requirements per client specifications

### Step 3: Look Up CORP ID
- Locate tool that references: `S:\Prod\Inputs\Reference and Control Tables\CU Master for Providers.xlsx`
- Find the credit union's CORP ID in the Peer column
- This ID is used for TransUnion batch submission
- Example: Look up peer number 0016 for Palmetto Citizens

### Step 4: Copy Completed Workflow
- Save workflow as new version in client's Workflow folder
- Example path: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\0016_Palmetto Citizens\Workflow(s)`
- This preserves client-specific configurations

### Step 5: Run Initial Workflow
- Execute the workflow to generate output file
- Monitor for errors during execution
- Output file will be created for TransUnion submission

### Step 6: Prepare TransUnion Submission
- Locate the generated output file
- File will be used for batch credit pull request
- Verify file format matches TU requirements

## Phase 2: Run CLIP & TransUnion Integration (Steps 7-14)

### Step 7: Upload to TransUnion Data Exchange Gateway
- Access TransUnion Data Exchange Gateway (DEG)
- Navigate to file upload section
- Submit the prepared file for batch processing
- **Important**: Note submission timestamp for tracking

### Step 8: Download TransUnion Response
- Wait for TU batch processing to complete (typically same day for standard)
- Download response files from DEG
- Save to: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received`

### Step 9: Handle Consumer Statements
- If Consumer Statements file is received (not always present)
- Save to: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Consumer Statements`
- These require special handling per regulations

### Step 10: Copy Files to Processing Location
- Copy all response files to: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\FilesToProcess`
- This is the standard processing directory
- Verify all expected files are present

### Step 11: Open CLIP Step 2 Workflow
- Open: `S:\Prod\Workflows\Chained Apps\Clip Step2.yxwz`
- This workflow merges TU data with original member data
- Verify workflow version is current

### Step 12: Configure Input Files in Step 2
- Update input tool to point to downloaded TU files
- Verify date fields parse correctly
- Check for any format differences from TU

### Step 13: Verify Inputs Look Correct
- Review sample records to ensure data alignment
- Check that SSN/DOB matching is working
- Verify credit score fields are populated

### Step 14: Run CLIP Step 2
- Execute the workflow
- Monitor for matching errors
- Review output for completeness

## Phase 3: Parameter Configuration & Analysis (Steps 15-21)

### Step 15: Configure Credit Metrics
- Locate Formula (67) in workflow
- This formula handles credit score ranges and related metrics
- Review thresholds match client requirements

### Step 16: Apply Exclusion Criteria
- Locate Formula (72)
- Contains exclusion logic (bankruptcy, delinquency, etc.)
- Verify all exclusion rules align with client parameters

### Step 17: Configure Income & Payment Calculations
- Locate Formula (73)
- Calculates monthly income from annual figures
- Calculates minimum monthly payments
- Verify calculation formulas are correct

### Step 18: Apply Credit Limit Increase Rules
- Locate Formula (74)
- Contains nested IF statements for limit increases
- **Critical**: Adjust these IFs per client's specific CLI tier structure
- Review increase amounts match agreed parameters

### Step 19: Configure Supplemental Fields
- Locate Select (260)
- Adds supplemental data fields as needed:
  - Aggregate Spend Over Past 12 Months
  - Max Aggregate Bankcard Balance Over The Last Year
- Enable/disable fields per client needs

### Step 20: Review Summary Statistics
- Check Summary tools near end of workflow
- Verify no zeros in key count fields
- Review approval/rejection ratios

### Step 21: Generate Output Files
- Run final output generation
- Verify all output files created successfully
- Check file sizes are reasonable

## Phase 4: Aggregate Limits Processing (Steps 22-23)

### Step 22: Run PC Aggregate Limits Workflow
- This handles members with multiple products
- Locate Sort (30) tool for prioritization
- **Priority Rule**: Credit Card ranked BEFORE Line of Credit
- This ensures credit cards get limit increases first when member has both products tied to same SSN

### Step 23: Configure Credit Limit Buckets
- Locate Formula (47) in PC Aggregate Limits workflow
- Review credit limit bucket configurations
- Adjust per client's aggregate limit tiers
- Verify total exposure caps are applied correctly

## Key File Paths Reference

| Purpose | Path |
|---------|------|
| Run CLIP Workflow | `S:\Prod\Workflows\Tools\Run CLIP.yxwz` |
| CLIP Step 2 | `S:\Prod\Workflows\Chained Apps\Clip Step2.yxwz` |
| Direct Source Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\` |
| Files To Process | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\FilesToProcess` |
| TU Received Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received` |
| TU Consumer Statements | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Consumer Statements` |
| CORP ID Reference | `S:\Prod\Inputs\Reference and Control Tables\CU Master for Providers.xlsx` |

## Key Alteryx Tools Reference

| Tool | Location | Purpose |
|------|----------|---------|
| Formula (64) | Early in Run CLIP | Credit Limit Max / Account Age |
| Formula (67) | Mid workflow | Credit score ranges & metrics |
| Formula (72) | Mid workflow | Exclusion criteria logic |
| Formula (73) | Mid workflow | Income & payment calculations |
| Formula (74) | Mid workflow | CLI tier logic (nested IFs) |
| Sort (30) | PC Aggregate Limits | Multi-product prioritization |
| Formula (47) | PC Aggregate Limits | Credit limit buckets |
| Select (260) | Near end | Supplemental fields configuration |

---

# PART 8: FOLDER SETUP & FILE MANAGEMENT

## Amazon Workspace Shared Drive Setup

### Base Directory Structure
All CLIP files are stored on the S: drive (shared drive accessible via Amazon Workspace).

### Step 1: Navigate to Base Directory
```
S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\
```

### Step 2: Create Client Folder
- **Naming Convention**: `PeerNumber_CreditUnionName`
- Examples:
  - `0558_Interfaith`
  - `0016_Palmetto Citizens`
  - `1234_Example FCU`

### Step 3: Create Required Subfolders
Inside the client folder, create:
- **Year folder** (e.g., `2025`, `2026`)
- **Workflows folder** (for saved workflow copies)

### Step 4: File Placement Rules
- Source data files → Year-specific folder
- Workflow files (.yxwz) → Workflows folder
- Keep raw and processed files separate

## Box Setup for Client File Sharing

### Purpose
Box is used to securely share files with credit union clients for data collection and result delivery.

### Step 1: Access Box
- URL: `https://trellance.app.box.com/folder/305984505328`
- Log in with your Trellance Box account credentials

### Step 2: Navigate to Client Folder Structure
- Path: `Files > Shared > Credit Unions`
- Client folder naming: `PeerNumber_CreditUnionName` (consistent with S: drive)

### Step 3: Create New Client Folder (if needed)
- Create folder following naming convention
- Set appropriate permissions for team access

## Sharing Access with Clients

### Using File Request Feature

#### Step 1: Create File Request
- Right-click the client's folder in Box
- Select **Options > File Request**

#### Step 2: Configure the Link
- Copy the generated upload link
- **Optional Security Setting**: Set link expiration under Settings
- Recommended: 30-day expiration for one-time uploads

#### Step 3: Send to Client
- Email the file request link to client contact
- Client can upload files directly without Box account
- Files automatically land in the shared folder

### Benefits of File Request
- Clients don't need Box accounts
- Secure file transfer
- Automatic organization into correct folder
- Audit trail of uploads

## Key File Paths Summary

| Purpose | Path/Location |
|---------|---------------|
| Client Source Files (S: Drive) | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\PeerNumber_CUName\` |
| Files To Process | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\FilesToProcess` |
| Main Run CLIP Workflow | `S:\Prod\Workflows\Tools\Run CLIP.yxwz` |
| CLIP Step 2 Workflow | `S:\Prod\Workflows\Chained Apps\Clip Step2.yxwz` |
| TransUnion Received Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received` |
| Consumer Statements | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Consumer Statements` |
| Processed TU Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Processed` |
| CORP ID Reference Table | `S:\Prod\Inputs\Reference and Control Tables\CU Master for Providers.xlsx` |
| Client Sharing (Box) | `https://trellance.app.box.com/folder/305984505328` → Files > Shared > Credit Unions |

## Related Confluence Pages (Reference)
- 1.0 (Intro) - CLIP Introduction
- 2.0 (Sales) - Sales Processes
- 3.0 (Implementation) - Implementation Guide
- 4.0 (Support & Ops) - Support Operations
- 5.0 (Reporting & Insights) - Reporting
- 6.0 (Engineering) - Technical Details
- 7.0 (Alerts) - Alerting Systems
- 8.0 (Training) - Training Materials

---

# PART 9: KEY PERFORMANCE INDICATORS

## Core KPIs

| KPI | Definition | Target |
|-----|------------|--------|
| Total Eligible Accounts | Members meeting all eligibility criteria | Maximize |
| Total Approved Accounts | Members receiving CLI approval | 60-70% of eligible |
| CLI Approval Rate | Approved / Eligible | 65-75% |
| Avg Credit Line Increase | Average dollar increase per approval | $2,500+ |
| Incremental Credit Exposure | Total new credit extended | Track monthly |
| Risk Score Distribution | Breakdown by credit score tier | Balanced |
| Processing Accuracy | Error rate in analysis | <1% |

## Operational Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Turnaround Time | 2-3 days | 4-8 hours |
| Manual Touchpoints | 8-12 | 2-3 |
| Error Rate | 2-5% | <0.5% |
| Throughput | 5-10 CUs/week | 20-30 CUs/week |

---

# PART 10: RISKS AND MITIGATION

## Credit Union Risks

1. **Credit Risk Exposure** - Members may default after increase
   - Mitigation: Conservative parameters, ongoing monitoring

2. **Regulatory Compliance** - ECOA/FCRA requirements must be met
   - Mitigation: Proper adverse action notices, documentation
   - Note: Fair Lending analysis is a separate Trellance product

3. **Portfolio Concentration** - Over-exposure in certain segments
   - Mitigation: Aggregate limits by credit tier

## Operational Risks

1. **Data Quality Issues** - Bad input leads to bad recommendations
   - Mitigation: Input validation, data quality framework

2. **TransUnion API Failures** - Cannot complete processing
   - Mitigation: Retry logic, manual fallback procedures

3. **Processing Delays** - Miss SLA commitments
   - Mitigation: Automation, monitoring, alerting

4. **Parameter Misconfiguration** - Wrong thresholds applied
   - Mitigation: Config validation, peer review

5. **Duplicate Handling Errors** - Same member gets multiple offers
   - Mitigation: Deduplication macro, unique ID logic

6. **Version Control Issues** - Lost workflow changes
   - Mitigation: Git repository, PR workflow

7. **Security/PII Exposure** - Data breach risk
   - Mitigation: Encryption, access controls, audit logging

8. **Staff Knowledge Gaps** - Key person leaves
   - Mitigation: Documentation, cross-training

## Functional Risks

1. **CLI Recommendation Too Aggressive** - High default rates post-increase
   - Mitigation: Conservative initial parameters, 30/60/90 day monitoring
   - Owner: Product Team
   - Review: Monthly

2. **CLI Recommendation Too Conservative** - Low adoption, reduced value
   - Mitigation: Regular parameter tuning based on performance data
   - Owner: Product Team
   - Review: Monthly

3. **Credit Score Model Drift** - Predictions degrading over time
   - Mitigation: Quarterly model validation against actual outcomes
   - Owner: Data Science
   - Review: Quarterly

4. **Multi-Product Exposure Calculation Error** - Aggregate limits miscalculated
   - Mitigation: Automated validation checks, manual spot-checks
   - Owner: Operations
   - Review: Per run

5. **Utilization Calculation Incorrect** - Wrong balance/limit ratios
   - Mitigation: Data validation macros, unit tests
   - Owner: Operations
   - Review: Per run

## Comprehensive Risk Register

| Risk ID | Category | Risk Description | Likelihood | Impact | Owner | Mitigation | Review Cadence |
|---------|----------|------------------|------------|--------|-------|------------|----------------|
| R001 | Credit | Members default after CLI | MEDIUM | HIGH | Product | Conservative parameters, monitoring | Monthly |
| R002 | Compliance | ECOA/FCRA violations | LOW | CRITICAL | Compliance | Adverse action notices, documentation | Quarterly |
| R003 | Data | Bad input causes bad recommendations | MEDIUM | HIGH | Operations | Input validation, DQ framework | Per run |
| R004 | Technical | TransUnion API failure | LOW | HIGH | Engineering | Retry logic, manual fallback | Per run |
| R005 | Process | Parameter misconfiguration | MEDIUM | HIGH | Operations | Config validation, peer review | Per run |
| R006 | Process | Duplicate handling errors | MEDIUM | MEDIUM | Operations | Deduplication macro | Per run |
| R007 | Technical | Version control issues | MEDIUM | MEDIUM | Engineering | Git repository, PR workflow | Weekly |
| R008 | Security | PII exposure/data breach | LOW | CRITICAL | Security | Encryption, access controls | Monthly |
| R009 | People | Staff knowledge gaps | MEDIUM | HIGH | Management | Documentation, cross-training | Quarterly |
| R010 | Process | Processing delays/SLA miss | MEDIUM | MEDIUM | Operations | Automation, monitoring | Weekly |
| R011 | Functional | CLI too aggressive | MEDIUM | HIGH | Product | 30/60/90 day monitoring | Monthly |
| R012 | Functional | CLI too conservative | MEDIUM | MEDIUM | Product | Parameter tuning | Monthly |
| R013 | Functional | Model drift | LOW | HIGH | Data Science | Model validation | Quarterly |
| R014 | Operational | Key analyst turnover | MEDIUM | HIGH | Management | Cross-training, documentation | Quarterly |
| R015 | Operational | Alteryx license expiration | MEDIUM | HIGH | IT/Finance | License tracking, renewal alerts | Quarterly |
| R016 | Operational | TU API deprecation | LOW | CRITICAL | Engineering | API monitoring, relationship management | Annual |
| R017 | Operational | Client data format changes | MEDIUM | MEDIUM | Operations | Flexible parsing, validation | Per client |
| R018 | Operational | Box/SharePoint access issues | LOW | MEDIUM | IT | Access monitoring, backup procedures | Monthly |

---

# PART 11: GAP ANALYSIS SUMMARY

## Critical Gaps

### Gap 1: No Automation Framework
- **Current**: Manual Alteryx workflow execution
- **Target**: Modular macro-driven automation
- **Impact**: Scalability limits, human error, slow turnaround

### Gap 2: Fragmented Documentation
- **Current**: Scattered across SharePoint, Box, local drives
- **Target**: Single source of truth with version control
- **Impact**: Knowledge loss, inconsistent processes

### Gap 3: No Formal Training Program
- **Current**: Tribal knowledge, shadowing
- **Target**: Structured curriculum with certification
- **Impact**: Inconsistent skill levels, long onboarding

### Gap 4: Missing Role Definitions
- **Current**: No formal RACI matrix
- **Target**: Clear role definitions
- **Impact**: Unclear responsibilities, dropped tasks

## High Priority Gaps

1. Multi-product member prioritization rules not defined
2. Manual duplicate handling varies by analyst
3. Limited monitoring and alerting
4. No version control for workflows
5. Missing data quality framework
6. No encryption documentation
7. Incomplete audit trail

## Recommended Resolution Roadmap

- **Phase 1 (Weeks 1-4)**: Foundation - Documentation, role definitions, security
- **Phase 2 (Weeks 5-12)**: Automation - Macro library, config management, monitoring
- **Phase 3 (Weeks 13-20)**: Quality & Compliance - DQ framework, testing, audit logging
- **Phase 4 (Weeks 21+)**: Optimization - Training program, knowledge base, performance

---

# PART 12: SALES CHANNELS

## Channel 1: MDPA Portal (Self-Service)
- Credit union logs into portal
- Uploads member data in standard format
- System auto-processes
- Results available in portal
- Best for: Recurring analyses, standardized approach

## Channel 2: Consulting Engagement (Custom)
- Discovery and scoping phase
- Custom configuration
- Analysis and processing
- Report and presentation
- Best for: New clients, complex requirements

## Channel 3: Enterprise/Recurring (Batch)
- Scheduled trigger (calendar/cron)
- Automated data pull from Snowflake
- Automated processing
- Automated delivery
- Best for: Large CUs, high volume

---

# PART 13: TRANSUNION INTEGRATION

## Overview
- 419 fields available from TransUnion credit bureau
- Batch submission process via Data Exchange Gateway (DEG)
- Real-time credit pulls for individual requests
- Includes FICO score, trade lines, inquiries, derogatory records
- All TransUnion codes stored in Snowflake (table managed by James)
- Internal documentation: 150-page code reference in Admin Folder

## Key Data Points Retrieved
- Credit scores (FICO)
- Trade line information
- Payment history
- Inquiry data
- Public records (bankruptcy, foreclosure)
- Collections
- Credit utilization across all accounts
- Credit-to-Debt ratio (DTI)

## Unique Identifier for Matching
- SSN (Last 4 or full) + Date of Birth
- Used to match TransUnion response back to member data
- Critical for multi-product member handling

## TransUnion Contact Information

| Contact | Email | Role |
|---------|-------|------|
| Jen Werkley | jen.werkley@transunion.com | Primary Contact |
| Abbie Jeremiah | Abbie.Jeremiah@transunion.com | Secondary Contact |

## Credit Union Credentialing Scenarios

### Scenario 1: CU Has Active TransUnion Subscriber Code
- CU has pulled scores recently
- **Process**: Can proceed directly with CLIP processing
- No additional credentialing required

### Scenario 2: CU Has Inactive Subscriber Code
- CU has TransUnion relationship but hasn't pulled scores in a while
- Subscriber codes go inactive after approximately 1 year of no activity
- **Process**:
  1. Request TransUnion to reactivate the code via email
  2. May require a new Subscriber Release Form signed by CU
  3. Send intro email to TransUnion with CU contact details
- **Ownership**:
  - Existing clients → Loan Analytics (LA) team handles
  - Net new clients → Implementation team handles

### Scenario 3: CU is Brand New to TransUnion
- No existing TransUnion relationship
- **Process**:
  1. Send intro email to TransUnion with CU details
  2. TransUnion credentialing team onboards the CU
  3. TU gets documents/signatures from CU
  4. TU issues credentials
- **Timeline**: 3-4 weeks (depends on CU responsiveness)
- **Note**: CU may communicate with different people than Trellance does

## Subscriber Release Forms

Two standard forms are used:

| Form | File Name | Use Case |
|------|-----------|----------|
| Standard CLIP Form | `TransUnion Subscriber Code Release Form_Trellance.pdf` | CLIP credit line increase projects |
| Credit Score Only Form | `TransUnion Subscriber Code Release Form_Trellance - CS Only.pdf` | Data enrichment and Loan Grading projects |

## Intro Email to TransUnion (Required Information)

When contacting TransUnion for new or reactivation requests, include:
- CU Name
- CU Address
- Charter Number (obtain from NCUA website)
- Main Contact Name
- Main Contact Email
- Main Contact Phone Number
- Main Contact Title at Institution

**Note**: This is free-form email format

## Credentialing Process Flow

```
1. Identify CU's TransUnion Status
   ↓
2. If New/Inactive: Send Intro Email to TU with CU Details
   ↓
3. TU Responds with Subscriber Release Form Requirement
   ↓
4. CU Signs and Returns Subscriber Release Form
   ↓
5. TU Credentialing Team Onboards CU (3-4 weeks)
   ↓
6. TU Provides Subscriber Code in Secure File
   ↓
7. Store Credentials Securely (Enterprise - contains PII)
   ↓
8. Proceed with CLIP Processing
```

## Key Points

- **Volume-Based Pricing**: TransUnion charges Trellance based on volume; Trellance passes cost to client
- **One File at a Time**: Submit and receive ONE file at a time to TU (they process in unpredictable order)
- **Output File Naming**: TU always names output files `OLB.EDTOUT.TWNTWCDT.OUTPUT`
- **Secure File Handling**: Credentials and attributes arrive in secure files → store on shared drive
- **TU Keeps Us Informed**: TransUnion provides status updates on CU credentialing progress

## Products Using TransUnion

1. **CLIP** - Credit Line Increase Program
2. **Loan Grading** - Portfolio risk assessment
3. **Data Enrichment** - Credit score appending
4. **Other consulting products** - Various credit-related analyses

---

# PART 14: CLIENT ONBOARDING PROCESS

## Overview
This section documents the standard client onboarding workflow for CLIP and other data analytics products.

## Onboarding Workflow Steps

### Step 1: Product Management / Account Management (PM/AM)
- Client request received from PM or AM team
- Initial scoping and requirements gathering
- Contract and pricing confirmation

### Step 2: Request & Project Opening
- Formal request submitted to operations team
- Project opened in project management system
- Resources allocated

### Step 3: Implementation Manager (IM) Assignment
- Implementation Manager assigned to project
- IM becomes primary point of contact for technical setup
- Initial contact made with client

### Step 4: Kick-Off Meeting
- Schedule and conduct kick-off call with client
- Review project scope and timeline
- Confirm data requirements and deliverables
- Identify client technical contacts

### Step 5: Environment Preparation
- Provision necessary system access
- Set up client workspace and folders
- Configure data connections

### Step 6: Load Client Files (Alteryx)
- Receive client data files
- Load into Alteryx workflows
- Initial data validation and profiling

### Step 7: Internal Validation
- Quality assurance review
- Data completeness checks
- Process validation before client exposure

### Step 8: User Portal Admin Training
- Train client administrators on portal access
- Review user management procedures
- Demonstrate key functionality

### Step 9: Push Data to Dashboards
- Load processed data to reporting layer
- Configure dashboard views
- Verify data accuracy in visualizations

### Step 10: Final Checks
- End-to-end process validation
- Stakeholder review and sign-off
- Documentation completion

### Step 11: Client Data Review
- Walk client through their data
- Answer questions and gather feedback
- Address any discrepancies or concerns

### Step 12: Close Project
- Formal project closure
- Transition to ongoing support
- Document lessons learned

## Key Onboarding Contacts

| Role | Contact | Responsibility |
|------|---------|----------------|
| Onboarding Lead | John W | Overall onboarding coordination |
| Onboarding Support | Kayla | Client communication and scheduling |
| Onboarding Support | Paolo | Technical setup assistance |
| Workspace Admin | Rob-Logan | AWS Workspaces provisioning |
| Shared Drive Access | Manish | BOX and S: drive permissions |

## Access Request Procedures

### Alteryx Access
- Submit request through IT ticketing system
- Requires manager approval
- License assigned from pool

### AWS Workspaces Access
- Contact: Rob-Logan
- Used for remote access to Alteryx and S: drive
- Requires VPN setup confirmation

### SQL Database Access
- Admin access contacts: Venkat, Onome, Mercy, Chris, Jon
- Read-only vs. write access determined by role
- Requires data access agreement

### BOX Access
- Contact: Manish for shared drive permissions
- Folder-level access based on project assignment
- External sharing requires additional approval

---

# PART 15: MIGRATION PROCESS (TABLEAU TO POWERBI)

## Overview
Trellance is migrating analytics dashboards from Tableau to PowerBI. This section documents the migration process, benefits, and considerations.

## Migration Scope

### Credit Unions Being Migrated
- MainStreet
- OTIS
- Central Virginia FCU
- NorthWest
- Additional CUs as scheduled

## Benefits of Migration to PowerBI

### 1. Unified Microsoft Ecosystem
- Seamless integration with Office 365
- Native Teams integration for collaboration
- Consistent user experience across Microsoft tools

### 2. Cost Optimization
- Reduced licensing costs
- Consolidated tooling
- Better utilization of existing Microsoft investments

### 3. Enhanced Collaboration
- Real-time co-authoring
- Easy sharing within Teams
- Integrated commenting and feedback

### 4. Improved Data Connectivity
- Native Snowflake connector
- DirectQuery capabilities
- Better performance with large datasets

### 5. Self-Service Analytics
- User-friendly interface
- Drag-and-drop report building
- Empowers business users

### 6. Mobile Experience
- Native mobile apps
- Responsive design
- Push notifications for alerts

### 7. Advanced AI Capabilities
- Q&A natural language queries
- Smart narratives
- Automated insights

### 8. Better Governance
- Data lineage tracking
- Sensitivity labels
- Centralized admin portal

### 9. Scalability
- Enterprise-grade infrastructure
- Auto-scaling capabilities
- Global distribution

### 10. Consistent Branding
- Custom themes and templates
- Standardized visualizations
- Professional appearance

## Migration Challenges & Gaps

### Challenge 1: Visualization Parity
- Some Tableau visualizations may not have direct PowerBI equivalents
- Custom visualizations may need rebuilding
- **Mitigation**: Identify alternatives early, document workarounds

### Challenge 2: User Retraining
- Staff familiar with Tableau need PowerBI training
- Different UI and workflow patterns
- **Mitigation**: Develop training program, provide documentation

### Challenge 3: Data Model Differences
- Tableau and PowerBI handle data differently
- Calculated fields and measures need conversion
- **Mitigation**: Thorough testing, validation against source data

### Challenge 4: Migration Timeline
- Cannot migrate all clients simultaneously
- Need to maintain both platforms during transition
- **Mitigation**: Phased rollout, clear communication schedule

## Migration Kick-Off Process

1. **Client Communication**
   - Announce migration plan
   - Share timeline and milestones
   - Address questions and concerns

2. **Environment Setup**
   - Provision PowerBI workspace
   - Configure data connections
   - Set up security and permissions

3. **Dashboard Rebuild**
   - Recreate reports in PowerBI
   - Validate calculations and metrics
   - Test with sample data

4. **User Acceptance Testing**
   - Client reviews new dashboards
   - Comparison with Tableau originals
   - Feedback incorporation

5. **Go-Live**
   - Deploy to production
   - Monitor for issues
   - Provide support during transition

6. **Decommission Tableau**
   - Archive old dashboards
   - Remove access
   - Update documentation

---

# PART 16: GAPS TO BE FILLED

## Overview
This section documents known gaps in the CLIP documentation and processes that require additional information or development. Use this as a roadmap for future documentation efforts.

---

## Critical Gaps (High Priority)

### Gap 1: TransUnion Field Mapping (419 Fields)
| Aspect | Details |
|--------|---------|
| **What's Missing** | Complete documentation of all 419 TransUnion fields |
| **Current State** | Reference to "150-page internal TU documentation in Admin Folder" but content not consolidated |
| **Needed** | Field names, data types, business meanings, usage examples |
| **Owner** | TBD |
| **Impact** | Troubleshooting delays, integration issues, training gaps |

### Gap 2: Adverse Action Letters
| Aspect | Details |
|--------|---------|
| **What's Missing** | Templates and procedures for notifying declined members |
| **Current State** | No documentation exists |
| **Needed** | Letter templates, regulatory requirements (ECOA, FCRA), timing requirements, delivery procedures |
| **Owner** | TBD (Compliance) |
| **Impact** | Regulatory risk, inconsistent member communication |

### Gap 3: Credit Freeze Handling
| Aspect | Details |
|--------|---------|
| **What's Missing** | Process for members with credit freezes |
| **Current State** | Not documented |
| **Needed** | Detection process, communication procedures, workaround options, member notification templates |
| **Owner** | TBD |
| **Impact** | Processing errors, member complaints |

### Gap 4: Income Verification Process
| Aspect | Details |
|--------|---------|
| **What's Missing** | How income is verified for DTI calculation |
| **Current State** | DTI mentioned but verification process unclear |
| **Needed** | Verification methods, acceptable documentation, self-reported vs. verified handling, fallback procedures |
| **Owner** | TBD (Operations) |
| **Impact** | Inconsistent risk assessment, potential over-extension |

---

## Process Gaps (Medium Priority)

### Gap 5: Rush Processing Details
| Aspect | Details |
|--------|---------|
| **What's Missing** | Pricing and SLA for rush requests |
| **Current State** | "Rush: 1 business day (additional fee)" mentioned but no details |
| **Needed** | Pricing tiers (24hr, same-day), resource allocation, client communication, approval process |
| **Owner** | TBD (Sales/Finance) |

### Gap 6: Parameter Change Approval Workflow
| Aspect | Details |
|--------|---------|
| **What's Missing** | Who approves parameter changes and how |
| **Current State** | Parameters documented but governance unclear |
| **Needed** | Approval matrix, change request form, documentation requirements, audit trail |
| **Owner** | TBD (Compliance/Operations) |

### Gap 7: Data Retention Policy
| Aspect | Details |
|--------|---------|
| **What's Missing** | How long data is kept and archival procedures |
| **Current State** | Not documented |
| **Needed** | Retention periods by data type, archival procedures, destruction protocols, compliance requirements |
| **Owner** | TBD (Legal/Compliance) |

### Gap 8: Disaster Recovery / Business Continuity
| Aspect | Details |
|--------|---------|
| **What's Missing** | DR/BC plan for CLIP operations |
| **Current State** | Not documented |
| **Needed** | Failover procedures, recovery time objectives (RTO), recovery point objectives (RPO), backup locations |
| **Owner** | TBD (IT/Operations) |

---

## Technical Gaps

### Gap 9: Error Handling Procedures
| Aspect | Details |
|--------|---------|
| **What's Missing** | What happens when TU batch fails |
| **Current State** | Basic troubleshooting exists but no formal procedures |
| **Needed** | Error codes, retry procedures, manual fallback, escalation paths, client communication |
| **Owner** | TBD |

### Gap 10: CLIP Packages Details
| Aspect | Details |
|--------|---------|
| **What's Missing** | The "2 CLIP Packages" mentioned but never detailed |
| **Current State** | Reference only - "2 CLIP Packages exist" |
| **Needed** | Package names, included features, pricing, target clients, comparison matrix |
| **Owner** | TBD (Product/Sales) |

### Gap 11: Snowflake Schema Documentation
| Aspect | Details |
|--------|---------|
| **What's Missing** | TR_ANALYTICS_* schema details |
| **Current State** | Schema names referenced but not documented |
| **Needed** | Table structures, field definitions, relationships, data dictionary, refresh schedules |
| **Owner** | TBD (Data Engineering) |

### Gap 12: Sample Output Files
| Aspect | Details |
|--------|---------|
| **What's Missing** | Example deliverables |
| **Current State** | Output fields described but no samples |
| **Needed** | Example approved list, rejection report sample, executive summary template, sample data (anonymized) |
| **Owner** | TBD |

---

## Compliance & Operational Gaps

### Gap 13: Client Communication Templates
| Aspect | Details |
|--------|---------|
| **What's Missing** | Standardized messaging templates |
| **Current State** | Ad-hoc communication |
| **Needed** | Implementation kickoff template, status update template, delivery notification, issue escalation template |
| **Owner** | TBD (Implementation) |

### Gap 14: Quality Assurance Checklist
| Aspect | Details |
|--------|---------|
| **What's Missing** | Pre-delivery QA steps |
| **Current State** | Informal validation |
| **Needed** | QA checklist, validation criteria, sign-off requirements, peer review process |
| **Owner** | TBD (Operations) |

---

## Gap Resolution Tracking

| Gap # | Description | Priority | Owner | Target Date | Status |
|-------|-------------|----------|-------|-------------|--------|
| 1 | TransUnion Field Mapping | Critical | TBD | TBD | Not Started |
| 2 | Adverse Action Letters | Critical | TBD | TBD | Not Started |
| 3 | Credit Freeze Handling | Critical | TBD | TBD | Not Started |
| 4 | Income Verification | Critical | TBD | TBD | Not Started |
| 5 | Rush Processing Details | Medium | TBD | TBD | Not Started |
| 6 | Parameter Change Approval | Medium | TBD | TBD | Not Started |
| 7 | Data Retention Policy | Medium | TBD | TBD | Not Started |
| 8 | DR/BC Plan | Medium | TBD | TBD | Not Started |
| 9 | Error Handling Procedures | Medium | TBD | TBD | Not Started |
| 10 | CLIP Packages Details | Medium | TBD | TBD | Not Started |
| 11 | Snowflake Schema Docs | Medium | TBD | TBD | Not Started |
| 12 | Sample Output Files | Low | TBD | TBD | Not Started |
| 13 | Communication Templates | Low | TBD | TBD | Not Started |
| 14 | QA Checklist | Low | TBD | TBD | Not Started |

---

## Questions Requiring Answers

| # | Question | Why It Matters | Suggested Owner |
|---|----------|----------------|-----------------|
| 1 | What is the exact TransUnion batch submission format? | Needed for automation | Technical Lead |
| 2 | How are credit freeze members handled? | Process gap | Operations |
| 3 | What is the current Alteryx license situation? | Impacts automation approach | IT/Finance |
| 4 | Who approves parameter changes? | Governance gap | Compliance |
| 5 | What is the data retention policy? | Compliance requirement | Legal/Compliance |
| 6 | What are the 2 CLIP packages? | Sales enablement | Product |
| 7 | What is the rush processing pricing? | Sales enablement | Sales/Finance |
| 8 | Who has access to production data? | Security audit | Security |
| 9 | What is the DR/BC plan for CLIP? | Business continuity | Operations |
| 10 | How is income verified for DTI? | Process clarity | Operations |

---

# PART 17: CONFIGURATION EXAMPLE (JSON TEMPLATE)

```json
{
  "credit_union_id": "CU_001",
  "credit_union_name": "Example Federal Credit Union",
  "tenant_id": "TR_ANALYTICS_EXAMPLEFCU",

  "eligibility_criteria": {
    "minimum_account_age_months": 12,
    "minimum_credit_score": 650,
    "maximum_delinquency_30_days": 0,
    "maximum_delinquency_60_days": 0,
    "minimum_current_limit": 500,
    "maximum_current_utilization": 95,
    "exclude_charged_off": true,
    "exclude_bankruptcy": true,
    "bankruptcy_lookback_years": 2
  },

  "increase_strategy": {
    "method": "tiered_percentage",
    "tiers": [
      {"credit_score_min": 750, "increase_percentage": 50, "max_increase_amount": 5000},
      {"credit_score_min": 700, "increase_percentage": 35, "max_increase_amount": 3000},
      {"credit_score_min": 650, "increase_percentage": 25, "max_increase_amount": 2000}
    ],
    "absolute_maximum_limit": 25000
  },

  "risk_parameters": {
    "high_utilization_threshold": 75,
    "analysis_period_months": 6,
    "minimum_payment_rate": 1.0,
    "income_verification_required": true,
    "debt_to_income_max": 0.43
  },

  "output_preferences": {
    "include_rejection_reasons": true,
    "generate_executive_summary": true,
    "export_formats": ["csv", "xlsx", "pdf"],
    "email_recipients": [
      "analyst@examplefcu.com",
      "manager@examplefcu.com"
    ]
  },

  "data_sources": {
    "member_table": "MEMBER",
    "account_table": "ACCOUNT",
    "transaction_table": "TRANSACTIONS",
    "credit_score_table": "CREDIT_SCORES"
  }
}
```

---

# PART 18: GLOSSARY

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
| LA | Loan Analytics (team handling existing client credentialing) |
| LOC | Line of Credit |
| MDPA | Member Data Portal Analytics |
| PII | Personally Identifiable Information |
| PM/AM | Product Management / Account Management |
| SLA | Service Level Agreement |
| TU | TransUnion (credit bureau) |
| Utilization | Balance / Credit Limit ratio |

---

# PART 19: QUICK REFERENCE

## Standard Parameters
- Min FICO: 650
- Min Income: $20,000
- Max DTI: 50%
- Min Age: 21
- Max Limit: $20,000
- Min Account Age: 12 months
- Max Utilization: 95%
- Days Past Due: 0

## Increase Tiers
- <$1K → $1.5K
- $1K-$2K → $3K
- $2K-$3K → $5K
- $3K-$5K → $7.5K
- $5K-$7.5K → $10K
- $7.5K-$10K → $15K
- $10K-$15K → $20K

## Aggregate Limits
- Score 776-850: $25,000 max
- Score 726-775: $18,000 max
- Score 650-725: $13,000 max

## Turnaround Times
- Standard: 2-3 business days
- Rush: 1 business day (additional fee)
- Automated: Next business day

---

*Master Document Version: 1.3*
*Generated: January 2026*
*Source: Consolidated from:*
- *Meeting transcripts (Oct 28, 30, 31, Nov 26, 2025)*
- *CLIP Alteryx Automation POC.pdf - Comprehensive automation blueprint*
- *CLIP Automation-POC.pdf - Macro-driven framework design*
- *Mercy CLIP Notes.pdf - Folder setup and file management procedures*
- *CLIP Run Process documentation (23 operational steps)*
- *TransUnion credentialing process and contact information*
- *Client onboarding workflow and access procedures*
- *Tableau to PowerBI migration documentation*
- *Training materials, KPIs, and risk documentation*

---

# PART 20: TEAM RESPONSIBILITIES (RACI MATRIX)

## Overview
This section defines the responsibilities for each team across the CLIP lifecycle to ensure clear accountability and efficient handoffs.

## RACI Legend
- **R** = Responsible (does the work)
- **A** = Accountable (owns the outcome)
- **C** = Consulted (provides input)
- **I** = Informed (kept updated)

## CLIP Lifecycle RACI Matrix

| Activity | Sales/AM | Implementation | Operations/ART | Support | Product | Engineering |
|----------|----------|----------------|----------------|---------|---------|-------------|
| **SALES & ONBOARDING** |
| Client Acquisition | A/R | I | I | I | C | I |
| Contract Negotiation | A/R | C | I | I | C | I |
| Requirements Gathering | C | A/R | C | I | C | I |
| Parameter Agreement | C | A/R | C | I | R | I |
| **IMPLEMENTATION** |
| Environment Setup | I | A/R | C | I | I | R |
| TU Credentialing | I | A/R | R | I | I | I |
| Folder/Box Setup | I | A/R | R | I | I | I |
| Kick-off Meeting | R | A/R | C | I | C | I |
| **DATA PROCESSING** |
| Data Reception | I | C | A/R | I | I | I |
| Data Validation | I | I | A/R | I | I | I |
| TU Batch Submission | I | I | A/R | I | I | I |
| Parameter Configuration | I | C | A/R | I | C | I |
| Analysis Execution | I | I | A/R | I | I | I |
| **QUALITY & DELIVERY** |
| Quality Assurance | I | C | A/R | C | I | I |
| Output Generation | I | I | A/R | I | I | I |
| Delivery & Presentation | R | A/R | R | I | I | I |
| Client Training | I | A/R | C | C | I | I |
| **ONGOING OPERATIONS** |
| Issue Resolution | I | C | C | A/R | I | C |
| Escalation Management | R | C | C | A/R | C | C |
| Recurring Runs | I | I | A/R | I | I | I |
| Performance Monitoring | I | I | R | I | A | I |
| **PRODUCT & ENGINEERING** |
| Feature Enhancement | C | C | C | C | A/R | R |
| Automation Development | I | I | C | I | R | A/R |
| Documentation Updates | I | C | C | C | A/R | C |
| Training Development | I | C | C | C | A/R | I |

## Team Definitions

### Sales/Account Management
- **Primary Role**: Client relationship, revenue generation
- **CLIP Activities**: Lead generation, contract management, escalation point
- **Handoff To**: Implementation (after contract signed)

### Implementation Team
- **Primary Role**: Client onboarding, environment setup
- **CLIP Activities**: Kick-off, TU credentialing, initial setup, training
- **Handoff To**: Operations (after go-live)

### Operations/ART (Analytics Resource Team)
- **Primary Role**: Day-to-day CLIP execution
- **CLIP Activities**: Data processing, analysis, quality checks, delivery
- **Handoff To**: Support (for ongoing issues)

### Support Team
- **Primary Role**: Issue resolution, client assistance
- **CLIP Activities**: Troubleshooting, escalation management
- **Handoff To**: Engineering (for technical issues)

### Product Team
- **Primary Role**: Product strategy, enhancement
- **CLIP Activities**: Roadmap, feature prioritization, documentation
- **Handoff To**: Engineering (for development)

### Engineering Team
- **Primary Role**: Technical development, automation
- **CLIP Activities**: Automation framework, integrations, infrastructure
- **Handoff To**: Operations (after deployment)

## Responsibility Distribution Opportunities

### Current State vs. Recommended Changes

| Activity | Current Owner | Recommended | Rationale |
|----------|---------------|-------------|-----------|
| TU Credentialing | Implementation | **Shared: Impl + Ops** | Ops has ongoing TU relationship |
| Parameter Configuration | Operations | **Shared: Ops + Product** | Product should validate business rules |
| Client Training | Implementation | **Shared: Impl + Support** | Support handles ongoing questions |
| Documentation | Scattered | **Centralized: Product** | Single source of truth |
| Automation Development | Ad-hoc | **Formalized: Engineering** | Dedicated automation roadmap |

---

# PART 21: PRODUCT SHOWCASES

## Overview
Product Showcases are recurring sessions designed to disperse knowledge, improve feature adoption, and ensure unified understanding of the CLIP lifecycle across all teams.

## Showcase Types

### 1. New Feature Demo
| Aspect | Details |
|--------|---------|
| **Audience** | All teams (Sales, Implementation, Operations, Support, Product, Engineering) |
| **Frequency** | Upon each new feature/enhancement release |
| **Duration** | 30 minutes |
| **Owner** | Product Manager (backup: Engineering Lead) |
| **Content** | Feature walkthrough, use cases, Q&A |
| **Outcome** | Teams understand new capabilities and can communicate to clients |

### 2. Monthly Operations Review
| Aspect | Details |
|--------|---------|
| **Audience** | ART, Operations, Support, Product |
| **Frequency** | Monthly (1st Thursday, 2:00 PM ET) |
| **Duration** | 45 minutes |
| **Owner** | Operations Lead (backup: Senior Analyst) |
| **Content** | Volume metrics, issues encountered, process improvements, upcoming changes |
| **Outcome** | Operational alignment, issue visibility, continuous improvement |

### 3. Quarterly Business Review (QBR)
| Aspect | Details |
|--------|---------|
| **Audience** | Leadership, Sales, Account Management, Product |
| **Frequency** | Quarterly (last Thursday of quarter) |
| **Duration** | 60 minutes |
| **Owner** | Product Manager (backup: Account Director) |
| **Content** | KPI review, revenue analysis, client feedback, roadmap preview |
| **Outcome** | Strategic alignment, resource planning, goal setting |

### 4. Technical Deep Dive
| Aspect | Details |
|--------|---------|
| **Audience** | Engineering, ART, Product |
| **Frequency** | Bi-monthly (2nd Tuesday of odd months) |
| **Duration** | 60 minutes |
| **Owner** | Engineering Lead (backup: Senior Developer) |
| **Content** | Architecture updates, automation progress, technical debt, integration details |
| **Outcome** | Technical knowledge sharing, alignment on technical direction |

## Annual Showcase Calendar

| Month | Week 1 | Week 2 | Week 3 | Week 4 |
|-------|--------|--------|--------|--------|
| January | Ops Review | Tech Deep Dive | - | QBR |
| February | Ops Review | - | - | - |
| March | Ops Review | Tech Deep Dive | - | QBR |
| April | Ops Review | - | - | - |
| May | Ops Review | Tech Deep Dive | - | - |
| June | Ops Review | - | - | QBR |
| July | Ops Review | Tech Deep Dive | - | - |
| August | Ops Review | - | - | - |
| September | Ops Review | Tech Deep Dive | - | QBR |
| October | Ops Review | - | - | - |
| November | Ops Review | Tech Deep Dive | - | - |
| December | Ops Review | - | - | QBR |

*New Feature Demos scheduled ad-hoc upon releases*

## Showcase Agenda Template

### Opening (5 minutes)
- Welcome and attendance
- Agenda overview
- Previous action items review

### Main Presentation (20-30 minutes)
- Topic introduction
- Key content delivery
- Data and metrics (if applicable)
- Visual demonstrations

### Live Demo (10-15 minutes)
- Hands-on walkthrough
- Real examples
- Tips and tricks

### Q&A (10-15 minutes)
- Open questions
- Discussion
- Clarifications

### Wrap-Up (5 minutes)
- Key takeaways summary
- Action items with owners
- Next showcase preview
- Feedback collection

## Showcase Ownership Matrix

| Showcase Type | Primary Owner | Backup Owner | Content Contributors |
|---------------|---------------|--------------|----------------------|
| New Feature Demo | Product Manager | Engineering Lead | Engineering, QA |
| Monthly Ops Review | Operations Lead | Senior Analyst | All Analysts, Support |
| Quarterly Business Review | Product Manager | Account Director | Sales, Finance, Operations |
| Technical Deep Dive | Engineering Lead | Senior Developer | Engineering, Data Engineering |

## Showcase Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Attendance Rate | ≥ 80% of target audience | Sign-in tracking |
| Engagement Score | ≥ 4.0 / 5.0 | Post-session survey |
| Action Item Completion | ≥ 90% | Tracked in project management |
| Knowledge Transfer | ≥ 85% pass rate | Optional quiz for critical topics |
| Feature Adoption | Increase after demo | Usage metrics tracking |

## Recording and Documentation

- All showcases recorded and stored in SharePoint/Confluence
- Slides and materials shared within 24 hours
- Key decisions documented in meeting notes
- Action items tracked in project management system

---

# PART 22: TESTING & VALIDATION FRAMEWORK

## Overview
This section defines the testing and validation procedures to ensure CLIP analyses are accurate, complete, and ready for delivery.

## Testing Levels

### Level 1: Unit Tests
Testing individual components/macros in isolation.

| Test ID | Component | Test Description | Input | Expected Result | Priority |
|---------|-----------|------------------|-------|-----------------|----------|
| UT001 | Eligibility Filter | Credit score below 650 | Score = 620 | Member EXCLUDED | HIGH |
| UT002 | Eligibility Filter | Credit score at threshold | Score = 650 | Member INCLUDED | HIGH |
| UT003 | Eligibility Filter | Account age < 12 months | Age = 10 months | Member EXCLUDED | HIGH |
| UT004 | Eligibility Filter | Account age at threshold | Age = 12 months | Member INCLUDED | HIGH |
| UT005 | Eligibility Filter | Days past due > 0 | DPD = 30 | Member EXCLUDED | HIGH |
| UT006 | Eligibility Filter | Bankruptcy flag | Bankruptcy = Y | Member EXCLUDED | HIGH |
| UT007 | Utilization Calc | Standard calculation | Bal=$2500, Lim=$5000 | Util = 50% | HIGH |
| UT008 | Utilization Calc | Zero balance | Bal=$0, Lim=$5000 | Util = 0% | MEDIUM |
| UT009 | Utilization Calc | Near limit | Bal=$4900, Lim=$5000 | Util = 98% | MEDIUM |
| UT010 | CLI Tier | Entry level increase | Current=$800 | New=$1,500 | HIGH |
| UT011 | CLI Tier | Mid tier increase | Current=$3,500 | New=$7,500 | HIGH |
| UT012 | CLI Tier | Max tier increase | Current=$12,000 | New=$20,000 | HIGH |
| UT013 | Aggregate Limit | Excellent tier cap | Score=780, Total=$30K | Capped at $25,000 | HIGH |
| UT014 | Aggregate Limit | Good tier cap | Score=740, Total=$20K | Capped at $18,000 | HIGH |
| UT015 | Risk Score | Low risk calculation | Score=780, DTI=25% | Risk=LOW | MEDIUM |
| UT016 | Risk Score | High risk calculation | Score=660, DTI=48% | Risk=HIGH | MEDIUM |

### Level 2: Integration Tests
Testing end-to-end flow with component interactions.

| Test ID | Flow | Test Description | Input | Expected Result | Priority |
|---------|------|------------------|-------|-----------------|----------|
| IT001 | Full Pipeline | 100 test members through complete flow | Test file | All outputs generated | HIGH |
| IT002 | TU Integration | Batch submission and response | Valid SSN/DOB | All records matched | HIGH |
| IT003 | TU Integration | Handle no-hit records | Invalid SSN | Proper rejection | HIGH |
| IT004 | Multi-Product | Member with CC and LOC | 2 products | CC prioritized | HIGH |
| IT005 | Output Generation | All file formats | Analysis data | CSV, XLSX, PDF created | HIGH |
| IT006 | Aggregate Limits | Cross-product exposure | Multiple products | Total within tier | HIGH |
| IT007 | Rejection Flow | All rejection reasons | Various failures | Correct reason codes | MEDIUM |
| IT008 | Audit Logging | Complete audit trail | Full run | All events logged | MEDIUM |

### Level 3: Regression Tests
Ensuring changes don't break existing functionality.

| Test ID | Scenario | Baseline | Comparison | Tolerance |
|---------|----------|----------|------------|-----------|
| RT001 | Approval Rate | Historical average | Current run | ± 10% |
| RT002 | Rejection Distribution | Historical pattern | Current run | Major shifts flagged |
| RT003 | CLI Amount Distribution | Historical average | Current run | ± 15% |
| RT004 | Processing Time | Historical average | Current run | ± 20% |
| RT005 | Record Counts | Input count | Output count | 100% accounted |

## Pre-Delivery Validation Checklist

### Data Quality Checks
- [ ] **Record Count Validation**: Input count matches sum of approved + rejected
- [ ] **No Unexpected Nulls**: Required fields have no null values
- [ ] **Date Format Validation**: All dates in expected format
- [ ] **SSN Format Validation**: All SSNs properly formatted
- [ ] **Credit Score Range**: All scores within valid range (300-850)
- [ ] **Limit Range**: All limits within configured bounds

### Business Logic Checks
- [ ] **Eligibility Criteria**: All approved members meet minimum thresholds
- [ ] **Rejection Reasons**: All rejected members have populated reason codes
- [ ] **CLI Tiers**: Increases align with configured tier structure
- [ ] **Aggregate Limits**: No member exceeds tier maximum
- [ ] **Multi-Product Priority**: Credit cards prioritized over LOC

### Output Checks
- [ ] **File Naming**: Files follow naming convention
- [ ] **File Format**: CSV/XLSX/PDF properly formatted
- [ ] **Column Headers**: All expected columns present
- [ ] **Executive Summary**: All metrics populated
- [ ] **Audit Trail**: Complete processing log available

### Manual Spot-Check (10% Sample)
- [ ] Select 10% random sample of approved members
- [ ] Verify eligibility criteria manually
- [ ] Confirm CLI amount calculation
- [ ] Validate aggregate exposure
- [ ] Document findings

## Acceptance Criteria

| Metric | Threshold | Action if Failed |
|--------|-----------|------------------|
| Data Completeness | ≥ 99% | Investigate missing data |
| Processing Accuracy | ≥ 99.5% | Root cause analysis |
| Run Completion | 100% | No partial deliveries |
| Output Format Compliance | 100% | Fix before delivery |
| Rejection Reason Coverage | 100% | All rejections explained |
| Audit Trail Completeness | 100% | Full traceability |

## Test Data Management

### Test Data Requirements
- Anonymized member data for testing
- Representative distribution of credit scores
- Mix of eligible and ineligible members
- Multi-product test cases
- Edge case scenarios

### Test Data Location
```
S:\Products\CLIP (Credit Line Increase Program)\Testing\
├── test_data/
│   ├── standard_test_file.csv
│   ├── edge_cases.csv
│   └── multi_product_test.csv
├── expected_results/
│   ├── standard_expected.csv
│   └── edge_cases_expected.csv
└── test_reports/
    └── YYYY-MM-DD_test_results.xlsx
```

## Validation Sign-Off

| Role | Responsibility | Sign-Off Required |
|------|----------------|-------------------|
| Analyst | Execute tests, document results | YES - Level 1 & 2 |
| QA Reviewer | Validate test results, spot-check | YES - Level 2 & 3 |
| Operations Lead | Approve for delivery | YES - All levels |
| Client (UAT) | Accept deliverables | YES - Final |

---

# PART 23: OPERATIONAL RUNBOOKS

## Overview
Operational runbooks provide step-by-step procedures for handling common operational scenarios, ensuring consistent responses and minimizing resolution time.

## Runbook 1: Standard CLIP Run

### Trigger
Scheduled or on-demand CLIP analysis request

### Pre-Requisites
- [ ] Client data received and validated
- [ ] TU credentials active
- [ ] Parameters confirmed
- [ ] Analyst assigned

### Procedure

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | Verify input file completeness | Analyst | 15 min |
| 2 | Open Run CLIP workflow | Analyst | 5 min |
| 3 | Configure input file path | Analyst | 5 min |
| 4 | Update CORP ID reference | Analyst | 5 min |
| 5 | Run initial workflow | Analyst | 30 min |
| 6 | Submit to TU DEG | Analyst | 10 min |
| 7 | Wait for TU response | System | 4-8 hrs |
| 8 | Download TU files | Analyst | 10 min |
| 9 | Run CLIP Step 2 | Analyst | 30 min |
| 10 | Configure parameters | Analyst | 30 min |
| 11 | Run aggregate limits | Analyst | 15 min |
| 12 | Generate outputs | Analyst | 15 min |
| 13 | QA validation | Analyst/QA | 30 min |
| 14 | Deliver to client | Analyst | 15 min |

### Completion Criteria
- All output files generated
- QA checklist completed
- Files delivered to client
- Audit log updated

---

## Runbook 2: TransUnion Batch Failure

### Trigger
- TU batch not returned within 24 hours
- TU DEG error message received
- Partial or corrupted response file

### Severity
**P2 - High** (impacts delivery SLA)

### Procedure

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | Check TU DEG for error messages | Analyst | 10 min |
| 2 | Review submission file for format issues | Analyst | 15 min |
| 3 | Check TU status page for outages | Analyst | 5 min |
| 4 | If file error: correct and resubmit | Analyst | 30 min |
| 5 | If TU issue: contact TU support | Analyst | 15 min |
| 6 | Contact: jen.werkley@transunion.com | - | - |
| 7 | Backup: Abbie.Jeremiah@transunion.com | - | - |
| 8 | Document issue in TU issues log | Analyst | 10 min |
| 9 | Notify client of potential delay | Analyst/AM | 15 min |
| 10 | Update project timeline | Analyst | 10 min |
| 11 | Escalate if unresolved after 4 hours | Ops Lead | - |

### Escalation Path
1. Analyst → Operations Lead (after 2 hours)
2. Operations Lead → Account Manager (after 4 hours)
3. Account Manager → Client notification (after 4 hours)

### Resolution Documentation
- Log in TU Issues Tracker
- Include: date, error type, resolution, time to resolve
- Update knowledge base if new issue type

---

## Runbook 3: Data Quality Issue

### Trigger
- Missing required fields in client data
- Invalid data formats
- Duplicate records beyond threshold
- Data anomalies detected

### Severity
**P2-P3** (depends on scope)

### Procedure

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | Identify specific DQ issues | Analyst | 30 min |
| 2 | Quantify impact (% of records affected) | Analyst | 15 min |
| 3 | Determine if proceed or pause | Ops Lead | 15 min |
| 4 | **If < 5% affected**: Document, proceed with exclusions | Analyst | - |
| 5 | **If 5-20% affected**: Contact client for clarification | Analyst/AM | 1 hr |
| 6 | **If > 20% affected**: Pause, request corrected file | Analyst/AM | - |
| 7 | Document DQ issues in delivery notes | Analyst | 15 min |
| 8 | Update DQ log for pattern tracking | Analyst | 10 min |

### Common DQ Issues and Resolutions

| Issue | Resolution |
|-------|------------|
| Missing SSN | Exclude record, note in rejection |
| Invalid date format | Attempt parsing, exclude if fails |
| Negative balances | Flag for review, may indicate payment |
| Future origination dates | Exclude, flag as data error |
| Duplicate SSN+DOB | Apply deduplication rules |

---

## Runbook 4: Client Escalation

### Trigger
- Client complaint received
- Missed SLA
- Data accuracy concern
- Urgent request

### Severity
**P1-P2** (based on client tier and issue)

### Procedure

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | Acknowledge receipt to client | AM/Support | 1 hour |
| 2 | Log escalation in tracking system | Support | 15 min |
| 3 | Notify Operations Lead | Support | 15 min |
| 4 | Investigate root cause | Ops Lead/Analyst | 2 hours |
| 5 | Prepare preliminary findings | Ops Lead | 1 hour |
| 6 | Schedule client call if needed | AM | 4 hours |
| 7 | Present resolution plan | AM/Ops Lead | - |
| 8 | Execute resolution | Team | Varies |
| 9 | Confirm resolution with client | AM | 1 day |
| 10 | Post-mortem for P1/P2 | Ops Lead | 1 week |

### Escalation Matrix

| Client Tier | P1 Response | P2 Response | P3 Response |
|-------------|-------------|-------------|-------------|
| Enterprise | 1 hour | 4 hours | 1 business day |
| Standard | 2 hours | 8 hours | 2 business days |
| Self-Service | 4 hours | 1 business day | 3 business days |

---

## Runbook 5: Rollback Procedure

### Trigger
- Incorrect output delivered to client
- Parameter error discovered post-delivery
- Data corruption identified
- Client rejects deliverables

### Severity
**P1 - Critical**

### Procedure

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | **STOP** any further distribution immediately | Analyst | ASAP |
| 2 | Notify Operations Lead | Analyst | 5 min |
| 3 | Notify Account Manager | Ops Lead | 10 min |
| 4 | Contact client to halt use of delivered files | AM | 30 min |
| 5 | Identify scope of error | Analyst | 1 hour |
| 6 | Identify affected records | Analyst | 1 hour |
| 7 | Determine root cause | Ops Lead/Analyst | 2 hours |
| 8 | Correct parameters/data/workflow | Analyst | Varies |
| 9 | Re-run analysis | Analyst | 2-4 hours |
| 10 | Enhanced QA on new output | QA/Ops Lead | 1 hour |
| 11 | Deliver corrected files with explanation | AM/Analyst | 1 hour |
| 12 | Document incident | Ops Lead | 1 hour |
| 13 | Post-mortem review | Team | 1 week |

### Client Communication Template

```
Subject: CLIP Analysis Correction - [Client Name] - [Date]

Dear [Client Contact],

We have identified an issue with the CLIP analysis delivered on [date].
We have immediately halted further use of these files and are working
on a corrected version.

Issue Identified: [Brief description]
Impact: [Scope of affected records]
Resolution: [What we're doing to fix it]
New Delivery: [Expected delivery date/time]

We sincerely apologize for any inconvenience. Please discard the
previously delivered files and await the corrected version.

[Contact information for questions]
```

---

## Runbook 6: New Client Onboarding (Quick Reference)

### Trigger
New CLIP client contract signed

### Procedure Summary

| Phase | Key Steps | Owner | Timeline |
|-------|-----------|-------|----------|
| **Initiation** | Contract review, IM assignment | Sales/Impl | Day 1-2 |
| **Kick-off** | Client meeting, requirements confirmation | Impl | Day 3-5 |
| **TU Credentialing** | Status check, initiate if needed | Impl | Day 3-21 |
| **Environment Setup** | Folders, Box, access | Impl | Day 5-10 |
| **First Run** | Test data, validate workflow | Impl/Ops | Day 10-15 |
| **Training** | Client admin training | Impl | Day 15-20 |
| **Go-Live** | Production run, handoff | Impl/Ops | Day 20-25 |
| **Transition** | Handoff to ongoing support | Impl/Support | Day 25-30 |

### Key Contacts for Onboarding

| Role | Contact | Responsibility |
|------|---------|----------------|
| Onboarding Lead | John W | Overall coordination |
| Onboarding Support | Kayla, Paolo | Scheduling, admin |
| Workspace Admin | Rob-Logan | AWS Workspaces |
| Shared Drive Access | Manish | Box permissions |

---

## Runbook 7: Incident Response (General)

### Trigger
Any unplanned event impacting CLIP service

### Severity Classification

| Severity | Definition | Response Time | Resolution Target |
|----------|------------|---------------|-------------------|
| P1 - Critical | Service down, data breach, major client impact | 15 min | 4 hours |
| P2 - High | Feature unavailable, SLA at risk, client escalation | 1 hour | 8 hours |
| P3 - Medium | Degraded performance, minor issue, workaround available | 4 hours | 2 business days |
| P4 - Low | Cosmetic issue, minor inconvenience | 1 business day | 1 week |

### Incident Response Procedure

| Step | Action | Time |
|------|--------|------|
| 1 | Detect and acknowledge incident | Per severity |
| 2 | Classify severity | 5 min |
| 3 | Notify stakeholders per escalation matrix | 10 min |
| 4 | Assemble response team (P1/P2) | 15 min |
| 5 | Investigate and diagnose | Varies |
| 6 | Implement fix or workaround | Varies |
| 7 | Validate resolution | 30 min |
| 8 | Communicate resolution to stakeholders | 15 min |
| 9 | Document in incident log | 30 min |
| 10 | Schedule post-mortem (P1/P2) | Within 1 week |

### Incident Log Template

```
Incident ID: INC-YYYY-XXXX
Date/Time Detected:
Date/Time Resolved:
Severity: P1/P2/P3/P4
Description:
Root Cause:
Resolution:
Affected Clients:
Preventive Actions:
Owner:
```

---

# PART 24: ROLE-SPECIFIC TRAINING PATHS

## Overview
Structured training curricula for each team to ensure unified understanding of the CLIP lifecycle and role-specific expertise.

## Training Path 1: ART (Analytics Resource Team)

### Target Role
Data Analysts responsible for day-to-day CLIP execution

### Prerequisites
- Basic SQL knowledge
- Excel proficiency
- Understanding of credit/lending concepts

### Curriculum

| Module | Topic | Duration | Delivery | Assessment |
|--------|-------|----------|----------|------------|
| ART-101 | CLIP Program Overview | 2 hours | Self-paced | Quiz |
| ART-102 | Alteryx Workflow Basics | 4 hours | Instructor-led | Hands-on lab |
| ART-103 | Data Requirements & Validation | 2 hours | Self-paced | Quiz |
| ART-104 | Parameter Configuration | 2 hours | Instructor-led | Hands-on lab |
| ART-105 | TransUnion Integration | 2 hours | Instructor-led | Hands-on lab |
| ART-106 | Output Interpretation | 2 hours | Self-paced | Quiz |
| ART-107 | Quality Assurance Procedures | 2 hours | Instructor-led | Certification exam |
| ART-108 | Troubleshooting Common Issues | 2 hours | Self-paced | Quiz |
| ART-109 | Shadowing (3 complete runs) | 6 hours | On-the-job | Sign-off |

**Total Duration**: 24 hours
**Certification**: CLIP Analyst Level 1
**Recertification**: Annual refresher (4 hours)

---

## Training Path 2: Implementation Team

### Target Role
Implementation Managers and specialists handling client onboarding

### Prerequisites
- Client communication skills
- Project management basics
- Basic technical aptitude

### Curriculum

| Module | Topic | Duration | Delivery | Assessment |
|--------|-------|----------|----------|------------|
| IMPL-101 | CLIP Product Overview | 2 hours | Self-paced | Quiz |
| IMPL-102 | Client Onboarding Process | 2 hours | Instructor-led | Role-play |
| IMPL-103 | Environment Setup | 2 hours | Instructor-led | Hands-on lab |
| IMPL-104 | TU Credentialing Process | 2 hours | Self-paced | Quiz |
| IMPL-105 | Data Validation Basics | 2 hours | Instructor-led | Hands-on lab |
| IMPL-106 | Folder & Box Setup | 1 hour | Self-paced | Checklist |
| IMPL-107 | Client Communication Templates | 1 hour | Self-paced | Template review |
| IMPL-108 | Kick-off Meeting Best Practices | 1 hour | Instructor-led | Role-play |
| IMPL-109 | Handoff to Operations | 1 hour | Self-paced | Checklist |

**Total Duration**: 14 hours
**Certification**: CLIP Implementation Specialist
**Recertification**: Annual refresher (2 hours)

---

## Training Path 3: Support Team

### Target Role
Support specialists handling ongoing client issues

### Prerequisites
- Customer service experience
- Basic troubleshooting skills
- Communication skills

### Curriculum

| Module | Topic | Duration | Delivery | Assessment |
|--------|-------|----------|----------|------------|
| SUP-101 | CLIP Product Overview | 1 hour | Self-paced | Quiz |
| SUP-102 | Common Issues & Resolutions | 2 hours | Instructor-led | Scenarios |
| SUP-103 | Escalation Procedures | 1 hour | Self-paced | Quiz |
| SUP-104 | Client Communication | 1 hour | Role-play | Evaluation |
| SUP-105 | Knowledge Base Navigation | 1 hour | Hands-on | Quiz |
| SUP-106 | Shadowing (5 support tickets) | 3 hours | On-the-job | Sign-off |

**Total Duration**: 9 hours
**Certification**: CLIP Support Associate
**Recertification**: Annual refresher (2 hours)

---

## Training Path 4: Product Team

### Target Role
Product Managers and owners responsible for CLIP strategy

### Prerequisites
- Product management experience
- Analytics background preferred
- Business acumen

### Curriculum

| Module | Topic | Duration | Delivery | Assessment |
|--------|-------|----------|----------|------------|
| PROD-101 | CLIP Program Deep Dive | 4 hours | Instructor-led | Discussion |
| PROD-102 | Value Stream Understanding | 2 hours | Self-paced | Quiz |
| PROD-103 | Competitive Landscape | 1 hour | Self-paced | Analysis |
| PROD-104 | Roadmap & Enhancement Process | 2 hours | Instructor-led | Workshop |
| PROD-105 | Client Feedback Analysis | 1 hour | Hands-on | Report |
| PROD-106 | KPI Dashboard Review | 1 hour | Hands-on | Quiz |
| PROD-107 | Cross-Functional Shadowing | 4 hours | On-the-job | Summary |

**Total Duration**: 15 hours
**Certification**: CLIP Product Expert
**Recertification**: Annual refresher (3 hours)

---

## Training Path 5: Sales/Account Management

### Target Role
Sales representatives and Account Managers

### Prerequisites
- Sales experience
- Client relationship skills
- Basic lending knowledge helpful

### Curriculum

| Module | Topic | Duration | Delivery | Assessment |
|--------|-------|----------|----------|------------|
| SALES-101 | CLIP Value Proposition | 1 hour | Self-paced | Quiz |
| SALES-102 | Product Capabilities & Packages | 1 hour | Instructor-led | Quiz |
| SALES-103 | Competitive Differentiation | 1 hour | Self-paced | Quiz |
| SALES-104 | Pricing & Packaging | 1 hour | Instructor-led | Quiz |
| SALES-105 | Client Discovery Questions | 1 hour | Role-play | Evaluation |
| SALES-106 | Demo Delivery | 1 hour | Instructor-led | Demo |
| SALES-107 | Objection Handling | 1 hour | Role-play | Evaluation |

**Total Duration**: 7 hours
**Certification**: CLIP Sales Certified
**Recertification**: Annual refresher (2 hours)

---

## Training Calendar

| Month | Training Cohort | Focus |
|-------|-----------------|-------|
| January | New Analysts | ART full curriculum |
| March | Implementation | IMPL full curriculum |
| May | Support | SUP full curriculum |
| July | All Teams | Annual refresher |
| September | New Analysts | ART full curriculum |
| November | Product/Sales | PROD/SALES curriculum |

## Training Resources

| Resource | Location | Owner |
|----------|----------|-------|
| Training Videos | SharePoint > CLIP > Training | Product |
| Slide Decks | SharePoint > CLIP > Training > Slides | Product |
| Hands-on Labs | Sandbox environment | Engineering |
| Quizzes | LMS System | HR/Product |
| Certificates | LMS System | HR |

---

# PART 25: POST-DEPLOYMENT OPERATIONS

## Overview
This section covers the activities that occur after CLIP analysis is delivered to the client, including member communication, implementation tracking, and performance monitoring.

## Phase 6: Member Communication

### 6.1 CLI Offer Generation
| Activity | Owner | Timeline |
|----------|-------|----------|
| Credit union generates offer letters | CU | Within 5 days of delivery |
| Offer includes new limit, terms, opt-out | CU | - |
| Trellance provides template if requested | Implementation | On request |

### 6.2 Offer Channels
- Direct mail
- Email notification
- Mobile app alert
- Online banking message
- Statement insert

### 6.3 Adverse Action Notices
**Required when member is rejected for CLI**

| Requirement | Details |
|-------------|---------|
| **Regulation** | FCRA / ECOA compliance |
| **Timing** | Within 30 days of decision |
| **Content** | Reason for denial, credit bureau info, rights |
| **Owner** | Credit Union (Trellance provides rejection reasons) |

### 6.4 Member Response Tracking

| Metric | Definition | Target |
|--------|------------|--------|
| Offer Acceptance Rate | Members accepting CLI / Total offers | 60-80% |
| Opt-Out Rate | Members declining CLI / Total offers | < 20% |
| Response Time | Days from offer to acceptance | < 30 days |

---

## Phase 7: Implementation Tracking

### 7.1 CU Implementation Steps
| Step | Activity | Timeline |
|------|----------|----------|
| 1 | Receive approved list from Trellance | Day 0 |
| 2 | Load approved members to core system | Day 1-3 |
| 3 | Generate and send offer letters | Day 3-7 |
| 4 | Process member acceptances | Day 7-30 |
| 5 | Update credit limits in core | Day 7-30 |
| 6 | Report back to Trellance (optional) | Day 30+ |

### 7.2 Implementation Tracking Dashboard

| Metric | How to Track | Frequency |
|--------|--------------|-----------|
| Approved count | Trellance delivery | Per run |
| Implemented count | CU report-back | Monthly |
| Implementation rate | Implemented / Approved | Monthly |
| Average days to implement | Date diff | Monthly |
| Issues encountered | CU feedback | As needed |

### 7.3 Feedback Loop to Trellance

| Data Point | Purpose | Frequency |
|------------|---------|-----------|
| Acceptance rates | Model improvement | Quarterly |
| Default rates | Risk assessment | Quarterly |
| Implementation issues | Process improvement | As needed |
| Client satisfaction | Service quality | Annual |

---

## Phase 8: Performance Monitoring

### 8.1 Post-CLI Monitoring Periods

| Period | Metrics Tracked | Owner |
|--------|-----------------|-------|
| 30 days | Early default, utilization change | CU/Trellance |
| 60 days | Delinquency rates, spend patterns | CU/Trellance |
| 90 days | Default rates, ROI calculation | CU/Trellance |
| 6 months | Long-term performance | CU |
| 12 months | Annual review, model validation | Trellance |

### 8.2 Key Performance Indicators (Post-Deployment)

| KPI | Definition | Target | Alert Threshold |
|-----|------------|--------|-----------------|
| 30-Day Default Rate | % of CLI members 30+ DPD | < 1% | > 2% |
| 60-Day Default Rate | % of CLI members 60+ DPD | < 0.5% | > 1% |
| 90-Day Default Rate | % of CLI members 90+ DPD | < 0.25% | > 0.5% |
| Utilization Change | Post-CLI vs Pre-CLI utilization | +10-20% | > 90% |
| Revenue Impact | Additional interest from CLI | Positive | Negative |
| Member Satisfaction | NPS or survey score | > 70 | < 50 |

### 8.3 Model Validation

| Validation Activity | Frequency | Owner |
|---------------------|-----------|-------|
| Compare predictions to actuals | Quarterly | Data Science |
| Analyze false positives (approved, defaulted) | Quarterly | Data Science |
| Analyze false negatives (rejected, would have performed) | Annual | Data Science |
| Adjust parameters based on findings | As needed | Product |
| Document model performance | Quarterly | Data Science |

### 8.4 Performance Report Template

```
CLIP Performance Report - [Credit Union] - [Period]

1. IMPLEMENTATION SUMMARY
   - Approved Members: X
   - Implemented: X (X%)
   - Pending: X
   - Declined by Member: X

2. POST-CLI PERFORMANCE
   - 30-Day DPD Rate: X%
   - 60-Day DPD Rate: X%
   - 90-Day DPD Rate: X%
   - Average Utilization Change: +X%

3. FINANCIAL IMPACT
   - Additional Credit Extended: $X
   - Estimated Revenue Impact: $X
   - Losses (if any): $X

4. COMPARISON TO BASELINE
   - Performance vs. non-CLI members: [Better/Worse/Same]
   - Performance vs. predictions: [Better/Worse/Same]

5. RECOMMENDATIONS
   - [Parameter adjustment recommendations]
   - [Process improvement suggestions]
   - [Next run recommendations]
```

---

# PART 26: KPI MEASUREMENT PROCEDURES

## Overview
This section defines how to measure, track, and report on CLIP KPIs to ensure consistent performance monitoring and improvement.

## KPI Dashboard Components

### 1. Core Operational KPIs

| KPI | Definition | Data Source | Calculation | Target | Frequency |
|-----|------------|-------------|-------------|--------|-----------|
| Turnaround Time | Request to delivery | Project tracker | End date - Start date | 2-3 days | Per run |
| Processing Accuracy | Error-free deliveries | QA logs | Error-free / Total | > 99% | Monthly |
| Throughput | CUs processed | Run logs | Count of completed | 5-10/week | Weekly |
| On-Time Delivery | SLA compliance | Project tracker | On-time / Total | > 95% | Monthly |
| First-Pass Yield | No rework needed | QA logs | No rework / Total | > 90% | Monthly |

### 2. Business Outcome KPIs

| KPI | Definition | Data Source | Calculation | Target | Frequency |
|-----|------------|-------------|-------------|--------|-----------|
| Approval Rate | Approved / Eligible | Output files | Sum approved / Sum eligible | 60-70% | Per run |
| Average CLI Amount | Dollar increase | Output files | Sum increase / Count | $2,500 | Per run |
| Total Exposure | New credit extended | Output files | Sum of new limits | Track | Per run |
| Client Satisfaction | CSAT score | Surveys | Average rating | > 4.5/5 | Quarterly |
| Revenue per Run | Billing amount | Finance | Invoice amount | Track | Monthly |

### 3. Quality KPIs

| KPI | Definition | Data Source | Calculation | Target | Frequency |
|-----|------------|-------------|-------------|--------|-----------|
| Data Quality Score | Input completeness | Validation logs | Valid fields / Total | > 99% | Per run |
| Rejection Accuracy | Correct rejections | Spot checks | Correct / Sampled | 100% | Monthly |
| Approval Accuracy | Correct approvals | Spot checks | Correct / Sampled | 100% | Monthly |
| Audit Compliance | Complete audit trail | Audit logs | Complete / Total | 100% | Per run |

## Measurement Procedures

### Procedure 1: Calculating Turnaround Time

```
1. Record request received date/time (T1)
2. Record delivery date/time (T2)
3. Calculate business hours: T2 - T1 (excluding weekends/holidays)
4. Log in project tracker
5. Flag if > SLA threshold
```

### Procedure 2: Calculating Approval Rate

```
1. Extract total eligible count from eligibility filter output
2. Extract total approved count from final approved list
3. Calculate: Approved / Eligible × 100
4. Compare to historical average
5. Flag if deviation > 10%
```

### Procedure 3: Calculating Data Quality Score

```
1. Count total input records
2. Count records with all required fields populated
3. Count records with valid formats
4. Score = (Complete + Valid) / (2 × Total) × 100
5. Log by client for trending
```

## Reporting Schedule

| Report | Audience | Frequency | Owner | Distribution |
|--------|----------|-----------|-------|--------------|
| Daily Operations Summary | Operations | Daily | Analyst | Email |
| Weekly Metrics Dashboard | Ops Lead, Product | Weekly | Ops Lead | Dashboard |
| Monthly Performance Report | Leadership | Monthly | Product | Presentation |
| Quarterly Business Review | Executives | Quarterly | Product | Meeting |
| Annual Performance Analysis | All stakeholders | Annual | Product | Report |

## Baseline Measurements

### Current State Baselines (to be updated)

| Metric | Baseline Value | Baseline Date | Next Review |
|--------|----------------|---------------|-------------|
| Turnaround Time | 2-3 days | Jan 2026 | Apr 2026 |
| Approval Rate | 60-70% | Jan 2026 | Apr 2026 |
| Processing Accuracy | 95-98% | Jan 2026 | Apr 2026 |
| Throughput | 5-10 CUs/week | Jan 2026 | Apr 2026 |
| Client Satisfaction | TBD | TBD | TBD |

### Target State Goals

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Turnaround Time | 2-3 days | 4-8 hours | Q4 2026 |
| Processing Accuracy | 95-98% | > 99.5% | Q2 2026 |
| Manual Touchpoints | 8-12 | 2-3 | Q4 2026 |
| Throughput | 5-10 CUs/week | 20-30 CUs/week | Q4 2026 |

## Dashboard Access

| Dashboard | Platform | Access | URL |
|-----------|----------|--------|-----|
| Operations Dashboard | PowerBI | Operations team | [Internal link] |
| Executive Dashboard | PowerBI | Leadership | [Internal link] |
| Client Dashboard | PowerBI | Per-client | [Client portal] |

---

*Master Document Version: 2.0*
*Generated: January 2026*
*Source: Consolidated from:*
- *Meeting transcripts (Oct 28, 30, 31, Nov 26, 2025)*
- *CLIP Alteryx Automation POC.pdf - Comprehensive automation blueprint*
- *CLIP Automation-POC.pdf - Macro-driven framework design*
- *Mercy CLIP Notes.pdf - Folder setup and file management procedures*
- *CLIP Run Process documentation (23 operational steps)*
- *TransUnion credentialing process and contact information*
- *Client onboarding workflow and access procedures*
- *Tableau to PowerBI migration documentation*
- *Training materials, KPIs, and risk documentation*
- *Value Stream requirements analysis (January 2026)*

---

**END OF DOCUMENT**

This document is optimized for upload to NotebookLM for interactive Q&A, mind map generation, and training material development.
