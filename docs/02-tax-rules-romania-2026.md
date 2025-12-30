# Romanian Tax Rules 2025-2026

> **Sources**: 
> - Legea 239/2025 (Tax Code modifications)
> - ANAF Guidelines 2026
> - Codul Fiscal (updated provisions)
>
> **Last Updated**: January 15, 2025

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
- 2026 Average (for CASS): 4,187.50 RON/month = (4,050×6 + 4,325×6) / 12

---

## 💰 1. DIVIDENDS

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

### 5.2 CASS Brackets (2026)

**Important**: 2026 minimum wage changes mid-year:
- **Jan-Jun**: 4,050 RON/month
- **Jul-Dec**: 4,325 RON/month (+6.8%)
- **Average for CASS**: 4,187.50 RON/month = (4,050×6 + 4,325×6) / 12

**CASS Thresholds (using average minimum wage)**:

| Net Income Range | Threshold Calculation | CASS Calculation | Amount Due |
|------------------|----------------------|------------------|------------|
| **< 6 × MW** (< 25,125 RON) | 4,187.50 × 6 | 0% | **0 RON** |
| **6-12 × MW** (25,125 - 50,250 RON) | 4,187.50 × 12 | 10% × (4,187.50 × 6) | **2,512.50 RON** |
| **12-24 × MW** (50,250 - 100,500 RON) | 4,187.50 × 24 | 10% × (4,187.50 × 12) | **5,025 RON** |
| **> 24 × MW** (> 100,500 RON) | - | 10% × (4,187.50 × 24) | **10,050 RON** |

**Key Points**:
- CASS is **stepped**, not progressive (you pay fixed amount per bracket)
- Thresholds use **monthly minimum wage × number of months** (NOT annual wage × multiplier)
- Use **net income** after taxes/forfeit
- Exclude losses from calculation
- One-time payment by May 25 (with Form 212)
- Average minimum wage accounts for mid-year increase in 2026

### 5.3 Average Minimum Wage Calculation (2026)

Since the minimum wage changes mid-year in 2026, CASS calculations use an **average monthly minimum wage**:

**Formula**:
```
Average MW = (MW_Jan_Jun × 6 months + MW_Jul_Dec × 6 months) / 12 months
           = (4,050 × 6 + 4,325 × 6) / 12
           = (24,300 + 25,950) / 12
           = 50,250 / 12
           = 4,187.50 RON/month
```

**Why use average?**
- CASS is calculated once per year (declared in May)
- Net income is aggregated for entire year (Jan 1 - Dec 31)
- Using average ensures fair treatment regardless of when income was earned
- This is the official methodology per ANAF guidelines

**Threshold Calculation**:
```
Threshold = Average Monthly MW × Number of Months

Example for 6 MW threshold:
= 4,187.50 × 6 = 25,125 RON (NOT 4,325 × 6 = 25,950)
```

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

CASS bracket: 12-24 × MW (50,250 - 100,500)
→ CASS due: 10% × (4,187.50 × 12) = 5,025 RON
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
// IMPORTANT: min_wage should be the AVERAGE monthly minimum wage for the year
// For 2026: 4,187.50 = (4,050×6 + 4,325×6) / 12
//
// CRITICAL: Thresholds use monthly_wage × number_of_months
// NOT annual_wage × multiplier
fn calculate_cass(net_income: f64, min_wage_monthly: f64) -> f64 {
    // Calculate thresholds using monthly wage × months
    let threshold_6_mw = min_wage_monthly * 6.0;   // 25,125 RON for 2026
    let threshold_12_mw = min_wage_monthly * 12.0; // 50,250 RON for 2026
    let threshold_24_mw = min_wage_monthly * 24.0; // 100,500 RON for 2026

    // CASS amounts (10% of threshold basis)
    let cass_6_mw = threshold_6_mw * 0.10;   // 2,512.50 RON
    let cass_12_mw = threshold_12_mw * 0.10; // 5,025 RON
    let cass_24_mw = threshold_24_mw * 0.10; // 10,050 RON

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

## 📝 11. CHANGE LOG

| Date | Change | Impact |
|------|--------|--------|
| **2025-12** | Legea 239/2025 published | Major tax increases for 2026 |
| **2026-01** | Min wage increase (July 1st) | CASS brackets use average MW: 4,187.50 |
| **2026-01-15** | CASS calculation methodology clarified | Thresholds use monthly MW × months (not annual × multiplier) |
| **2026-03** | ANAF pre-fills available | Check for accuracy |

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

**Last Updated**: 2025-01-15  
**Next Review**: 2026-01 (check for any ANAF clarifications)
