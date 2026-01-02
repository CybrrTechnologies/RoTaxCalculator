# RoTaxCalculator - Romanian Tax Calculator

**Web MVP**: Tax calculator for Romanian investors - dividends, capital gains, crypto, and rental income.

**Domain**: [impoziteonline.ro](https://impoziteonline.ro)

## 🎯 Current Features (Web MVP)

- Calculate taxes for dividends, capital gains, crypto, rent, and interest
- Automatic CASS calculation (stepped brackets: 6/12/24 MW)
- Multi-income support (combine multiple sources)
- Tax breakdown and summary
- Year comparison (2025 vs 2026)

## 🎯 Future Features

- Generate tax reports (PDF)
- Fill Declarația Unică 212 (Romanian tax form)
- Broker statement import (IBKR, Trading212)
- ANAF XML export

## 🛠️ Tech Stack

- **Core Logic**: Rust (shared across all platforms)
- **iOS**: Swift + SwiftUI + UniFFI
- **Android**: Kotlin + Jetpack Compose + UniFFI
- **Web**: React + Rust WASM
- **Backend**: Python FastAPI (PDF filling service)

## 📁 Project Structure

```
RoTaxCalculator/
├── docs/              # 📄 Documentation (Markdown files)
├── src/               # 🦀 Rust core logic (shared)
├── mobile/
│   ├── ios/          # 📱 iOS app (Swift + SwiftUI)
│   └── android/      # 🤖 Android app (Kotlin + Compose)
├── web/              # 🌐 Web app (React + WASM)
├── backend/          # 🐍 PDF service (Python FastAPI)
└── resources/        # 📋 Assets, PDF templates
```

## 🚀 Getting Started

### Prerequisites

- **Rust** 1.75+ - [Install here](https://rustup.rs)
- **Xcode** 15+ (for iOS development)
- **Android Studio** (for Android development)
- **Node.js** 20+ (for Web)
- **Python** 3.11+ (for Backend)

### Installation

```bash
# Navigate to project
cd ~/Documents/SideProjects/RoTaxCalculator

# Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build Rust core
cd src
cargo build

# Run tests
cargo test
```

## 📖 Documentation

All documentation is in the [`docs/`](docs/) folder:

- [Requirements](docs/01-requirements.md) - Product vision & features
- [Tax Rules 2026](docs/02-tax-rules-romania-2026.md) ⭐ - Complete tax legislation reference
- [Architecture](docs/03-architecture.md) - Technical design
- [Rust Learning Plan](docs/04-rust-learning-plan.md) - Learning roadmap
- [API Contracts](docs/05-api-contracts.md) - Data structures & API design
- [Data Models](docs/06-data-models.md) - Rust types & models
- [Implementation Log](docs/07-implementation-log.md) 📊 - Daily progress tracking
- [Deployment](docs/08-deployment.md) - Deployment guide
- [SEO Setup](docs/09-seo-setup.md) - SEO configuration
- [SRL Procedures](docs/10-srl-procedures.md) - Company registration
- [ONRC County Contacts](docs/11-onrc-county-contacts.md) - Registry contacts
- [Market Sizing Romania](docs/12-market-sizing-romania.md) 📊 - Target market analysis
- [Web Release Plan](docs/13-web-release-plan.md) - Web MVP launch strategy

## 📊 Current Status

**Phase**: Web MVP - Live at [impoziteonline.ro](https://impoziteonline.ro)

✅ **Completed**:
- Tax calculator (dividends, capital gains, crypto, rent, interest)
- CASS calculator (6/12/24 MW brackets)
- Multi-income entry system
- Year selector (2025/2026)
- Number input validation
- LocalStorage persistence

See [Implementation Log](docs/07-implementation-log.md) for detailed progress.

## 🗓️ Roadmap

**Phase 1 - Web MVP (Current)**:
- ✅ Basic tax calculator
- ✅ CASS calculation
- ✅ Multi-income support
- 🔄 Analytics integration
- 🔄 Feedback widget
- 📋 SEO optimization

**Phase 2 - Enhanced Features**:
- PDF Form 212 generation
- ANAF XML export
- Broker statement import
- User accounts/save history

**Phase 3 - Mobile Apps** (Future):
- iOS app (SwiftUI + UniFFI)
- Android app (Kotlin + UniFFI)

## 🧪 Testing

```bash
# Rust unit tests
cd src
cargo test

# iOS tests
cd mobile/ios
xcodebuild test -scheme TaxCalculator

# Integration tests
cargo test --test integration_tests
```

## 📄 License

Private project - All rights reserved

## 👤 Author

iOS Engineer with 10+ years experience, learning Rust for cross-platform development.

**Contact**: [Your contact info]

---

**Last Updated**: January 2025
