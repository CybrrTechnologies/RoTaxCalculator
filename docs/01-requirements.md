# Requirements - RoTaxCalculator

## 🎯 Product Vision

Enable Romanian investors to **calculate taxes accurately** and **generate tax declarations effortlessly** for stocks, crypto, and real estate income.

## 👥 Target Users

### Primary Users
- **Romanian investors** (age 25-45)
- Invest in: stocks, ETFs, crypto, rental properties
- Tech-savvy, use multiple brokers (Romanian + foreign)
- Pain point: Complex tax calculations, fear of errors
- Need: Accurate tax calculation + Form 212 generation

### Secondary Users
- PFA (self-employed) with investment income
- Small business owners with side investments
- Expats investing while in Romania

## ✨ Core Features

### Phase 1: MVP (Weeks 1-8)

#### Input Investment Income
- [ ] Dividends
  - Domestic (Romanian companies)
  - Foreign (with tax credit calculation)
- [ ] Capital Gains
  - Romanian broker transactions (withholding at source)
  - Foreign broker transactions (self-declaration)
  - Loss carryforward tracking (7 years, 70% value)
- [ ] Crypto gains
  - FIFO cost basis calculation
  - Exemption tracking (<200 RON/transaction, <600 RON/year)
- [ ] Rental income
  - Gross rent input
  - Automatic forfeit calculation (30% in 2026)
- [ ] Interest income
  - Regular bank interest
  - Government bonds (exempt from tax & CASS)

#### Calculate Taxes Automatically
- [ ] Apply 2026 tax rates
  - 16% dividends
  - 16% crypto
  - 3-6% capital gains (Romanian brokers)
  - 16% capital gains (foreign brokers)
  - 7% effective rent tax
- [ ] Handle foreign tax credits
- [ ] Calculate loss carryforward
- [ ] Compute CASS (tiered: 0, 6SM, 12SM, 24SM)
- [ ] Real-time validation & warnings

#### Generate Reports
- [ ] Tax summary PDF
  - Breakdown by income type
  - Total taxes + CASS
  - Comparison vs previous year
- [ ] Instructions for Form 212 completion
- [ ] Export to JSON (for accountant)

#### Fill Declarația Unică 212
- [ ] API integration with PDF filling service
- [ ] Pre-fill all calculated values
- [ ] Handle conditional sections (appear/disappear based on income types)
- [ ] Download filled PDF form

### Phase 2: Enhanced Features (Weeks 9-16)

#### Import Transactions
- [ ] CSV upload support
  - XTB format
  - IBKR format
  - Trading212 format
  - Generic CSV with mapping
- [ ] Automatic categorization
  - Dividends vs capital gains
  - Foreign currency detection
- [ ] Currency conversion
  - Fetch BNR (National Bank) rates
  - Apply correct date rate

#### Multi-Year Tracking
- [ ] Store historical data (encrypted)
- [ ] Loss carryforward automatic tracking
- [ ] Year-over-year comparison
- [ ] Tax payment history

#### Tax Optimization Suggestions
- [ ] "Hold X more days for lower tax rate"
- [ ] "You can offset loss against gain"
- [ ] "Consider tax-loss harvesting before Dec 31"
- [ ] "Switch to accumulating ETFs for tax efficiency"

### Phase 3: Premium Features (Months 4-6)

- [ ] Cloud sync (end-to-end encrypted)
- [ ] Family accounts (multiple users, shared storage)
- [ ] Export formats for accountants
- [ ] Push notifications
  - Tax deadline reminders
  - New tax law changes
- [ ] ANAF API integration (when available)
  - Direct form submission
  - Payment verification

## 📱 Platform Requirements

### iOS (Primary Platform)
- **Minimum**: iPhone 12, iOS 16+
- **Recommended**: iPhone 13+, iOS 17+
- **Features**:
  - Native UI (SwiftUI)
  - FaceID/TouchID for sensitive data
  - Share Sheet integration
  - Files app integration
  - Dark mode support

### Android (Secondary)
- **Minimum**: Android 10 (API 29+)
- **Recommended**: Android 12+
- **Features**:
  - Material Design 3
  - Biometric authentication
  - Share integration
  - Files integration

### Web (Tertiary)
- **Browsers**: Chrome 90+, Safari 15+, Firefox 88+
- **Features**:
  - Responsive design (desktop + tablet)
  - Progressive Web App (PWA)
  - Offline mode (ServiceWorker + IndexedDB)

## 🎨 UX Principles

### Simplicity
- Minimal input fields with smart defaults
- Progressive disclosure (advanced options hidden initially)
- Clear visual hierarchy

### Instant Feedback
- Real-time calculations (update as user types)
- Inline validation warnings
- Progress indicators for multi-step flows

### Transparency
- Show formula for every tax calculation
- Explain why CASS is 0 or X amount
- Reference relevant tax law articles

### Offline-First
- Core calculations work without internet
- Sync when connection available
- Clear offline/online status

### Privacy
- Data stored locally by default
- Optional cloud sync (encrypted)
- No tracking without consent
- Export/delete all data option

## 🚫 Non-Goals (for MVP)

These are explicitly OUT OF SCOPE for initial launch:

- ❌ Business tax calculations (SRL profit tax, micro-enterprise)
- ❌ PFA activity income tax (only investment income)
- ❌ Property tax calculations (IMI, not investment income)
- ❌ Payroll tax calculations (salary taxes)
- ❌ Direct bank/broker API integration (future phase)
- ❌ Tax filing directly to ANAF (API not public yet)
- ❌ Multi-language support (Romanian only initially)
- ❌ Desktop native apps (Web works on desktop)

## 🔮 Future Development (Post-MVP)

Potential features to add after successful MVP launch:

### Additional Income Types (Phase 2)
- **PFA (Persoană Fizică Autorizată)** - Self-employed professional income
  - Business/service income calculations
  - Optional CAS (pension) contributions (25%)
  - Mandatory CASS (health insurance) on different base
  - Quarterly advance payments

- **CIM (Conventii Individuale de Munca)** - Employment income
  - Salary tax calculator (10% income tax)
  - Employee contributions (CAS 25%, CASS 10%)
  - Personal deductions (basic, dependents)
  - Meal vouchers, bonuses

- **IF (Întreprinzător Individual)** - Individual Entrepreneur
  - 1% revenue tax (with employees) or 3% (no employees)
  - **Important limitations:**
    - Revenue cap: €500,000/year (~2.5M RON) - must convert to SRL if exceeded
    - Employee limit: Maximum 8 employees
    - Mandatory contributions: CAS 25% + CASS 10% on minimum 12 MW base (~17,000 RON/year)
    - Mandatory accounting (double-entry, ~2,400 RON/year for accountant)
    - VAT registration required if revenue > €88,500
    - Cannot combine with full-time employment
    - Total minimum cost: ~19,400 RON/year even with zero revenue
  - **Best for**: High-margin businesses (>70% profit margin) with revenue under €500k
  - **Break-even**: IF better than PFA when expenses < 70% of revenue
  - **Calculator features needed:**
    - Revenue input
    - Employee count (affects 1% vs 3% rate)
    - Automatic CAS/CASS calculation on 12 MW base
    - Warning when approaching €500k cap
    - Cost comparison vs PFA

- **Copyright/Royalties** - Creative income
  - 20% forfeit deduction
  - 10% tax on net
  - CASS applicable

- **Agricultural Income** - Farming
  - Norm-based taxation
  - Simplified regime

### CASS Aggregation
- Combine all income types (investment + PFA + employment + copyright)
- Single CASS calculation on total net income
- Handle cases where employer already pays CASS (exemptions)

### Premium Features
- Multi-year tax planning (compare 2025 vs 2026)
- What-if scenarios ("What if I earn X more?")
- Tax optimization suggestions
- Historical data tracking
- Export to Excel/PDF for accountant
- Import from broker statements (CSV/PDF parsing)

## 📊 Success Metrics

### MVP Launch (Month 2)
- **Users**: 100 beta testers
- **Accuracy**: <5% error rate (vs manual calculation)
- **Rating**: 4.5+ stars (App Store / Play Store)
- **Speed**: <30 seconds to complete full calculation
- **Completion rate**: >80% users fill all sections

### Month 6 Targets
- **Active users**: 1,000+
- **Retention**: 40% MAU (Monthly Active Users)
- **Paid subscribers**: 50+ (premium features)
- **NPS**: >50 (Net Promoter Score)
- **ROI**: Time saved > subscription cost

### Key Metrics to Track
- Calculation completion rate
- Error reports (calculation bugs)
- Feature usage (which calculators used most)
- Drop-off points (where users abandon)
- Support requests (where users need help)

## 🔒 Privacy & Security

### Data Handling
- **Local-first**: Calculations happen on device (Rust WASM/native)
- **No server storage**: Unless user opts into cloud sync
- **Encryption**: All cloud data encrypted (AES-256)
- **Minimal data**: Only necessary fields stored

### Compliance
- **GDPR compliant**: EU data protection rules
- **Data export**: User can download all data (JSON)
- **Right to deletion**: User can delete all data permanently
- **No tracking**: No Google Analytics or similar without consent
- **Open about data**: Privacy policy in plain language

### Security Measures
- **Local encryption**: Sensitive data encrypted on device
- **Biometric auth**: FaceID/TouchID for app access
- **Secure transmission**: HTTPS only, certificate pinning
- **Code signing**: Verified app integrity
- **Regular updates**: Security patches within 48h

## 💰 Monetization Strategy

### Freemium Model

**Free Tier** (Always free):
- Basic tax calculations (all income types)
- Manual Form 212 completion (instructions provided)
- PDF summary report
- 1 year of data storage (local)

**Premium Tier** ($5/month or $50/year):
- Automatic Form 212 fill & download
- Transaction CSV import (unlimited)
- Multi-year tracking (unlimited history)
- Cloud sync (encrypted)
- Priority support (24h response)
- Tax optimization suggestions
- Early access to new features

### Revenue Projections
```
Month 6: 1,000 users
  → 10% conversion = 100 paid
  → $5/month × 100 = $500/month
  → $6,000/year

Year 2: 10,000 users
  → 15% conversion = 1,500 paid
  → $5/month × 1,500 = $7,500/month
  → $90,000/year
```

### Alternative Revenue Streams (Future)
- Affiliate partnerships with Romanian brokers
- B2B licensing (accountants, tax advisors)
- White-label version for financial institutions

## 🗓️ Development Timeline

### Week 1-2: Learning
- Rust fundamentals (The Rust Book)
- Ownership, borrowing, lifetimes
- Async/await, error handling
- Rustlings exercises

### Week 3-4: Core Logic
- Implement all calculators
- Write comprehensive tests
- Define API contracts
- BNR API integration

### Week 5-6: iOS App
- SwiftUI interface
- UniFFI Rust integration
- Local storage (CoreData/SQLite)
- PDF generation

### Week 7-8: Testing & Polish
- Beta testing (friends, family)
- Bug fixes
- Performance optimization
- UI/UX refinements

### Week 9-10: Android
- Kotlin UI (Compose)
- UniFFI integration
- Testing

### Week 11-12: Web
- React frontend
- WASM integration
- PWA setup
- Testing

### Week 13-14: Backend
- Python FastAPI service
- PDF form filling (pypdf)
- Deploy to cloud (Fly.io)

### Week 15-16: Launch Prep
- App Store submission
- Play Store submission
- Marketing website
- Documentation
- **LAUNCH** 🚀

## 🎯 Definition of Done (MVP)

The MVP is complete when:

- [x] User can input all income types
- [x] Taxes calculate correctly (validated against ANAF examples)
- [x] CASS calculates correctly (all brackets tested)
- [x] PDF summary generates and downloads
- [x] Form 212 fills correctly (all sections)
- [x] iOS app passes App Store review
- [x] 10 beta users test successfully
- [x] <3 critical bugs reported
- [x] Documentation complete (user guide)
- [x] Privacy policy published
- [x] Support email/contact set up

---

**Next**: See [Tax Rules](02-tax-rules-romania-2026.md) for detailed tax calculation logic
