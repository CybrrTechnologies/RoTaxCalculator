# Romanian Tax Rules 2025-2026

## 📚 Legal Framework & Sources

### 🏛️ Primary Legislation (Official Government Sources):

**Romanian Tax Code:**
- **[Legea 227/2015](https://legislatie.just.ro/Public/DetaliiDocument/171282)** - Codul Fiscal (Romanian Tax Code)
- **[Legea 239/2024](https://legislatie.just.ro/Public/DetaliiDocumentAfis/287644)** - Tax Code modifications for 2025-2026
- **[HG 1/2016](https://legislatie.just.ro/Public/DetaliiDocument/174060)** - Normele metodologice de aplicare a Codului fiscal

**Social Contributions & Minimum Wage:**
- **[OUG 115/2023](https://legislatie.just.ro/Public/DetaliiDocument/277836)** - Minimum wage and social contributions
- **[OUG 114/2023](https://legislatie.just.ro/Public/DetaliiDocument/265749)** - CAS optional for PFA (starting 2023)

**Business Forms:**
- **[Legea 346/2004](https://legislatie.just.ro/Public/DetaliiDocument/54045)** - Stimulare IF (Întreprinzător Individual)

**EU Directives:**
- **[DAC8 Directive](https://eur-lex.europa.eu/legal-content/RO/TXT/?uri=CELEX:32023L2852)** - Crypto platform reporting to ANAF (2026)

---

### 📋 ANAF Official Guidelines:

**Tax Declaration & Forms:**
- [ANAF - Ghid Declarație Unică 2025](https://www.anaf.ro/anaf/internet/ANAF/despre_anaf/strategii_anaf/declaratia_unica/)
- [ANAF - Ghid Declarația Unică 2025 (PDF)](https://static.anaf.ro/static/10/Anaf/AsistentaContribuabili_r/Ghid_Declaratia_Unica_2025.pdf)
- [ANAF - Impozitare venituri independente 2025 (PDF)](https://static.anaf.ro/static/10/Ploiesti/impozitare_venituri_independente25.pdf)

**Investment Income:**
- [ANAF - Impozitare venituri investiții](https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/venituri_investitii/)
- [ANAF - CASS pentru venituri din investiții](https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/contributii_sociale_sanatate/)

**Business Income:**
- [ANAF - Norme de venit 2025 (PDF)](https://static.anaf.ro/static/10/Anaf/legislatie/norme_venit_2025.pdf)
- [ANAF - Ghid taxare PFA](https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/persoane_fizice/)

---

### ⚖️ Tax Code Articles (by Income Type):

| Income Type | Tax Code Article | Rate Article |
|-------------|-----------------|--------------|
| **Dividends** | Art. 97 CF | Art. 97 alin. (1) - 16% (2026) |
| **Capital Gains (Stocks)** | Art. 94-96 CF | Art. 94 alin. (2) - 16% foreign, 6%/3% RO (2026) |
| **Crypto** | Art. 98 CF | Art. 98 alin. (1) - 16% (2026) |
| **Rental Income** | Art. 84-86 CF | Art. 84 alin. (3) - 10% on 70% = 7% effective |
| **Bank Interest** | Art. 92 CF | Art. 92 alin. (1) - 10% |
| **PFA/IF Income** | Art. 67-69 CF | Art. 68 - 10% on profit |
| **Employment (CIM)** | Art. 76-78 CF | Art. 76 - 10% on net salary |
| **Copyright** | Art. 70-74 CF | Art. 72 - 10% on 80% (forfeit 20%) |
| **CASS** | Art. 170-172 CF | Art. 170 - 10% |
| **CAS** | Art. 137-139 CF | Art. 137 - 25% |

---

### 🏦 Official Government Portals:

**File Taxes & Check Data:**
- [SPV (Spațiul Privat Virtual)](https://www.anaf.ro/anaf/internet/ANAF/servicii_online/e_services/) - File Form 212, check pre-filled data, pay taxes
- [Portal ANAF](https://www.anaf.ro) - Tax authority main website
- [Legis.just.ro](https://legislatie.just.ro) - Official legal database (Monitorul Oficial)

**Exchange Rates:**
- [BNR (Banca Națională a României)](https://www.bnr.ro/Cursuri-zilnice-3424.aspx) - Official exchange rates for foreign currency conversions

---

### 📰 Secondary Sources (Non-Government):

**Tax Guides & Articles:**
- [Groupama - Ghid Taxe PFA](https://www.groupama.ro/ghiduri/ghid-taxe-pfa)
- [ContApp - Taxe PFA 2025](https://contapp.ro/blog/taxe-pfa-2025-cas-cass-si-impozit/)
- [Financiarul - PFA 2025 ghid complet](https://financiarul.ro/economice/pfa-2025-taxe-venituri-contributii/)
- [Tax Mentor - Calculator taxe PFA](https://www.taxmentor.ro/resurse-antreprenori/taxe-pfa/)

**Community Resources:**
- [r/Romania Financial Wiki](https://www.reddit.com/r/Romania/wiki/financiar) - Community tax guides
- [r/robursa](https://www.reddit.com/r/robursa/) - Romanian investors forum
- [Impozite Online Forum](https://forum.softpedia.com/forum/181-economie-finante/) - Tax discussion community

**Last Updated**: January 30, 2025
**Tax Years Covered**: 2025, 2026
**Next Legislative Review**: March 2025 (potential ANAF clarifications)

---

## 🔢 CONSTANTS (2026) — Single Source of Truth

> ⚠️ **UPDATE HERE ONLY** — All values below are derived from these constants.
> When minimum wage changes, update `MW` and all derived values update automatically.

### Base Values

| Constant | Value | Notes |
|----------|-------|-------|
| **MW** (Minimum Wage) | **4,050 RON** | Used for CASS/CAS calculations (Jan 1 value) |
| MW_JUL | 4,325 RON | July 1st increase (informational only) |

### Derived Thresholds (MW × Multiplier)

| Threshold | Formula | Value |
|-----------|---------|-------|
| **6_MW** | 4,050 × 6 | **24,300 RON** |
| **12_MW** | 4,050 × 12 | **48,600 RON** |
| **24_MW** | 4,050 × 24 | **97,200 RON** |
| **60_MW** | 4,050 × 60 | **243,000 RON** |
| **72_MW** | 4,050 × 72 | **291,600 RON** |

### CASS Amounts (Investment Income — Stepped)

| Bracket | Formula | Amount |
|---------|---------|--------|
| < 6 MW | 0 | **0 RON** |
| 6-12 MW | 6_MW × 10% | **2,430 RON** |
| 12-24 MW | 12_MW × 10% | **4,860 RON** |
| > 24 MW | 24_MW × 10% | **9,720 RON** |

### CAS Amounts (PFA — Threshold-Based)

| Bracket | Formula | Amount |
|---------|---------|--------|
| < 12 MW | Optional | **0 RON** |
| 12-24 MW | 12_MW × 25% | **12,150 RON** |
| > 24 MW | 24_MW × 25% | **24,300 RON** |

### CASS Amounts (PFA — Proportional above 24 MW)

| Bracket | Formula | Amount |
|---------|---------|--------|
| < 6 MW | 0 | **0 RON** |
| 6-12 MW | 6_MW × 10% | **2,430 RON** |
| 12-24 MW | 12_MW × 10% | **4,860 RON** |
| 24-72 MW | Income × 10% | **Proportional** |
| > 72 MW | 72_MW × 10% | **29,160 RON** (cap) |

---

## 📋 Quick Reference Table

| Income Type | Tax Rate 2025 | Tax Rate 2026 | Change |
|-------------|---------------|---------------|--------|
| **Dividends** | 10% | **16%** | +60% ⚠️ |
| **Capital Gains (Foreign)** | 10% | **16%** | +60% ⚠️ |
| **Capital Gains (RO <365d)** | 3% | **6%** | +100% ⚠️ |
| **Capital Gains (RO ≥365d)** | 1% | **3%** | +200% ⚠️ |
| **Crypto** | 10% | **16%** | +60% ⚠️ |
| **Rent (effective)** | 8% | **7%** | -12.5% ✅ |

**Minimum Wage**:
- 2025: 4,050 RON/month
- 2026: 4,050 RON/month (Jan-Jun), 4,325 RON/month (Jul-Dec) (+6.8% from July 1st)
- **For CASS calculations**: Use 4,050 RON (Jan 1 value, NOT average)

**CASS Thresholds (2026)** — Based on 4,050 RON:
| Bracket | Threshold | CASS Due |
|---------|-----------|----------|
| 6 MW | 24,300 RON | 2,430 RON |
| 12 MW | 48,600 RON | 4,860 RON |
| 24 MW | 97,200 RON | 9,720 RON |

**PFA Contributions (2026)** — See Section 11 for details:
| Contribution | Threshold | Amount |
|--------------|-----------|--------|
| **CAS** (optional <12 MW) | 12 MW / 24 MW | 12,150 / 24,300 RON |
| **CASS** (proportional 24-72 MW) | 6 / 12 / 24-72 MW | 2,430 / 4,860 / 10% real / 29,160 max |

---

## 💰 1. DIVIDENDS

> **Legal Basis**: Art. 97 Codul Fiscal ([Legea 227/2015](https://legislatie.just.ro/Public/DetaliiDocument/171282))
> **2026 Changes**: [Legea 239/2024](https://legislatie.just.ro/Public/DetaliiDocumentAfis/287644) - Art. I pct. 78

### 1.1 Domestic Dividends (Romanian Companies)

**2026 Tax Rules**:
- **Tax Rate**: 16% (increased from 10% in 2025)
- **Withheld at Source**: ✅ Yes (company withholds automatically)
- **Your Action**: Verify in pre-filled Form 212
- **CASS Applicable**: ✅ Yes (net amount after tax)

**Calculation Example**:
```
Gross dividend: 30,000 RON
Tax withheld: 30,000 × 16% = 4,800 RON
Net received: 30,000 - 4,800 = 25,200 RON

For CASS calculation: Use net 25,200 RON
```

### 1.2 Foreign Dividends

**2026 Tax Rules**:
- **Romania Tax**: 16%
- **Foreign Tax Credit**: Deductible (up to 16%)
- **Declaration**: You declare gross + foreign tax in Form 212

**Tax Treaty Rates** (common countries):

| Country | Treaty Rate | Romania Top-up |
|---------|-------------|----------------|
| USA | 15% | 1% |
| UK | 15% | 1% |
| Germany | 15% | 1% |
| France | 15% | 1% |
| Switzerland | 15% | 1% |
| Netherlands | 15% | 1% |

**Example - US Dividends**:
```
Step 1: File W-8BEN form with US broker
Step 2: US withholds 15% (tax treaty rate)

Calculation:
- Gross dividend: $1,000
- Exchange rate (BNR): 4.95 RON/USD
- Gross in RON: $1,000 × 4.95 = 4,950 RON

Romania tax calculation:
- Romania tax: 4,950 × 16% = 792 RON
- Foreign tax credit: 4,950 × 15% = 742.50 RON
- Tax due in Romania: 792 - 742.50 = 49.50 RON

Total tax paid: 742.50 (US) + 49.50 (RO) = 792 RON (16% total)
```

**Important Notes**:
- ✅ Always use BNR exchange rate from dividend payment date
- ✅ Declare gross amount (before foreign withholding)
- ✅ Foreign tax credit cannot exceed Romanian tax
- ✅ Keep W-8BEN form and broker statements for 5 years

---

## 📈 2. CAPITAL GAINS (Stocks, ETFs, Bonds)

> **Legal Basis**: Art. 94-96 Codul Fiscal ([Legea 227/2015](https://legislatie.just.ro/Public/DetaliiDocument/171282))
> **2026 Changes**: [Legea 239/2024](https://legislatie.just.ro/Public/DetaliiDocumentAfis/287644) - Art. I pct. 75-77

### 2.1 Romanian Brokers (XTB, Tradeville, BT Trade)

**2026 Tax Rates**:

| Holding Period | Tax Rate | Withheld at Source |
|----------------|----------|-------------------|
| **< 365 days** | **6%** | ✅ Yes (automatic) |
| **≥ 365 days** | **3%** | ✅ Yes (automatic) |

**Key Characteristics**:
- ✅ Broker calculates and withholds tax automatically
- ✅ Broker reports to ANAF (you verify in Form 212)
- ❌ **Losses NOT deductible** (tax is definitive)
- ✅ **Optimal for**: Buy-and-hold investors (lower long-term rate)

**Calculation Example**:
```
Purchase: 100 shares × 100 RON = 10,000 RON (Jan 1, 2026)
Sale: 100 shares × 150 RON = 15,000 RON (Feb 15, 2027)
Holding period: 410 days (> 365 days)

Capital gain: 15,000 - 10,000 = 5,000 RON
Tax rate: 3% (held > 365 days)
Tax withheld: 5,000 × 3% = 150 RON
Net profit: 5,000 - 150 = 4,850 RON
```

### 2.2 Foreign Brokers (IBKR, Trading212, eToro)

**2026 Tax Rate**: **16%**

**Key Differences from Romanian Brokers**:
- ❌ NOT withheld at source
- ✅ **You declare & pay** in Form 212 by May 25
- ✅ **Losses ARE deductible** from gains
- ✅ **Loss carryforward**: 7 years at 70% value
- ✅ **Optimal for**: Active traders (can offset losses)

**Example with Loss Offset**:
```
2026 Transactions:
- Stock A gain: +15,000 RON
- Stock B loss: -5,000 RON

Net gain: 15,000 - 5,000 = 10,000 RON
Tax: 10,000 × 16% = 1,600 RON
```

**Loss Carryforward Example**:
```
2025: Total loss: -10,000 RON (no gains to offset)

2026: Gain: 20,000 RON
Step 1: Reportable loss = 10,000 × 70% = 7,000 RON
Step 2: Taxable gain = 20,000 - 7,000 = 13,000 RON
Step 3: Tax = 13,000 × 16% = 2,080 RON

Remaining loss: 10,000 - 7,000 = 3,000 RON
→ Can use in 2027-2031 (7 years total from 2025)
```

**Loss Carryforward Rules**:
- ✅ Can carry forward for **7 years**
- ✅ Can use **70%** of prior year loss each year
- ✅ Must be used in order (oldest first)
- ❌ Cannot carry back to previous years

### 2.3 ETFs - Accumulating vs Distributing

**Tax Treatment Comparison**:

| ETF Type | Dividend Tax | Capital Gains Tax | Total Tax Burden |
|----------|--------------|-------------------|------------------|
| **Accumulating** | None (reinvested internally) | 3-6% (RO) or 16% (foreign) | Lower ✅ |
| **Distributing** | 16% (on each distribution) | 3-6% (RO) or 16% (foreign) | Higher ❌ |

**Example - 10-year investment**:

**Accumulating ETF**:
```
Investment: 10,000 EUR
Annual return: 8% (all reinvested)
Final value after 10 years: 21,589 EUR

Sell at year 10:
- Gain: 21,589 - 10,000 = 11,589 EUR
- Tax (foreign broker, >365 days): 11,589 EUR × exchange_rate × 16%
- Tax paid once at exit
```

**Distributing ETF**:
```
Investment: 10,000 EUR
Annual return: 8% (4% dividends + 4% growth)

Year 1 dividend: 400 EUR → 16% tax
Year 2 dividend: 416 EUR → 16% tax
... (10 years of dividend taxes)

Plus capital gains tax on sale
→ Tax paid 10+ times (every year + exit)
```

**Recommendation**: ✅ Choose **accumulating ETFs** for tax efficiency

---

## 🪙 3. CRYPTOCURRENCY

> **Legal Basis**: Art. 98 Codul Fiscal ([Legea 227/2015](https://legislatie.just.ro/Public/DetaliiDocument/171282))
> **2026 Changes**: [Legea 239/2024](https://legislatie.just.ro/Public/DetaliiDocumentAfis/287644) - Art. I pct. 79
> **Platform Reporting**: [DAC8 Directive](https://eur-lex.europa.eu/legal-content/RO/TXT/?uri=CELEX:32023L2852) - Platforms report to ANAF starting 2026

### 3.1 Tax Rate

**2026**: 16% (increased from 10% in 2025)

### 3.2 Exemptions

**Two conditions must BOTH be met**:
- Per transaction: Gain < 200 RON
- Annual total: Total gains < 600 RON

**Example - Exemption Logic**:
```
Transaction 1: Gain 150 RON (< 200 ✅) 
Transaction 2: Gain 180 RON (< 200 ✅)
Transaction 3: Gain 300 RON (> 200 ❌) → TAXABLE
Transaction 4: Gain 100 RON (< 200 ✅)

Total gains: 150 + 180 + 300 + 100 = 730 RON

Taxable amount: 300 RON (only transaction 3)
Tax: 300 × 16% = 48 RON

Note: If total was <600 RON, even transaction 3 would be exempt
```

### 3.3 Cost Basis Method

**FIFO (First In, First Out)** - Required by Romanian law

**Example**:
```
Purchases:
- Jan 10: 0.5 BTC at 100,000 RON
- Mar 15: 0.3 BTC at 120,000 RON

Sale:
- Jul 20: 0.6 BTC at 150,000 RON

Cost basis calculation (FIFO):
- First 0.5 BTC from Jan: 100,000 RON
- Next 0.1 BTC from Mar: 120,000 × (0.1/0.3) = 40,000 RON
- Total cost basis: 140,000 RON

Gain calculation:
- Sale proceeds: 150,000 RON
- Cost basis: 140,000 RON
- Gain: 10,000 RON
- Tax: 10,000 × 16% = 1,600 RON
```

### 3.4 Key Rules

- ❌ **Losses NOT deductible** (not even between different cryptos)
- ✅ **Platforms report to ANAF** (starting 2026, reported March 2027)
- ✅ **Declaration**: Form 212 by May 25
- ✅ **CASS applicable**: On net gains
- ✅ **Currency conversion**: Use BNR rate from transaction date

---

## 🏠 4. RENTAL INCOME

> **Legal Basis**: Art. 84-86 Codul Fiscal ([Legea 227/2015](https://legislatie.just.ro/Public/DetaliiDocument/171282))
> **Forfeit Rules**: Art. 84 alin. (2) - Cheltuieli forfetare

### 4.1 Tax Calculation (2026)

**Forfeit System** (simplified):
- **Forfeit Rate**: 30% (increased from 20% in 2025)
- **Net Income**: Gross × 70%
- **Tax**: Net × 10%
- **Effective Tax Rate**: 7% of gross (down from 8%)

**Formula**:
```
Net income = Gross rent × (1 - 0.30) = Gross × 0.70
Tax = Net income × 0.10
Effective tax = Gross × 0.07
```

**Example**:
```
Monthly rent: 2,000 RON
Annual gross: 2,000 × 12 = 24,000 RON

Net income: 24,000 × 70% = 16,800 RON
Tax: 16,800 × 10% = 1,680 RON
Effective rate: 1,680 / 24,000 = 7%

For CASS: Use 16,800 RON (net income)
```

### 4.2 Requirements & Obligations

**Mandatory**:
- ✅ Register contract (Form C168) within 30 days of lease start
- ✅ Short-term rentals (Airbnb, Booking): Issue fiscal receipts
- ✅ ANAF pre-fills Form 212 if properly registered
- ❌ No expenses deductible (forfeit system replaces itemization)

**Important Notes**:
- Unregistered rent is illegal (ANAF penalties apply)
- Multiple properties: Aggregate all rental income
- Mixed use (personal + rental): Prorate by days rented

---

## 🏥 5. CASS (Health Insurance Contribution)

> **Legal Basis**: Art. 170-172 Codul Fiscal ([Legea 227/2015](https://legislatie.just.ro/Public/DetaliiDocument/171282))
> **CASS Rate**: Art. 170 alin. (1) - 10%
> **ANAF Methodology**: [ANAF - CASS Guidelines 2025](https://www.anaf.ro/anaf/internet/ANAF/asistenta_contribuabili/contributii_sociale_sanatate/)

### 5.1 Who Pays CASS on Investment Income

**Applicable to**:
- ✅ Dividends (net after tax)
- ✅ Capital gains (net profit)
- ✅ Crypto (net gains)
- ✅ Rent (net after forfeit)
- ✅ Interest (regular bank accounts)

**NOT applicable to**:
- ❌ Government bonds (Fidelis, Tezaur) - fully exempt
- ❌ Interest with tax withheld at source
- ❌ Losses (don't reduce net income)

### 5.2 CASS Brackets (2026) — Investment Income

> ⚠️ **Note**: This section covers CASS for **investment income** (dividends, capital gains, crypto, rent). For **PFA/business income**, see Section 11.2 — the rules differ significantly (CASS becomes proportional above 24 MW).

**Important**: 2026 minimum wage changes mid-year:
- **Jan-Jun**: 4,050 RON/month
- **Jul-Dec**: 4,325 RON/month (+6.8%)
- **For CASS calculations**: Use **4,050 RON** (Jan 1 value, NOT average)

**CASS Thresholds (based on 4,050 RON minimum wage)**:

| Net Income Range | Threshold | CASS Calculation | Amount Due |
|------------------|-----------|------------------|------------|
| **< 6 × MW** (< 24,300 RON) | 4,050 × 6 | 0% | **0 RON** |
| **6-12 × MW** (24,300 - 48,600 RON) | 4,050 × 12 | 10% × (4,050 × 6) | **2,430 RON** |
| **12-24 × MW** (48,600 - 97,200 RON) | 4,050 × 24 | 10% × (4,050 × 12) | **4,860 RON** |
| **> 24 × MW** (> 97,200 RON) | - | 10% × (4,050 × 24) | **9,720 RON** |

**Key Points**:
- CASS is **stepped**, not progressive (you pay fixed amount per bracket)
- Thresholds use **monthly minimum wage × number of months** (NOT annual wage × multiplier)
- Use **net income** after taxes/forfeit
- Exclude losses from calculation
- One-time payment by May 25 (with Form 212)
- Use January 1st minimum wage (4,050 RON) for threshold calculations

### 5.3 Minimum Wage for CASS Calculations (2026)

> ⚠️ **Important**: CASS thresholds use the **January 1st minimum wage** (4,050 RON), NOT an average.

**2026 Minimum Wage**:
- **Jan-Jun**: 4,050 RON/month
- **Jul-Dec**: 4,325 RON/month (+6.8%)
- **For CASS**: Use **4,050 RON** (Jan 1 value)

**Threshold Calculation**:
```
Threshold = Monthly MW × Number of Months

6 MW threshold:  4,050 × 6  = 24,300 RON
12 MW threshold: 4,050 × 12 = 48,600 RON
24 MW threshold: 4,050 × 24 = 97,200 RON
```

**Why Jan 1 value?**
- Thresholds are set at the beginning of the fiscal year
- Provides predictability for tax planning
- Consistent with ANAF methodology

### 5.4 Calculation Example

**Scenario**: Mixed investment income

```
2026 Income:
1. Dividends (domestic): 30,000 RON gross
   - Tax withheld: 4,800 RON
   - Net: 25,200 RON ✅ Counts for CASS

2. Capital gains (foreign broker): 20,000 RON gain
   - Tax: 3,200 RON (paid by you)
   - Net: 20,000 RON ✅ Counts for CASS

3. Crypto: 5,000 RON gain
   - Tax: 800 RON
   - Net: 5,000 RON ✅ Counts for CASS

4. Rent: 24,000 RON gross
   - Net (after forfeit): 16,800 RON ✅ Counts for CASS

5. Government bonds interest: 3,000 RON
   - ❌ Does NOT count for CASS (exempt)

Total net for CASS:
25,200 + 20,000 + 5,000 + 16,800 = 67,000 RON

CASS bracket: 12-24 × MW (48,600 - 97,200)
→ CASS due: 10% × (4,050 × 12) = 4,860 RON
```

---

## 📅 6. DECLARATION TIMELINE

### 6.1 Annual Cycle (for 2025 income, declared in 2026)

| Date | Event |
|------|-------|
| **December 31, 2025** | Tax year ends |
| **March 31, 2026** | ANAF publishes pre-filled Form 212 |
| **May 25, 2026** | ⚠️ **DEADLINE**: File Form 212 |
| **May 25, 2026** | ⚠️ **DEADLINE**: Pay taxes + CASS |

### 6.2 What ANAF Pre-fills

**Automatically included**:
- ✅ Salary income (from employer reports)
- ✅ Registered rent (if Form C168 filed)
- ✅ Dividends from Romanian companies
- ✅ Bank interest from Romanian banks
- ✅ Romanian broker capital gains (XTB, Tradeville)

**You MUST manually add**:
- ❌ Foreign broker transactions (IBKR, Trading212)
- ❌ Crypto gains
- ❌ Foreign dividends
- ❌ Unregistered rent (don't do this - illegal!)
- ❌ Cash transactions

### 6.3 Late Filing Penalties

| Violation | Penalty |
|-----------|---------|
| Late filing (1-30 days) | 50 RON + interest |
| Late filing (31-60 days) | 100 RON + interest |
| Late filing (>60 days) | 500 RON + interest + possible audit |
| Late payment | Daily interest (current: ~0.02%/day) |
| Non-filing | Up to 1,000 RON + tax assessment |

---

## 🔄 7. SPECIAL CASES

### 7.1 Government Bonds (Fidelis, Tezaur)

**Complete Tax Exemption**:
- ❌ 0% tax on interest
- ❌ 0% tax on capital gains (if sold before maturity)
- ❌ 0% CASS (fully exempt)
- ✅ Can sell anytime (you get accrued interest to date)

**Why they're tax-advantaged**:
```
Regular bank deposit:
- Interest: 1,000 RON
- Tax (10%): 100 RON
- CASS: Depends on total income
- Net: 900 RON or less

Government bond:
- Interest: 1,000 RON
- Tax: 0 RON
- CASS: 0 RON
- Net: 1,000 RON ✅
```

### 7.2 Stock Options / RSUs from Employer

**Taxation**:
- Grant: No tax
- Vesting: Taxed as salary income (10% + social contributions)
- Sale: Taxed as capital gains (16% if foreign broker)

**Example**:
```
RSU grant: 100 shares at $50/share vesting price
Vesting: Taxed as $5,000 salary income

Later sale at $80/share:
- Cost basis: $50/share (vesting price)
- Sale price: $80/share
- Gain: $30/share × 100 = $3,000
- Tax: 16% on $3,000 equivalent in RON
```

### 7.3 Inherited Investments

**Tax Treatment**:
- Inheritance itself: Gift/inheritance tax (separate from income tax)
- Cost basis: "Steps up" to FMV at inheritance date
- Future gains: Calculated from inherited value

**Example**:
```
Parent bought stock at 100 RON
Stock worth 500 RON when inherited
You sell at 600 RON

Your cost basis: 500 RON (not 100 RON)
Your gain: 600 - 500 = 100 RON
Tax: 100 × 16% = 16 RON (if foreign broker)
```

---

## 🧮 8. CALCULATION FORMULAS (for Rust Implementation)

### 8.1 Dividends

```rust
// Domestic
fn domestic_dividend_tax(gross: f64) -> f64 {
    gross * 0.16
}

// Foreign with tax credit
fn foreign_dividend_tax(gross: f64, foreign_tax_paid: f64) -> f64 {
    let ro_tax = gross * 0.16;
    let credit = f64::min(foreign_tax_paid, ro_tax);
    ro_tax - credit
}
```

### 8.2 Capital Gains

```rust
// Romanian broker
fn ro_broker_tax(gain: f64, holding_days: u32) -> f64 {
    let rate = if holding_days >= 365 { 0.03 } else { 0.06 };
    gain * rate
}

// Foreign broker with loss offset
fn foreign_broker_tax(
    gains: f64, 
    losses: f64, 
    prior_year_losses: f64
) -> f64 {
    let current_year_net = gains - losses;
    let usable_prior_loss = prior_year_losses * 0.70;
    let taxable = f64::max(0.0, current_year_net - usable_prior_loss);
    taxable * 0.16
}
```

### 8.3 CASS

```rust
// IMPORTANT: min_wage should be the January 1st minimum wage
// For 2026: 4,050 RON (NOT average!)
//
// CRITICAL: Thresholds use monthly_wage × number_of_months
fn calculate_cass(net_income: f64, min_wage_monthly: f64) -> f64 {
    // Calculate thresholds using monthly wage × months
    // For 2026 with MW = 4,050:
    let threshold_6_mw = min_wage_monthly * 6.0;   // 24,300 RON
    let threshold_12_mw = min_wage_monthly * 12.0; // 48,600 RON
    let threshold_24_mw = min_wage_monthly * 24.0; // 97,200 RON

    // CASS amounts (10% of threshold basis)
    let cass_6_mw = threshold_6_mw * 0.10;   // 2,430 RON
    let cass_12_mw = threshold_12_mw * 0.10; // 4,860 RON
    let cass_24_mw = threshold_24_mw * 0.10; // 9,720 RON

    if net_income < threshold_6_mw {
        0.0
    } else if net_income < threshold_12_mw {
        cass_6_mw
    } else if net_income < threshold_24_mw {
        cass_12_mw
    } else {
        cass_24_mw
    }
}
```

### 8.4 Rent

```rust
fn rent_tax(gross_rent: f64) -> f64 {
    let net = gross_rent * 0.70;  // 30% forfeit
    net * 0.10
}
```

### 8.5 Crypto

```rust
fn crypto_tax(gain: f64, transaction_count: u32) -> f64 {
    // Check exemption
    if gain < 200.0 && transaction_count == 1 && gain < 600.0 {
        0.0  // Exempt
    } else {
        gain * 0.16
    }
}
```

---

## 📚 9. SOURCES & REFERENCES

### Official Documents
1. **Legea 239/2025** - Tax code modifications effective 2026
2. **Codul Fiscal** - Updated tax code
3. **ANAF Guidelines** - Official interpretations

### Online Resources
- [ANAF Official](https://www.anaf.ro) - Tax authority
- [BNR Exchange Rates](https://www.bnr.ro/nbrfxrates.xml) - Official rates
- [e-Guvernare](https://www.e-guvernare.ro) - Government portal
- [ITM Hunedoara - Minimum Wage History](https://itmhunedoara.ro/ro/activitatea-itm/relatii-de-munca/evolutia-salariului-minim-brut/) - Official minimum wage evolution data

### Minimum Wage Historical Data
See [minimum-wage-history-romania.md](minimum-wage-history-romania.md) for complete historical data including:
- All minimum wage amounts from 2007-2025
- Mid-year changes and effective dates
- Inflation rates and real purchasing power analysis
- Government decisions (HG numbers)

**Key Finding**: Romania has had mid-year minimum wage increases in **2024, 2023, 2015, 2014, 2013, and 2008**.

### Tax Calculators (for validation)
- ANAF's official calculator (when available)
- Independent calculators (cross-check only)

---

## ⚠️ 10. IMPORTANT DISCLAIMERS

### Record Keeping
- ✅ Keep ALL transaction records for **5 years** (ANAF audit period)
- ✅ Save broker statements (monthly/annual)
- ✅ Keep currency conversion documentation (BNR rates)
- ✅ Store tax payment receipts

### Professional Advice
- This document is for informational purposes only
- For complex situations, consult a Romanian tax advisor (expert contabil)
- Tax laws can change - always verify current regulations
- ANAF interpretations may vary - document your reasoning

### Currency Conversions
- ✅ Always use BNR (National Bank of Romania) official rate
- ✅ Use rate from transaction date (not settlement date)
- ✅ For same-day multiple transactions, same rate applies
- ✅ BNR publishes rates daily (except weekends/holidays - use previous day)

---

## 📝 10.5 CHANGE LOG

| Date | Change | Impact |
|------|--------|--------|
| **2025-12** | Legea 239/2025 published | Major tax increases for 2026 |
| **2026-01** | Min wage increase (July 1st) | Salariu crește la 4,325 din Iulie |
| **2026-01-03** | CASS calculation clarification | Use 4,050 RON (Jan 1 value), NOT average |
| **2026-01-03** | PFA CAS/CASS thresholds clarified | CAS on threshold base (not real income); CASS proportional 24-72 MW |
| **2026-01-03** | CASS ceiling for PFA increased | From 60 MW to 72 MW (max CASS: 29,160 RON) |
| **2026-01-15** | CASS calculation methodology clarified | Thresholds use monthly MW × months (not annual × multiplier) |
| **2026-03** | ANAF pre-fills available | Check for accuracy |

---

## 💼 11. BUSINESS INCOME (Not in Current Calculator - Future Phase)

> **Note**: The current calculator focuses on **investment income only**. This section documents business income types for future development.

### 📋 PFA Quick Reference — CAS & CASS (2026)

> **Minimum Wage for Calculations**: 4,050 RON (Jan 1 value, NOT average)

**CAS (Pension) — 25% on THRESHOLD base (never proportional)**

| Net Income | CAS Status | You Pay |
|------------|------------|---------|
| < 48,600 RON | ❌ Optional | 0 |
| 48,600 - 97,200 RON | ✅ Mandatory | **12,150 RON** |
| > 97,200 RON | ✅ Mandatory (capped) | **24,300 RON** |

**CASS (Health) — 10%, becomes proportional above 24 MW**

| Net Income | CASS Base | You Pay |
|------------|-----------|---------|
| < 24,300 RON | - | 0 |
| 24,300 - 48,600 RON | 6 MW (fixed) | **2,430 RON** |
| 48,600 - 97,200 RON | 12 MW (fixed) | **4,860 RON** |
| 97,200 - 291,600 RON | **REAL income** | **10% × income** |
| > 291,600 RON | 72 MW (capped) | **29,160 RON** |

**Key Rules:**
- CAS & CASS are **independent** — paying one doesn't affect the other
- CAS = always on threshold base; CASS = proportional above 24 MW
- Common case: income 24k-48k → pay CASS only, CAS optional

---

> **Primary Sources**:
> - [Groupama - Ghid Taxe PFA](https://www.groupama.ro/ghiduri/ghid-taxe-pfa)
> - [ContApp - Taxe PFA 2025](https://contapp.ro/blog/taxe-pfa-2025-cas-cass-si-impozit/)
> - [ANAF - Impozitare venituri independente (PDF)](https://static.anaf.ro/static/10/Ploiesti/impozitare_venituri_independente25.pdf)
> - [Financiarul - PFA 2025 ghid](https://financiarul.ro/economice/pfa-2025-taxe-venituri-contributii/)

### 11.1 IF (Întreprinzător Individual) - Individual Entrepreneur

> **Legal Basis**: Art. 50-53 Legea 346/2004 (Stimulare IF)
> **Tax Rules**: Art. 94 Codul Fiscal (venituri activități independente)

**Revenue-Based Taxation** (not profit-based):

#### Tax Rates (2025-2026):
- **With employees (1-8)**: 1% of revenue
- **No employees**: 3% of revenue

#### Mandatory Contributions (Even with €0 Revenue):

**Contribution Base**: Minimum **12 × Minimum Wage**
- 2025: 12 × 4,050 = **48,600 RON/year**
- 2026: 12 × 4,050 = **48,600 RON/year**

**Contributions**:
```
2026 Example (no revenue):
CAS (pension): 48,600 × 25% = 12,150 RON
CASS (health): 48,600 × 10% = 4,860 RON
Total: 17,010 RON/year (mandatory!)

Plus accounting: ~2,400 RON/year
Minimum annual cost: ~19,500 RON
```

#### Limits & Restrictions:

| Limit | Value | Consequence |
|-------|-------|-------------|
| **Revenue Cap** | €500,000/year (~2.5M RON) | Must convert to SRL if exceeded |
| **Employees** | Maximum 8 | Cannot exceed |
| **VAT Threshold** | €88,500 (~437k RON) | Mandatory VAT registration |

**Cannot do IF if**:
- ❌ Full-time employee elsewhere (CIM contract)
- ❌ Certain regulated activities (banking, insurance, gambling)
- ❌ Some professional services (lawyers, doctors use specific forms)

#### Cost Comparison - IF vs PFA:

**Example**: 200,000 RON revenue, 50,000 RON expenses

**IF (3% rate)**:
```
Revenue tax: 200,000 × 3% = 6,000 RON
CAS: 12,150 RON (mandatory)
CASS: 4,860 RON (mandatory)
Accountant: 2,400 RON
───────────────────────────────
Total: 25,410 RON (12.7% of revenue)
```

**PFA (10% on profit)**:
```
Profit: 200,000 - 50,000 = 150,000 RON
Income tax: 150,000 × 10% = 15,000 RON
CAS: 0 RON (optional, if not opted in)
CASS: ~4,860 RON (12 MW bracket)
Accountant: 0-1,200 RON (optional)
───────────────────────────────
Total: ~20,000 RON (10% of revenue)
```

#### Break-Even Analysis:

**IF is better than PFA when**:
```
3% of Revenue < 10% of (Revenue - Expenses)
3% × R < 10% × (R - E)
3% × R < 10% × R - 10% × E
10% × E < 7% × R
E < 70% of R

→ Profit margin > 30%
→ Expenses < 70% of revenue
```

**Best use cases for IF**:
- ✅ High-margin services (consulting, software, coaching)
- ✅ Revenue €200k-€500k with >70% profit margin
- ✅ Want pension contributions anyway
- ✅ Simple business model

**Better to use PFA when**:
- ❌ Profit margin < 30%
- ❌ High expenses (trading, reselling, manufacturing)
- ❌ Revenue < €50k (mandatory costs too high)
- ❌ Don't want mandatory pension contributions

---

### 11.2 PFA (Persoană Fizică Autorizată) - Self-Employed

> **Legal Basis**: Art. 67-69 Codul Fiscal (venituri activități independente)
> **CAS Optional**: [OUG 114/2023](https://legislatie.just.ro/Public/DetaliiDocument/265749) - CAS opțional din 2023

PFA has **TWO taxation systems**: Real System (majority) and Income Norms (limited activities).

---

#### 11.2.1 Real System (Sistem Real) - Most Common

> **Tax Base**: Art. 68 CF - Profit (venituri - cheltuieli)

**Profit-Based Taxation** (income minus expenses):

#### Tax Rates (2025-2026):
- **Income Tax**: 10% on net profit (Revenue - Expenses)

#### Contributions (2025-2026):

**CAS (Pension) - 25%**:
- **Status**: OPTIONAL below 12 MW, MANDATORY above
- **Base**: THRESHOLD base (NOT real income!) - see table below
- **If you opt out**: Zero pension points (smaller future pension)
- **Decision**: Annual, cannot change mid-year

**CAS Thresholds for PFA** (25% rate applied to threshold base):

| Net Annual Income | CAS Status | CAS Base | CAS Amount (2026) |
|-------------------|------------|----------|-------------------|
| < 12 MW (~48,600 RON) | ❌ Optional | - | 0 (unless voluntary) |
| 12-24 MW (~48,600-97,200 RON) | ✅ Mandatory | 12 × MW | 25% × 48,600 = **12,150 RON** |
| > 24 MW (>97,200 RON) | ✅ Mandatory | 24 × MW (capped) | 25% × 97,200 = **24,300 RON** |

⚠️ **Important**: CAS is paid on the THRESHOLD base, NOT on your real income. Even if you earn 500,000 RON, CAS is capped at 24,300 RON.

**CASS (Health) - 10%**:
- **Status**: MANDATORY above 6 MW
- **Base**: Stepped thresholds, then PROPORTIONAL, then capped

⚠️ **CASS for PFA differs from investment income!** Above 24 MW, CASS is calculated on REAL income (not stepped).

**CASS Thresholds for PFA** (10% rate):

| Net Annual Income | CASS Base | CASS Amount (2026) |
|-------------------|-----------|-------------------|
| < 6 MW (~24,300 RON) | - | **0 RON** |
| 6-12 MW (~24,300-48,600 RON) | 6 × MW (fixed) | 10% × 24,300 = **2,430 RON** |
| 12-24 MW (~48,600-97,200 RON) | 12 × MW (fixed) | 10% × 48,600 = **4,860 RON** |
| 24-72 MW (~97,200-291,600 RON) | **REAL income** (proportional!) | 10% × actual income |
| > 72 MW (>291,600 RON) | 72 × MW (capped) | 10% × 291,600 = **29,160 RON** |

⚠️ **2026 Change**: CASS ceiling increased from 60 MW to **72 MW** (291,600 RON).

**CAS vs CASS - Key Differences**:
- ✅ CAS and CASS are **completely independent** - paying one doesn't affect the other
- ✅ CAS is always on **threshold base** (never proportional)
- ✅ CASS becomes **proportional** between 24-72 MW (unlike investment income!)
- ✅ You can owe CASS without owing CAS (common case: income 6-12 MW)

#### Example Calculations (2026):

**Example 1: Income 80,000 RON (between 12-24 MW)**
```
Revenue: 120,000 RON
Expenses: 40,000 RON
Net Profit: 80,000 RON

Income tax: 80,000 × 10% = 8,000 RON

CAS (mandatory - income > 12 MW):
  - Base: 12 × MW = 48,600 RON (threshold, not real income!)
  - CAS: 48,600 × 25% = 12,150 RON

CASS:
  - Income in 12-24 MW range → fixed base
  - Base: 12 × MW = 48,600 RON
  - CASS: 48,600 × 10% = 4,860 RON

Total: 8,000 + 12,150 + 4,860 = 25,010 RON
```

**Example 2: Income 150,000 RON (above 24 MW, CASS proportional!)**
```
Revenue: 200,000 RON
Expenses: 50,000 RON
Net Profit: 150,000 RON

Income tax: 150,000 × 10% = 15,000 RON

CAS (mandatory - income > 24 MW):
  - Base: 24 × MW = 97,200 RON (CAPPED - not real income!)
  - CAS: 97,200 × 25% = 24,300 RON

CASS (proportional zone!):
  - Income 150,000 is between 24-72 MW
  - Base: REAL income = 150,000 RON
  - CASS: 150,000 × 10% = 15,000 RON

Total: 15,000 + 24,300 + 15,000 = 54,300 RON
```

**Example 3: Income 35,000 RON (between 6-12 MW)**
```
Net Profit: 35,000 RON

Income tax: 35,000 × 10% = 3,500 RON

CAS: ❌ OPTIONAL (income < 12 MW)
  - You can opt out and pay nothing
  - Or voluntarily contribute for pension credits

CASS (mandatory - income > 6 MW):
  - Base: 6 × MW = 24,300 RON (fixed)
  - CASS: 24,300 × 10% = 2,430 RON

Total (without CAS): 3,500 + 2,430 = 5,930 RON
```

#### Advance Payments:

PFA must make **quarterly advance payments**:
- **Deadline**: 25th of month following quarter end
  - Q1 (Jan-Mar): Pay by April 25
  - Q2 (Apr-Jun): Pay by July 25
  - Q3 (Jul-Sep): Pay by October 25
  - Q4 (Oct-Dec): Pay by January 25 (next year)

**Amount**: 1/4 of estimated annual tax + contributions

**Annual settlement**: Form 212 by May 25 (reconcile advances with actual)

---

#### 11.2.2 Income Norms System (Norme de Venit) - Limited Use

> **Legal Basis**: Art. 69 Codul Fiscal
> **Norms List**: [ANAF - Norme de venit 2025 (PDF)](https://static.anaf.ro/static/10/Anaf/legislatie/norme_venit_2025.pdf)
> **Revenue Cap**: €25,000 = 124,365 RON (2025 BNR rate)

**Fixed Annual Income** (set by ANAF, not based on actual revenue):

#### What Are Income Norms?

A **simplified taxation system** where you pay tax on a **fixed annual income** established by ANAF for specific activities, regardless of actual revenue/expenses.

#### Eligibility (2025):

Must meet **ALL** conditions:
- ✅ Your activity (CAEN code) must be in [ANAF's norms list](https://static.anaf.ro/static/10/Anaf/legislatie/norme_venit_2025.pdf)
- ✅ Previous year revenue < €25,000 (124,365 RON at 2025 exchange rate)
- ✅ Choose at beginning of year (cannot switch mid-year)

**Common activities eligible**:
- Some retail (small shops)
- Certain services (repairs, tailoring, hairdressing)
- Small-scale agriculture
- **Check ANAF list** - most professional services NOT eligible

**NOT eligible** (must use Real System):
- IT/software development
- Consulting (most types)
- Marketing, accounting, legal
- Engineering, architecture
- Any activity not in ANAF norms

#### How It Works (2025):

**ANAF publishes annual norms** for each:
- Activity type (CAEN code)
- County (București has different norms than Cluj, etc.)
- Sometimes city size

**Example Norms (2025 - hypothetical)**:
```
Activity: Hairdressing (CAEN 9602)
Location: Cluj County
Norm: 35,000 RON/year (set by ANAF)

You pay tax on 35,000 RON regardless of whether you earned:
- 10,000 RON (you pay more than real system!)
- 50,000 RON (you pay less than real system!)
```

#### Taxation on Norms (2025):

```
Example: Norm = 35,000 RON/year

Income tax: 35,000 × 10% = 3,500 RON

CAS (if opted in):
  - Base: 35,000 RON (the norm)
  - CAS: 35,000 × 25% = 8,750 RON

CASS:
  - Base: 35,000 RON
  - Bracket: 6-12 MW (24,300 - 48,600)
  - CASS: 2,430 RON (stepped)

Total (with CAS): 3,500 + 8,750 + 2,430 = 14,680 RON
Total (without CAS): 3,500 + 2,430 = 5,930 RON
```

#### Forced Transition to Real System:

If in 2024 you had **revenue > €25,000** (€124,365 RON):
- ⚠️ **Mandatory** switch to Real System for 2025
- No option to stay on norms
- Must track expenses and real profit

#### Pros & Cons:

**Advantages** ✅:
- Simple accounting (no expense tracking needed)
- Predictable taxes (know exact amount at year start)
- Good if actual revenue > norm (pay less tax)
- Minimal record-keeping

**Disadvantages** ❌:
- Pay tax even if revenue < norm (or even zero!)
- No expense deductions allowed
- Limited to specific activities
- Revenue cap €25,000 (very low)
- ANAF can change norms yearly

#### When to Use Norms vs Real:

**Use Norms if**:
- ✅ Your activity qualifies (CAEN in list)
- ✅ Revenue consistently > norm but < €25k
- ✅ Low/no expenses to deduct
- ✅ Want simple accounting

**Use Real System if**:
- ✅ High expenses (norm doesn't allow deductions)
- ✅ Revenue > €25,000
- ✅ Activity not in norms list
- ✅ Variable income (might be below norm)

#### 2025 Key Thresholds:

| Threshold | Amount (RON) | Purpose |
|-----------|--------------|---------|
| **Revenue cap for norms** | 124,365 (€25k) | Above = forced to Real System |
| **CAS threshold 1** | 48,600 (12 MW) | Below = no CAS if opted out |
| **CAS threshold 2** | 97,200 (24 MW) | Affects CAS calculation base |
| **CASS threshold** | 24,300 (6 MW) | Below = no CASS (if insured otherwise) |

---

### 11.3 CIM (Convenții Individuale de Muncă) - Employment Income

> **Legal Basis**:
> - Income Tax: Art. 76-78 Codul Fiscal
> - CAS: Art. 137-138 CF
> - CASS: Art. 155 CF
> - Personal Deductions: Art. 77 alin. (2) CF

**Salary Taxation**:

#### Employee Contributions (2025-2026):
- **Income Tax**: 10% on gross salary
- **CAS (pension)**: 25% on gross salary
- **CASS (health)**: 10% on gross salary
- **Total**: 45% withheld from gross

#### Employer Contributions (separate):
- **CAS employer**: 4% (reduced from 25%)
- **Social insurance**: 2.25%
- **Total employer**: ~6.25%

#### Personal Deductions (2026):

| Deduction Type | Monthly Amount | Annual |
|----------------|----------------|--------|
| **Basic** (everyone) | 300 RON | 3,600 RON |
| **1 dependent** | +100 RON | +1,200 RON |
| **2 dependents** | +200 RON | +2,400 RON |
| **3 dependents** | +300 RON | +3,600 RON |
| **4+ dependents** | +400 RON | +4,800 RON |

**Dependent**: Child, spouse without income, disabled family member

#### Example (2026):

```
Gross salary: 10,000 RON/month
Dependents: 1 child

Personal deduction: 300 + 100 = 400 RON
Taxable income: 10,000 - 400 = 9,600 RON

Income tax: 9,600 × 10% = 960 RON
CAS: 10,000 × 25% = 2,500 RON
CASS: 10,000 × 10% = 1,000 RON
Total withheld: 4,460 RON

Net salary: 10,000 - 4,460 = 5,540 RON

Annual:
Gross: 120,000 RON
Net: 66,480 RON
Effective rate: 44.6%
```

#### CASS Exemption:

If you're employed AND have investment income:
- **Employer already pays CASS** on your salary
- **Investment income**: May be exempt from CASS if total < certain threshold
- Check with accountant - rules complex

---

### 11.4 Copyright & Royalties

> **Legal Basis**: Art. 70-74 Codul Fiscal (venituri drepturi proprietate intelectuală)
> **Forfeit Deduction**: Art. 72 alin. (2) - 20% cheltuieli forfetare

**Creative/Intellectual Work Income**:

#### Tax Treatment (2025-2026):
- **Forfeit Deduction**: 20% (automatic, no expenses needed)
- **Net Income**: Revenue × 80%
- **Tax Rate**: 10% on net income
- **Effective Rate**: 8% of gross revenue

#### CASS (2026):
- **Rate**: 10%
- **Base**: Net income (after forfeit)
- **Brackets**: Same as investment income

#### Example (2026):

```
Royalties: 50,000 RON (book sales, music, software)

Forfeit: 50,000 × 20% = 10,000 RON (automatic deduction)
Net income: 50,000 × 80% = 40,000 RON

Income tax: 40,000 × 10% = 4,000 RON

CASS:
  - Net: 40,000 RON
  - Bracket: 6-12 MW (24,300 - 48,600)
  - CASS: 2,430 RON

Total: 4,000 + 2,430 = 6,430 RON
Effective rate: 12.9% of gross
```

#### What Qualifies as Copyright:

✅ **Eligible**:
- Books, articles, blog posts
- Music, songs, compositions
- Software (some cases)
- Art, photography
- Film, video
- Translation work

❌ **Not eligible**:
- Standard consulting services
- Regular employment work
- Business operations

---

### 11.5 CASS Aggregation Across Income Types

**Important**: CASS is calculated on **total net income** from ALL sources (except exempt ones).

#### Example - Multiple Income Types (2026):

```
1. Employment (CIM): 120,000 RON gross
   → CASS paid by employer: 12,000 RON ✓

2. Investment income (dividends): 30,000 RON net

3. Copyright (royalties): 40,000 RON net (after forfeit)

Total net for CASS calculation:
  - Employment: Exempt (employer pays)
  - Investment: 30,000 RON
  - Copyright: 40,000 RON
  ─────────────────────────────
  Total: 70,000 RON

CASS bracket: 12-24 MW (48,600 - 97,200)
CASS due: 4,860 RON (one payment in May)

Note: This is ON TOP of the CASS already paid by employer
```

**Complex Rule**: If employer pays CASS on salary AND you have investment/other income:
- Some interpretations: Exempt if total < 12 MW
- Other interpretations: Always pay on non-employment income
- **Recommendation**: Consult accountant for multi-source scenarios

---

## ✅ 12. QUICK CHECKLIST FOR 2026 TAXES

**Before May 25, 2026**:
- [ ] Gather all broker statements (domestic + foreign)
- [ ] Collect dividend statements (domestic + foreign)
- [ ] Calculate crypto gains (FIFO method)
- [ ] Compile rental income records
- [ ] Get BNR exchange rates for all foreign transactions
- [ ] Calculate loss carryforwards from prior years
- [ ] Review ANAF pre-filled Form 212 (available March 31)
- [ ] Verify all calculations with this guide
- [ ] Complete Form 212
- [ ] Calculate total tax + CASS due
- [ ] Submit Form 212 by May 25
- [ ] Pay taxes + CASS by May 25

---

**Last Updated**: 2026-01-03
**Next Review**: 2026-03 (check for any ANAF clarifications)
