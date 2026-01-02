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
            html += '  <label for="domesticDividends_' + entryId + '">Dividende Românești (RON brut)</label>';
            html += '  <input type="number" id="domesticDividends_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="domesticDividends" step="0.01" min="0" placeholder="0.00">';
            html += '  <small>Taxa: ' + (rates.DIVIDEND * 100).toFixed(0) + '% (reținută la sursă)' + divComparison + '</small>';
            html += '</div>';
            html += '<div class="form-group">';
            html += '  <label for="foreignDividends_' + entryId + '">Dividende Străine (RON brut)</label>';
            html += '  <input type="number" id="foreignDividends_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignDividends" step="0.01" min="0" placeholder="0.00">';
            html += '</div>';
            html += '<div class="form-group">';
            html += '  <label for="foreignTaxPaid_' + entryId + '">Taxa Plătită în Străinătate (RON)</label>';
            html += '  <input type="number" id="foreignTaxPaid_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignTaxPaid" step="0.01" min="0" placeholder="0.00">';
            html += '  <small>Credit fiscal disponibil (max ' + (rates.DIVIDEND * 100).toFixed(0) + '%)</small>';
            html += '</div>';
            return html;

        case 'capitalGains':
            var cgShortComparison = prevRates ? createRateComparison(year, rates.CAPITAL_GAINS_RO_SHORT, prevRates.CAPITAL_GAINS_RO_SHORT) : '';
            var cgLongComparison = prevRates ? createRateComparison(year, rates.CAPITAL_GAINS_RO_LONG, prevRates.CAPITAL_GAINS_RO_LONG) : '';
            var html2 = '';
            html2 += '<h4 style="margin: 0 0 12px 0; font-size: 1em; color: var(--text-muted);">Broker Românesc (XTB, Tradeville, BT Trade)</h4>';
            html2 += '<div class="form-group">';
            html2 += '  <label for="roGainsShort_' + entryId + '">Câștig &lt; 365 zile (RON)</label>';
            html2 += '  <input type="number" id="roGainsShort_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="roGainsShort" step="0.01" min="0" placeholder="0.00">';
            html2 += '  <small>Taxa: ' + (rates.CAPITAL_GAINS_RO_SHORT * 100).toFixed(0) + '% (reținută la sursă)' + cgShortComparison + '</small>';
            html2 += '</div>';
            html2 += '<div class="form-group">';
            html2 += '  <label for="roGainsLong_' + entryId + '">Câștig ≥ 365 zile (RON)</label>';
            html2 += '  <input type="number" id="roGainsLong_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="roGainsLong" step="0.01" min="0" placeholder="0.00">';
            html2 += '  <small>Taxa: ' + (rates.CAPITAL_GAINS_RO_LONG * 100).toFixed(0) + '% (reținută la sursă)' + cgLongComparison + '</small>';
            html2 += '</div>';
            var cgForeignComparison = prevRates ? createRateComparison(year, rates.CAPITAL_GAINS_FOREIGN, prevRates.CAPITAL_GAINS_FOREIGN) : '';
            html2 += '<h4 style="margin: 16px 0 12px 0; font-size: 1em; color: var(--text-muted);">Broker Străin (IBKR, Trading212, eToro)</h4>';
            html2 += '<div class="form-group">';
            html2 += '  <label for="foreignGains_' + entryId + '">Câștiguri Totale (RON)</label>';
            html2 += '  <input type="number" id="foreignGains_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignGains" step="0.01" min="0" placeholder="0.00">';
            html2 += '  <small>Taxa: ' + (rates.CAPITAL_GAINS_FOREIGN * 100).toFixed(0) + '% (declari și plătești tu)' + cgForeignComparison + '</small>';
            html2 += '</div>';
            html2 += '<div class="form-group">';
            html2 += '  <label for="foreignLosses_' + entryId + '">Pierderi Anul Curent (RON)</label>';
            html2 += '  <input type="number" id="foreignLosses_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="foreignLosses" step="0.01" min="0" placeholder="0.00">';
            html2 += '  <small>Se pot compensa cu câștigurile</small>';
            html2 += '</div>';
            html2 += '<div class="form-group">';
            html2 += '  <label for="priorYearLosses_' + entryId + '">Pierderi Reportate din Anii Trecuți (RON)</label>';
            html2 += '  <input type="number" id="priorYearLosses_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="priorYearLosses" step="0.01" min="0" placeholder="0.00">';
            html2 += '  <small>Se pot folosi 70% din valoare (până la 7 ani)</small>';
            html2 += '</div>';
            return html2;

        case 'crypto':
            var cryptoComparison = prevRates ? createRateComparison(year, rates.CRYPTO, prevRates.CRYPTO) : '';
            var html3 = '';
            html3 += '<div class="form-group">';
            html3 += '  <label for="cryptoGains_' + entryId + '">Câștiguri Totale Criptomonede (RON)</label>';
            html3 += '  <input type="number" id="cryptoGains_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="cryptoGains" step="0.01" min="0" placeholder="0.00">';
            html3 += '  <small>Taxa: ' + (rates.CRYPTO * 100).toFixed(0) + '%' + cryptoComparison + '</small>';
            html3 += '</div>';
            html3 += '<div class="form-group checkbox-group">';
            html3 += '  <input type="checkbox" id="cryptoExempt_' + entryId + '" class="income-field-checkbox" data-entry="' + entryId + '" data-field="cryptoExempt">';
            html3 += '  <label for="cryptoExempt_' + entryId + '">Toate tranzacțiile sunt sub prag de scutire (&lt;200 RON/tranzacție ȘI &lt;600 RON/an)</label>';
            html3 += '</div>';
            return html3;

        case 'rental':
            var forfeitRate = ACTIVE_TAX_YEAR === 2025 ? 20 : 30;
            var rentComparison = prevRates ? createRateComparison(year, rates.RENT_EFFECTIVE, prevRates.RENT_EFFECTIVE) : '';
            var html4 = '';
            html4 += '<div class="form-group">';
            html4 += '  <label for="rentalIncome_' + entryId + '">Chirii Anuale Brute (RON)</label>';
            html4 += '  <input type="number" id="rentalIncome_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="rentalIncome" step="0.01" min="0" placeholder="0.00">';
            html4 += '  <small>Taxa efectivă: ' + (rates.RENT_EFFECTIVE * 100).toFixed(0) + '% (forfet ' + forfeitRate + '% + 10% pe net)' + rentComparison + '</small>';
            html4 += '</div>';
            return html4;

        case 'interest':
            var html5 = '';
            html5 += '<div class="form-group">';
            html5 += '  <label for="bankInterest_' + entryId + '">Dobânzi Bancare Brute (RON)</label>';
            html5 += '  <input type="number" id="bankInterest_' + entryId + '" class="income-field" data-entry="' + entryId + '" data-field="bankInterest" step="0.01" min="0" placeholder="0.00">';
            html5 += '  <small>Taxa: 10% (reținută la sursă). Exclud titluri de stat (Fidelis, Tezaur)</small>';
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

    // Auto-show and expand section when first entry is added
    if (incomeEntries[sectionName].length === 1) {
        var section = document.querySelector('[data-section="' + sectionName + '"]');
        if (section) {
            var content = section.querySelector('.section-content');
            var collapseIcon = section.querySelector('.collapse-icon');

            section.style.display = '';
            section.classList.remove('disabled');
            content.classList.remove('collapsed');
            if (collapseIcon) {
                collapseIcon.classList.add('expanded');
            }

            updateEmptyStateVisibility();
            saveSectionStates();
        }
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
