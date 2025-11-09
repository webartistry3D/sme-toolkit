# SMETools Design Guidelines

## Design Approach
**System-Based Approach**: Following Tailwind's default design patterns with Material Design principles for utility-focused business tools. The design prioritizes clarity, efficiency, and professional credibility over visual experimentation.

**Core Principles**:
- Clarity first: Every element serves a functional purpose
- Professional minimalism: Clean, trustworthy business aesthetic
- Efficiency: Quick task completion with minimal friction
- Consistency: Predictable patterns across all three tools

---

## Typography

**Font Family**: Inter or DM Sans via Google Fonts (professional, highly readable)

**Type Scale**:
- Hero/H1: text-4xl md:text-5xl, font-bold
- H2 (Tool Titles): text-3xl md:text-4xl, font-bold
- H3 (Section Headers): text-2xl, font-semibold
- H4 (Card Titles): text-xl, font-semibold
- Body: text-base, font-normal
- Small/Labels: text-sm, font-medium
- Button Text: text-base, font-semibold

---

## Layout System

**Spacing Units**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Card spacing: p-6 to p-8
- Section spacing: py-12 to py-16
- Element gaps: gap-4 to gap-6

**Containers**:
- Max width: max-w-7xl mx-auto
- Page padding: px-4 md:px-6 lg:px-8
- Tool forms: max-w-3xl mx-auto

---

## Component Library

### Landing Page Dashboard
**Hero Section**:
- Compact header with logo/icon + "SMETools" title
- Tagline: "Smart tools for everyday business tasks"
- Clean, centered layout (py-12 to py-16)
- No large hero image - focus on immediate tool access

**Tool Cards Grid**:
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Each card: rounded-xl, shadow-md hover:shadow-xl transition
- Card structure: Large emoji icon (text-5xl), tool title, 2-line description, "Open Tool →" link
- Generous card padding (p-8)
- Subtle elevation changes on hover

### Navigation
**Header** (all pages):
- Sticky top navigation (sticky top-0 z-50)
- Logo/title left, back button for tool pages
- Minimal height (h-16)

### Forms (Invoice Generator, Profit Calculator)
**Input Fields**:
- Standard text/number inputs with labels above
- Rounded corners (rounded-lg)
- Visible borders with focus states
- Spacing: space-y-4 between fields
- Helper text where needed (text-sm)

**Dynamic Lists** (Invoice items):
- Add/Remove buttons with clear icons
- Bordered sections for each item (border rounded-lg p-4)
- Subtle dividers between entries

**Results Display**:
- Highlighted summary box (border-2 rounded-lg p-6)
- Large, bold totals
- Breakdown of calculations in organized rows

### WhatsApp Link & QR Builder
**Two-Column Layout** (desktop):
- Left: Input form
- Right: Generated output (link + QR code)
- Stack vertically on mobile

**QR Code Display**:
- Centered in bordered container (border-2 rounded-lg p-8)
- Generated QR code size: 256x256px
- Download button directly below

### Buttons
**Primary CTAs**:
- Rounded (rounded-lg)
- Bold text (font-semibold)
- Generous padding (px-6 py-3)
- Full width on mobile (w-full md:w-auto)

**Secondary Actions**:
- Outlined style (border-2)
- Same sizing as primary

**Icon Buttons** (copy, download):
- Compact square buttons (p-2 to p-3)
- Icon from Heroicons

### Utility Elements
**Copy-to-clipboard**:
- Input field + copy button combination
- Success toast notification on copy

**File Upload** (Logo in invoice):
- Dashed border dropzone (border-2 border-dashed rounded-lg)
- Preview thumbnail when uploaded

---

## Animations
- Card hover: scale-105 transition-transform duration-200
- Button hover: Tailwind's built-in hover states
- No page transitions or scroll animations
- Loading states: Simple spinner for PDF generation

---

## Images
**Landing Page**: No hero image. Use large emoji icons (🧾 💬 📊) at 4-5rem size for visual interest on tool cards.

**Invoice Generator**: Optional logo upload preview (max 120x120px, object-contain).