/**
 * RoTaxCalculator - Core Tax Calculation Logic
 * Based on Romanian tax legislation 2025-2026
 */

// Tax Rate Configurations by Year
const TAX_CONFIG = {
    2025: {
        rates: {
            DIVIDEND: 0.10,
            CAPITAL_GAINS_FOREIGN: 0.10,
            CAPITAL_GAINS_RO_SHORT: 0.03,
            CAPITAL_GAINS_RO_LONG: 0.01,
            CRYPTO: 0.10,
            RENT_EFFECTIVE: 0.08,
            BANK_INTEREST: 0.10
        },
        minimumWage: 4050,
        minimumWageNote: 'Neschimbat din Iulie 2024 (crește +6.8% în 2026)',
        legislation: 'Codul Fiscal 2025'
    },
    2026: {
        rates: {
            DIVIDEND: 0.16,
            CAPITAL_GAINS_FOREIGN: 0.16,
            CAPITAL_GAINS_RO_SHORT: 0.06,
            CAPITAL_GAINS_RO_LONG: 0.03,
            CRYPTO: 0.16,
            RENT_EFFECTIVE: 0.07,
            BANK_INTEREST: 0.10
        },
        minimumWage: 4050,  // Used for CASS calculation (first half of year)
        minimumWageNote: 'Ian-Iun: 4,050 RON, Iul-Dec: 4,325 RON (+6.8%)',
        legislation: 'Legea 239/2025'
    }
};

// Current active year (default 2025)
let ACTIVE_TAX_YEAR = 2025;

// Active tax rates (updated when year changes)
let TAX_RATES = TAX_CONFIG[ACTIVE_TAX_YEAR].rates;
let MINIMUM_WAGE = TAX_CONFIG[ACTIVE_TAX_YEAR].minimumWage;

const CASS_RATE = 0.10;         // 10% for CASS (same for both years)

// CASS brackets (in terms of minimum wages)
const CASS_BRACKETS = {
    NONE: 6,      // < 6 MW = 0 CASS
    LOW: 12,      // 6-12 MW = 10% × 6 MW
    MEDIUM: 24,   // 12-24 MW = 10% × 12 MW
    HIGH: Infinity // > 24 MW = 10% × 24 MW
};

/**
 * Set active tax year and update rates
 */
function setTaxYear(year) {
    if (!TAX_CONFIG[year]) {
        console.error(`Invalid tax year: ${year}`);
        return false;
    }

    ACTIVE_TAX_YEAR = year;
    TAX_RATES = TAX_CONFIG[year].rates;
    MINIMUM_WAGE = TAX_CONFIG[year].minimumWage;

    console.log(`Tax year set to ${year}`);
    return true;
}

/**
 * Get current tax year configuration
 */
function getTaxYearConfig() {
    return {
        year: ACTIVE_TAX_YEAR,
        ...TAX_CONFIG[ACTIVE_TAX_YEAR]
    };
}

/**
 * Calculate domestic dividend tax (withheld at source)
 */
function calculateDomesticDividendTax(grossDividend) {
    const tax = grossDividend * TAX_RATES.DIVIDEND;
    const net = grossDividend - tax;
    return {
        gross: grossDividend,
        tax: tax,
        net: net,
        rate: TAX_RATES.DIVIDEND,
        withheldAtSource: true
    };
}

/**
 * Calculate foreign dividend tax with tax credit
 */
function calculateForeignDividendTax(grossDividend, foreignTaxPaid) {
    const romanianTax = grossDividend * TAX_RATES.DIVIDEND;
    const taxCredit = Math.min(foreignTaxPaid, romanianTax);
    const taxDue = romanianTax - taxCredit;
    const net = grossDividend - foreignTaxPaid - taxDue;

    return {
        gross: grossDividend,
        romanianTax: romanianTax,
        foreignTaxPaid: foreignTaxPaid,
        taxCredit: taxCredit,
        taxDue: taxDue,
        net: grossDividend - foreignTaxPaid,
        rate: TAX_RATES.DIVIDEND,
        withheldAtSource: false
    };
}

/**
 * Calculate capital gains tax for Romanian brokers
 */
function calculateRomanianBrokerTax(gainsShort, gainsLong) {
    const taxShort = gainsShort * TAX_RATES.CAPITAL_GAINS_RO_SHORT;
    const taxLong = gainsLong * TAX_RATES.CAPITAL_GAINS_RO_LONG;
    const totalTax = taxShort + taxLong;

    return {
        gainsShort: gainsShort,
        gainsLong: gainsLong,
        taxShort: taxShort,
        taxLong: taxLong,
        totalTax: totalTax,
        netGains: (gainsShort + gainsLong) - totalTax,
        withheldAtSource: true
    };
}

/**
 * Calculate capital gains tax for foreign brokers
 * Includes loss offset and carryforward
 */
function calculateForeignBrokerTax(gains, currentYearLosses, priorYearLosses) {
    // Step 1: Offset current year losses
    const netCurrentYear = Math.max(0, gains - currentYearLosses);

    // Step 2: Apply 70% of prior year losses
    const usablePriorLoss = priorYearLosses * 0.70;
    const taxableGain = Math.max(0, netCurrentYear - usablePriorLoss);

    // Step 3: Calculate tax
    const tax = taxableGain * TAX_RATES.CAPITAL_GAINS_FOREIGN;

    // Calculate remaining loss carryforward
    const usedPriorLoss = Math.min(usablePriorLoss, netCurrentYear);
    const remainingCarryforward = priorYearLosses - usedPriorLoss;

    return {
        grossGains: gains,
        currentYearLosses: currentYearLosses,
        netCurrentYear: netCurrentYear,
        priorYearLosses: priorYearLosses,
        usablePriorLoss: usablePriorLoss,
        taxableGain: taxableGain,
        tax: tax,
        netGains: taxableGain,
        remainingCarryforward: remainingCarryforward,
        withheldAtSource: false
    };
}

/**
 * Calculate crypto tax with exemptions
 */
function calculateCryptoTax(totalGains, exemptGains) {
    // Taxable gains = total - exempt
    const taxableGains = Math.max(0, totalGains - exemptGains);

    // Check if total gains are under annual exemption (600 RON)
    const isExempt = totalGains < 600;

    const tax = isExempt ? 0 : taxableGains * TAX_RATES.CRYPTO;

    return {
        totalGains: totalGains,
        exemptGains: exemptGains,
        taxableGains: taxableGains,
        tax: tax,
        netGains: totalGains,
        isExempt: isExempt,
        rate: TAX_RATES.CRYPTO
    };
}

/**
 * Calculate rental income tax (forfeit system)
 * 2025: 20% forfeit + 10% tax = 8% effective
 * 2026: 30% forfeit + 10% tax = 7% effective
 */
function calculateRentalTax(grossRent) {
    // Forfeit rate depends on tax year
    const forfeitRate = ACTIVE_TAX_YEAR === 2025 ? 0.20 : 0.30;
    const netIncome = grossRent * (1 - forfeitRate);

    // 10% tax on net
    const tax = netIncome * 0.10;

    // Effective rate
    const effectiveRate = tax / grossRent;

    return {
        grossRent: grossRent,
        forfeitRate: forfeitRate,
        netIncome: netIncome,
        tax: tax,
        effectiveRate: effectiveRate
    };
}

/**
 * Calculate CASS (health insurance contribution)
 */
function calculateCASS(netIncome) {
    // MINIMUM_WAGE is already the monthly average (4,187.50 for 2026)
    // We need the annual total: 4,187.50 × 12 = 50,250 RON
    const annualMinWage = MINIMUM_WAGE * 12;

    // Calculate thresholds based on annual minimum wage
    const threshold6MW = annualMinWage * CASS_BRACKETS.NONE;    // 50,250 × 6 = 301,500 (WRONG!)
    const threshold12MW = annualMinWage * CASS_BRACKETS.LOW;    // 50,250 × 12 = 603,000 (WRONG!)
    const threshold24MW = annualMinWage * CASS_BRACKETS.MEDIUM; // 50,250 × 24 = 1,206,000 (WRONG!)

    // Actually, MINIMUM_WAGE for 2026 should be the monthly average
    // So we calculate: Monthly × Number of months of MW
    const cassBase6MW = MINIMUM_WAGE * CASS_BRACKETS.NONE;     // 4,187.50 × 6 = 25,125
    const cassBase12MW = MINIMUM_WAGE * CASS_BRACKETS.LOW;     // 4,187.50 × 12 = 50,250
    const cassBase24MW = MINIMUM_WAGE * CASS_BRACKETS.MEDIUM;  // 4,187.50 × 24 = 100,500

    // Determine bracket
    let bracket;
    let cassBase;
    let cassAmount;
    let explanation;

    if (netIncome < cassBase6MW) {
        // < 6 MW
        bracket = `< ${CASS_BRACKETS.NONE} salarii minime`;
        cassBase = 0;
        cassAmount = 0;
        explanation = `Venit sub pragul de ${cassBase6MW.toLocaleString('ro-RO')} RON → CASS = 0`;
    } else if (netIncome < cassBase12MW) {
        // 6-12 MW
        bracket = `${CASS_BRACKETS.NONE}-${CASS_BRACKETS.LOW} salarii minime`;
        cassBase = cassBase6MW;
        cassAmount = cassBase * CASS_RATE;
        explanation = `Venit între ${cassBase6MW.toLocaleString('ro-RO')} - ${cassBase12MW.toLocaleString('ro-RO')} RON → CASS = 10% × 6 SM`;
    } else if (netIncome < cassBase24MW) {
        // 12-24 MW
        bracket = `${CASS_BRACKETS.LOW}-${CASS_BRACKETS.MEDIUM} salarii minime`;
        cassBase = cassBase12MW;
        cassAmount = cassBase * CASS_RATE;
        explanation = `Venit între ${cassBase12MW.toLocaleString('ro-RO')} - ${cassBase24MW.toLocaleString('ro-RO')} RON → CASS = 10% × 12 SM`;
    } else {
        // > 24 MW
        bracket = `> ${CASS_BRACKETS.MEDIUM} salarii minime`;
        cassBase = cassBase24MW;
        cassAmount = cassBase * CASS_RATE;
        explanation = `Venit peste ${cassBase24MW.toLocaleString('ro-RO')} RON → CASS = 10% × 24 SM`;
    }

    return {
        netIncome: netIncome,
        bracket: bracket,
        cassBase: cassBase,
        cassAmount: cassAmount,
        explanation: explanation,
        minimumWage: MINIMUM_WAGE
    };
}

/**
 * Calculate all taxes based on input data
 */
function calculateAllTaxes(inputData) {
    const results = {
        taxes: [],
        totalTax: 0,
        totalNetIncome: 0,
        cass: null,
        summary: {}
    };

    // 1. Domestic Dividends
    if (inputData.domesticDividends > 0) {
        const div = calculateDomesticDividendTax(inputData.domesticDividends);
        results.taxes.push({
            type: 'Dividende Românești',
            base: div.gross,
            rate: `${(TAX_RATES.DIVIDEND * 100).toFixed(0)}%`,
            tax: div.tax,
            net: div.net,
            withheld: true
        });
        results.totalTax += div.tax;
        results.totalNetIncome += div.net;
    }

    // 2. Foreign Dividends
    if (inputData.foreignDividends > 0) {
        const div = calculateForeignDividendTax(inputData.foreignDividends, inputData.foreignTaxPaid);
        results.taxes.push({
            type: 'Dividende Străine',
            base: div.gross,
            rate: `${(TAX_RATES.DIVIDEND * 100).toFixed(0)}%`,
            tax: div.taxDue,
            net: div.net,
            withheld: false,
            note: `Credit fiscal: ${div.taxCredit.toFixed(2)} RON`
        });
        results.totalTax += div.taxDue;
        results.totalNetIncome += div.net;
    }

    // 3. Romanian Broker Capital Gains
    if (inputData.roGainsShort > 0 || inputData.roGainsLong > 0) {
        const gains = calculateRomanianBrokerTax(inputData.roGainsShort, inputData.roGainsLong);

        if (inputData.roGainsShort > 0) {
            const netShort = gains.gainsShort - gains.taxShort;
            results.taxes.push({
                type: 'Câștiguri Capital RO (<365 zile)',
                base: gains.gainsShort,
                rate: `${(TAX_RATES.CAPITAL_GAINS_RO_SHORT * 100).toFixed(0)}%`,
                tax: gains.taxShort,
                net: netShort,
                withheld: true
            });
        }

        if (inputData.roGainsLong > 0) {
            const netLong = gains.gainsLong - gains.taxLong;
            results.taxes.push({
                type: 'Câștiguri Capital RO (≥365 zile)',
                base: gains.gainsLong,
                rate: `${(TAX_RATES.CAPITAL_GAINS_RO_LONG * 100).toFixed(0)}%`,
                tax: gains.taxLong,
                net: netLong,
                withheld: true
            });
        }

        results.totalTax += gains.totalTax;
        results.totalNetIncome += gains.netGains;
    }

    // 4. Foreign Broker Capital Gains
    if (inputData.foreignGains > 0) {
        const gains = calculateForeignBrokerTax(
            inputData.foreignGains,
            inputData.foreignLosses,
            inputData.priorYearLosses
        );

        let note = '';
        if (inputData.foreignLosses > 0) {
            note += `Pierderi curente: -${inputData.foreignLosses.toFixed(2)} RON. `;
        }
        if (inputData.priorYearLosses > 0) {
            note += `Pierderi reportate folosite: ${gains.usablePriorLoss.toFixed(2)} RON. `;
        }
        if (gains.remainingCarryforward > 0) {
            note += `Rămân de reportat: ${gains.remainingCarryforward.toFixed(2)} RON.`;
        }

        results.taxes.push({
            type: 'Câștiguri Capital Străin',
            base: gains.taxableGain,
            rate: `${(TAX_RATES.CAPITAL_GAINS_FOREIGN * 100).toFixed(0)}%`,
            tax: gains.tax,
            net: gains.taxableGain,
            withheld: false,
            note: note
        });
        results.totalTax += gains.tax;
        results.totalNetIncome += gains.taxableGain;
    }

    // 5. Crypto
    if (inputData.cryptoGains > 0) {
        const crypto = calculateCryptoTax(inputData.cryptoGains, inputData.cryptoExempt);
        results.taxes.push({
            type: 'Criptomonede',
            base: crypto.taxableGains,
            rate: crypto.isExempt ? '0% (scutit)' : `${(TAX_RATES.CRYPTO * 100).toFixed(0)}%`,
            tax: crypto.tax,
            net: crypto.totalGains,
            withheld: false,
            note: crypto.isExempt ? 'Sub pragul de 600 RON anual' : ''
        });
        results.totalTax += crypto.tax;
        results.totalNetIncome += crypto.totalGains;
    }

    // 6. Rental Income
    if (inputData.rentalIncome > 0) {
        const rent = calculateRentalTax(inputData.rentalIncome);
        const forfeitPercent = (rent.forfeitRate * 100).toFixed(0);
        const netPercent = (100 - rent.forfeitRate * 100).toFixed(0);

        results.taxes.push({
            type: 'Venituri din Chirii',
            base: rent.netIncome,
            rate: '10%',
            tax: rent.tax,
            net: rent.netIncome,
            withheld: false,
            note: `Forfet ${forfeitPercent}%: ${rent.grossRent.toFixed(2)} × ${netPercent}% = ${rent.netIncome.toFixed(2)} RON`
        });
        results.totalTax += rent.tax;
        results.totalNetIncome += rent.netIncome;
    }

    // 7. Bank Interest (withheld at source by bank)
    if (inputData.bankInterest > 0) {
        const tax = inputData.bankInterest * TAX_RATES.BANK_INTEREST;
        const net = inputData.bankInterest - tax;
        results.taxes.push({
            type: 'Dobânzi Bancare',
            base: inputData.bankInterest,
            rate: `${(TAX_RATES.BANK_INTEREST * 100).toFixed(0)}%`,
            tax: tax,
            net: net,
            withheld: true  // Bank withholds at source
        });
        results.totalTax += tax;
        results.totalNetIncome += net;  // Use net for CASS
    }

    // 8. Calculate CASS
    results.cass = calculateCASS(results.totalNetIncome);

    // 9. Summary - separate withheld from payable taxes
    const taxesToPay = results.taxes
        .filter(t => !t.withheld)
        .reduce((sum, t) => sum + t.tax, 0);

    const withheldTaxes = results.taxes
        .filter(t => t.withheld)
        .reduce((sum, t) => sum + t.tax, 0);

    results.summary = {
        totalTax: results.totalTax,  // All taxes (for display)
        taxesToPay: taxesToPay,       // Only taxes YOU must pay
        withheldTaxes: withheldTaxes, // Taxes already withheld
        totalCass: results.cass.cassAmount,
        grandTotal: taxesToPay + results.cass.cassAmount,  // What you actually pay
        netIncome: results.totalNetIncome
    };

    return results;
}

// Export functions for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateAllTaxes,
        calculateCASS,
        setTaxYear,
        getTaxYearConfig,
        TAX_RATES,
        MINIMUM_WAGE
    };
}
