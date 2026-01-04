/**
 * RoTaxCalculator - Application Logic
 * Handles UI interactions, localStorage, and result display
 */

// localStorage key prefixes (year will be appended)
const STORAGE_KEY_PREFIX = 'rotax_calculator_data';
const STORAGE_KEY_SECTIONS_PREFIX = 'rotax_calculator_sections';
const STORAGE_KEY_ACTIVE_YEAR = 'rotax_calculator_active_year';
const STORAGE_KEY_SECTION_ORDER = 'rotax_calculator_section_order';
// Show fiscal optimization tips in tooltips (set to false to hide)
const SHOW_OPTIMIZATION_TIPS = false;

/**
 * Get year-specific storage keys
 */
function getStorageKeys(year) {
    return {
        data: `${STORAGE_KEY_PREFIX}_${year}`,
        sections: `${STORAGE_KEY_SECTIONS_PREFIX}_${year}`
    };
}

// Section configuration (checkboxes removed - sections auto-expand)
const SECTIONS = {
    dividends: {},
    capitalGains: {},
    crypto: {},
    rental: {},
    interest: {}
};

// Form input IDs (legacy - will be replaced by entry-based system)
const INPUT_IDS = [
    'domesticDividends',
    'foreignDividends',
    'foreignTaxPaid',
    'roGainsShort',
    'roGainsLong',
    'foreignGains',
    'foreignLosses',
    'priorYearLosses',
    'cryptoGains',
    'cryptoExempt',
    'rentalIncome',
    'bankInterest'
];

// Income entry counter for unique IDs
var entryCounter = 0;

// Income entries storage (organized by section)
var incomeEntries = {
    dividends: [],
    capitalGains: [],
    crypto: [],
    rental: [],
    interest: []
};

/**
 * Get tooltip data for a specific field and year
 * Returns year-appropriate content with examples
 * Dynamically calculates rates and examples from TAX_CONFIG
 */
function getTooltipData(tooltipId, year) {
    var baseData = TOOLTIP_DATA_BASE[tooltipId];
    if (!baseData) return null;

    // Clone the base data
    var data = Object.assign({}, baseData);

    // If tooltip has year-specific overrides, apply them
    if (data.yearOverrides && data.yearOverrides[year]) {
        data = Object.assign({}, data, data.yearOverrides[year]);
    }

    // Get config for year
    var config = TAX_CONFIG[year];
    var rates = config.rates;
    var income = config.incomeCategories;
    var cass = getCassThresholds(year);

    // CASS info text - applies to total investment income
    var cassText = 'Da, pe venitul net total din investiții > ' + formatRON(cass.threshold6) + ' RON';
    var cassTextShort = 'Da, dacă total investiții > ' + formatRON(cass.threshold6) + ' RON';

    // Dynamically enhance data based on tooltip type
    switch (tooltipId) {
        case 'domesticDividends':
            data.taxRate = formatPercent(rates.DIVIDEND);
            data.cassRequired = cassTextShort;
            data.formula = 'Impozit = Dividend × ' + formatPercent(rates.DIVIDEND) + ' (reținut la sursă)';
            break;

        case 'foreignDividends':
            data.taxRate = formatPercent(rates.DIVIDEND);
            data.cassRequired = cassTextShort;
            data.formula = 'Impozit RO = Dividend × ' + formatPercent(rates.DIVIDEND) + ' − Credit fiscal';
            break;

        case 'roGainsShort':
            data.taxRate = formatPercent(rates.CAPITAL_GAINS_RO_SHORT);
            data.cassRequired = cassTextShort + ' (impozit reținut la sursă, CASS separat)';
            data.formula = 'Impozit = Câștig × ' + formatPercent(rates.CAPITAL_GAINS_RO_SHORT) + ' (reținut de broker)';
            break;

        case 'roGainsLong':
            data.taxRate = formatPercent(rates.CAPITAL_GAINS_RO_LONG);
            data.cassRequired = cassTextShort + ' (impozit reținut la sursă, CASS separat)';
            data.formula = 'Impozit = Câștig × ' + formatPercent(rates.CAPITAL_GAINS_RO_LONG) + ' (reținut de broker)';
            break;

        case 'foreignGains':
            data.taxRate = formatPercent(rates.CAPITAL_GAINS_FOREIGN);
            data.cassRequired = cassTextShort;
            data.formula = 'Impozit = (Câștiguri − Pierderi) × ' + formatPercent(rates.CAPITAL_GAINS_FOREIGN);
            break;

        case 'cryptoGains':
            data.taxRate = formatPercent(rates.CRYPTO);
            data.cassRequired = cassTextShort;
            data.formula = 'Impozit = (Vânzare − Cumpărare) × ' + formatPercent(rates.CRYPTO);
            break;

        case 'cryptoExempt':
            var exemption = config.cryptoExemption;
            data.taxRate = '0% (scutit)';
            data.cassRequired = 'Nu (sub pragul de scutire)';
            data.formula = 'Tranzacție < ' + exemption.perTransaction + ' RON ȘI total < ' + exemption.annualTotal + ' RON/an → scutit';
            break;

        case 'rentalIncome':
            data.taxRate = formatPercent(rates.RENT_BASE) + ' (efectiv ' + formatPercent(rates.RENT_EFFECTIVE_LONG) + ' lung / ' + formatPercent(rates.RENT_EFFECTIVE_SHORT) + ' scurt)';
            data.cassRequired = cassTextShort;
            var forfeitLong = Math.round((1 - rates.RENT_FORFEIT_LONG) * 100);
            var forfeitShort = Math.round((1 - rates.RENT_FORFEIT_SHORT) * 100);
            data.formula = 'Lung: Chirie × ' + forfeitLong + '% × 10% = ' + formatPercent(rates.RENT_EFFECTIVE_LONG) + '. Scurt: Chirie × ' + forfeitShort + '% × 10% = ' + formatPercent(rates.RENT_EFFECTIVE_SHORT);
            break;

        case 'bankInterest':
            data.taxRate = formatPercent(rates.BANK_INTEREST);
            data.cassRequired = 'Nu (dobânzile nu intră în baza CASS)';
            data.formula = 'Impozit = Dobândă × ' + formatPercent(rates.BANK_INTEREST) + ' (reținut de bancă)';
            break;

        case 'cass':
            data.taxRate = '10% (plafonat în trepte)';
            data.cassRequired = 'Trepte: 0 / ' + formatRON(cass.cass6) + ' / ' + formatRON(cass.cass12) + ' / ' + formatRON(cass.cass24) + ' RON';
            data.formula = '<' + formatRON(cass.threshold6) + '→0, ' + formatRON(cass.threshold6) + '-' + formatRON(cass.threshold12) + '→' + formatRON(cass.cass6) + ', ' + formatRON(cass.threshold12) + '-' + formatRON(cass.threshold24) + '→' + formatRON(cass.cass12) + ', >' + formatRON(cass.threshold24) + '→' + formatRON(cass.cass24);
            break;

        case 'priorYearLosses':
            data.taxRate = 'N/A (reduce baza impozabilă)';
            data.cassRequired = 'Reduce și baza CASS';
            data.formula = 'Bază impozabilă = Câștig − (Pierdere × 70%)';
            break;
    }

    return data;
}

/**
 * Helper to get income categories from TAX_CONFIG
 */
function getIncomeCategories(year) {
    return TAX_CONFIG[year].incomeCategories;
}

// Default income categories for static tooltip definitions
// Note: These are for display labels only - actual calculations use TAX_CONFIG
var INCOME_CATEGORIES = TAX_CONFIG[2026].incomeCategories;

/**
 * Helper to format number in Romanian locale
 */
function formatRON(value) {
    return value.toLocaleString('ro-RO');
}

/**
 * Helper to format percentage
 */
function formatPercent(rate) {
    return Math.round(rate * 100) + '%';
}

/**
 * Helper to get CASS thresholds for a year
 */
function getCassThresholds(year) {
    var mw = TAX_CONFIG[year].minimumWage;
    return {
        threshold6: mw * 6,
        threshold12: mw * 12,
        threshold24: mw * 24,
        cass6: mw * 6 * 0.10,
        cass12: mw * 12 * 0.10,
        cass24: mw * 24 * 0.10
    };
}

/**
 * Format saving text with line breaks for readability
 * Splits on ". " to put each part on a new line
 */
function formatSavingLines(text) {
    if (!text) return '';
    // Split on ". " but preserve the period at end of each sentence
    var parts = text.split('. ');
    return parts.map(function(part, i) {
        // Add period back except for the last part (might already have one)
        if (i < parts.length - 1) {
            return part + '.';
        }
        return part;
    }).join('<br>');
}

/**
 * Tooltip data for help popups
 * hasSource: true = official source exists
 * hasTip: true = fiscal optimization opportunity
 * taxRate: tax percentage (e.g., '10%', '16%')
 * cassRequired: whether CASS applies (true/false/string for conditional)
 * formula: calculation formula (e.g., 'Venit × 10%')
 * examples: concrete calculations for small/medium/large investors
 * sources: array of {label, url} for multiple law references
 */
var TOOLTIP_DATA_BASE = {
    domesticDividends: {
        title: 'Dividende Românești',
        hasSource: true,
        hasTip: false,
        sources: [
            { label: 'Art. 97 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                content: 'Dividendele primite de la companii românești (SRL, SA) sunt impozitate cu 10%. Taxa este reținută la sursă de către compania care distribuie dividendele.'
            },
            2026: {
                content: 'Dividendele primite de la companii românești (SRL, SA) sunt impozitate cu 16% (majorare de la 10% în 2025). Taxa este reținută la sursă de către compania care distribuie dividendele.',
                sources: [
                    { label: 'Art. 97 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' },
                    { label: 'Legea 239/2024 (majorare 16%)', url: 'https://legislatie.just.ro/Public/DetaliiDocumentAfis/287644' }
                ]
            }
        }
    },
    foreignDividends: {
        title: 'Dividende Străine',
        hasSource: true,
        hasTip: true,
        sources: [
            { label: 'Art. 97 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' },
            { label: 'Tratat fiscal RO-US', url: 'https://www.irs.gov/businesses/international-businesses/romania-tax-treaty-documents' }
        ],
        yearOverrides: {
            2025: {
                content: 'Dividendele primite de la companii străine sunt impozitate cu 10% în România. Dacă s-a reținut impozit în țara sursă, poți beneficia de credit fiscal până la 10%.',
                tip: 'Completează formularul W-8BEN la brokerul american pentru a reduce reținerea la sursă de la 30% la 10% (tratat fiscal RO-US). Nu vei mai datora nimic în România!',
                examples: {
                    small: { label: INCOME_CATEGORIES.small.dividends.toLocaleString('ro-RO') + ' RON dividende US', saving: 'Fără W-8BEN: 1.500 US + 0 RO + 0 CASS = 1.500 RON. Cu W-8BEN: 500 US + 0 = 500 RON' },
                    medium: { label: INCOME_CATEGORIES.medium.dividends.toLocaleString('ro-RO') + ' RON dividende US', saving: 'Fără W-8BEN: 9.000 US + 0 RO + 2.430 CASS. Cu W-8BEN: 3.000 + 0 + 2.430 = 5.430 RON' },
                    large: { label: INCOME_CATEGORIES.large.dividends.toLocaleString('ro-RO') + ' RON dividende US', saving: 'Fără W-8BEN: 30.000 US + 0 RO + 7.920 CASS. Cu W-8BEN: 10.000 + 0 + 7.920 = 17.920 RON' }
                }
            },
            2026: {
                content: 'Dividendele primite de la companii străine sunt impozitate cu 16% în România. Dacă s-a reținut impozit în țara sursă, poți beneficia de credit fiscal până la 16%.',
                tip: 'Completează formularul W-8BEN la brokerul american pentru a reduce reținerea la sursă de la 30% la 10% (tratat fiscal RO-US). Vei plăti doar 6% în România.',
                examples: {
                    small: { label: INCOME_CATEGORIES.small.dividends.toLocaleString('ro-RO') + ' RON dividende US', saving: 'Cu W-8BEN: 500 US + 300 RO + 0 CASS = 800 RON. Fără: 1.500 US + 0 = 1.500 RON' },
                    medium: { label: INCOME_CATEGORIES.medium.dividends.toLocaleString('ro-RO') + ' RON dividende US', saving: 'Cu W-8BEN: 3.000 US + 1.800 RO + 2.595 CASS = 7.395 RON. Economie: 4.200 RON!' },
                    large: { label: INCOME_CATEGORIES.large.dividends.toLocaleString('ro-RO') + ' RON dividende US', saving: 'Cu W-8BEN: 10.000 US + 6.000 RO + 10.380 CASS = 26.380 RON. Economie: 14.000 RON!' }
                }
            }
        }
    },
    roGainsShort: {
        title: 'Câștiguri Capital RO (<365 zile)',
        hasSource: true,
        hasTip: true,
        sources: [
            { label: 'Art. 94 alin. (2) Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                content: 'Câștigurile din vânzarea titlurilor deținute mai puțin de 365 zile la brokeri români sunt impozitate cu 3%. Taxa este reținută la sursă de broker.',
                tip: 'În 2025, rata este aceeași (3%) indiferent de perioada de deținere. Nu există avantaj fiscal pentru așteptare.',
                hasTip: false
            },
            2026: {
                content: 'Câștigurile din vânzarea titlurilor deținute mai puțin de 365 zile la brokeri români sunt impozitate cu 6%. Taxa este reținută la sursă de broker.',
                tip: 'Dacă poți aștepta, păstrează titlurile peste 365 zile pentru rata de 3%. Economisești 50% din impozit!',
                examples: {
                    small: { label: INCOME_CATEGORIES.small.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 6%: 600 RON (reținut). CASS: 0 RON (sub prag). Total: 600 RON' },
                    medium: { label: INCOME_CATEGORIES.medium.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 6%: 3.000 RON. CASS: 2.430 RON. Total: 5.430 RON. Cu ≥365z: 1.500+2.430=3.930 RON' },
                    large: { label: INCOME_CATEGORIES.large.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 6%: 12.000 RON. CASS: 9.720 RON (plafonat). Total: 21.720 RON' }
                }
            }
        }
    },
    roGainsLong: {
        title: 'Câștiguri Capital RO (≥365 zile)',
        hasSource: true,
        hasTip: true,
        sources: [
            { label: 'Art. 94 alin. (2) Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                content: 'Câștigurile din vânzarea titlurilor deținute cel puțin 365 zile la brokeri români sunt impozitate cu 3%. Taxa este reținută la sursă de broker.',
                tip: 'Aceasta este cea mai mică rată disponibilă pentru câștiguri de capital în România!',
                hasTip: false
            },
            2026: {
                content: 'Câștigurile din vânzarea titlurilor deținute cel puțin 365 zile la brokeri români sunt impozitate cu doar 3%. Taxa este reținută la sursă de broker.',
                tip: 'Cea mai avantajoasă rată pentru câștiguri de capital! Strategia "buy and hold" te ajută să economisești 50% din impozit.',
                examples: {
                    small: { label: INCOME_CATEGORIES.small.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 3%: 300 RON (reținut). CASS: 0 RON (sub prag). Total: 300 RON' },
                    medium: { label: INCOME_CATEGORIES.medium.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 3%: 1.500 RON. CASS: 2.430 RON. Total: 3.930 RON. La broker străin: 8.000+2.430!' },
                    large: { label: INCOME_CATEGORIES.large.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 3%: 6.000 RON. CASS: 9.720 RON. Total: 15.720 RON. La străin: 32.000+9.720!' }
                }
            }
        }
    },
    foreignGains: {
        title: 'Câștiguri Capital Broker Străin',
        hasSource: true,
        hasTip: true,
        sources: [
            { label: 'Art. 94-96 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                content: 'Câștigurile de la brokeri străini (IBKR, Trading212, eToro) sunt impozitate cu 10%. Nu se reține taxa la sursă - trebuie să declari și să plătești tu prin Declarația Unică.',
                tip: 'Pierderile pot fi compensate cu câștigurile și reportate până la 7 ani (70% din valoare). Pentru sume mari, consideră un broker român pentru rata de 3%.',
                examples: {
                    small: { label: '10.000 RON câștig', saving: 'Impozit 10%: 1.000 RON. CASS: 0 RON (sub prag). Total: 1.000 RON' },
                    medium: { label: '50.000 RON câștig', saving: 'Impozit 10%: 5.000 RON. CASS: 2.430 RON. Total: 7.430 RON' },
                    large: { label: '200.000 RON câștig', saving: 'Impozit 10%: 20.000 RON. CASS: 7.920 RON (plafonat). Total: 27.920 RON' }
                }
            },
            2026: {
                content: 'Câștigurile de la brokeri străini (IBKR, Trading212, eToro) sunt impozitate cu 16%. Nu se reține taxa la sursă - trebuie să declari și să plătești tu prin Declarația Unică.',
                tip: 'Pentru investitori activi, transferul la un broker român poate economisi masiv: 16%→3% impozit!',
                examples: {
                    small: { label: INCOME_CATEGORIES.small.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 16%: 1.600 RON. CASS: 0 RON (sub prag). Total: 1.600 RON. La RO ≥365z: 300 RON!' },
                    medium: { label: INCOME_CATEGORIES.medium.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 16%: 8.000 RON. CASS: 2.595 RON. Total: 10.595 RON. La RO ≥365z: 4.095 RON!' },
                    large: { label: INCOME_CATEGORIES.large.gains.toLocaleString('ro-RO') + ' RON câștig', saving: 'Impozit 16%: 32.000 RON. CASS: 10.380 RON. Total: 42.380 RON. La RO ≥365z: 16.380 RON!' }
                }
            }
        }
    },
    priorYearLosses: {
        title: 'Pierderi Reportate',
        content: 'Pierderile din anii anteriori pot fi folosite pentru a reduce câștigurile impozabile. Se poate deduce 70% din valoarea pierderilor, pe o perioadă de până la 7 ani. Reduce și baza pentru CASS!',
        hasSource: true,
        hasTip: true,
        tip: 'Ține evidența pierderilor! Deducerea de 70% pe 7 ani reduce atât impozitul cât și CASS în anii profitabili.',
        sources: [
            { label: 'Art. 94 alin. (8) Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        examples: {
            small: { label: INCOME_CATEGORIES.small.dividends.toLocaleString('ro-RO') + ' RON pierderi reportate', saving: 'Deductibil: 3.500 RON (70%). Economie impozit 16%: 560 RON. CASS: poate reduce treapta!' },
            medium: { label: INCOME_CATEGORIES.medium.dividends.toLocaleString('ro-RO') + ' RON pierderi reportate', saving: 'Deductibil: 21.000 RON. Economie impozit: 3.360 RON. Dacă trece sub prag CASS: +2.595 RON!' },
            large: { label: INCOME_CATEGORIES.large.dividends.toLocaleString('ro-RO') + ' RON pierderi reportate', saving: 'Deductibil: 70.000 RON. Economie impozit: 11.200 RON. Poate reduce CASS cu o treaptă: +2.595-5.190 RON!' }
        }
    },
    cryptoGains: {
        title: 'Câștiguri Criptomonede',
        hasSource: true,
        hasTip: true,
        sources: [
            { label: 'Art. 98 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                content: 'Câștigurile din vânzarea/schimbul de criptomonede sunt impozitate cu 10%. Trebuie să declari și să plătești tu prin Declarația Unică.',
                tips: [
                    {
                        title: 'Scutire sume mici',
                        text: 'Tranzacțiile sub 200 RON/tranzacție ȘI sub 600 RON/an sunt scutite de impozit.'
                    },
                    {
                        title: 'Alternativă ETF pentru HODLeri',
                        text: 'ETF-uri crypto (BTC, ETH) la broker RO au taxă de doar 3% vs 10% crypto direct!',
                        examples: {
                            small: { label: INCOME_CATEGORIES.small.crypto.toLocaleString('ro-RO') + ' RON câștig', saving: 'Crypto: 500 RON impozit + 0 CASS = 500 RON. ETF: 150 RON + 0 = 150 RON' },
                            medium: { label: INCOME_CATEGORIES.medium.crypto.toLocaleString('ro-RO') + ' RON câștig', saving: 'Crypto: 3.000 + 2.430 CASS = 5.430 RON. ETF: 900 + 2.430 = 3.330 RON' },
                            large: { label: INCOME_CATEGORIES.large.crypto.toLocaleString('ro-RO') + ' RON câștig', saving: 'Crypto: 10.000 + 7.920 = 17.920 RON. ETF: 3.000 + 7.920 = 10.920 RON!' }
                        }
                    }
                ]
            },
            2026: {
                content: 'Câștigurile din vânzarea/schimbul de criptomonede sunt impozitate cu 16%. Trebuie să declari și să plătești tu prin Declarația Unică.',
                tips: [
                    {
                        title: 'Scutire sume mici',
                        text: 'Tranzacțiile sub 200 RON/tranzacție ȘI sub 600 RON/an sunt scutite de impozit și CASS.'
                    },
                    {
                        title: 'Alternativă ETF pentru HODLeri',
                        text: 'ETF-uri crypto (BTC, ETH) la broker RO au taxă de 6% (<365z) sau 3% (≥365z) vs 16% crypto direct!',
                        examples: {
                            small: { label: INCOME_CATEGORIES.small.crypto.toLocaleString('ro-RO') + ' RON câștig', saving: 'Crypto: 800 impozit + 0 CASS = 800 RON. ETF ≥365z: 150 + 0 = 150 RON' },
                            medium: { label: INCOME_CATEGORIES.medium.crypto.toLocaleString('ro-RO') + ' RON câștig', saving: 'Crypto: 4.800 + 2.595 CASS = 7.395 RON. ETF ≥365z: 900 + 2.595 = 3.495 RON' },
                            large: { label: INCOME_CATEGORIES.large.crypto.toLocaleString('ro-RO') + ' RON câștig', saving: 'Crypto: 16.000 + 10.380 = 26.380 RON. ETF ≥365z: 3.000 + 10.380 = 13.380 RON!' }
                        }
                    }
                ]
            }
        }
    },
    cryptoExempt: {
        title: 'Scutire Crypto',
        content: 'Ești scutit de impozit și CASS dacă TOATE tranzacțiile sunt sub 200 RON per tranzacție ȘI totalul anual este sub 600 RON.',
        hasSource: true,
        hasTip: true,
        tip: 'Util pentru sume foarte mici. O singură tranzacție peste 200 RON anulează scutirea pentru tot anul!',
        sources: [
            { label: 'Art. 98 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ]
    },
    rentalIncome: {
        title: 'Venituri din Chirii',
        hasSource: true,
        hasTip: false,
        sources: [
            { label: 'Art. 84-86 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                content: 'Veniturile din chirii sunt impozitate cu 10% pe venitul net. Se aplică cheltuieli forfetare fixe de 20%, rezultând o taxă efectivă de 8%.',
                hasTip: false
            },
            2026: {
                content: 'Veniturile din chirii sunt impozitate cu 10% pe venitul net. Cheltuieli forfetare: 20% pentru termen lung (taxă efectivă 8%), 30% pentru termen scurt (taxă efectivă 7%).',
                hasTip: true,
                tip: 'Chiria pe termen scurt (Airbnb, Booking) are taxă efectivă mai mică: 7% vs 8%! Dar necesită casă de marcat fiscală.',
                sources: [
                    { label: 'Art. 84-86 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' },
                    { label: 'Legea 239/2024 (termen scurt 30%)', url: 'https://legislatie.just.ro/Public/DetaliiDocumentAfis/287644' }
                ],
                examples: {
                    small: { label: INCOME_CATEGORIES.small.rental.toLocaleString('ro-RO') + ' RON/an (1.000/lună)', saving: 'Impozit lung 8%: 960 RON. CASS: 0 RON (sub prag). Total: 960 RON. Scurt 7%: 840+0=840 RON' },
                    medium: { label: INCOME_CATEGORIES.medium.rental.toLocaleString('ro-RO') + ' RON/an (3.000/lună)', saving: 'Impozit lung: 2.880 RON. CASS: 2.595 RON. Total: 5.475 RON. Scurt: 2.520+2.595=5.115 RON' },
                    large: { label: INCOME_CATEGORIES.large.rental.toLocaleString('ro-RO') + ' RON/an (10.000/lună)', saving: 'Impozit lung: 9.600 RON. CASS: 10.380 RON (plafonat). Total: 19.980 RON. Scurt: 8.400+10.380=18.780 RON' }
                }
            }
        }
    },
    bankInterest: {
        title: 'Dobânzi Bancare',
        content: 'Dobânzile la depozite bancare sunt impozitate cu 10%. Taxa este reținută la sursă de bancă. Dobânzile NU intră în baza CASS.',
        hasSource: true,
        hasTip: true,
        tip: 'Titlurile de stat (Fidelis, Tezaur) sunt 100% scutite de impozit! La randamente similare, economisești 10% din câștig.',
        sources: [
            { label: 'Art. 92 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        examples: {
            small: { label: INCOME_CATEGORIES.small.interest.toLocaleString('ro-RO') + ' RON dobândă/an', saving: 'Impozit 10%: 50 RON (reținut). CASS: 0 RON (nu se aplică). Fidelis: 0+0=0 RON!' },
            medium: { label: INCOME_CATEGORIES.medium.interest.toLocaleString('ro-RO') + ' RON dobândă/an', saving: 'Impozit 10%: 300 RON (reținut). CASS: 0 RON. Fidelis: 0 RON. Economie: 300 RON' },
            large: { label: INCOME_CATEGORIES.large.interest.toLocaleString('ro-RO') + ' RON dobândă/an', saving: 'Impozit 10%: 1.500 RON (reținut). CASS: 0 RON. Fidelis: 0 RON. Economie: 1.500 RON!' }
        }
    },
    cass: {
        title: 'CASS (Contribuția de Sănătate)',
        hasSource: true,
        hasTip: true,
        sources: [
            { label: 'Art. 170-172 Cod Fiscal', url: 'https://legislatie.just.ro/Public/DetaliiDocument/171282' }
        ],
        yearOverrides: {
            2025: {
                taxRate: '10% (plafonat în trepte)',
                cassRequired: 'Da, în trepte: 0 / 1.980 / 3.960 / 7.920 RON',
                formula: 'Vezi praguri: <19.800=0, 19.800-39.600=1.980, 39.600-79.200=3.960, >79.200=7.920',
                content: 'CASS de 10% se datorează pe veniturile din investiții care depășesc 6 salarii minime (19.800 RON în 2025). Sistemul este în trepte: 6, 12 sau 24 salarii minime.',
                tip: 'Praguri 2025: sub 19.800 = 0 RON, 19.800-39.600 = 1.980 RON, 39.600-79.200 = 3.960 RON, peste = 7.920 RON.',
                examples: {
                    small: { label: '25.000 RON venit net', saving: 'CASS: 1.980 RON. Dacă reduci la 19.799 RON: 0 RON. Economie: 1.980 RON!' },
                    medium: { label: '50.000 RON venit net', saving: 'CASS: 3.960 RON. Dacă reduci la 39.599 RON: 1.980 RON. Economie: 1.980 RON!' },
                    large: { label: '100.000 RON venit net', saving: 'CASS: 7.920 RON (plafonat). Nu se poate optimiza, dar nici nu crește peste acest nivel.' }
                }
            },
            2026: {
                taxRate: '10% (plafonat în trepte)',
                cassRequired: 'Da, în trepte: 0 / 2.595 / 5.190 / 10.380 RON',
                formula: 'Vezi praguri: <25.950=0, 25.950-51.900=2.595, 51.900-103.800=5.190, >103.800=10.380',
                content: 'CASS de 10% se datorează pe veniturile din investiții care depășesc 6 salarii minime (25.950 RON în 2026). Sistemul este în trepte: 6, 12 sau 24 salarii minime.',
                tip: 'Praguri 2026: sub 25.950 = 0 RON, 25.950-51.900 = 2.595 RON, 51.900-103.800 = 5.190 RON, peste = 10.380 RON.',
                examples: {
                    small: { label: '30.000 RON venit net', saving: 'CASS: 2.595 RON. Dacă reduci la 25.949 RON: 0 RON. Economie: 2.595 RON!' },
                    medium: { label: '60.000 RON venit net', saving: 'CASS: 5.190 RON. Dacă reduci la 51.899 RON: 2.595 RON. Economie: 2.595 RON!' },
                    large: { label: '150.000 RON venit net', saving: 'CASS: 10.380 RON (plafonat). Nu se poate optimiza, dar e plafonat indiferent cât câștigi.' }
                }
            }
        }
    }
};

/**
 * Show tooltip popup
 */
function showTooltip(tooltipId) {
    var data = getTooltipData(tooltipId, ACTIVE_TAX_YEAR);
    if (!data) return;

    var popup = document.getElementById('tooltipPopup');
    var overlay = document.getElementById('tooltipOverlay');

    if (!popup || !overlay) return;

    // Build popup content
    var html = '';
    html += '<div class="tooltip-header">';
    html += '  <div class="tooltip-title">' + data.title + '</div>';
    html += '  <button class="tooltip-close" onclick="hideTooltip()">&times;</button>';
    html += '</div>';
    html += '<div class="tooltip-content">';

    // Add structured info (tax rate, CASS, formula)
    if (data.taxRate || data.cassRequired || data.formula) {
        html += '<div class="tooltip-info-grid">';
        if (data.taxRate) {
            html += '<div class="tooltip-info-item">';
            html += '  <span class="tooltip-info-label">Impozit:</span>';
            html += '  <span class="tooltip-info-value">' + data.taxRate + '</span>';
            html += '</div>';
        }
        if (data.cassRequired) {
            html += '<div class="tooltip-info-item">';
            html += '  <span class="tooltip-info-label">CASS:</span>';
            html += '  <span class="tooltip-info-value">' + data.cassRequired + '</span>';
            html += '</div>';
        }
        if (data.formula) {
            html += '<div class="tooltip-info-item tooltip-info-formula">';
            html += '  <span class="tooltip-info-label">Formulă:</span>';
            html += '  <span class="tooltip-info-value">' + data.formula + '</span>';
            html += '</div>';
        }
        html += '</div>';
    }

    html += '  <p>' + data.content + '</p>';

    // Add optimization tips section (controlled by SHOW_OPTIMIZATION_TIPS constant)
    if (data.hasTip && SHOW_OPTIMIZATION_TIPS) {

        // Handle multiple tips (new format)
        if (data.tips && data.tips.length > 0) {
            data.tips.forEach(function(tipItem) {
                html += '<div class="tooltip-tip" style="margin-bottom: 12px;">';
                html += '  <div class="tooltip-tip-header">💡 ' + tipItem.title + '</div>';
                html += '  <div class="tooltip-tip-text">' + tipItem.text + '</div>';

                // Add examples for this tip if available
                if (tipItem.examples) {
                    html += '  <div style="margin-top: 12px; font-size: 0.85em;">';
                    html += '    <div style="font-weight: 600; margin-bottom: 8px;">Exemple concrete:</div>';
                    if (tipItem.examples.small) {
                        html += '    <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">';
                        html += '      <div style="font-weight: 600; margin-bottom: 4px;">📊 ' + tipItem.examples.small.label + '</div>';
                        html += '      <div>' + formatSavingLines(tipItem.examples.small.saving) + '</div>';
                        html += '    </div>';
                    }
                    if (tipItem.examples.medium) {
                        html += '    <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">';
                        html += '      <div style="font-weight: 600; margin-bottom: 4px;">📊 ' + tipItem.examples.medium.label + '</div>';
                        html += '      <div>' + formatSavingLines(tipItem.examples.medium.saving) + '</div>';
                        html += '    </div>';
                    }
                    if (tipItem.examples.large) {
                        html += '    <div style="padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">';
                        html += '      <div style="font-weight: 600; margin-bottom: 4px;">📊 ' + tipItem.examples.large.label + '</div>';
                        html += '      <div>' + formatSavingLines(tipItem.examples.large.saving) + '</div>';
                        html += '    </div>';
                    }
                    html += '  </div>';
                }
                html += '</div>';
            });
        }
        // Handle single tip (old format)
        else if (data.tip) {
            html += '<div class="tooltip-tip">';
            html += '  <div class="tooltip-tip-header">💡 Optimizare fiscală</div>';
            html += '  <div class="tooltip-tip-text">' + data.tip + '</div>';

            // Add examples if available
            if (data.examples) {
                html += '  <div style="margin-top: 12px; font-size: 0.85em;">';
                html += '    <div style="font-weight: 600; margin-bottom: 8px;">Exemple concrete:</div>';
                if (data.examples.small) {
                    html += '    <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">';
                    html += '      <div style="font-weight: 600; margin-bottom: 4px;">📊 ' + data.examples.small.label + '</div>';
                    html += '      <div>' + formatSavingLines(data.examples.small.saving) + '</div>';
                    html += '    </div>';
                }
                if (data.examples.medium) {
                    html += '    <div style="margin-bottom: 12px; padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">';
                    html += '      <div style="font-weight: 600; margin-bottom: 4px;">📊 ' + data.examples.medium.label + '</div>';
                    html += '      <div>' + formatSavingLines(data.examples.medium.saving) + '</div>';
                    html += '    </div>';
                }
                if (data.examples.large) {
                    html += '    <div style="padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">';
                    html += '      <div style="font-weight: 600; margin-bottom: 4px;">📊 ' + data.examples.large.label + '</div>';
                    html += '      <div>' + formatSavingLines(data.examples.large.saving) + '</div>';
                    html += '    </div>';
                }
                html += '  </div>';
            }
            html += '</div>';
        }
    }

    // Add warning if no official source
    if (!data.hasSource) {
        html += '<div class="tooltip-warning">';
        html += '  <div class="tooltip-warning-header">⚠️ Sursă neoficială</div>';
        html += '  <div class="tooltip-warning-text">Informația nu provine dintr-o sursă oficială. Consultă un expert fiscal.</div>';
        html += '</div>';
    }

    // Add source links (supports multiple sources)
    var sources = data.sources || (data.sourceUrl ? [{ label: data.sourceLabel, url: data.sourceUrl }] : []);
    if (sources.length > 0) {
        html += '<div class="tooltip-source">';
        html += '  <div class="tooltip-source-label">Surse oficiale:</div>';
        sources.forEach(function(source) {
            html += '  <a href="' + source.url + '" target="_blank" rel="noopener" style="display: block; margin-top: 4px;">' + source.label + ' ↗</a>';
        });
        html += '</div>';
    }

    // Add floating disclaimer at the bottom
    html += '<div class="tooltip-disclaimer">';
    html += '  ⚠️ Verifică întotdeauna sursele oficiale și consultă un contabil autorizat.';
    html += '</div>';

    html += '</div>';

    popup.innerHTML = html;
    popup.classList.add('active');
    overlay.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Hide tooltip popup
 */
function hideTooltip() {
    var popup = document.getElementById('tooltipPopup');
    var overlay = document.getElementById('tooltipOverlay');

    if (popup) popup.classList.remove('active');
    if (overlay) overlay.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';
}

/**
 * Create help trigger HTML
 */
function createHelpTrigger(tooltipId) {
    var data = getTooltipData(tooltipId, ACTIVE_TAX_YEAR);
    if (!data) return '';

    var classes = 'help-trigger';
    if (!data.hasSource) classes += ' no-source';
    // Only show tip indicator if tips are enabled
    else if (data.hasTip && SHOW_OPTIMIZATION_TIPS) classes += ' has-tip';

    return '<span class="' + classes + '" onclick="showTooltip(\'' + tooltipId + '\')">?</span>';
}

/**
 * Validate number input field - removes invalid characters
 */
function validateNumberInput(input) {
    var value = input.value;

    // Allow empty
    if (value === '') return;

    // Remove any characters that aren't digits, decimal point, or minus sign
    // Also ensure only one decimal point
    var cleaned = value.replace(/[^\d.-]/g, '');

    // Only allow minus at the start
    if (cleaned.indexOf('-') > 0) {
        cleaned = cleaned.replace(/-/g, '');
    }

    // Only allow one decimal point
    var parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // Update field if value changed
    if (cleaned !== value) {
        var cursorPos = input.selectionStart;
        input.value = cleaned;
        input.setSelectionRange(cursorPos - 1, cursorPos - 1);
    }
}

/**
 * Validate keypress for number inputs - prevent invalid characters
 */
function validateNumberKeypress(e, input) {
    var char = String.fromCharCode(e.which);
    var value = input.value;

    // Allow control keys (backspace, delete, arrow keys, etc.)
    if (e.which === 0 || e.which === 8) {
        return true;
    }

    // Allow digits
    if (/\d/.test(char)) {
        return true;
    }

    // Allow decimal point if there isn't one already
    if (char === '.' && value.indexOf('.') === -1) {
        return true;
    }

    // Allow minus sign only at the start
    if (char === '-' && value.indexOf('-') === -1 && input.selectionStart === 0) {
        return true;
    }

    // Block all other characters
    e.preventDefault();
    return false;
}

/**
 * Get field template for each income type
 */
function getIncomeFieldsTemplate(sectionName, entryId) {
    var config = getTaxYearConfig();
    var rates = config.rates;
    var year = config.year;

    // Get previous year rates for comparison
    var prevRates = year === 2026 ? TAX_CONFIG[2025].rates : null;

    switch(sectionName) {
        case 'dividends':
            var divComparison = prevRates ? createRateComparison(year, rates.DIVIDEND, prevRates.DIVIDEND) : '';
            var html = '';
            html += '<div class="form-group">';
            html += '  <label>Dividende Românești' + createHelpTrigger('domesticDividends') + '</label>';
            html += '  <div style="display: flex; gap: 12px;">';
            html += '    <div style="flex: 1;">';
            html += '      <input type="number" id="domesticDividendsNet_' + entryId + '" class="gross-net-field" data-entry="' + entryId + '" data-rate="' + rates.DIVIDEND + '" data-pair="domesticDividends_' + entryId + '" data-type="net" step="0.01" min="0" placeholder="0.00">';
            html += '      <small>Net (primit)</small>';
            html += '    </div>';
            html += '    <div style="flex: 1;">';
            html += '      <input type="number" id="domesticDividends_' + entryId + '" class="income-field gross-net-field" data-entry="' + entryId + '" data-field="domesticDividends" data-rate="' + rates.DIVIDEND + '" data-pair="domesticDividendsNet_' + entryId + '" data-type="gross" step="0.01" min="0" placeholder="0.00">';
            html += '      <small>Brut (-' + (rates.DIVIDEND * 100).toFixed(0) + '% taxă)' + divComparison + '</small>';
            html += '    </div>';
            html += '  </div>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '  <label for="foreignDividends_' + entryId + '">Dividende Străine (RON brut)' + createHelpTrigger('foreignDividends') + '</label>';
            html += '  <input type="number" id="foreignDividends_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignDividends" step="0.01" min="0" placeholder="0.00">';
            html += '</div>';
            html += '<div class="form-group">';
            html += '  <label for="foreignTaxPaid_' + entryId + '">Taxa Plătită în Străinătate (RON)</label>';
            html += '  <input type="number" id="foreignTaxPaid_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignTaxPaid" step="0.01" min="0" placeholder="0.00">';
            html += '  <small>Credit fiscal disponibil (max ' + (rates.DIVIDEND * 100).toFixed(0) + '%)' + (year === 2026 ? ' <span style="color: var(--danger);">(+6% față de 2025)</span>' : '') + '</small>';
            html += '</div>';
            return html;

        case 'capitalGains':
            var cgShortComparison = prevRates ? createRateComparison(year, rates.CAPITAL_GAINS_RO_SHORT, prevRates.CAPITAL_GAINS_RO_SHORT) : '';
            var cgLongComparison = prevRates ? createRateComparison(year, rates.CAPITAL_GAINS_RO_LONG, prevRates.CAPITAL_GAINS_RO_LONG) : '';
            var cgForeignComparison = prevRates ? createRateComparison(year, rates.CAPITAL_GAINS_FOREIGN, prevRates.CAPITAL_GAINS_FOREIGN) : '';

            var html2 = '';

            // Broker type segmented control
            html2 += '<div style="margin-bottom: 20px;">';
            html2 += '  <div class="segmented-control" style="display: inline-flex; background: #f1f5f9; border-radius: 10px; padding: 4px;">';
            html2 += '    <button type="button" class="broker-type-btn" data-entry="' + entryId + '" data-type="romanian" style="padding: 12px 20px; border: none; background: white; border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: left;">';
            html2 += '      <div style="font-size: 15px; font-weight: 600; color: var(--primary); margin-bottom: 2px;">Broker Românesc</div>';
            html2 += '      <div style="font-size: 12px; font-weight: 400; color: #64748b;">ex: XTB, Tradeville, BT Trade</div>';
            html2 += '    </button>';
            html2 += '    <button type="button" class="broker-type-btn" data-entry="' + entryId + '" data-type="foreign" style="padding: 12px 20px; border: none; background: transparent; border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: left;">';
            html2 += '      <div style="font-size: 15px; font-weight: 500; color: #64748b; margin-bottom: 2px;">Broker Străin</div>';
            html2 += '      <div style="font-size: 12px; font-weight: 400; color: #94a3b8;">ex: IBKR, Trading212, eToro</div>';
            html2 += '    </button>';
            html2 += '  </div>';
            html2 += '  <input type="hidden" id="isForeignBroker_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="isForeignBroker" value="0">';
            html2 += '</div>';

            // Romanian broker fields (default, hidden when foreign is checked)
            html2 += '<div id="romanianBrokerFields_' + entryId + '" class="broker-fields">';
            html2 += '  <div class="form-group">';
            html2 += '    <label>Câștig &lt; 365 zile' + createHelpTrigger('roGainsShort') + '</label>';
            html2 += '    <div style="display: flex; gap: 12px;">';
            html2 += '      <div style="flex: 1;">';
            html2 += '        <input type="number" id="roGainsShortNet_' + entryId + '" class="gross-net-field" data-entry="' + entryId + '" data-rate="' + rates.CAPITAL_GAINS_RO_SHORT + '" data-pair="roGainsShort_' + entryId + '" data-type="net" step="0.01" min="0" placeholder="0.00">';
            html2 += '        <small>Net (primit)</small>';
            html2 += '      </div>';
            html2 += '      <div style="flex: 1;">';
            html2 += '        <input type="number" id="roGainsShort_' + entryId + '" class="income-field gross-net-field" data-entry="' + entryId + '" data-field="roGainsShort" data-rate="' + rates.CAPITAL_GAINS_RO_SHORT + '" data-pair="roGainsShortNet_' + entryId + '" data-type="gross" step="0.01" min="0" placeholder="0.00">';
            html2 += '        <small>Brut (-' + (rates.CAPITAL_GAINS_RO_SHORT * 100).toFixed(0) + '% taxă)' + cgShortComparison + '</small>';
            html2 += '      </div>';
            html2 += '    </div>';
            html2 += '  </div>';
            html2 += '  <div class="form-group">';
            html2 += '    <label>Câștig ≥ 365 zile' + createHelpTrigger('roGainsLong') + '</label>';
            html2 += '    <div style="display: flex; gap: 12px;">';
            html2 += '      <div style="flex: 1;">';
            html2 += '        <input type="number" id="roGainsLongNet_' + entryId + '" class="gross-net-field" data-entry="' + entryId + '" data-rate="' + rates.CAPITAL_GAINS_RO_LONG + '" data-pair="roGainsLong_' + entryId + '" data-type="net" step="0.01" min="0" placeholder="0.00">';
            html2 += '        <small>Net (primit)</small>';
            html2 += '      </div>';
            html2 += '      <div style="flex: 1;">';
            html2 += '        <input type="number" id="roGainsLong_' + entryId + '" class="income-field gross-net-field" data-entry="' + entryId + '" data-field="roGainsLong" data-rate="' + rates.CAPITAL_GAINS_RO_LONG + '" data-pair="roGainsLongNet_' + entryId + '" data-type="gross" step="0.01" min="0" placeholder="0.00">';
            html2 += '        <small>Brut (-' + (rates.CAPITAL_GAINS_RO_LONG * 100).toFixed(0) + '% taxă)' + cgLongComparison + '</small>';
            html2 += '      </div>';
            html2 += '    </div>';
            html2 += '  </div>';
            html2 += '</div>';

            // Foreign broker fields (hidden by default, shown when foreign is checked)
            html2 += '<div id="foreignBrokerFields_' + entryId + '" class="broker-fields" style="display: none;">';
            html2 += '  <div class="form-group">';
            html2 += '    <label for="foreignGains_' + entryId + '">Câștiguri Totale (RON)' + createHelpTrigger('foreignGains') + '</label>';
            html2 += '    <input type="number" id="foreignGains_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignGains" step="0.01" min="0" placeholder="0.00">';
            html2 += '    <small>Taxa: ' + (rates.CAPITAL_GAINS_FOREIGN * 100).toFixed(0) + '% (declari și plătești tu)' + cgForeignComparison + '</small>';
            html2 += '  </div>';
            html2 += '  <div class="form-group">';
            html2 += '    <label for="foreignLosses_' + entryId + '">Pierderi Anul Curent (RON)</label>';
            html2 += '    <input type="number" id="foreignLosses_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignLosses" step="0.01" min="0" placeholder="0.00">';
            html2 += '    <small>Se pot compensa cu câștigurile</small>';
            html2 += '  </div>';
            html2 += '  <div class="form-group">';
            html2 += '    <label for="priorYearLosses_' + entryId + '">Pierderi Reportate din Anii Trecuți (RON)' + createHelpTrigger('priorYearLosses') + '</label>';
            html2 += '    <input type="number" id="priorYearLosses_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="priorYearLosses" step="0.01" min="0" placeholder="0.00">';
            html2 += '    <small>Se pot folosi 70% din valoare (până la 7 ani)</small>';
            html2 += '  </div>';
            html2 += '</div>';

            return html2;

        case 'crypto':
            var cryptoComparison = prevRates ? createRateComparison(year, rates.CRYPTO, prevRates.CRYPTO) : '';
            var html3 = '';
            html3 += '<div class="form-group">';
            html3 += '  <label for="cryptoGains_' + entryId + '">Câștiguri Totale Criptomonede (RON)' + createHelpTrigger('cryptoGains') + '</label>';
            html3 += '  <input type="number" id="cryptoGains_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="cryptoGains" step="0.01" min="0" placeholder="0.00">';
            html3 += '  <small>Taxa: ' + (rates.CRYPTO * 100).toFixed(0) + '%' + cryptoComparison + '</small>';
            html3 += '</div>';
            html3 += '<label style="display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; cursor: pointer;" title="Bifează doar dacă TOATE tranzacțiile sunt sub 200 RON ȘI totalul anual sub 600 RON">';
            html3 += '  <input type="checkbox" id="cryptoExempt_' + entryId + '" class="income-field-checkbox" data-entry="' + entryId + '" data-field="cryptoExempt" style="margin-top: 3px;">';
            html3 += '  <span style="line-height: 1.4;">Scutit de taxă<br><small style="color: #64748b;">Toate tranzacțiile &lt;200 RON ȘI total anual &lt;600 RON</small></span>';
            html3 += '</label>';
            return html3;

        case 'rental':
            var html4 = '';

            // Rental type toggle (only show for 2026, since 2025 uses same rate for both)
            if (ACTIVE_TAX_YEAR === 2026) {
                html4 += '<label style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; cursor: pointer;" title="Termen scurt: Airbnb, Booking (cheltuieli 30% → taxă 7%). Termen lung: contract tradițional (cheltuieli 20% → taxă 8%)">';
                html4 += '  <input type="checkbox" id="rentalIsShortTerm_' + entryId + '" class="income-field-checkbox rental-type-toggle" data-entry="' + entryId + '" data-field="rentalIsShortTerm" style="margin-top: 3px;">';
                html4 += '  <span style="line-height: 1.4;">Chirie pe termen scurt (Airbnb, Booking)<br><small style="color: #64748b;">Cheltuieli forfetare fixe 30% → Taxă efectivă 7% (necesită casă de marcat)</small></span>';
                html4 += '</label>';
            }

            html4 += '<div class="form-group">';
            html4 += '  <label for="rentalIncome_' + entryId + '">Venit anual brut (RON)' + createHelpTrigger('rentalIncome') + '</label>';
            html4 += '  <input type="number" id="rentalIncome_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="rentalIncome" step="0.01" min="0" placeholder="0.00">';
            html4 += '  <small id="rentalIncomeHelp_' + entryId + '">Total chirii încasate</small>';
            html4 += '</div>';

            if (ACTIVE_TAX_YEAR === 2025) {
                html4 += '<small style="display: block; margin-top: 8px; color: #64748b;">Cheltuieli forfetare fixe 20% → Taxă efectivă 8%</small>';
            }

            return html4;

        case 'interest':
            var html5 = '';
            html5 += '<div class="form-group">';
            html5 += '  <label>Dobânzi Bancare' + createHelpTrigger('bankInterest') + '</label>';
            html5 += '  <div style="display: flex; gap: 12px;">';
            html5 += '    <div style="flex: 1;">';
            html5 += '      <input type="number" id="bankInterestNet_' + entryId + '" class="gross-net-field" data-entry="' + entryId + '" data-rate="' + rates.BANK_INTEREST + '" data-pair="bankInterest_' + entryId + '" data-type="net" step="0.01" min="0" placeholder="0.00">';
            html5 += '      <small>Net (primit)</small>';
            html5 += '    </div>';
            html5 += '    <div style="flex: 1;">';
            html5 += '      <input type="number" id="bankInterest_' + entryId + '" class="income-field gross-net-field" data-entry="' + entryId + '" data-field="bankInterest" data-rate="' + rates.BANK_INTEREST + '" data-pair="bankInterestNet_' + entryId + '" data-type="gross" step="0.01" min="0" placeholder="0.00">';
            html5 += '      <small>Brut (-10% taxă)</small>';
            html5 += '    </div>';
            html5 += '  </div>';
            html5 += '</div>';
            return html5;

        default:
            return '';
    }
}

/**
 * Get default title for income type
 * Finds the next available number by checking existing titles
 */
function getDefaultIncomeTitle(sectionName) {
    var baseTitle;

    switch(sectionName) {
        case 'dividends':
            baseTitle = 'Dividende';
            break;
        case 'capitalGains':
            baseTitle = 'Câștiguri Capital';
            break;
        case 'crypto':
            baseTitle = 'Câștiguri Crypto';
            break;
        case 'rental':
            baseTitle = 'Chirie';
            break;
        case 'interest':
            baseTitle = 'Dobândă';
            break;
        default:
            baseTitle = 'Venit';
    }

    // Find all existing numbers in titles for this section
    var existingNumbers = [];
    var entries = incomeEntries[sectionName] || [];

    for (var i = 0; i < entries.length; i++) {
        var title = entries[i].title;
        // Extract number from titles like "Dividend 1", "Dividend 2", etc.
        var match = title.match(new RegExp('^' + baseTitle + ' (\\d+)$'));
        if (match) {
            existingNumbers.push(parseInt(match[1]));
        }
    }

    // Find the next available number
    var nextNumber = 1;
    while (existingNumbers.indexOf(nextNumber) !== -1) {
        nextNumber++;
    }

    return baseTitle + ' ' + nextNumber;
}

/**
 * Show the Add Income modal
 */
function showAddIncomeModal() {
    console.log('showAddIncomeModal called');
    const modal = document.getElementById('addIncomeModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } else {
        console.error('Modal not found!');
    }
}

/**
 * Hide the Add Income modal
 */
function hideAddIncomeModal() {
    const modal = document.getElementById('addIncomeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Enable a specific section (show it and expand it)
 */
function enableSection(sectionName) {
    console.log('enableSection called for:', sectionName);
    const section = document.querySelector('[data-section="' + sectionName + '"]');

    if (!section) {
        console.error('Section not found:', sectionName);
        return;
    }

    const content = section.querySelector('.section-content');
    const collapseIcon = section.querySelector('.collapse-icon');

    // Show and expand the section
    section.style.display = '';
    section.classList.remove('disabled');
    content.classList.remove('collapsed');
    if (collapseIcon) {
        collapseIcon.classList.add('expanded');
    }

    // Always add an entry when enabling from modal
    console.log('Adding entry for section:', sectionName);
    addIncomeEntry(sectionName);

    // Update empty state visibility
    updateEmptyStateVisibility();

    // Scroll to the newly added entry and focus its title
    setTimeout(function() {
        var sectionEntries = incomeEntries[sectionName];
        if (sectionEntries && sectionEntries.length > 0) {
            var newestEntry = sectionEntries[sectionEntries.length - 1];
            var newCard = document.querySelector('.income-entry-card[data-entry-id="' + newestEntry.id + '"]');

            if (newCard) {
                // Scroll with the card positioned 1/4 from top
                var scrollPosition = newCard.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 4);
                window.scrollTo({ top: scrollPosition, behavior: 'smooth' });

                // Focus and select the title input
                var titleInput = newCard.querySelector('.income-entry-title');
                if (titleInput) {
                    setTimeout(function() {
                        titleInput.focus();
                        titleInput.select();
                    }, 300);
                }
            }
        }
    }, 100);
}

/**
 * Add income entry to a section
 */
function addIncomeEntry(sectionName, title, data) {
    console.log('addIncomeEntry called for section:', sectionName);
    entryCounter++;
    var entryId = 'entry_' + entryCounter;

    if (!title) {
        title = getDefaultIncomeTitle(sectionName);
    }

    // Initialize default data for capital gains section
    if (!data && sectionName === 'capitalGains') {
        data = { isForeignBroker: 0 };
    }

    // Create entry data object
    var entry = {
        id: entryId,
        section: sectionName,
        title: title || getDefaultIncomeTitle(sectionName),
        data: data || {}
    };

    console.log('Created entry:', entry);

    // Add to entries array
    incomeEntries[sectionName].push(entry);

    // Auto-show and expand section when entry is added
    var section = document.querySelector('[data-section="' + sectionName + '"]');
    if (section) {
        var content = section.querySelector('.section-content');
        var collapseIcon = section.querySelector('.collapse-icon');

        // Show section (if hidden)
        section.style.display = '';
        section.classList.remove('disabled');

        // Expand section (if collapsed)
        content.classList.remove('collapsed');
        if (collapseIcon) {
            collapseIcon.classList.add('expanded');
        }

        updateEmptyStateVisibility();
        saveSectionStates();
    }

    // Render the entry card
    renderIncomeEntry(entry);

    // Save to localStorage
    saveIncomeEntries();

    // Auto-calculate
    autoCalculate();

    console.log('Entry added successfully');
    return entry;
}

/**
 * Render an income entry card in the DOM
 */
function renderIncomeEntry(entry) {
    console.log('renderIncomeEntry called for entry:', entry);
    var container = document.querySelector('.income-entries[data-section="' + entry.section + '"]');
    console.log('Container found:', container);

    if (!container) {
        console.error('Container not found for section:', entry.section);
        return;
    }

    var fieldsHtml = getIncomeFieldsTemplate(entry.section, entry.id);

    var cardHtml = '<div class="income-entry-card" data-entry-id="' + entry.id + '">';
    cardHtml += '  <div class="income-entry-header">';
    cardHtml += '    <input type="text" class="income-entry-title" value="' + entry.title + '" data-entry-id="' + entry.id + '" placeholder="Nume venit">';
    cardHtml += '    <button type="button" class="btn-delete-entry" data-entry-id="' + entry.id + '">🗑️ Șterge</button>';
    cardHtml += '  </div>';
    cardHtml += '  <div class="income-entry-fields">';
    cardHtml += fieldsHtml;
    cardHtml += '  </div>';
    cardHtml += '</div>';

    console.log('Inserting card HTML into container');
    container.insertAdjacentHTML('beforeend', cardHtml);
    console.log('Card inserted successfully');

    // Setup event listeners for the new card
    setupEntryEventListeners(entry.id);

    // Populate field values if data exists
    if (entry.data) {
        Object.keys(entry.data).forEach(function(fieldName) {
            var input = document.getElementById(fieldName + '_' + entry.id);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = entry.data[fieldName] == 1;
                } else {
                    input.value = entry.data[fieldName] || '';
                }
            }
        });

        // Disable crypto exempt checkbox if gains >= 600 RON
        if (entry.data.cryptoGains >= 600) {
            var checkbox = document.getElementById('cryptoExempt_' + entry.id);
            if (checkbox) {
                checkbox.checked = false;
                checkbox.disabled = true;
                checkbox.parentElement.style.opacity = '0.5';
            }
        }

        // Handle broker type segmented control state
        var isForeignBroker = entry.data.isForeignBroker == 1;
        if (isForeignBroker) {
            // If foreign broker was selected, update UI
            var romanianFields = document.getElementById('romanianBrokerFields_' + entry.id);
            var foreignFields = document.getElementById('foreignBrokerFields_' + entry.id);
            var brokerTypeBtns = document.querySelectorAll('.broker-type-btn[data-entry="' + entry.id + '"]');

            // Update button styles
            brokerTypeBtns.forEach(function(btn) {
                var titleDiv = btn.querySelector('div:first-child');
                var subtitleDiv = btn.querySelector('div:last-child');

                if (btn.dataset.type === 'foreign') {
                    btn.style.background = 'white';
                    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    if (titleDiv) {
                        titleDiv.style.fontWeight = '600';
                        titleDiv.style.color = 'var(--primary)';
                    }
                    if (subtitleDiv) {
                        subtitleDiv.style.color = '#64748b';
                    }
                } else {
                    btn.style.background = 'transparent';
                    btn.style.boxShadow = 'none';
                    if (titleDiv) {
                        titleDiv.style.fontWeight = '500';
                        titleDiv.style.color = '#64748b';
                    }
                    if (subtitleDiv) {
                        subtitleDiv.style.color = '#94a3b8';
                    }
                }
            });

            // Show/hide fields
            if (romanianFields) romanianFields.style.display = 'none';
            if (foreignFields) foreignFields.style.display = 'block';
        }

        // Restore rental help text for short-term
        if (entry.data.rentalIsShortTerm == 1) {
            var incomeHelp = document.getElementById('rentalIncomeHelp_' + entry.id);
            if (incomeHelp) {
                incomeHelp.textContent = 'Total încasat minus comision platformă (ex: Airbnb 15%, Booking 15-18%)';
            }
        }

        // Populate net fields from saved gross values
        var grossNetPairs = [
            { gross: 'domesticDividends', net: 'domesticDividendsNet', rate: 0.16 },
            { gross: 'bankInterest', net: 'bankInterestNet', rate: 0.10 },
            { gross: 'roGainsShort', net: 'roGainsShortNet', rate: 0.06 },
            { gross: 'roGainsLong', net: 'roGainsLongNet', rate: 0.03 }
        ];
        grossNetPairs.forEach(function(pair) {
            var grossValue = parseFloat(entry.data[pair.gross]) || 0;
            if (grossValue > 0) {
                var netField = document.getElementById(pair.net + '_' + entry.id);
                if (netField) {
                    netField.value = (grossValue * (1 - pair.rate)).toFixed(2);
                }
            }
        });
    }

    console.log('renderIncomeEntry completed');
}

/**
 * Setup event listeners for an income entry
 */
function setupEntryEventListeners(entryId) {
    // Title change listener
    var titleInput = document.querySelector('.income-entry-title[data-entry-id="' + entryId + '"]');
    if (titleInput) {
        titleInput.addEventListener('input', function() {
            updateEntryTitle(entryId, this.value);
        });
    }

    // Delete button listener
    var deleteBtn = document.querySelector('.btn-delete-entry[data-entry-id="' + entryId + '"]');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            deleteIncomeEntry(entryId);
        });
    }

    // Field input listeners (number inputs)
    var fields = document.querySelectorAll('.income-field[data-entry="' + entryId + '"]');
    fields.forEach(function(field) {
        // Add validation on input
        field.addEventListener('input', function() {
            validateNumberInput(this);
            updateEntryFieldValue(entryId, this.dataset.field, this.value);
        });

        // Prevent invalid characters on keypress
        field.addEventListener('keypress', function(e) {
            return validateNumberKeypress(e, this);
        });
    });

    // Checkbox listeners
    var checkboxes = document.querySelectorAll('.income-field-checkbox[data-entry="' + entryId + '"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            updateEntryFieldValue(entryId, this.dataset.field, this.checked ? 1 : 0);

            // Update rental help text based on short-term toggle
            if (this.classList.contains('rental-type-toggle')) {
                var incomeHelp = document.getElementById('rentalIncomeHelp_' + entryId);
                if (incomeHelp) {
                    incomeHelp.textContent = this.checked
                        ? 'Total încasat minus comision platformă (ex: Airbnb 15%, Booking 15-18%)'
                        : 'Total chirii încasate';
                }
            }
        });
    });

    // Broker type segmented control listeners
    var brokerTypeBtns = document.querySelectorAll('.broker-type-btn[data-entry="' + entryId + '"]');
    brokerTypeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var brokerType = this.dataset.type;
            var romanianFields = document.getElementById('romanianBrokerFields_' + entryId);
            var foreignFields = document.getElementById('foreignBrokerFields_' + entryId);
            var hiddenInput = document.getElementById('isForeignBroker_' + entryId);

            // Update button styles
            brokerTypeBtns.forEach(function(b) {
                var titleDiv = b.querySelector('div:first-child');
                var subtitleDiv = b.querySelector('div:last-child');

                if (b.dataset.type === brokerType) {
                    b.style.background = 'white';
                    b.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    if (titleDiv) {
                        titleDiv.style.fontWeight = '600';
                        titleDiv.style.color = 'var(--primary)';
                    }
                    if (subtitleDiv) {
                        subtitleDiv.style.color = '#64748b';
                    }
                } else {
                    b.style.background = 'transparent';
                    b.style.boxShadow = 'none';
                    if (titleDiv) {
                        titleDiv.style.fontWeight = '500';
                        titleDiv.style.color = '#64748b';
                    }
                    if (subtitleDiv) {
                        subtitleDiv.style.color = '#94a3b8';
                    }
                }
            });

            if (brokerType === 'foreign') {
                // Show foreign, hide Romanian
                if (romanianFields) romanianFields.style.display = 'none';
                if (foreignFields) foreignFields.style.display = 'block';
                if (hiddenInput) {
                    hiddenInput.value = '1';
                    updateEntryFieldValue(entryId, 'isForeignBroker', 1);
                }
                // Clear Romanian broker fields
                var roShort = document.getElementById('roGainsShort_' + entryId);
                var roLong = document.getElementById('roGainsLong_' + entryId);
                if (roShort) {
                    roShort.value = '';
                    updateEntryFieldValue(entryId, 'roGainsShort', 0);
                }
                if (roLong) {
                    roLong.value = '';
                    updateEntryFieldValue(entryId, 'roGainsLong', 0);
                }
            } else {
                // Show Romanian, hide foreign
                if (romanianFields) romanianFields.style.display = 'block';
                if (foreignFields) foreignFields.style.display = 'none';
                if (hiddenInput) {
                    hiddenInput.value = '0';
                    updateEntryFieldValue(entryId, 'isForeignBroker', 0);
                }
                // Clear foreign broker fields
                var foreignGains = document.getElementById('foreignGains_' + entryId);
                var foreignLosses = document.getElementById('foreignLosses_' + entryId);
                var priorYearLosses = document.getElementById('priorYearLosses_' + entryId);
                if (foreignGains) {
                    foreignGains.value = '';
                    updateEntryFieldValue(entryId, 'foreignGains', 0);
                }
                if (foreignLosses) {
                    foreignLosses.value = '';
                    updateEntryFieldValue(entryId, 'foreignLosses', 0);
                }
                if (priorYearLosses) {
                    priorYearLosses.value = '';
                    updateEntryFieldValue(entryId, 'priorYearLosses', 0);
                }
            }
            // Recalculate
            autoCalculate();
        });
    });

    // Gross ↔ Net sync listeners (only for net fields - gross fields save via income-field listener)
    var netFields = document.querySelectorAll('.gross-net-field[data-entry="' + entryId + '"][data-type="net"]');
    netFields.forEach(function(field) {
        // Add validation on input (same as income-field)
        field.addEventListener('input', function() {
            validateNumberInput(this);

            var rate = parseFloat(this.dataset.rate) || 0;
            var pairId = this.dataset.pair;
            var grossField = document.getElementById(pairId);
            var netValue = parseFloat(this.value) || 0;

            if (grossField) {
                if (netValue > 0) {
                    // Net → Gross: gross = net / (1 - rate)
                    var grossValue = (netValue / (1 - rate)).toFixed(2);
                    grossField.value = grossValue;
                    // Update data and calculate (don't dispatch event to avoid recursion)
                    updateEntryFieldValue(entryId, grossField.dataset.field, grossValue);
                } else {
                    grossField.value = '';
                    updateEntryFieldValue(entryId, grossField.dataset.field, 0);
                }
            }
        });

        // Prevent invalid characters on keypress (same as income-field)
        field.addEventListener('keypress', function(e) {
            return validateNumberKeypress(e, this);
        });
    });

    // Gross → Net sync (update net display when gross changes)
    var grossFields = document.querySelectorAll('.gross-net-field[data-entry="' + entryId + '"][data-type="gross"]');
    grossFields.forEach(function(field) {
        field.addEventListener('input', function() {
            var rate = parseFloat(this.dataset.rate) || 0;
            var pairId = this.dataset.pair;
            var netField = document.getElementById(pairId);
            var grossValue = parseFloat(this.value) || 0;

            if (netField) {
                if (grossValue > 0) {
                    // Gross → Net: net = gross * (1 - rate)
                    netField.value = (grossValue * (1 - rate)).toFixed(2);
                } else {
                    netField.value = '';
                }
            }
        });
    });
}

/**
 * Update entry title
 */
function updateEntryTitle(entryId, newTitle) {
    // Find entry across all sections
    for (var sectionName in incomeEntries) {
        var entries = incomeEntries[sectionName];
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].id === entryId) {
                entries[i].title = newTitle;
                saveIncomeEntries();
                return;
            }
        }
    }
}

/**
 * Update entry field value
 */
function updateEntryFieldValue(entryId, fieldName, value) {
    // Find entry across all sections
    for (var sectionName in incomeEntries) {
        var entries = incomeEntries[sectionName];
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].id === entryId) {
                if (!entries[i].data) {
                    entries[i].data = {};
                }
                entries[i].data[fieldName] = parseFloat(value) || 0;

                // Handle crypto exempt checkbox - disable if gains >= 600 RON
                if (fieldName === 'cryptoGains') {
                    var checkbox = document.getElementById('cryptoExempt_' + entryId);
                    if (checkbox) {
                        var gains = parseFloat(value) || 0;
                        if (gains >= 600) {
                            checkbox.checked = false;
                            checkbox.disabled = true;
                            checkbox.parentElement.style.opacity = '0.5';
                            entries[i].data['cryptoExempt'] = 0;
                        } else {
                            checkbox.disabled = false;
                            checkbox.parentElement.style.opacity = '1';
                        }
                    }
                }

                saveIncomeEntries();
                autoCalculate();
                return;
            }
        }
    }
}

/**
 * Delete an income entry
 */
function deleteIncomeEntry(entryId) {
    var card = document.querySelector('.income-entry-card[data-entry-id="' + entryId + '"]');
    if (!card) return;

    var deleteBtn = card.querySelector('.btn-delete-entry');
    if (!deleteBtn) return;

    // Check if already in confirm state
    if (deleteBtn.classList.contains('confirm-delete')) {
        // Actually delete
        deleteBtn.classList.remove('confirm-delete');

        // Find which section this entry belongs to
        var deletedSectionName = null;

        // Remove from data structure
        for (var sectionName in incomeEntries) {
            var entries = incomeEntries[sectionName];
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].id === entryId) {
                    entries.splice(i, 1);
                    deletedSectionName = sectionName;
                    break;
                }
            }
            if (deletedSectionName) break;
        }

        // Remove from DOM with animation
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(function() {
            card.remove();

            // Auto-hide section if no entries left
            if (deletedSectionName && incomeEntries[deletedSectionName].length === 0) {
                var section = document.querySelector('[data-section="' + deletedSectionName + '"]');
                if (section) {
                    var content = section.querySelector('.section-content');
                    var collapseIcon = section.querySelector('.collapse-icon');

                    section.style.display = 'none';
                    section.classList.add('disabled');
                    content.classList.add('collapsed');
                    if (collapseIcon) {
                        collapseIcon.classList.remove('expanded');
                    }

                    updateEmptyStateVisibility();
                    saveSectionStates();
                }
            }
        }, 200);

        // Save and recalculate
        saveIncomeEntries();
        autoCalculate();
    } else {
        // First click - show confirmation
        deleteBtn.classList.add('confirm-delete');
        deleteBtn.textContent = 'Sigur? Click din nou';

        // Reset after 3 seconds
        setTimeout(function() {
            if (deleteBtn) {
                deleteBtn.classList.remove('confirm-delete');
                deleteBtn.textContent = '🗑️ Șterge';
            }
        }, 3000);
    }
}

/**
 * Update empty state visibility based on whether any sections are visible
 */
function updateEmptyStateVisibility() {
    var emptyState = document.getElementById('emptyState');
    if (!emptyState) return;

    var hasVisibleSections = false;
    var sections = document.querySelectorAll('.form-section');

    for (var i = 0; i < sections.length; i++) {
        if (sections[i].style.display !== 'none') {
            hasVisibleSections = true;
            break;
        }
    }

    if (hasVisibleSections) {
        emptyState.style.display = 'none';
    } else {
        emptyState.style.display = 'block';
    }
}

/**
 * Initialize the app
 */
function initApp() {
    console.log('initApp called - starting initialization');

    // Load saved active year (if any)
    const savedYear = localStorage.getItem(STORAGE_KEY_ACTIVE_YEAR);
    if (savedYear) {
        const year = parseInt(savedYear);
        setTaxYear(year);

        // Update active button
        document.querySelectorAll('.year-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.year) === year) {
                btn.classList.add('active');
            }
        });
    }

    // Always update year info on init (whether saved or default year)
    updateYearInfo(ACTIVE_TAX_YEAR);

    // Setup tax year selector
    setupTaxYearSelector();

    // Setup section toggles
    setupSectionToggles();

    // Drag and drop disabled - sections stay in fixed order
    // setupDragAndDrop();
    // loadSectionOrder();

    // Load saved data from localStorage (for current year)
    loadSavedData();

    // Load income entries
    loadIncomeEntries();

    // Setup event listeners
    setupEventListeners();

    // Auto-calculate if there's saved data
    autoCalculate();

    // Update empty state visibility on init
    updateEmptyStateVisibility();

    console.log('RoTaxCalculator initialized');
}

/**
 * Setup tax year selector
 */
function setupTaxYearSelector() {
    const yearButtons = document.querySelectorAll('.year-btn');

    yearButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const newYear = parseInt(this.dataset.year);
            const currentYear = ACTIVE_TAX_YEAR;

            // Don't do anything if clicking the same year
            if (newYear === currentYear) {
                return;
            }

            // Save current year's data before switching
            saveFormData();
            saveSectionStates();

            // Update active button
            yearButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Set tax year in calculator
            setTaxYear(newYear);

            // Save active year to localStorage
            localStorage.setItem(STORAGE_KEY_ACTIVE_YEAR, newYear.toString());

            // Update year info display
            updateYearInfo(newYear);

            // Clear income entries DOM
            document.querySelectorAll('.income-entries').forEach(function(container) {
                container.innerHTML = '';
            });

            // Load data for the new year
            loadSavedData();

            // Load income entries for the new year
            loadIncomeEntries();

            // Recalculate with new rates
            autoCalculate();

            console.log(`Switched from ${currentYear} to ${newYear}`);
        });
    });
}

/**
 * Update year info display
 */
function updateYearInfo(year) {
    const config = getTaxYearConfig();
    const yearInfo = document.getElementById('yearInfo');

    // Build HTML with proper line breaks
    let html = '<p><strong>An Fiscal:</strong> ' + config.year + '<br>';
    html += '<strong>Salariu Minim:</strong> ' + config.minimumWage.toLocaleString('ro-RO') + ' RON/lună';

    // Add percentage increase for 2026
    if (year === 2026) {
        var prevWage = TAX_CONFIG[2025].minimumWage;
        var percentIncrease = ((4325 - prevWage) / prevWage * 100).toFixed(1);
        html += ' <span style="color: #ef4444; font-weight: 600;">(+' + percentIncrease + '% din Iulie)</span>';
    }

    // Add note on separate line if it exists
    if (config.minimumWageNote) {
        html += '<br><small style="color: #64748b;">' + config.minimumWageNote + '</small>';
    }

    html += '</p>';

    yearInfo.innerHTML = html;

    // Update help text in form fields
    updateFormFieldRates(config.rates);
}

/**
 * Create a comparison badge showing rate change between years
 */
function createRateComparison(currentYear, currentRate, previousRate, label = 'față de') {
    if (currentYear === 2025) return ''; // No comparison for base year

    const diff = currentRate - previousRate;
    if (diff === 0) return '';

    const diffPercent = ((diff / previousRate) * 100).toFixed(0);
    const diffAbsolute = (diff * 100).toFixed(0);
    const isIncrease = diff > 0;
    const color = isIncrease ? '#ef4444' : '#10b981'; // red for increase, green for decrease
    const sign = isIncrease ? '+' : '';

    return ` <span style="color: ${color}; font-weight: 600;">(${sign}${diffAbsolute}% ${label} 2025)</span>`;
}

/**
 * Update tax rate displays in form fields
 * NOTE: This function is no longer used since we moved to dynamic income entries
 * The rates are now updated in getIncomeFieldsTemplate() when entries are created
 */
function updateFormFieldRates(rates) {
    // This function is deprecated - rates are now set in getIncomeFieldsTemplate()
    // Keeping it for backwards compatibility but it does nothing
    console.log('updateFormFieldRates called (deprecated - does nothing now)');
}

/**
 * Setup section toggle functionality (collapse/expand only)
 */
function setupSectionToggles() {
    Object.entries(SECTIONS).forEach(([sectionName, config]) => {
        const section = document.querySelector('[data-section="' + sectionName + '"]');
        if (!section) return;

        const content = section.querySelector('.section-content');
        const collapseIcon = section.querySelector('.collapse-icon');

        // Arrow click - toggle expand/collapse
        if (collapseIcon) {
            collapseIcon.addEventListener('click', function(e) {
                e.stopPropagation();

                const isExpanded = collapseIcon.classList.contains('expanded');

                if (isExpanded) {
                    content.classList.add('collapsed');
                    collapseIcon.classList.remove('expanded');
                } else {
                    content.classList.remove('collapsed');
                    collapseIcon.classList.add('expanded');
                }
            });
        }
    });
}

/**
 * Setup event listeners for form interactions
 */
function setupEventListeners() {
    console.log('setupEventListeners called');

    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', handleCalculate);

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', handleClear);

    // Print button
    document.getElementById('printBtn').addEventListener('click', handlePrint);

    // Floating banner scroll to results button
    document.getElementById('scrollToResultsBtn').addEventListener('click', () => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    });

    // Window scroll event to show/hide floating banner
    window.addEventListener('scroll', handleBannerScroll);

    // Auto-save AND auto-calculate on input change
    INPUT_IDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                saveFormData();
                autoCalculate();
            });
        }
    });

    // Add Income button - show modal
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    console.log('addIncomeBtn:', addIncomeBtn);
    if (addIncomeBtn) {
        addIncomeBtn.addEventListener('click', function() {
            console.log('Add Income button clicked');
            showAddIncomeModal();
        });
    } else {
        console.error('addIncomeBtn not found!');
    }

    // Income type buttons in modal
    const incomeTypeBtns = document.querySelectorAll('.income-type-btn');
    console.log('Found ' + incomeTypeBtns.length + ' income type buttons in modal');
    incomeTypeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            console.log('Income type button clicked:', this.dataset.section);
            const sectionName = this.dataset.section;
            enableSection(sectionName);
            hideAddIncomeModal();
        });
    });

    // Modal close button
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            hideAddIncomeModal();
        });
    }

    // Close modal on background click
    const modal = document.getElementById('addIncomeModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideAddIncomeModal();
            }
        });
    }

    // "+ Adaugă" buttons in section headers - using event delegation
    document.addEventListener('click', function(e) {
        // Check if clicked element has btn-add-entry class
        if (e.target && e.target.classList.contains('btn-add-entry')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('>>> SECTION ADD ENTRY BUTTON clicked for section:', e.target.dataset.section);
            var sectionName = e.target.dataset.section;
            if (sectionName) {
                var newEntry = addIncomeEntry(sectionName);
                // Scroll to the newly added entry and focus title
                setTimeout(function() {
                    var entryCard = document.querySelector('.income-entry-card[data-entry-id="' + newEntry.id + '"]');
                    if (entryCard) {
                        // Scroll with the card positioned 1/4 from top
                        var scrollPosition = entryCard.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 4);
                        window.scrollTo({ top: scrollPosition, behavior: 'smooth' });

                        // Focus and select the title input
                        var titleInput = entryCard.querySelector('.income-entry-title');
                        if (titleInput) {
                            setTimeout(function() {
                                titleInput.focus();
                                titleInput.select();
                            }, 300);
                        }
                    }
                }, 100);
            } else {
                console.error('No section name found on button');
            }
        }
    });
}

/**
 * Get all form input values (aggregate from income entries)
 */
function getFormData() {
    const data = {};

    // Initialize all fields to 0
    INPUT_IDS.forEach(id => {
        data[id] = 0;
    });

    // Aggregate values from all income entries
    for (var sectionName in incomeEntries) {
        var entries = incomeEntries[sectionName];
        entries.forEach(function(entry) {
            if (entry.data) {
                for (var fieldName in entry.data) {
                    var value = parseFloat(entry.data[fieldName]) || 0;
                    if (data.hasOwnProperty(fieldName)) {
                        data[fieldName] += value;
                    } else {
                        data[fieldName] = value;
                    }
                }
            }
        });
    }

    return data;
}

/**
 * Save income entries to localStorage (for current active year)
 */
function saveIncomeEntries() {
    var keys = getStorageKeys(ACTIVE_TAX_YEAR);
    var storageKey = keys.data + '_entries';

    var dataToSave = {
        entries: incomeEntries,
        counter: entryCounter
    };

    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    console.log('Income entries saved for year ' + ACTIVE_TAX_YEAR);
}

/**
 * Load income entries from localStorage (for current active year)
 */
function loadIncomeEntries() {
    console.log('loadIncomeEntries called');
    var keys = getStorageKeys(ACTIVE_TAX_YEAR);
    var storageKey = keys.data + '_entries';

    var savedData = localStorage.getItem(storageKey);
    if (!savedData) {
        console.log('No saved entries found');
        // Reset to empty
        incomeEntries = {
            dividends: [],
            capitalGains: [],
            crypto: [],
            rental: [],
            interest: []
        };
        entryCounter = 0;
        return;
    }

    try {
        var data = JSON.parse(savedData);
        incomeEntries = data.entries || {
            dividends: [],
            capitalGains: [],
            crypto: [],
            rental: [],
            interest: []
        };
        entryCounter = data.counter || 0;

        console.log('Loaded entries:', incomeEntries);

        // Render all entries
        for (var sectionName in incomeEntries) {
            var entries = incomeEntries[sectionName];
            console.log('Rendering ' + entries.length + ' entries for ' + sectionName);
            entries.forEach(function(entry) {
                renderIncomeEntry(entry);
            });
        }

        console.log('Income entries loaded for year ' + ACTIVE_TAX_YEAR);
    } catch (error) {
        console.error('Error loading income entries:', error);
        console.error('Error stack:', error.stack);
        incomeEntries = {
            dividends: [],
            capitalGains: [],
            crypto: [],
            rental: [],
            interest: []
        };
        entryCounter = 0;
    }
}

/**
 * Clear all income entries
 */
function clearAllIncomeEntries() {
    // Clear data structures
    incomeEntries = {
        dividends: [],
        capitalGains: [],
        crypto: [],
        rental: [],
        interest: []
    };
    entryCounter = 0;

    // Clear DOM
    document.querySelectorAll('.income-entries').forEach(function(container) {
        container.innerHTML = '';
    });

    // Save empty state
    saveIncomeEntries();
}

/**
 * Save form data to localStorage (for current active year)
 */
function saveFormData() {
    const data = {};

    // Save actual input values (not just enabled ones)
    INPUT_IDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            const value = parseFloat(input.value) || 0;
            data[id] = value;
        }
    });

    const keys = getStorageKeys(ACTIVE_TAX_YEAR);
    localStorage.setItem(keys.data, JSON.stringify(data));
    console.log(`Form data saved for year ${ACTIVE_TAX_YEAR}`);
}

/**
 * Save section states (visible/hidden) to localStorage (for current active year)
 */
function saveSectionStates() {
    const states = {};
    Object.entries(SECTIONS).forEach(([sectionName, config]) => {
        const section = document.querySelector('[data-section="' + sectionName + '"]');
        states[sectionName] = section && section.style.display !== 'none';
    });
    const keys = getStorageKeys(ACTIVE_TAX_YEAR);
    localStorage.setItem(keys.sections, JSON.stringify(states));
    console.log('Section states saved for year ' + ACTIVE_TAX_YEAR);
}

/**
 * Load saved data from localStorage (for current active year)
 */
function loadSavedData() {
    const keys = getStorageKeys(ACTIVE_TAX_YEAR);

    // Reset all sections to default (collapsed/hidden)
    Object.entries(SECTIONS).forEach(([sectionName, config]) => {
        const section = document.querySelector('[data-section="' + sectionName + '"]');
        if (!section) return;

        const content = section.querySelector('.section-content');
        const collapseIcon = section.querySelector('.collapse-icon');

        content.classList.add('collapsed');
        section.classList.add('disabled');
        collapseIcon.classList.remove('expanded');
        section.style.display = 'none';
    });

    // Load section states for this year
    const savedStates = localStorage.getItem(keys.sections);
    if (savedStates) {
        try {
            const states = JSON.parse(savedStates);
            Object.entries(SECTIONS).forEach(([sectionName, config]) => {
                if (states[sectionName]) {
                    const section = document.querySelector('[data-section="' + sectionName + '"]');
                    if (!section) return;

                    const content = section.querySelector('.section-content');
                    const collapseIcon = section.querySelector('.collapse-icon');

                    content.classList.remove('collapsed');
                    section.classList.remove('disabled');
                    collapseIcon.classList.add('expanded');
                    section.style.display = '';
                }
            });
            console.log('Section states loaded for year ' + ACTIVE_TAX_YEAR);
        } catch (error) {
            console.error('Error loading section states:', error);
        }
    }
}

/**
 * Clear all form data
 */
function handleClear() {
    if (confirm('Sigur doriți să ștergeți toate datele introduse?')) {
        // Clear income entries
        clearAllIncomeEntries();

        // Collapse and hide all sections
        Object.entries(SECTIONS).forEach(([sectionName, config]) => {
            const section = document.querySelector('[data-section="' + sectionName + '"]');
            if (!section) return;

            const content = section.querySelector('.section-content');
            const collapseIcon = section.querySelector('.collapse-icon');

            content.classList.add('collapsed');
            section.classList.add('disabled');
            collapseIcon.classList.remove('expanded');
            section.style.display = 'none';
        });

        // Show empty state
        updateEmptyStateVisibility();

        // Clear localStorage for current year only
        const keys = getStorageKeys(ACTIVE_TAX_YEAR);
        localStorage.removeItem(keys.data);
        localStorage.removeItem(keys.sections);
        localStorage.removeItem(keys.data + '_entries');

        // Hide results
        document.getElementById('results').classList.add('hidden');

        console.log('Form data cleared for year ' + ACTIVE_TAX_YEAR);
    }
}

/**
 * Handle calculate button click
 */
function handleCalculate() {
    // Get form data
    const inputData = getFormData();

    // Validate at least one input
    const hasInput = Object.values(inputData).some(value => value > 0);

    if (!hasInput) {
        alert('Vă rugăm să introduceți cel puțin un venit!');
        return;
    }

    // Calculate taxes
    const results = calculateAllTaxes(inputData);

    // Display results
    displayResults(results);

    // Save to localStorage
    saveFormData();

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Auto-calculate on input change (real-time)
 */
function autoCalculate() {
    // Get form data
    const inputData = getFormData();

    // Check if we have any input
    const hasInput = Object.values(inputData).some(value => value > 0);

    // Update clear button visibility
    updateClearButtonVisibility(hasInput);

    if (!hasInput) {
        // No input, hide results and banner
        document.getElementById('results').classList.add('hidden');
        document.getElementById('floatingBanner').style.display = 'none';
        return;
    }

    // Calculate taxes
    const results = calculateAllTaxes(inputData);

    // Display results (no scroll, no alert)
    displayResults(results);
}

/**
 * Update clear button visibility based on whether there's any data
 */
function updateClearButtonVisibility(hasData) {
    const clearBtn = document.getElementById('clearBtn');

    if (hasData) {
        clearBtn.style.display = '';  // Show button
    } else {
        clearBtn.style.display = 'none';  // Hide button
    }
}

/**
 * Update floating banner with payment total
 */
function updateFloatingBanner(grandTotal) {
    const banner = document.getElementById('floatingBanner');
    const bannerAmount = document.getElementById('bannerAmount');
    const bannerLabel = document.getElementById('bannerLabel');

    if (grandTotal > 0) {
        bannerLabel.textContent = 'Total de Plată pentru ' + ACTIVE_TAX_YEAR + ':';
        bannerAmount.textContent = formatCurrency(grandTotal);
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

/**
 * Check if results section is visible in viewport
 */
function isResultsVisible() {
    const results = document.getElementById('results');
    if (!results || results.classList.contains('hidden')) {
        return false;
    }

    const rect = results.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
}

/**
 * Handle scroll to toggle banner visibility
 */
function handleBannerScroll() {
    const banner = document.getElementById('floatingBanner');
    if (banner.style.display === 'none') return;

    if (isResultsVisible()) {
        banner.style.opacity = '0';
        banner.style.pointerEvents = 'none';
    } else {
        banner.style.opacity = '1';
        banner.style.pointerEvents = 'auto';
    }
}

/**
 * Display calculation results
 */
function displayResults(results) {
    // Show results section
    document.getElementById('results').classList.remove('hidden');

    // Display tax breakdown table
    displayTaxBreakdown(results.taxes, results.totalTax);

    // Display CASS information (pass taxes for net income breakdown)
    displayCASS(results.cass, results.taxes);

    // Display summary
    displaySummary(results.summary);

    // Update floating banner with grand total
    updateFloatingBanner(results.summary.grandTotal);

    // Check banner visibility based on scroll position
    setTimeout(handleBannerScroll, 100);
}

/**
 * Display tax breakdown table
 */
function displayTaxBreakdown(taxes, totalTax) {
    const tbody = document.getElementById('taxBreakdown');
    tbody.innerHTML = '';

    if (taxes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nu există venituri impozabile</td></tr>';
        document.getElementById('totalTax').textContent = '0 RON';
        return;
    }

    taxes.forEach(tax => {
        const row = document.createElement('tr');

        // If tax is withheld (already paid), make it less prominent
        if (tax.withheld) {
            row.style.opacity = '0.6';
        }

        // Type
        const typeCell = document.createElement('td');
        typeCell.textContent = tax.type;
        if (tax.note) {
            const noteDiv = document.createElement('div');
            noteDiv.style.fontSize = '0.85em';
            noteDiv.style.color = '#64748b';
            noteDiv.style.marginTop = '5px';
            noteDiv.textContent = tax.note;
            typeCell.appendChild(noteDiv);
        }
        row.appendChild(typeCell);

        // Base
        const baseCell = document.createElement('td');
        baseCell.textContent = formatCurrency(tax.base);
        row.appendChild(baseCell);

        // Rate
        const rateCell = document.createElement('td');
        // Check if exempt (rate contains "scutit")
        const isExempt = tax.rate && tax.rate.includes('scutit');
        if (isExempt) {
            rateCell.textContent = tax.rate.replace(' (scutit)', '').replace('(scutit)', '');
            row.style.opacity = '0.6';
            const exemptSpan = document.createElement('div');
            exemptSpan.style.fontSize = '0.8em';
            exemptSpan.style.color = '#10b981';
            exemptSpan.textContent = '(scutit)';
            rateCell.appendChild(exemptSpan);
        } else {
            rateCell.textContent = tax.rate;
        }
        if (tax.withheld) {
            const withheldSpan = document.createElement('div');
            withheldSpan.style.fontSize = '0.8em';
            withheldSpan.style.color = '#10b981';
            withheldSpan.textContent = '(reținut)';
            rateCell.appendChild(withheldSpan);
        }
        row.appendChild(rateCell);

        // Tax
        const taxCell = document.createElement('td');
        taxCell.textContent = formatCurrency(tax.tax);
        taxCell.style.fontWeight = '600';

        // Highlight taxes to be paid (not withheld) with blue
        if (!tax.withheld) {
            taxCell.style.color = '#3b82f6';
            taxCell.style.fontWeight = '700';
        }

        row.appendChild(taxCell);

        tbody.appendChild(row);
    });

    // Update total
    document.getElementById('totalTax').innerHTML = `<strong>${formatCurrency(totalTax)}</strong>`;

    // Update total tax to pay (excluding withheld at source)
    const taxesToPay = taxes.filter(t => !t.withheld).reduce((sum, t) => sum + t.tax, 0);
    const totalTaxToPayElement = document.getElementById('totalTaxToPay');
    totalTaxToPayElement.innerHTML = `<strong>${formatCurrency(taxesToPay)}</strong>`;
}

/**
 * Display CASS information
 */
function displayCASS(cass, taxes) {
    document.getElementById('cassNetIncome').textContent = formatCurrency(cass.netIncome);
    document.getElementById('cassBracket').textContent = cass.bracket;
    document.getElementById('cassAmount').textContent = formatCurrency(cass.cassAmount);

    // Populate net income breakdown
    populateNetIncomeDetail(taxes);

    // Populate CASS brackets detail
    populateCassBracketsDetail(cass);

    // Setup toggles
    setupNetIncomeToggle();
    setupCassBracketsToggle();
}

/**
 * Populate net income breakdown detail
 */
function populateNetIncomeDetail(taxes) {
    const detailDiv = document.getElementById('netIncomeDetail');

    if (!taxes || taxes.length === 0) {
        detailDiv.innerHTML = '<p style="text-align: center; color: #64748b; font-size: 0.9em;">Nu există venituri</p>';
        return;
    }

    // Filter only taxes with net income > 0
    const taxesWithIncome = taxes.filter(t => t.net > 0);

    if (taxesWithIncome.length === 0) {
        detailDiv.innerHTML = '<p style="text-align: center; color: #64748b; font-size: 0.9em;">Nu există venituri nete</p>';
        return;
    }

    // Generate HTML
    detailDiv.innerHTML = taxesWithIncome.map(tax => {
        return `
            <div class="net-income-item">
                <span>${tax.type}:</span>
                <span>${formatCurrency(tax.net)}</span>
            </div>
        `;
    }).join('');
}

/**
 * Setup net income toggle
 */
function setupNetIncomeToggle() {
    const toggle = document.getElementById('netIncomeToggle');
    const detail = document.getElementById('netIncomeDetail');
    const icon = toggle.querySelector('.cass-collapse-icon');

    // Remove old listener if exists
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    // Add new listener
    newToggle.addEventListener('click', function() {
        const isExpanded = detail.style.display !== 'none';
        const newIcon = newToggle.querySelector('.cass-collapse-icon');

        if (isExpanded) {
            detail.style.display = 'none';
            newIcon.classList.remove('expanded');
        } else {
            detail.style.display = 'block';
            newIcon.classList.add('expanded');
        }
    });
}

/**
 * Populate CASS brackets detail with all thresholds
 */
function populateCassBracketsDetail(cass) {
    const config = getTaxYearConfig();
    const minWage = config.minimumWage;

    // Calculate all bracket thresholds
    const brackets = [
        {
            label: '< 6 salarii minime',
            range: `< ${formatCurrency(minWage * 6)}`,
            cass: '0 RON',
            threshold: minWage * 6
        },
        {
            label: '6-12 salarii minime',
            range: `${formatCurrency(minWage * 6)} - ${formatCurrency(minWage * 12)}`,
            cass: formatCurrency(minWage * 6 * 0.10),
            threshold: minWage * 12
        },
        {
            label: '12-24 salarii minime',
            range: `${formatCurrency(minWage * 12)} - ${formatCurrency(minWage * 24)}`,
            cass: formatCurrency(minWage * 12 * 0.10),
            threshold: minWage * 24
        },
        {
            label: '> 24 salarii minime',
            range: `> ${formatCurrency(minWage * 24)}`,
            cass: formatCurrency(minWage * 24 * 0.10),
            threshold: Infinity
        }
    ];

    // Determine which bracket is active
    const netIncome = cass.netIncome;
    let activeBracketIndex = 0;

    if (netIncome < minWage * 6) {
        activeBracketIndex = 0;
    } else if (netIncome < minWage * 12) {
        activeBracketIndex = 1;
    } else if (netIncome < minWage * 24) {
        activeBracketIndex = 2;
    } else {
        activeBracketIndex = 3;
    }

    // Generate HTML
    const detailDiv = document.getElementById('cassBracketsDetail');
    detailDiv.innerHTML = brackets.map((bracket, index) => {
        const isActive = index === activeBracketIndex;
        const className = isActive ? 'cass-bracket-item active' : 'cass-bracket-item inactive';

        return `
            <div class="${className}">
                <span>${bracket.label}: ${bracket.range}</span>
                <span>CASS: ${bracket.cass}</span>
            </div>
        `;
    }).join('');
}

/**
 * Setup CASS brackets toggle
 */
function setupCassBracketsToggle() {
    const toggle = document.getElementById('cassBracketToggle');
    const detail = document.getElementById('cassBracketsDetail');
    const icon = toggle.querySelector('.cass-collapse-icon');

    // Remove old listener if exists
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);

    // Add new listener
    newToggle.addEventListener('click', function() {
        const isExpanded = detail.style.display !== 'none';
        const newIcon = newToggle.querySelector('.cass-collapse-icon');

        if (isExpanded) {
            detail.style.display = 'none';
            newIcon.classList.remove('expanded');
        } else {
            detail.style.display = 'block';
            newIcon.classList.add('expanded');
        }
    });
}

/**
 * Display summary
 */
function displaySummary(summary) {
    document.getElementById('summaryTax').textContent = formatCurrency(summary.taxesToPay);
    document.getElementById('summaryCass').textContent = formatCurrency(summary.totalCass);
    document.getElementById('summaryTotal').textContent = formatCurrency(summary.grandTotal);
}

/**
 * Format number as RON currency
 */
function formatCurrency(amount) {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' RON';
}

/**
 * Handle print/save as PDF
 */
function handlePrint() {
    window.print();
}

/**
 * Setup drag and drop functionality for sections
 */
function setupDragAndDrop() {
    const sections = document.querySelectorAll('.form-section');
    let draggedElement = null;

    sections.forEach(section => {
        // Initially disable dragging on the section
        section.setAttribute('draggable', 'false');

        // Get the drag handle for this section
        const dragHandle = section.querySelector('.drag-handle');

        // Enable dragging only when mouse is over the handle
        dragHandle.addEventListener('mouseenter', function() {
            section.setAttribute('draggable', 'true');
        });

        dragHandle.addEventListener('mouseleave', function() {
            section.setAttribute('draggable', 'false');
        });

        // For touch devices - enable on touch
        dragHandle.addEventListener('touchstart', function() {
            section.setAttribute('draggable', 'true');
        });

        // Drag start
        section.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';

            // Safari requires setData to be called
            e.dataTransfer.setData('text/plain', this.dataset.section);

            // For Safari - add a timeout to ensure draggable is set
            setTimeout(() => {
                this.style.opacity = '0.5';
            }, 0);
        });

        // Drag end
        section.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
            this.style.opacity = '';
            section.setAttribute('draggable', 'false');

            // Remove all drag-over classes
            sections.forEach(s => s.classList.remove('drag-over'));
        });

        // Drag over
        section.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
        });

        // Drag enter
        section.addEventListener('dragenter', function(e) {
            e.preventDefault();
            if (this !== draggedElement && draggedElement) {
                this.classList.add('drag-over');
            }
        });

        // Drag leave
        section.addEventListener('dragleave', function(e) {
            // Only remove if we're actually leaving the section
            if (e.target === this) {
                this.classList.remove('drag-over');
            }
        });

        // Drop
        section.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (draggedElement && draggedElement !== this) {
                // Get the parent form
                const form = document.getElementById('taxForm');

                // Get all sections
                const allSections = Array.from(form.querySelectorAll('.form-section'));

                // Get indices
                const draggedIndex = allSections.indexOf(draggedElement);
                const targetIndex = allSections.indexOf(this);

                // Reorder in DOM
                if (draggedIndex < targetIndex) {
                    // Moving down
                    this.parentNode.insertBefore(draggedElement, this.nextSibling);
                } else {
                    // Moving up
                    this.parentNode.insertBefore(draggedElement, this);
                }

                // Save new order
                saveSectionOrder();
            }

            this.classList.remove('drag-over');
            return false;
        });
    });
}

/**
 * Save section order to localStorage
 */
function saveSectionOrder() {
    const sections = document.querySelectorAll('.form-section');
    const order = Array.from(sections).map(section => section.dataset.section);
    localStorage.setItem(STORAGE_KEY_SECTION_ORDER, JSON.stringify(order));
    console.log('Section order saved:', order);
}

/**
 * Load section order from localStorage
 */
function loadSectionOrder() {
    const savedOrder = localStorage.getItem(STORAGE_KEY_SECTION_ORDER);
    if (!savedOrder) return;

    try {
        const order = JSON.parse(savedOrder);
        const form = document.getElementById('taxForm');
        const buttons = form.querySelector('.btn-primary').parentElement;

        // Get all sections
        const sections = {};
        document.querySelectorAll('.form-section').forEach(section => {
            sections[section.dataset.section] = section;
        });

        // Reorder sections based on saved order
        order.forEach(sectionName => {
            if (sections[sectionName]) {
                // Insert before the buttons
                form.insertBefore(sections[sectionName], buttons.firstChild);
            }
        });

        console.log('Section order loaded:', order);
    } catch (error) {
        console.error('Error loading section order:', error);
    }
}

/**
 * Setup privacy modal
 */
function setupPrivacyModal() {
    const privacyLink = document.getElementById('privacyLink');
    const privacyModal = document.getElementById('privacyModal');
    const privacyClose = document.querySelector('.privacy-close');
    const privacyCloseBtn = document.getElementById('privacyClose');

    // Open modal
    privacyLink?.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    // Close modal - X button
    privacyClose?.addEventListener('click', () => {
        privacyModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal - "Am Înțeles" button
    privacyCloseBtn?.addEventListener('click', () => {
        privacyModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Close modal - Click outside
    privacyModal?.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Close modal - ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyModal.style.display === 'flex') {
            privacyModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        try {
            console.log('DOMContentLoaded event fired');
            initApp();
        } catch(error) {
            console.error('Error during initApp:', error);
            console.error('Error stack:', error.stack);
            alert('Error initializing app: ' + error.message);
        }
    });
} else {
    try {
        console.log('DOM already ready, calling initApp');
        initApp();
    } catch(error) {
        console.error('Error during initApp:', error);
        console.error('Error stack:', error.stack);
        alert('Error initializing app: ' + error.message);
    }
}

// Setup privacy modal after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPrivacyModal);
} else {
    setupPrivacyModal();
}

/**
 * Setup feedback modal functionality
 */
function setupFeedbackModal() {
    var feedbackBtn = document.getElementById('feedbackBtn');
    var feedbackModal = document.getElementById('feedbackModal');
    var feedbackClose = feedbackModal?.querySelector('.feedback-close');
    var feedbackText = document.getElementById('feedbackText');
    var feedbackSend = document.getElementById('feedbackSend');
    var feedbackCopy = document.getElementById('feedbackCopy');
    var starBtns = document.querySelectorAll('.star-btn');
    var selectedRating = 0;

    // Star rating selection
    starBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            selectedRating = parseInt(btn.dataset.rating);
            starBtns.forEach(function(b) {
                b.classList.toggle('selected', parseInt(b.dataset.rating) === selectedRating);
            });
        });
    });

    // Open modal
    feedbackBtn?.addEventListener('click', function() {
        feedbackModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    function closeFeedbackModal() {
        feedbackModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    feedbackClose?.addEventListener('click', closeFeedbackModal);

    feedbackModal?.addEventListener('click', function(e) {
        if (e.target === feedbackModal) closeFeedbackModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && feedbackModal?.style.display === 'flex') {
            closeFeedbackModal();
        }
    });

    // Build feedback message
    function buildFeedbackMessage() {
        var ratingEmojis = ['', '😞', '😐', '🙂', '😊', '🤩'];
        var feedbackType = document.querySelector('input[name="feedbackType"]:checked')?.value || 'sugestie';
        var message = feedbackText?.value || '';

        var text = 'Feedback Impozite Online\n';
        text += '========================\n\n';
        if (selectedRating > 0) {
            text += 'Rating: ' + ratingEmojis[selectedRating] + ' (' + selectedRating + '/5)\n';
        }
        text += 'Tip: ' + feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1) + '\n\n';
        text += 'Mesaj:\n' + message + '\n\n';
        text += '---\n';
        text += 'An fiscal selectat: ' + ACTIVE_TAX_YEAR + '\n';
        text += 'Trimis de la: ' + window.location.href;

        return text;
    }

    // Send email
    feedbackSend?.addEventListener('click', function() {
        var feedbackType = document.querySelector('input[name="feedbackType"]:checked')?.value || 'sugestie';
        var subject = 'Feedback Impozite Online - ' + feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1);
        var body = buildFeedbackMessage();
        var mailtoUrl = 'mailto:cybrrsoft@protonmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        window.location.href = mailtoUrl;
        closeFeedbackModal();
    });

    // Copy to clipboard
    feedbackCopy?.addEventListener('click', function() {
        var text = buildFeedbackMessage();
        navigator.clipboard.writeText(text).then(function() {
            showToast('Copiat în clipboard!');
        }).catch(function() {
            // Fallback for older browsers
            var textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('Copiat în clipboard!');
        });
    });
}

// Show toast notification
function showToast(message) {
    var existing = document.querySelector('.feedback-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'feedback-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.remove();
    }, 3000);
}

// Setup feedback modal after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFeedbackModal);
} else {
    setupFeedbackModal();
}
