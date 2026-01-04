# RoTaxCalculator - Web App (Basic Draft)

Romanian Tax Calculator for Investors - Simple HTML/JavaScript version

## Features

- **Real-time Calculation**:
  - Results update instantly as you type
  - No need to click "Calculate" button
  - Immediate feedback on tax amounts

- **Tax Calculations** for 2026 (Legea 239/2025):
  - Dividends (domestic & foreign with tax credits)
  - Capital Gains (Romanian & foreign brokers)
  - Cryptocurrency (with exemptions)
  - Rental Income (forfeit system)
  - Bank Interest

- **CASS Calculation** (Health Insurance):
  - Automatic bracket detection
  - Tiered contribution system

- **Auto-save**:
  - All inputs saved to browser localStorage
  - Data persists between sessions
  - No data loss if browser closes

- **Print to PDF**:
  - Clean print layout (Ctrl+P / Cmd+P)
  - Works as PDF export

## How to Use

### 1. Open the App

**Method 1: Double-click**
```bash
# Just double-click on index.html in Finder
# Opens in your default browser
```

**Method 2: From terminal**
```bash
cd ~/Documents/SideProjects/RoTaxCalculator/web
open index.html
```

**Method 3: With a local server (recommended for testing)**
```bash
# Using Python 3
cd ~/Documents/SideProjects/RoTaxCalculator/web
python3 -m http.server 8000

# Open browser to: http://localhost:8000
```

### 2. Enter Your Income

Start typing in any field - results update **instantly as you type**:

- **Dividends**: Enter gross amounts (before tax)
- **Capital Gains**: Separate Romanian vs foreign brokers
- **Crypto**: Total gains and exempt amounts
- **Rent**: Annual gross rental income
- **Interest**: Bank interest (excludes gov bonds)

**Results appear automatically** showing:
- Tax breakdown by income type
- CASS contribution amount
- Total amount due
- Payment deadline (May 25, 2026)

### 3. Review Results

Results update in real-time as you modify values.

Click **"Vezi Rezultate ↓"** button to scroll to results section (optional).

### 4. Save as PDF

Click **"Printează / Salvează PDF"** or use Ctrl+P (Cmd+P on Mac)

Select "Save as PDF" in the print dialog

## Files

```
web/
├── index.html       # Main page (forms + results)
├── styles.css       # Styling (responsive design)
├── calculator.js    # Tax calculation logic
├── app.js           # UI logic + localStorage
└── README.md        # This file
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Safari 15+
- Firefox 88+

**Requires JavaScript enabled**

## Data Storage

All data is stored **locally in your browser** using localStorage:

- **Location**: Browser's local storage (not on any server)
- **Privacy**: Never leaves your computer
- **Persistence**: Survives browser restarts
- **Size limit**: ~5MB (more than enough for this app)

**To clear data:**
1. Click "Șterge Tot" button in the app, OR
2. Clear browser data (localStorage) manually

## Tax Calculation Rules

Based on **Romanian Tax Code 2026** (Legea 239/2025):

### Tax Rates
| Income Type | Rate |
|-------------|------|
| Dividends | 16% |
| Capital Gains (Foreign) | 16% |
| Capital Gains (RO <365d) | 6% |
| Capital Gains (RO ≥365d) | 3% |
| Crypto | 16% |
| Rent (effective) | 7% |
| Bank Interest | 10% |

### CASS Brackets (2026)
Minimum wage: 4,325 RON/month = 51,900 RON/year

| Net Income Range | CASS Amount |
|------------------|-------------|
| < 25,950 RON | 0 RON |
| 25,950 - 51,900 RON | 2,595 RON |
| 51,900 - 103,800 RON | 5,190 RON |
| > 103,800 RON | 10,380 RON |

## Limitations

This is a **basic draft** with some limitations:

1. **No CSV import** (manual entry only)
2. **No multi-year tracking** (single year only)
3. **No data export** (except print to PDF)
4. **No Form 212 generation** (shows summary only)
5. **No currency conversion** (enter amounts in RON)
6. **No automatic BNR rate fetching**

These features require a more complex stack (backend, database, etc.)

## Example Usage

### Scenario: Mixed Investment Income

**Inputs:**
- Domestic dividends: 30,000 RON
- Foreign broker capital gains: 20,000 RON
- Crypto gains: 5,000 RON (no exempt)
- Rental income: 24,000 RON/year

**Results:**
- Dividend tax: 4,800 RON (16%)
- Capital gains tax: 3,200 RON (16%)
- Crypto tax: 800 RON (16%)
- Rental tax: 1,680 RON (7% effective)
- **Total tax: 10,480 RON**

**CASS:**
- Net income: 67,000 RON
- Bracket: 12-24 SM
- **CASS: 5,190 RON**

**TOTAL DUE: 15,670 RON** (by May 25, 2026)

## Troubleshooting

### Data not saving?
- Check if browser allows localStorage
- Try a different browser
- Make sure you're not in private/incognito mode

### Calculations seem wrong?
- Verify inputs (use gross amounts, not net)
- Check tax rates match 2026 legislation
- Review CASS bracket thresholds

### Print doesn't look good?
- Use Chrome/Edge for best PDF output
- Check "Print backgrounds" option
- Use landscape if needed

## Disclaimer

**This is an unofficial calculator for estimation purposes only.**

For complex situations or official filing, consult:
- A certified Romanian accountant (expert contabil)
- ANAF official resources (www.anaf.ro)

Tax laws can change. Always verify current regulations.

## Next Steps

To add more features, consider upgrading to:

**Option 1: Add Python backend (Flask)**
- PDF form filling (Form 212)
- CSV import & parsing
- BNR API integration

**Option 2: Full React + Rust WASM**
- As designed in original architecture
- Shared logic with mobile apps
- Better performance

## License

Private project - All rights reserved

---

**Last Updated**: January 2026
**Tax Year**: 2026 (Legea 239/2025)
