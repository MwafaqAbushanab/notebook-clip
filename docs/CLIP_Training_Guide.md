# CLIP Training Guide
## Credit Line Increase Program - Comprehensive Training Manual

---

## Table of Contents
1. [Program Overview](#1-program-overview)
2. [Products & Eligibility](#2-products--eligibility)
3. [Data Requirements](#3-data-requirements)
4. [Parameters & Business Rules](#4-parameters--business-rules)
5. [Process Workflow](#5-process-workflow)
6. [Detailed CLIP Run Process (Step-by-Step)](#6-detailed-clip-run-process-step-by-step)
7. [Folder Setup & File Management](#7-folder-setup--file-management)
8. [Automation Framework](#8-automation-framework)
9. [Output Interpretation](#9-output-interpretation)
10. [Troubleshooting](#10-troubleshooting)
11. [Best Practices](#11-best-practices)
12. [TransUnion Credentialing](#12-transunion-credentialing)
13. [Client Onboarding Process](#13-client-onboarding-process)
14. [Tableau to PowerBI Migration](#14-tableau-to-powerbi-migration)
15. [Gaps to Be Filled](#15-gaps-to-be-filled)
16. [Quick Reference](#16-quick-reference)

---

## 1. Program Overview

### What is CLIP?
**CLIP (Credit Line Increase Program)** is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions. Operating since 2015-2016, CLIP identifies members eligible for credit line increases across multiple lending products.

### Value Proposition
- **For Credit Unions**: Increase revenue, improve member satisfaction, optimize credit portfolio
- **For Members**: Access to additional credit when needed, recognition of good payment history
- **For Trellance**: Recurring revenue stream, strengthened client relationships

### Key Statistics
| Metric | Value |
|--------|-------|
| Program Age | Since 2015-2016 |
| Standard Turnaround | 2-3 business days |
| Typical Approval Rate | 60-70% of eligible |
| Credit Bureau | TransUnion (419 fields) |

---

## 2. Products & Eligibility

### Supported Products

#### Credit Cards
- Most common product for CLI analysis
- Minimum 1 year since origination
- Maximum individual limit: $20,000
- Subject to aggregate limits by credit score tier

#### Unsecured Lines of Credit
- Variable terms
- Higher risk tier than credit cards
- Same eligibility criteria apply
- Combined with other products for aggregate limits

#### HELOCs (Home Equity Lines of Credit)
- Collateralized product
- Different risk profile
- May have different parameters per CU
- Requires property valuation consideration

### Credit Score Tier Limits

| Credit Score Range | Tier Name | Max Aggregate Limit |
|-------------------|-----------|---------------------|
| 776 - 850 | Excellent | $25,000 |
| 726 - 775 | Good | $18,000 |
| 650 - 725 | Fair | $13,000 |
| Below 650 | Below Threshold | Not Eligible |

---

## 3. Data Requirements

### Required Data Fields

#### Critical (Must Have)
| Field | Description | Example |
|-------|-------------|---------|
| Account Number | Unique account identifier | 1234567890 |
| SSN | Last 4 or full (for TU pull) | XXX-XX-1234 |
| First Name | Member first name | John |
| Last Name | Member last name | Smith |
| Date of Birth | DOB for age verification | 1985-03-15 |
| Current Credit Limit | Existing limit amount | $5,000 |
| Current Balance | Outstanding balance | $2,500 |

#### Important (Should Have)
| Field | Description | Example |
|-------|-------------|---------|
| Income | Annual gross income | $65,000 |
| DTI | Debt-to-Income ratio | 35% |
| Days Past Due | Current delinquency status | 0 |
| Product Type | CC, LOC, HELOC | Credit Card |
| Origination Date | Account open date | 2020-01-15 |
| FICO Score | If available from CU | 720 |
| Payment History | Recent payment behavior | Current |

### Data Sources

#### Source 1: MDPA Portal
- Self-service data upload
- Standardized format required
- Automated validation
- Best for recurring analyses

#### Source 2: Consulting Engagements
- Custom data handling
- Flexible formats accepted
- Manual validation
- Best for one-time deep dives

#### Source 3: Direct Snowflake Connection
- Enterprise clients
- Automated data pull
- TR_ANALYTICS_* schemas
- Best for high-volume recurring

### Creating Unique Identifiers
```
Unique ID = Last 4 SSN + Date of Birth (MMDDYYYY)
Example: 1234 + 03151985 = 123403151985
```

**Why?** Members may have multiple products. Unique ID allows:
- Duplicate detection across products
- Aggregate exposure calculation
- Proper recommendation handling

---

## 4. Parameters & Business Rules

### Standard Eligibility Thresholds

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

### Credit Line Increase Tiers

| Current Limit | Increase To | Notes |
|---------------|-------------|-------|
| < $1,000 | $1,500 | Entry level |
| $1,000 - $2,000 | $3,000 | Low tier |
| $2,000 - $3,000 | $5,000 | Mid-low tier |
| $3,000 - $5,000 | $7,500 | Mid tier |
| $5,000 - $7,500 | $10,000 | Mid-high tier |
| $7,500 - $10,000 | $15,000 | High tier |
| $10,000 - $15,000 | $20,000 | Maximum tier |

### Exclusion Criteria (Hard Stops)
- Bankruptcy (active or within lookback period)
- Charged-off accounts
- Active collections
- 30/60/90 day delinquencies
- Fraud alerts on credit file
- Deceased indicator
- Credit freeze
- Overlimit on existing products
- Recent CLI (within 6-12 months)

### Configurable Parameters (Per Credit Union)

```json
{
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
  }
}
```

---

## 5. Process Workflow

### High-Level Process

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    DATA     │───▶│  TRANSUNION │───▶│   ANALYSIS  │───▶│  DECISION   │───▶│   OUTPUT    │
│    INPUT    │    │    PULL     │    │   ENGINE    │    │   ENGINE    │    │  DELIVERY   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Detailed Step-by-Step Process

#### Step 1: Initialization
- Load credit union configuration
- Validate parameters
- Establish database connections
- Initialize logging

#### Step 2: Data Extraction
- Pull member demographics
- Extract account balances & history
- Get transaction patterns (6-12 months)
- Retrieve internal credit scores
- Apply exclusion lists

#### Step 3: TransUnion Integration
- Submit batch credit pull request
- Receive 419 available fields
- Parse and validate response
- Merge with member data

#### Step 4: Eligibility Screening
- Account age check
- Payment history validation
- Balance/limit checks
- Credit score threshold
- DTI calculation
- Exclusion criteria

#### Step 5: Utilization Analysis
- Current utilization percentage
- Historical utilization trends
- High utilizer identification (>70%)
- Available credit headroom
- Utilization band segmentation

#### Step 6: Risk Assessment
- Credit score banding
- Income verification
- Employment stability check
- Recent inquiry analysis
- Bankruptcy/foreclosure screening
- Composite risk score (0-100)

#### Step 7: Recommendation Engine
- Determine increase strategy
- Apply business rule caps
- Calculate post-increase utilization
- Generate confidence score

#### Step 8: Compliance Check
- Regulatory limit verification
- Internal policy validation
- Cross-product exposure check
- Approval routing determination

#### Step 9: Output Generation
- Approved list with details
- Rejection report with reasons
- Executive summary
- Audit trail

#### Step 10: Delivery
- Email notifications
- File upload (S3/shared drive)
- Database update
- Archive processing

---

## 6. Detailed CLIP Run Process (Step-by-Step)

This section provides the detailed operational steps for running CLIP analysis, organized by workflow phase.

### Phase 1: Data Preparation & Input Setup (Steps 1-6)

#### Step 1.1: Verify Inbound File Meta Fields
Required fields in the inbound file:
- Account Number
- Loan Description
- Name
- Address 1, Address 2, City, State, Zip
- SSN
- Current Balance
- Credit Limit
- Available Credit
- Origination Date
- Next Payment Due Date
- Days Past Due
- Original Credit Score
- Unique ID (must match MDPA)

#### Step 1.2: Review Agreed Parameters
- Verify all parameters match the client agreement
- Confirm required metadata is available in provided files
- Reference the "Credit Line Increase Walkthrough" document

#### Step 1.3: Create Preliminary Data Cleanse Workflow
- Duplicate from existing client workflows
- Example location: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\0016_Palmetto Citizens\Workflow(s)`

#### Step 1.4: Validate Prelim Data Cleanse
- Review workflow to ensure all fields and metadata are correct
- Remove unused fields
- **IMPORTANT**: This step requires careful validation - ensure all data is captured and formulas work correctly

#### Step 1.5: Output File Preparation
- Output file format: **CSV**
- File naming: Prepend **CORP ID** to filename
- Get CORP ID from: `S:\Prod\Inputs\Reference and Control Tables\CU Master for Providers.xlsx`

#### Step 1.6: Stage File for Processing
- Place CSV file in: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\FilesToProcess`
- **Archive any existing files** from prior processing before adding new file

### Phase 2: Run CLIP & TransUnion Integration (Steps 7-14)

#### Step 2.1: Execute Run CLIP Application
- Run as Application: `S:\Prod\Workflows\Tools\Run CLIP.yxwz`

#### Step 2.2: Execute CLIP Step 2 Workflow
- For manual runs, execute with validation
- Workflow: `S:\Prod\Workflows\Chained Apps\Clip Step2.yxwz`
- **Turn off outputs before running** to validate

#### Step 2.3: Update CLIP Cycle Date
- Format: YYYY-MM
- Location: Formula tool 144 in the workflow

#### Step 2.4: Validate Data Flow
- Review data running through workflow
- Confirm no records dropped incorrectly

#### Step 2.5: Review Run CLIP Outputs
- Multiple outputs generated:
  - CSV file (for TU submission)
  - XLSX file (for analysis)

#### Step 2.6: Submit to TransUnion Data Exchange Gateway
1. Log in to TU DEG (Data Exchange Gateway)
2. Navigate to 'Send File to TU'
3. Select mailbox: `/ToTU/olb.edtin.twntwodt.inputa`
4. Browse and select CSV file with appropriate date
5. Click 'Go' to submit

**IMPORTANT TU Submission Best Practice:**
- Submit and receive **ONE FILE AT A TIME**
- TU processes submissions in unpredictable order
- Output files always named: `OLB.EDTOUT.TWNTWCDT.OUTPUT`
- Processing multiple files makes client identification difficult

#### Step 2.7: Process TransUnion Response Files
TU returns two files:
1. **Consumer File** → Save to: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Consumer Statements`
2. **Output File** (credit attributes) → Leave in: `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received`
   - Batch command auto-moves to 'Processed' folder after reading

#### Step 2.8: Verify File Naming Conventions
- **Consulting projects**: `Peer No _ Consulting Project's Report Date _ standard TU file name`
- **CLIP runs**: `Peer No _ Date file returns from TU _ standard TU file name`

### Phase 3: Parameter Configuration & Analysis (Steps 15-21)

#### Step 3.1: Configure Credit Limit Maximum
- Tool: Formula (64)
- Field: `CLIP CR Limit Max`
- Adjust per client based on "Credit Line Increase Walkthrough" document

#### Step 3.2: Apply Credit Metrics
- Tool: Formula (67)
- Input all credit metrics from walkthrough document
- Adjust formulas as needed per client

#### Step 3.3: Configure Exclusion Criteria
- Tool: Formula (72)
- Example adjustments:
  - Bankruptcies in past 24 months
  - Repossession trades
- Uncomment/comment items based on client requirements

#### Step 3.4: Calculate Income & Payment Metrics
- Tool: Formula (73)
- Calculates:
  - Monthly income
  - Monthly minimum payments

#### Step 3.5: Apply Proposed New Limits
- Tool: Formula (74)
- Adjust nested IFs per client requirements

#### Step 3.6: Configure Supplemental Fields
- Tool: Select (260)
- Add supplemental fields as needed:
  - Aggregate Spend Over Past 12 Months
  - Max Aggregate Bankcard Balance Over The Last Year

#### Step 3.7: Final Validation
- Check Summary tools near end of workflow
- Verify no zeros in key counts

### Phase 4: Aggregate Limits Processing (Steps 22-23)

#### Step 4.1: Multi-Product Prioritization
- Workflow: PC Aggregate Limits
- Tool: Sort (30)
- **Priority ranking**: Credit Card ranked BEFORE Line of Credit
- Applies when multiple records tied to one SSN

#### Step 4.2: Configure Credit Limit Buckets
- Tool: Formula (47) in PC Aggregate Limits
- Review and adjust credit limit buckets per client

---

## 7. Folder Setup & File Management

### Amazon Workspace Shared Drive Setup

#### Step 1: Navigate to Base Directory
```
S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\
```

#### Step 2: Create Client Folder
- Naming convention: `PeerNumber_CreditUnionName`
- Example: `0558_Interfaith`

#### Step 3: Create Subfolders
Inside the client folder, create:
- **Year folder** (e.g., `2025`)
- **Workflows folder**

#### Step 4: File Placement Rules
- Source files → Year-specific folder
- Workflow files → Workflows folder

### Box Setup for Client File Sharing

#### Step 1: Access Box
- URL: `https://trellance.app.box.com/folder/305984505328`
- Connect with your Box account

#### Step 2: Navigate to Client Folder
- Path: `Files > Shared > Credit Unions`
- Folder naming: `PeerNumber_CreditUnionName`

### Sharing Access with Clients

#### Step 1: Create File Request
- Right-click folder
- Select **Options > File Request**

#### Step 2: Configure Link
- Copy generated link
- **Optional**: Set link expiration under Settings for added security

#### Step 3: Send to Client
- Email link to client
- Client can upload files directly to shared folder

### Key File Paths Reference

| Purpose | Path |
|---------|------|
| Direct Source Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\` |
| Files To Process | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\FilesToProcess` |
| Run CLIP Workflow | `S:\Prod\Workflows\Tools\Run CLIP.yxwz` |
| CLIP Step 2 | `S:\Prod\Workflows\Chained Apps\Clip Step2.yxwz` |
| TU Consumer Statements | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Consumer Statements` |
| TU Output Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received` |
| TU Processed Files | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Transunion Received\Processed` |
| CORP ID Reference | `S:\Prod\Inputs\Reference and Control Tables\CU Master for Providers.xlsx` |
| Example Workflow | `S:\Products\CLIP (Credit Line Increase Program)\Inputs\Direct Source Files\0016_Palmetto Citizens\Workflow(s)` |

---

## 8. Automation Framework

### Macro Library Overview

The automation framework uses 8 reusable macros:

| Macro | Purpose | Key Inputs | Key Outputs |
|-------|---------|------------|-------------|
| `data_extraction_macro()` | Pull data from Snowflake | tenant_id, lookback | DataFrame |
| `eligibility_filter_macro()` | Apply eligibility rules | raw_data, config | eligible_members |
| `utilization_calculation_macro()` | Calculate utilization | balance, limit | utilization_metrics |
| `risk_assessment_macro()` | Compute risk scores | credit_data | risk_score, band |
| `recommendation_engine_macro()` | Determine increases | eligible, risk | recommendations |
| `compliance_check_macro()` | Validate compliance | recommendations | approved_list |
| `output_generator_macro()` | Create reports | analysis_data | files |
| `audit_logging_macro()` | Track processing | events | audit_trail |

### Folder Structure

```
CLIP_AUTOMATION/
├── config/
│   ├── global_config.yaml          # System-wide settings
│   ├── credit_unions/
│   │   ├── CU_001_config.json      # Per-CU configuration
│   │   ├── CU_002_config.json
│   │   └── config_template.json    # Template for new CUs
│   └── business_rules/
│       ├── risk_scoring_rules.yaml
│       ├── increase_strategies.yaml
│       └── compliance_rules.yaml
│
├── src/
│   ├── macros/
│   │   ├── data_extraction.py
│   │   ├── eligibility_filter.py
│   │   ├── utilization_calc.py
│   │   ├── risk_assessment.py
│   │   ├── recommendation_engine.py
│   │   ├── compliance_check.py
│   │   ├── output_generator.py
│   │   └── audit_logging.py
│   ├── core/
│   │   ├── database_connector.py
│   │   ├── config_loader.py
│   │   └── validation_engine.py
│   └── orchestration/
│       ├── main_pipeline.py
│       └── scheduler.py
│
├── outputs/
│   └── YYYY-MM/
│       └── CU_001/
│           ├── approved_list.csv
│           ├── rejection_details.csv
│           ├── analysis_report.xlsx
│           └── executive_summary.pdf
│
├── logs/
│   ├── execution_logs/
│   └── error_logs/
│
└── run_clip_analysis.py            # Main entry point
```

### Running Analysis

```bash
# Run for single credit union
python run_clip_analysis.py --cu CU_001 --run-date 2025-01-01

# Run for all credit unions
python run_clip_analysis.py --all --run-date 2025-01-01

# Run with custom config override
python run_clip_analysis.py --cu CU_001 --config custom_config.json

# Dry run (validation only)
python run_clip_analysis.py --cu CU_001 --dry-run
```

---

## 9. Output Interpretation

### Approved List Fields

| Field | Description | Action |
|-------|-------------|--------|
| Member ID | Unique identifier | Use for matching |
| Current Limit | Existing credit limit | Reference |
| New Limit | Recommended new limit | Implement |
| Increase Amount | Dollar increase | Track |
| Credit Score | Current FICO | Risk assessment |
| Risk Band | Low/Medium/High | Pricing tier |
| Confidence Score | 0-100 | Prioritization |
| Product Type | CC/LOC/HELOC | Implementation routing |

### Rejection Report Fields

| Field | Description | Use |
|-------|-------------|-----|
| Member ID | Unique identifier | Communication |
| Rejection Reason | Primary reason | Member notification |
| Failed Criteria | All failed checks | Training data |
| Recommendation | Future action | Next steps |

### Executive Summary Metrics

| Metric | What It Tells You |
|--------|-------------------|
| Total Analyzed | Population size |
| Total Eligible | Met all criteria |
| Total Approved | Final recommendations |
| Approval Rate | Eligible → Approved % |
| Avg Increase | Dollar impact |
| Total Exposure | Portfolio risk |
| Score Distribution | Risk profile |

---

## 10. Troubleshooting

### Common Issues & Solutions

#### Issue: Low Approval Rate
**Symptoms**: Less than 50% approval rate
**Possible Causes**:
- Parameters too restrictive
- Poor data quality
- High-risk population

**Solutions**:
1. Review parameter thresholds
2. Check data completeness
3. Analyze rejection reasons
4. Consider tiered approach

#### Issue: Missing TransUnion Data
**Symptoms**: Empty credit fields
**Possible Causes**:
- SSN format issues
- Name mismatch
- Credit freeze

**Solutions**:
1. Validate SSN format
2. Check name standardization
3. Flag credit freeze members
4. Review TU batch logs

#### Issue: Duplicate Records
**Symptoms**: Same member appears multiple times
**Possible Causes**:
- Multi-product members
- Data entry errors
- Missing unique ID

**Solutions**:
1. Apply unique ID logic (SSN + DOB)
2. Use deduplication macro
3. Prioritize by product type
4. Aggregate exposure calculation

#### Issue: Parameter Configuration Errors
**Symptoms**: Unexpected results, processing failures
**Possible Causes**:
- Invalid JSON format
- Missing required fields
- Value out of range

**Solutions**:
1. Validate JSON syntax
2. Use config template
3. Run validation checks
4. Review error logs

### Error Codes Reference

| Code | Description | Resolution |
|------|-------------|------------|
| E001 | Database connection failed | Check credentials |
| E002 | Invalid config file | Validate JSON |
| E003 | TU batch timeout | Retry or contact TU |
| E004 | Missing required field | Check input data |
| E005 | Duplicate processing | Clear cache/restart |

---

## 11. Best Practices

### Data Preparation
1. **Validate before submitting** - Use data quality checks
2. **Standardize names** - First name, Last name format
3. **Clean SSNs** - Numeric only, no dashes
4. **Verify dates** - Consistent format (YYYY-MM-DD)
5. **Check completeness** - All required fields populated

### Parameter Configuration
1. **Start conservative** - Begin with stricter thresholds
2. **Document changes** - Track parameter modifications
3. **Test before production** - Use dry-run mode
4. **Review quarterly** - Adjust based on performance
5. **Maintain audit trail** - Log all config changes

### Analysis Best Practices
1. **Run regularly** - Monthly or quarterly cadence
2. **Monitor trends** - Track approval rates over time
3. **Segment analysis** - By product, score tier, etc.
4. **Quality checks** - Review sample recommendations
5. **Feedback loop** - Incorporate performance data

### Security & Compliance
1. **Encrypt PII** - SSN, DOB, account numbers
2. **Access controls** - Role-based permissions
3. **Audit logging** - Track all data access
4. **Retention policy** - Follow regulatory requirements
5. **ECOA/FCRA compliance** - Adverse action notices when required

---

## 12. TransUnion Credentialing

### Overview
Before running CLIP for any credit union, they must have valid TransUnion credentials. This section covers the credentialing process.

### TransUnion Contact Information

| Contact | Email |
|---------|-------|
| Jen Werkley | jen.werkley@transunion.com |
| Abbie Jeremiah | Abbie.Jeremiah@transunion.com |

### Credentialing Scenarios

#### Scenario 1: CU Has Active Subscriber Code
- CU has pulled scores recently
- **Action**: Proceed directly with CLIP processing

#### Scenario 2: CU Has Inactive Subscriber Code
- Code inactive (typically after ~1 year of no activity)
- **Action**:
  1. Email TransUnion to request reactivation
  2. May need new Subscriber Release Form
  3. Existing clients → Loan Analytics (LA) team handles
  4. Net new clients → Implementation handles

#### Scenario 3: CU is Brand New to TransUnion
- **Action**:
  1. Send intro email to TU with CU details
  2. TU onboards CU (3-4 weeks)
  3. TU provides subscriber code in secure file

### Subscriber Release Forms

| Form | Use Case |
|------|----------|
| `TransUnion Subscriber Code Release Form_Trellance.pdf` | Standard CLIP |
| `TransUnion Subscriber Code Release Form_Trellance - CS Only.pdf` | Data Enrichment / Loan Grading |

### Intro Email Requirements

When contacting TransUnion, include:
- CU Name & Address
- Charter Number (from NCUA website)
- Main Contact: Name, Email, Phone, Title

### Key Points
- **Volume-Based Pricing**: TU charges by volume → we pass to client
- **One File at a Time**: Submit/receive one file at a time
- **Output File Name**: Always `OLB.EDTOUT.TWNTWCDT.OUTPUT`
- **Timeline**: New credentialing takes 3-4 weeks

---

## 13. Client Onboarding Process

### Overview
This section covers the standard workflow for onboarding new clients to CLIP and other analytics products.

### Onboarding Workflow

#### Step 1: PM/AM Request
- Product Management or Account Management initiates request
- Contract and pricing confirmed

#### Step 2: Project Opening
- Project opened in tracking system
- Resources allocated

#### Step 3: Implementation Manager Assignment
- IM assigned as technical lead
- Initial client contact made

#### Step 4: Kick-Off Meeting
- Review scope and timeline
- Confirm data requirements
- Identify client contacts

#### Step 5: Environment Preparation
- System access provisioned
- Workspace and folders set up

#### Step 6: Load Client Files
- Receive and load client data
- Initial validation

#### Step 7: Internal Validation
- QA review
- Data completeness checks

#### Step 8: User Portal Admin Training
- Train client administrators
- Review user management

#### Step 9: Push Data to Dashboards
- Load to reporting layer
- Configure views

#### Step 10: Final Checks
- End-to-end validation
- Stakeholder sign-off

#### Step 11: Client Data Review
- Walk client through data
- Address questions

#### Step 12: Close Project
- Formal closure
- Transition to support

### Key Onboarding Contacts

| Role | Contact |
|------|---------|
| Onboarding Lead | John W |
| Onboarding Support | Kayla, Paolo |
| Workspace Admin | Rob-Logan |
| Shared Drive Access | Manish |

### Access Request Procedures

#### Alteryx Access
- Submit IT ticket
- Manager approval required
- License from pool

#### AWS Workspaces Access
- Contact: Rob-Logan
- VPN setup required

#### SQL Database Access
- Admin contacts: Venkat, Onome, Mercy, Chris, Jon
- Access level by role

#### BOX Access
- Contact: Manish
- Folder-level permissions

---

## 14. Tableau to PowerBI Migration

### Overview
Trellance is migrating dashboards from Tableau to PowerBI for improved integration and capabilities.

### Migration Benefits

1. **Microsoft Integration** - Office 365 & Teams compatibility
2. **Cost Optimization** - Reduced licensing costs
3. **Enhanced Collaboration** - Real-time co-authoring
4. **Better Data Connectivity** - Native Snowflake connector
5. **Self-Service Analytics** - User-friendly interface
6. **Mobile Experience** - Native mobile apps
7. **AI Capabilities** - Q&A and automated insights
8. **Better Governance** - Data lineage & sensitivity labels
9. **Scalability** - Enterprise-grade infrastructure
10. **Consistent Branding** - Custom themes

### Migration Challenges

1. **Visualization Parity** - Some charts need rebuilding
2. **User Retraining** - New UI patterns
3. **Data Model Differences** - Measures need conversion
4. **Timeline** - Phased rollout required

### CUs Being Migrated
- MainStreet
- OTIS
- Central Virginia FCU
- NorthWest

### Migration Steps
1. Client communication
2. Environment setup
3. Dashboard rebuild
4. User acceptance testing
5. Go-live
6. Decommission Tableau

---

## 15. Gaps to Be Filled

### Overview
This section tracks known documentation and process gaps that require additional information.

### Critical Gaps (High Priority)

| Gap # | Description | What's Needed | Owner |
|-------|-------------|---------------|-------|
| 1 | **TransUnion Field Mapping** | Documentation of all 419 TU fields with data types and meanings | TBD |
| 2 | **Adverse Action Letters** | Templates, regulatory requirements (ECOA, FCRA), timing | TBD (Compliance) |
| 3 | **Credit Freeze Handling** | Detection process, communication procedures, workarounds | TBD |
| 4 | **Income Verification** | Verification methods, acceptable docs, self-reported handling | TBD (Operations) |

### Process Gaps (Medium Priority)

| Gap # | Description | What's Needed | Owner |
|-------|-------------|---------------|-------|
| 5 | **Rush Processing Details** | Pricing tiers, SLAs, approval process | TBD (Sales/Finance) |
| 6 | **Parameter Change Approval** | Approval matrix, change request form, audit trail | TBD (Compliance) |
| 7 | **Data Retention Policy** | Retention periods, archival procedures, compliance requirements | TBD (Legal) |
| 8 | **DR/BC Plan** | Failover procedures, RTO, RPO, backup locations | TBD (IT) |

### Technical Gaps

| Gap # | Description | What's Needed | Owner |
|-------|-------------|---------------|-------|
| 9 | **Error Handling Procedures** | Error codes, retry procedures, escalation paths | TBD |
| 10 | **CLIP Packages Details** | Package names, features, pricing, comparison matrix | TBD (Product) |
| 11 | **Snowflake Schema Docs** | TR_ANALYTICS_* table structures, data dictionary | TBD (Data Eng) |
| 12 | **Sample Output Files** | Example approved list, rejection report, exec summary | TBD |

### Compliance & Operational Gaps

| Gap # | Description | What's Needed | Owner |
|-------|-------------|---------------|-------|
| 13 | **Communication Templates** | Kickoff, status update, delivery notification templates | TBD (Implementation) |
| 14 | **QA Checklist** | Pre-delivery QA steps, validation criteria, sign-off | TBD (Operations) |

### Questions Requiring Answers

1. What is the exact TransUnion batch submission format?
2. How are credit freeze members handled?
3. What is the current Alteryx license situation?
4. Who approves parameter changes?
5. What is the data retention policy?
6. What are the 2 CLIP packages?
7. What is the rush processing pricing?
8. Who has access to production data?
9. What is the DR/BC plan for CLIP?
10. How is income verified for DTI calculation?

---

## 16. Quick Reference

### Key Contacts
| Role | Responsibility |
|------|---------------|
| Data Analyst | Run analyses, configure parameters |
| Account Manager | Client communication, escalations |
| Technical Support | System issues, troubleshooting |
| Compliance | Regulatory questions |

### Standard Parameters Quick Reference
```
Min FICO: 650
Min Income: $20,000
Max DTI: 50%
Min Age: 21
Max Limit: $20,000
Min Account Age: 12 months
Max Utilization: 95%
Days Past Due: 0
```

### Increase Tiers Quick Reference
```
<$1K → $1.5K
$1K-$2K → $3K
$2K-$3K → $5K
$3K-$5K → $7.5K
$5K-$7.5K → $10K
$7.5K-$10K → $15K
$10K-$15K → $20K
```

### Aggregate Limits Quick Reference
```
Score 776-850: $25,000 max
Score 726-775: $18,000 max
Score 650-725: $13,000 max
```

### Turnaround Times
```
Standard Processing: 2-3 business days
Rush Processing: 1 business day (additional fee)
Automated/Scheduled: Next business day
```

---

## Glossary

| Term | Definition |
|------|------------|
| **CLI** | Credit Line Increase |
| **CLIP** | Credit Line Increase Program |
| **DEG** | Data Exchange Gateway (TransUnion file transfer) |
| **DTI** | Debt-to-Income ratio |
| **FICO** | Fair Isaac Corporation credit score |
| **HELOC** | Home Equity Line of Credit |
| **IM** | Implementation Manager |
| **LA** | Loan Analytics (team handling existing client credentialing) |
| **LOC** | Line of Credit |
| **MDPA** | Member Data Portal Analytics |
| **PM/AM** | Product Management / Account Management |
| **TU** | TransUnion (credit bureau) |
| **Utilization** | Balance / Credit Limit ratio |

---

*Training Guide Version: 1.3*
*Last Updated: January 2026*
*Source: Consolidated from meeting transcripts, POC documents, operational knowledge, client onboarding procedures, migration documentation, and gap analysis*
