# CryptoVault — Design System & UI Guidelines

## Design Direction

**Aesthetic:** Dark Glassmorphism — Refined & Mobile-First  
**Tone:** Premium, trustworthy, modern fintech  
**Memorable element:** Frosted glass cards floating over a deep animated gradient mesh background, with teal-green as the primary action color that glows on key interactions.

---

## Core Philosophy

- **Mobile-first** — every component is designed for 375px first, then scaled up
- **Touch-friendly** — minimum tap targets of 48px, bottom navigation on mobile
- **Data-forward** — numbers are the hero, always large and readable
- **Calm confidence** — no flashy gimmicks, just clean glass + subtle glow effects

---

## Color Palette

```css
:root {
  /* Backgrounds */
  --bg-base:        #080B14;   /* deepest background */
  --bg-surface:     #0D1117;   /* page background */
  --bg-card:        rgba(255, 255, 255, 0.04);  /* glass card fill */
  --bg-card-hover:  rgba(255, 255, 255, 0.07);
  --bg-input:       rgba(255, 255, 255, 0.06);

  /* Glass borders */
  --border-glass:   rgba(255, 255, 255, 0.08);
  --border-strong:  rgba(255, 255, 255, 0.14);

  /* Accent — Primary (Teal Green) */
  --accent-primary:       #00D4AA;
  --accent-primary-glow:  rgba(0, 212, 170, 0.20);
  --accent-primary-dim:   rgba(0, 212, 170, 0.10);

  /* Accent — Secondary (Electric Indigo) */
  --accent-secondary:     #6C63FF;
  --accent-secondary-glow: rgba(108, 99, 255, 0.20);

  /* Semantic */
  --color-success:  #00D4AA;
  --color-danger:   #FF4D6D;
  --color-warning:  #FFB547;
  --color-info:     #3B9EFF;

  /* Typography */
  --text-primary:   #F0F2F8;
  --text-secondary: #8B8FA8;
  --text-muted:     #4A4E6A;

  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #00D4AA 0%, #6C63FF 100%);
  --gradient-card:  linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%);
  --gradient-bg:    radial-gradient(ellipse at 20% 50%, rgba(108,99,255,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(0,212,170,0.06) 0%, transparent 60%);
}
```

---

## Typography

```css
/* Display / Hero numbers */
font-family: 'DM Mono', monospace;        /* balances, prices, amounts */

/* Headings */
font-family: 'Cabinet Grotesk', sans-serif;  /* page titles, section headers */

/* Body / UI */
font-family: 'Geist', sans-serif;          /* paragraphs, labels, buttons */
```

### Type Scale

| Role | Size (mobile) | Size (desktop) | Weight |
|---|---|---|---|
| Balance hero | 32px | 48px | 700 |
| Page title | 22px | 32px | 700 |
| Card title | 16px | 18px | 600 |
| Body | 14px | 15px | 400 |
| Label / caption | 12px | 12px | 500 |
| Monospace amount | 18px | 24px | 600 |

---

## Glass Card System

Every card uses the same base style:

```css
.glass-card {
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.glass-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-strong);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(0, 212, 170, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

### Card Variants

| Variant | Use case |
|---|---|
| `glass-card` | Default — stats, info |
| `glass-card--accent` | Active investment, highlighted plan |
| `glass-card--danger` | Failed transaction, error state |
| `glass-card--flat` | Table rows, list items |

---

## Layout — Mobile First

### Breakpoints
```css
/* Mobile  */ default (375px+)
/* Tablet  */ @media (min-width: 768px)
/* Desktop */ @media (min-width: 1024px)
/* Wide    */ @media (min-width: 1280px)
```

### Mobile Navigation
- **Bottom tab bar** (fixed) with 5 icons: Home, Deposit, Invest, History, Profile
- Tab bar has glass blur background + top border
- Active tab uses `--accent-primary` color + small dot indicator

### Desktop Navigation
- **Left sidebar** (240px wide) with logo, nav links, and user avatar at bottom
- Collapsible to icon-only on smaller desktops (64px)
- Main content area scrolls independently

### Page Layout (Mobile)
```
┌─────────────────────┐
│  Header (greeting + │
│  notification bell) │
├─────────────────────┤
│  Price ticker strip │
│  (BTC · ETH · USDT) │
├─────────────────────┤
│  Balance hero card  │
├─────────────────────┤
│  Coin balance cards │
│  (horizontal scroll)│
├─────────────────────┤
│  Active investments │
├─────────────────────┤
│  Recent txns list   │
├─────────────────────┤
│  Bottom nav bar     │
└─────────────────────┘
```

---

## Component Specs

### Balance Hero Card
- Full width, tall card (200px mobile / 240px desktop)
- Large monospace total balance in USD
- Gradient mesh background unique to this card
- Two CTA buttons below: `Deposit` (primary) + `Withdraw` (ghost)

### Coin Balance Cards
- Horizontal scroll row on mobile (3 cards: BTC / ETH / USDT)
- Each card: coin icon + symbol, balance in coin, balance in USD
- 2-column grid on desktop

### Price Ticker Strip
- Horizontal scrolling strip at top of dashboard
- Shows BTC, ETH, USDT prices + 24hr % change
- Green for positive, red for negative
- Auto-scrolls slowly on mobile (marquee style), static on desktop

### Stat Cards (Portfolio Summary)
- 3 cards in a row: Total Deposited / Total Returns / Active Plans
- Icon + label + value
- Subtle accent glow on the Returns card

### Investment Plan Cards
- Plan name + badge (e.g. "Popular")
- ROI % large and bold in accent color
- Duration, min amount, coin
- "Invest Now" button — full width on mobile
- 2-col grid on tablet, 3-col on desktop

### Transaction Row
- Coin icon + type label (Deposit / Withdrawal / ROI)
- Amount right-aligned in monospace
- Status badge: pill shape (Pending = yellow, Confirmed = green, Failed = red)
- Date below in muted text

---

## Buttons

```css
/* Primary */
.btn-primary {
  background: var(--accent-primary);
  color: #080B14;
  font-weight: 700;
  border-radius: 12px;
  padding: 14px 24px;
  box-shadow: 0 0 20px var(--accent-primary-glow);
  min-height: 48px;
}

/* Ghost */
.btn-ghost {
  background: var(--bg-input);
  border: 1px solid var(--border-glass);
  color: var(--text-primary);
  border-radius: 12px;
  padding: 14px 24px;
  min-height: 48px;
}

/* Danger */
.btn-danger {
  background: rgba(255, 77, 109, 0.12);
  border: 1px solid rgba(255, 77, 109, 0.3);
  color: var(--color-danger);
  border-radius: 12px;
  padding: 14px 24px;
  min-height: 48px;
}
```

---

## Animations & Motion

- **Page transitions:** fade + slide up (200ms ease-out)
- **Card hover:** scale(1.01) + border glow (150ms)
- **Number updates:** count-up animation when balance changes
- **Toast notifications:** slide in from top-right (desktop) / top-center (mobile)
- **Deposit status tracker:** animated progress dots
- **Price change flash:** brief green/red background flash on price update
- **Background:** very slow drifting gradient mesh (CSS animation, 30s loop, subtle)
- **Skeleton loaders:** shimmer effect on all cards while data loads

---

## Deposit Flow UI (Step by Step)

```
Step 1: Select Coin        → BTC / ETH / USDT pill selector
Step 2: Enter Amount       → Input with USD equivalent below
Step 3: Confirm            → Summary card + "Generate Address" button
Step 4: Send Crypto        → Wallet address + copy button + QR code card
                             Status tracker: Waiting → Confirming → Confirmed
Step 5: Confirmed          → Green success screen + balance updated
```

Progress shown as step dots at top of page.

---

## Status Badges

```
● Confirmed   → bg: rgba(0,212,170,0.12)  | text: #00D4AA  | border: rgba(0,212,170,0.3)
● Pending     → bg: rgba(255,181,71,0.12) | text: #FFB547  | border: rgba(255,181,71,0.3)
● Processing  → bg: rgba(59,158,255,0.12) | text: #3B9EFF  | border: rgba(59,158,255,0.3)
● Failed      → bg: rgba(255,77,109,0.12) | text: #FF4D6D  | border: rgba(255,77,109,0.3)
```

---

## Forms & Inputs

```css
.input {
  background: var(--bg-input);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--text-primary);
  font-size: 16px; /* prevents iOS zoom */
  min-height: 48px;
  width: 100%;
}

.input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-dim);
  outline: none;
}
```

- Labels always above inputs (never floating/placeholder-only)
- Error messages in `--color-danger` below the field
- Currency inputs show coin icon on the left, USD value below

---

## Landing Page Sections

1. **Hero** — Bold headline, subtext, two CTAs (Get Started + Watch Demo), animated background mesh
2. **Live Prices** — BTC / ETH / USDT live price cards
3. **How It Works** — 3 steps: Sign Up → Deposit → Earn (icon + title + description)
4. **Investment Plans** — Plan cards with ROI rates
5. **Why Us** — 4 feature cards: Security, Fast Payouts, 24/7 Support, Multi-coin
6. **Footer** — Logo, links, socials, disclaimer

---

## Mobile-Specific Rules

- Font size minimum **14px** everywhere (no smaller)
- All inputs minimum **48px** tall to prevent iOS zoom
- No hover-only states — everything must work on touch
- Bottom sheet modals instead of centered modals on mobile
- QR code must be large enough to scan (min 200x200px)
- Horizontal scrolling rows use `-webkit-overflow-scrolling: touch`
- Safe area insets respected: `padding-bottom: env(safe-area-inset-bottom)`

---

## Accessibility

- All interactive elements have visible focus states
- Color is never the only indicator (always paired with icon or text)
- Touch targets minimum 48x48px
- Contrast ratio minimum 4.5:1 for all text
- Loading states always communicated (skeleton + aria-busy)
