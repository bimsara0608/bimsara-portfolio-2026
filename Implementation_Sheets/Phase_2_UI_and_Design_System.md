# Phase 2: UI and Design System (Velisse + Apple Glass)

## 2.1 Design System Tokens
**Goal:** Implement the locked-in design spec (Velisse editorial + Apple Glass nav).
- **Typography:** 
  - Install and configure `Poppins` font via `next/font/google`.
  - Set global font variables for Bold (headings), Regular (body), Medium (meta).
- **Color Palette:**
  - Define CSS variables in `globals.css`:
    - `--bg-primary: #F5F5F0` (Off-white)
    - `--text-primary: #1A1A1A`
    - `--text-secondary: #6B6B6B`
    - `--accent: #141414`
- **Component Styling (Sharp Corners):**
  - Set default border-radius to `2px` for cards (sharp, editorial look).
  - Define thin borders: `border: 1px solid #E0E0E0`.

## 2.2 Apple Frosted Glass Utilities
**Goal:** Implement the specific glass effects for the navbar and dark footer.
- **CSS Utility Classes:**
  ```css
  .glass-nav {
    background: rgba(245, 245, 240, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .glass-input-dark {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  ```

## 2.3 Core Layout Components
**Goal:** Build the persistent UI elements.
- **Sticky Navbar:**
  - Logo ("Bimsara") left, links right.
  - Apply `.glass-nav` class.
  - Implement mobile hamburger menu (clean, full-screen overlay).
- **Footer:**
  - Dark background (`#141414`), white text.
  - Newsletter input using `.glass-input-dark`.
  - Links grid (Socials, Quick Links).
- **Page Transitions:**
  - Add Framer Motion for subtle fade-in on page load. No heavy animations.

## 2.4 Reusable UI Components
**Goal:** Build the building blocks for the portfolio.
- **Project Card:** Flat white background, thin border, sharp corners. Hover state adds subtle `box-shadow` and `transform: translateY(-2px)`.
- **Stat Item:** Clean text with thin border separators.
- **Pill Badge:** For category tags. Flat background, thin border, rounded corners (`border-radius: 24px`).
