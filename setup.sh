#!/bin/bash

# RoTaxCalculator - Local Setup Script for macOS
# Run this after downloading the project files from Claude

set -e  # Exit on error

echo "🚀 Setting up RoTaxCalculator locally..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if we're in the right place
if [[ ! -f "$SCRIPT_DIR/README.md" ]]; then
    echo "❌ Error: This script must be run from the RoTaxCalculator root directory"
    echo "   Current directory: $SCRIPT_DIR"
    exit 1
fi

echo "✅ Found project root: $SCRIPT_DIR"
echo ""

# Initialize git if not already initialized
if [[ ! -d ".git" ]]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - project structure from Claude"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi
echo ""

# Check for Rust installation
echo "🦀 Checking for Rust..."
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    echo "✅ Rust installed: $RUST_VERSION"
else
    echo "❌ Rust not found"
    echo ""
    echo "Would you like to install Rust now? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Installing Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
        source "$HOME/.cargo/env"
        echo "✅ Rust installed successfully"
    else
        echo "⏭️  Skipping Rust installation"
        echo "   You can install later with: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    fi
fi
echo ""

# Create .gitkeep files in empty directories
echo "📁 Creating .gitkeep files in empty directories..."
find . -type d -empty -exec touch {}/.gitkeep \;
echo "✅ .gitkeep files created"
echo ""

# Summary
echo "✨ Setup complete!"
echo ""
echo "📂 Project structure created in: $SCRIPT_DIR"
echo ""
echo "📋 Next steps:"
echo "   1. Open project in VS Code: code ."
echo "   2. Review docs/01-requirements.md"
echo "   3. Fill in docs/02-tax-rules-romania-2026.md with tax info from chat"
echo "   4. Upload docs/*.md files to Claude Project for AI assistance"
echo "   5. Start learning Rust: https://doc.rust-lang.org/book/"
echo ""
echo "🦀 When ready to start coding:"
echo "   cd src"
echo "   cargo init --name tax_calculator"
echo "   cargo build"
echo ""
echo "Happy coding! 🚀"
