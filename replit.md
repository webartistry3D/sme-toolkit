# SMETools

A modern, mobile-friendly utility hub for entrepreneurs and small business owners. SMETools provides three essential business tools - all client-side with no login required.

## Overview

**Type**: Client-side React application  
**Stack**: React, TypeScript, TailwindCSS, shadcn/ui  
**Deployment**: Single-page application (SPA)  
**Data Storage**: localStorage (no backend/database needed)

## Features

### 1. Invoice Generator 🧾
- Create professional invoices with automatic calculations
- Multi-currency support (Dollar, Euro, Pound, Naira, Cedi)
- Dynamic line items with add/remove functionality
- Tax and discount calculations
- Optional business logo upload
- Payment information field
- PDF export (using jsPDF + html2canvas)
- Auto-save to localStorage

### 2. WhatsApp Link & QR Builder 💬
- Generate WhatsApp click-to-chat links
- Pre-fill message support
- QR code generation (using qrcode.react)
- Copy link to clipboard
- Download QR code as PNG
- Auto-save to localStorage

### 3. Profit Calculator 📊
- Calculate profit and profit margins
- Multi-currency support (Dollar, Euro, Pound, Naira, Cedi)
- Product cost, selling price, and expenses inputs
- Real-time profit calculations
- Suggested pricing at 30%, 40%, and 50% profit margins
- Auto-save to localStorage

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   └── examples/        # Component examples for development
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── InvoiceGenerator.tsx
│   │   ├── WhatsAppBuilder.tsx
│   │   └── ProfitCalculator.tsx
│   ├── lib/                 # Utilities
│   ├── App.tsx              # Main app with routing
│   └── index.css            # Global styles
server/                       # Minimal Express server (serves frontend only)
shared/                       # Shared types
```

## Recent Changes

**November 9, 2025**
- Added multi-currency support to Invoice Generator and Profit Calculator
- Currencies supported: Dollar ($), Euro (€), Pound (£), Naira (₦), Cedi (₵)
- Currency selection persists across sessions via localStorage
- All calculations and display values update based on selected currency

## Technical Details

### Dependencies
- **Core**: React, TypeScript, Wouter (routing)
- **UI**: TailwindCSS, shadcn/ui, Framer Motion
- **PDF Generation**: jspdf, html2canvas
- **QR Codes**: qrcode.react
- **Forms**: react-hook-form, zod

### Data Persistence
All tools use localStorage for client-side persistence:
- Invoice data: `localStorage.getItem('invoiceData')`
- WhatsApp data: `localStorage.getItem('whatsappData')`
- Calculator data: `localStorage.getItem('profitCalculatorData')`

No backend or database required - all data stays in the user's browser.

### Running the Application

```bash
npm run dev
```

The app runs on port 5000 with Vite's HMR for development.

## Design Philosophy

- **No login required**: Instant access to all tools
- **Privacy-first**: All data stored locally in browser
- **Mobile-friendly**: Responsive design for all screen sizes
- **Fast & simple**: No complex setups or configurations
- **Professional**: Clean business aesthetic with smooth animations

## User Preferences

- Clean, minimal business aesthetic
- Neutral backgrounds with primary blue accent
- Smooth card hover animations
- Professional typography (Inter font)
- Instant feedback via toast notifications
