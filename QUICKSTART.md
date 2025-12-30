# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Download Project Files

You're reading this, so you've already downloaded the files! ✅

### Step 2: Run Setup Script

```bash
cd ~/Documents/SideProjects/RoTaxCalculator
./setup.sh
```

This will:
- Initialize git repository
- Check/install Rust
- Create necessary files

### Step 3: Fill in Tax Rules

Open `docs/02-tax-rules-romania-2026.md` and copy the comprehensive tax rules from your Claude chat conversation.

### Step 4: Upload Docs to Claude Project

1. Go to Claude.ai
2. Navigate to your RoTaxCalculator project
3. Click "Add content"
4. Upload all files from `docs/` folder
5. Now Claude will have context about your project!

### Step 5: Start Learning Rust

```bash
# Open The Rust Book
open https://doc.rust-lang.org/book/

# Or install mdBook to read offline
cargo install mdbook
git clone https://github.com/rust-lang/book.git
cd book
mdbook serve --open
```

**Recommended path**:
- Week 1: Chapters 1-10 (core concepts)
- Week 2: Chapters 11-15 (testing, cargo, smart pointers)
- Week 3: Chapters 16-17 (concurrency, async)

### Step 6: Initialize Rust Project

```bash
cd src
cargo init --name tax_calculator --lib
cargo build
```

### Step 7: Write Your First Calculator

Create `src/calculators/dividends.rs`:

```rust
/// Calculate domestic dividend tax
pub fn calculate_domestic_dividend_tax(amount: f64, rate: f64) -> f64 {
    amount * rate
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_domestic_dividend() {
        let tax = calculate_domestic_dividend_tax(10000.0, 0.16);
        assert_eq!(tax, 1600.0);
    }
}
```

Run test:
```bash
cargo test
```

## 📚 Learning Resources

### Rust Fundamentals
- [The Rust Book](https://doc.rust-lang.org/book/) - **Start here**
- [Rustlings](https://github.com/rust-lang/rustlings) - Interactive exercises
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) - Code examples

### Cross-Platform
- [UniFFI Guide](https://mozilla.github.io/uniffi-rs/) - iOS/Android bindings
- [Rust WASM Book](https://rustwasm.github.io/docs/book/) - Web integration

### Community
- [r/rust](https://reddit.com/r/rust) - Daily discussions
- [Rust Discord](https://discord.gg/rust-lang) - Live help
- [This Week in Rust](https://this-week-in-rust.org/) - Weekly newsletter

## 🛠️ Development Workflow

### Daily Routine

```bash
# Morning: Pull latest (if using git remote)
cd ~/Documents/SideProjects/RoTaxCalculator
git pull

# Open in editor
code .  # VS Code

# Write code, run tests
cd src
cargo test
cargo build

# End of day: Commit progress
git add .
git commit -m "Implemented dividend calculator"

# Update implementation log
open docs/07-implementation-log.md
# Add today's progress
```

### Recommended Tools

**Editor**:
- VS Code + rust-analyzer extension (free, excellent)
- RustRover (JetBrains, paid but powerful)
- Cursor (AI-enhanced, great for learning)

**Markdown**:
- Typora (WYSIWYG, $15 one-time)
- Obsidian (free, knowledge base)
- VS Code (free, built-in preview)

## ⏱️ Time Commitment

**Week 1-2: Learning** (10-15 hours)
- 1-2 hours/day reading Rust Book
- 30 min/day Rustlings exercises
- Weekend: 4-6 hours coding practice

**Week 3-4: Building** (15-20 hours)
- Core logic implementation
- Unit tests
- Integration with APIs

**Week 5+: Platforms** (10-15 hours/week)
- iOS UI (your expertise - fast!)
- Android UI (contractor or learn)
- Web (React + WASM)

## 🎯 First Week Goals

By end of Week 1, you should have:

- [x] Rust installed and working
- [x] Read Rust Book chapters 1-10
- [x] Completed 50% of Rustlings
- [x] Written a simple CLI calculator (dividends + CASS)
- [x] All tests passing
- [x] Understand ownership & borrowing intuitively

**This is achievable with 1-2 hours/day!**

## 💡 Tips for Success

### Learning Rust
1. **Don't fight the borrow checker** - it's teaching you memory safety
2. **Write tests first** - TDD helps understand types
3. **Use `cargo clippy`** - catches common mistakes
4. **Ask Claude** - I can explain Rust errors in Swift terms!

### Staying Motivated
1. **Track progress** - Update implementation log daily
2. **Celebrate small wins** - Each test passing is progress
3. **Focus on learning** - Not just shipping (long-term investment)
4. **Connect with community** - r/rust is very welcoming

### When Stuck
1. Read the error message carefully (Rust errors are helpful!)
2. Ask Claude (show me the error, I'll explain in Swift terms)
3. Search docs.rs (official Rust documentation)
4. Check r/rust or Discord

## 🐛 Common Issues

### "Cannot borrow as mutable"
This is ownership. In Swift terms: trying to modify while another reference exists.

**Solution**: Use `.clone()` or restructure to avoid simultaneous borrows.

### "Expected X, found Y"
Type mismatch. Rust is strict about types.

**Solution**: Use `.into()`, explicit conversion, or fix the type.

### Cargo build slow
First build compiles all dependencies (slow). Incremental builds are fast.

**Solution**: Be patient on first `cargo build`. Subsequent builds are 5-10 seconds.

## 📞 Getting Help

- **Claude**: Ask me anything! I have context about your project via uploaded docs
- **r/rust**: Post questions, very helpful community
- **Discord**: Real-time help
- **Stack Overflow**: Search existing Q&A

## ✅ Checklist

Before moving to next phase, ensure:

- [ ] Rust installed (`rustc --version` works)
- [ ] Git initialized (`git log` shows commits)
- [ ] Docs folder populated (especially 02-tax-rules)
- [ ] Docs uploaded to Claude Project
- [ ] Rust Book chapters 1-5 read
- [ ] First Rust program compiles
- [ ] Understand ownership basics

---

**Ready? Let's build something amazing! 🚀**

Open `docs/01-requirements.md` to see full product vision.

Open `docs/07-implementation-log.md` to start tracking progress.
