/**
 * RoTaxCalculator - Application Logic
 * Handles UI interactions, localStorage, and result display
 */

// localStorage key prefixes (year will be appended)
const STORAGE_KEY_PREFIX = 'rotax_calculator_data';
const STORAGE_KEY_SECTIONS_PREFIX = 'rotax_calculator_sections';
const STORAGE_KEY_ACTIVE_YEAR = 'rotax_calculator_active_year';
const STORAGE_KEY_SECTION_ORDER = 'rotax_calculator_section_order';

/**
 * Get year-specific storage keys
 */
function getStorageKeys(year) {
    return {
        data: `${STORAGE_KEY_PREFIX}_${year}`,
        sections: `${STORAGE_KEY_SECTIONS_PREFIX}_${year}`
    };
}

// Section configuration
const SECTIONS = {
    dividends: {
        toggleId: 'enableDividends',
        inputs: ['domesticDividends', 'foreignDividends', 'foreignTaxPaid']
    },
    capitalGains: {
        toggleId: 'enableCapitalGains',
        inputs: ['roGainsShort', 'roGainsLong', 'foreignGains', 'foreignLosses', 'priorYearLosses']
    },
    crypto: {
        toggleId: 'enableCrypto',
        inputs: ['cryptoGains', 'cryptoExempt']
    },
    rental: {
        toggleId: 'enableRental',
        inputs: ['rentalIncome']
    },
    interest: {
        toggleId: 'enableInterest',
        inputs: ['bankInterest']
    }
};

// Form input IDs
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

/**
 * Initialize the app
 */
function initApp() {
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

        updateYearInfo(year);
    }

    // Setup tax year selector
    setupTaxYearSelector();

    // Setup section toggles
    setupSectionToggles();

    // Setup drag and drop for sections
    setupDragAndDrop();

    // Load saved section order
    loadSectionOrder();

    // Load saved data from localStorage (for current year)
    loadSavedData();

    // Setup event listeners
    setupEventListeners();

    // Auto-calculate if there's saved data
    autoCalculate();

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

            // Load data for the new year
            loadSavedData();

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
    let html = `<p><strong>An Fiscal:</strong> ${config.year}<br>`;
    html += `<strong>Salariu Minim:</strong> ${config.minimumWage.toLocaleString('ro-RO')} RON/lună`;

    // Add note on separate line if it exists
    if (config.minimumWageNote) {
        html += `<br><small style="color: #64748b;">${config.minimumWageNote}</small>`;
    }

    html += `<br><strong>Legislație:</strong> ${config.legislation}</p>`;

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
 */
function updateFormFieldRates(rates) {
    const config2025 = TAX_CONFIG[2025].rates;

    // Update dividend rate
    const dividendSmall = document.querySelector('label[for="domesticDividends"] + input + small');
    dividendSmall.innerHTML =
        `Taxa: ${(rates.DIVIDEND * 100).toFixed(0)}% (reținută la sursă)${createRateComparison(ACTIVE_TAX_YEAR, rates.DIVIDEND, config2025.DIVIDEND)}`;

    // Update capital gains rates - Romanian broker short term
    const roGainsShortSmall = document.querySelector('label[for="roGainsShort"] + input + small');
    roGainsShortSmall.innerHTML =
        `Taxa: ${(rates.CAPITAL_GAINS_RO_SHORT * 100).toFixed(0)}% (reținută la sursă)${createRateComparison(ACTIVE_TAX_YEAR, rates.CAPITAL_GAINS_RO_SHORT, config2025.CAPITAL_GAINS_RO_SHORT)}`;

    // Update capital gains rates - Romanian broker long term
    const roGainsLongSmall = document.querySelector('label[for="roGainsLong"] + input + small');
    roGainsLongSmall.innerHTML =
        `Taxa: ${(rates.CAPITAL_GAINS_RO_LONG * 100).toFixed(0)}% (reținută la sursă)${createRateComparison(ACTIVE_TAX_YEAR, rates.CAPITAL_GAINS_RO_LONG, config2025.CAPITAL_GAINS_RO_LONG)}`;

    // Update crypto rate
    const cryptoSmall = document.querySelector('label[for="cryptoGains"] + input + small');
    cryptoSmall.innerHTML =
        `Taxa: ${(rates.CRYPTO * 100).toFixed(0)}% (scutire: <200 RON/tranzacție ȘI <600 RON/an)${createRateComparison(ACTIVE_TAX_YEAR, rates.CRYPTO, config2025.CRYPTO)}`;

    // Update rent rate
    const rentSmall = document.getElementById('rentalRateText');
    if (rentSmall) {
        const forfeitRate = ACTIVE_TAX_YEAR === 2025 ? 20 : 30;
        rentSmall.innerHTML =
            `Taxa efectivă: ${(rates.RENT_EFFECTIVE * 100).toFixed(0)}% (forfet ${forfeitRate}% + 10% pe net)${createRateComparison(ACTIVE_TAX_YEAR, rates.RENT_EFFECTIVE, config2025.RENT_EFFECTIVE)}`;
    }

    // Update foreign dividends (if exists)
    const foreignDivSmall = document.querySelector('label[for="foreignDividends"] + input + small');
    if (foreignDivSmall && !foreignDivSmall.textContent.includes('Credit')) {
        foreignDivSmall.innerHTML =
            `Taxa: ${(rates.DIVIDEND * 100).toFixed(0)}%${createRateComparison(ACTIVE_TAX_YEAR, rates.DIVIDEND, config2025.DIVIDEND)}`;
    }

    // Update foreign capital gains
    const foreignGainsSmall = document.querySelector('label[for="foreignGains"] + input + small');
    if (foreignGainsSmall && !foreignGainsSmall.textContent.includes('compensate')) {
        foreignGainsSmall.innerHTML =
            `Taxa: ${(rates.CAPITAL_GAINS_FOREIGN * 100).toFixed(0)}%${createRateComparison(ACTIVE_TAX_YEAR, rates.CAPITAL_GAINS_FOREIGN, config2025.CAPITAL_GAINS_FOREIGN)}`;
    }
}

/**
 * Setup section toggle functionality
 */
function setupSectionToggles() {
    Object.entries(SECTIONS).forEach(([sectionName, config]) => {
        const toggle = document.getElementById(config.toggleId);
        const section = document.querySelector(`[data-section="${sectionName}"]`);
        const content = section.querySelector('.section-content');
        const collapseIcon = section.querySelector('.collapse-icon');
        const inputs = config.inputs.map(id => document.getElementById(id));

        // Checkbox event - enable/disable section
        toggle.addEventListener('change', function() {
            const isChecked = this.checked;

            // Enable/disable inputs
            inputs.forEach(input => {
                if (input) {
                    input.disabled = !isChecked;
                    // Don't clear value - keep it for when user re-enables
                }
            });

            // If unchecked, collapse and gray out
            if (!isChecked) {
                content.classList.add('collapsed');
                section.classList.add('disabled');
                collapseIcon.classList.remove('expanded');
            } else {
                // If checked, expand and enable
                content.classList.remove('collapsed');
                section.classList.remove('disabled');
                collapseIcon.classList.add('expanded');
            }

            // Save section states
            saveSectionStates();

            // Recalculate
            autoCalculate();
        });

        // Arrow click - toggle expand/collapse (independent of checkbox)
        collapseIcon.addEventListener('click', function(e) {
            e.stopPropagation();

            // Only allow collapse/expand if section is enabled
            if (toggle.checked) {
                const isExpanded = collapseIcon.classList.contains('expanded');

                if (isExpanded) {
                    content.classList.add('collapsed');
                    collapseIcon.classList.remove('expanded');
                } else {
                    content.classList.remove('collapsed');
                    collapseIcon.classList.add('expanded');
                }
            } else {
                // If not enabled, enable it on arrow click
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change'));
            }
        });

        // Label click - enables checkbox if not checked
        const label = section.querySelector('.section-header label');
        label.addEventListener('click', function(e) {
            if (!toggle.checked) {
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change'));
            }
        });
    });
}

/**
 * Setup event listeners for form interactions
 */
function setupEventListeners() {
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
}

/**
 * Get all form input values (only from enabled sections)
 */
function getFormData() {
    const data = {};

    INPUT_IDS.forEach(id => {
        const input = document.getElementById(id);
        if (input && !input.disabled) {
            // Only include values from enabled inputs
            const value = parseFloat(input.value) || 0;
            data[id] = value;
        } else {
            // Set disabled inputs to 0
            data[id] = 0;
        }
    });

    return data;
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
 * Save section states (enabled/disabled) to localStorage (for current active year)
 */
function saveSectionStates() {
    const states = {};
    Object.entries(SECTIONS).forEach(([sectionName, config]) => {
        const toggle = document.getElementById(config.toggleId);
        states[sectionName] = toggle.checked;
    });
    const keys = getStorageKeys(ACTIVE_TAX_YEAR);
    localStorage.setItem(keys.sections, JSON.stringify(states));
    console.log(`Section states saved for year ${ACTIVE_TAX_YEAR}`);
}

/**
 * Load saved data from localStorage (for current active year)
 */
function loadSavedData() {
    const keys = getStorageKeys(ACTIVE_TAX_YEAR);

    // First, reset all sections to default (unchecked/collapsed)
    Object.entries(SECTIONS).forEach(([sectionName, config]) => {
        const toggle = document.getElementById(config.toggleId);
        const section = document.querySelector(`[data-section="${sectionName}"]`);
        const content = section.querySelector('.section-content');
        const collapseIcon = section.querySelector('.collapse-icon');

        toggle.checked = false;
        content.classList.add('collapsed');
        section.classList.add('disabled');
        collapseIcon.classList.remove('expanded');

        // Disable inputs
        config.inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) input.disabled = true;
        });
    });

    // Clear all form values
    INPUT_IDS.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = '';
        }
    });

    // Load section states for this year
    const savedStates = localStorage.getItem(keys.sections);
    if (savedStates) {
        try {
            const states = JSON.parse(savedStates);
            Object.entries(SECTIONS).forEach(([sectionName, config]) => {
                const toggle = document.getElementById(config.toggleId);
                const section = document.querySelector(`[data-section="${sectionName}"]`);
                const content = section.querySelector('.section-content');

                if (states[sectionName]) {
                    const collapseIcon = section.querySelector('.collapse-icon');

                    toggle.checked = true;
                    content.classList.remove('collapsed');
                    section.classList.remove('disabled');
                    collapseIcon.classList.add('expanded');

                    // Enable inputs
                    config.inputs.forEach(inputId => {
                        const input = document.getElementById(inputId);
                        if (input) input.disabled = false;
                    });
                }
            });
            console.log(`Section states loaded for year ${ACTIVE_TAX_YEAR}`);
        } catch (error) {
            console.error('Error loading section states:', error);
        }
    }

    // Load form data for this year
    const savedData = localStorage.getItem(keys.data);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);

            INPUT_IDS.forEach(id => {
                const input = document.getElementById(id);
                if (input && data[id] !== undefined) {
                    input.value = data[id] || '';
                }
            });

            console.log(`Form data loaded for year ${ACTIVE_TAX_YEAR}`);
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

/**
 * Clear all form data
 */
function handleClear() {
    if (confirm('Sigur doriți să ștergeți toate datele introduse?')) {
        // Clear form inputs
        INPUT_IDS.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.value = '';
            }
        });

        // Uncheck and collapse all sections
        Object.entries(SECTIONS).forEach(([sectionName, config]) => {
            const toggle = document.getElementById(config.toggleId);
            const section = document.querySelector(`[data-section="${sectionName}"]`);
            const content = section.querySelector('.section-content');

            toggle.checked = false;
            content.classList.add('collapsed');
            section.classList.add('disabled');

            // Disable inputs
            config.inputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) input.disabled = true;
            });
        });

        // Clear localStorage for current year only
        const keys = getStorageKeys(ACTIVE_TAX_YEAR);
        localStorage.removeItem(keys.data);
        localStorage.removeItem(keys.sections);

        // Hide results
        document.getElementById('results').classList.add('hidden');

        console.log(`Form data cleared for year ${ACTIVE_TAX_YEAR}`);
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

    if (grandTotal > 0) {
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
        rateCell.textContent = tax.rate;
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
    document.getElementById('cassExplanation').textContent = cass.explanation;

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

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
