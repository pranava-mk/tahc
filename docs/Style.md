# tahc Design System Style Guide

## Overview

This comprehensive style guide documents the design system used by, a hyper-minimalist productivity and collaboration platform. tahc's design philosophy emphasizes minimalism, clarity, and exceptional readability. The design system is built on clean typography, a carefully curated color palette, generous white space, and consistent spacing patterns.

**Design Principles:**
- Minimalist aesthetic with focus on content
- High readability and accessibility
- Consistent spacing and rhythm
- Clean, modern interface patterns
- Responsive and adaptive design

---

## Color Palette

### Light Mode Colors

tahc's light mode uses a warm, slightly off-white background to reduce eye strain while maintaining high contrast for text.

#### Primary Colors

**Default Background:**
- `#FFFFFF` - Pure white (used for cards and elevated surfaces)
- `#FFFEFC` - Warm off-white (primary page background)
- Usage: Main canvas, content areas, clean backgrounds

**Default Text:**
- `#37352F` - Dark warm gray (primary text)
- `#373530` - Alternative primary text
- Usage: Body text, headings, primary content

#### Secondary Colors

**Gray:**
- Text: `#787774` - Medium gray
- Background: `#F1F1EF` - Light gray
- Usage: Secondary text, disabled states, subtle backgrounds

**Brown:**
- Text: `#976D57` - Warm brown
- Background: `#F3EEEE` - Light beige
- Usage: Subtle emphasis, warm accents

**Orange:**
- Text: `#CC782F` - Rich orange
- Background: `#F8ECDF` - Soft peach
- Usage: Warnings, highlights, calls to attention

**Yellow:**
- Text: `#C29343` - Golden yellow
- Background: `#FAF3DD` - Pale yellow
- Usage: Highlights, notes, important items

**Green:**
- Text: `#548164` - Forest green
- Background: `#EEF3ED` - Mint green
- Usage: Success states, confirmations, positive actions

**Blue:**
- Text: `#487CA5` - Ocean blue
- Background: `#E9F3F7` - Sky blue
- Usage: Links, information, primary actions

**Purple:**
- Text: `#8A67AB` - Deep purple
- Background: `#F6F3F8` - Lavender
- Usage: Special features, creative elements

**Pink:**
- Text: `#B35488` - Rose pink
- Background: `#F9F2F5` - Blush pink
- Usage: Decorative elements, accents

**Red:**
- Text: `#C4554D` - Warm red
- Background: `#FAECEC` - Light rose
- Usage: Errors, destructive actions, alerts

#### Border and Divider Colors

**Light Mode:**
- `#EEEEEC` - Light borders and dividers
- Usage: Separators, subtle borders, component outlines

### Dark Mode Colors

tahc's dark mode provides reduced eye strain for low-light environments while maintaining readability.

#### Primary Colors (Dark Mode)

**Default Background:**
- `#191919` - Deep charcoal (primary background)
- `#2A2A2A` - Slightly lighter charcoal (borders/dividers)
- Usage: Main canvas, component backgrounds

**Default Text:**
- `#D4D4D4` - Light gray
- Usage: Body text, headings

#### Accent Colors (Dark Mode)

**Blue:**
- Text: `#447ACB` - Bright blue
- Background: `#1F282D` - Dark blue-gray
- Usage: Links, primary actions

**Green:**
- Text: `#4F9768` - Vibrant green
- Background: `#242B26` - Dark green-gray
- Usage: Success states, confirmations

**Red (Nothing OS Accent - Optional):**
- Primary: `#FF3B30` - Vibrant red
- Hover: `#FF5247` - Lighter vibrant red
- Background: `rgba(255, 59, 48, 0.1)` - Subtle red tint
- Usage: Critical actions, delete buttons, error states, Nothing OS aesthetic

**CSS Variables:**
```css
--accent-red: #FF3B30;
--accent-red-hover: #FF5247;
--accent-red-bg: rgba(255, 59, 48, 0.1);
```

### Semantic Colors

**Success:**
- Light: `#548164` (text) / `#EEF3ED` (background)
- Dark: `#4F9768` (text) / `#242B26` (background)

**Error:**
- Light: `#C4554D` (text) / `#FAECEC` (background)
- Dark: Similar adjusted values

**Warning:**
- Light: `#CC782F` (text) / `#F8ECDF` (background)

**Info:**
- Light: `#487CA5` (text) / `#E9F3F7` (background)
- Dark: `#447ACB` (text) / `#1F282D` (background)

---

## Typography

### Font Families

tahc uses **Inter** as its primary typeface, with comprehensive system font fallbacks for optimal cross-platform rendering.

**Primary Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
```

**Inter Font:**
- Designer: Rasmus Andersson (2017)
- Type: Open-source neo-grotesque sans-serif
- Optimized for: Screen readability, UI text, small sizes
- Characteristics: Tall x-height, open apertures, wide character spacing

**System Fallbacks:**
- macOS/iOS: San Francisco (via -apple-system)
- Windows: Segoe UI
- Android: Roboto (via BlinkMacSystemFont)
- Generic: Helvetica, Arial

### Built-in Font Options

tahc provides three font style options for content:

1. **Sans (Default)** - Inter and system sans-serif
2. **Serif** - For formal or traditional content
3. **Mono** - Monospace for code and technical content

### Monospace Font Stack (Nothing OS Inspired)

For technical elements, timestamps, and dot-matrix aesthetic touches:

**Mono Font Stack:**
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace;
```

**Usage Contexts:**
- Timestamps (e.g., "Last saved 2:45 PM")
- Character counts and metadata
- Technical indicators
- Loading states with numbers
- Terminal-style outputs

**Styling:**
```css
.mono-element {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace;
  font-weight: 400;
  letter-spacing: 0.05em;
  font-feature-settings: 'tnum', 'zero'; /* Tabular numbers, slashed zero */
}
```

### Font Weights

**Available Weights:**
- Regular: `400` - Body text, standard content
- Medium: `500` - Subtle emphasis, UI elements
- Semi-Bold: `600` - Subheadings, important labels
- Bold: `700` - Headings, strong emphasis

### Type Scale

tahc employs a harmonious type scale for hierarchy and readability.

**Heading Scale:**
- H1: `32px` - `40px` (depending on context)
- H2: `24px` - `28px`
- H3: `18px` - `20px`
- H4: `16px`

**Body Text:**
- Large: `16px` - Default body text
- Medium: `14px` - Secondary text, UI labels
- Small: `12px` - Captions, metadata
- Tiny: `11px` - Supplementary information

### Line Height

**Standard Line Heights:**
```css
line-height: 1.5; /* Default for body text */
```

**Heading Line Heights:**
- H1: `1.2` - `1.3`
- H2: `1.25` - `1.35`
- H3: `1.3` - `1.4`
- Body: `1.5` - `1.6`

### Letter Spacing (Nothing OS Refined)

**CSS Custom Properties:**
```css
--tracking-tighter: -0.02em;   /* Large headings (H1, hero text) */
--tracking-tight: -0.01em;      /* Headings (H2, H3) */
--tracking-normal: 0;           /* Body text */
--tracking-wide: 0.01em;        /* UI elements, buttons */
--tracking-wider: 0.02em;       /* Labels, all-caps text */
```

**Usage Guidelines:**
- **Tighter (-0.02em):** Large display text (32px+) for premium feel
- **Tight (-0.01em):** Standard headings for elegance
- **Normal (0):** Body copy for optimal readability
- **Wide (0.01em):** Buttons, UI labels for clarity
- **Wider (0.02em):** Small caps, technical labels

**Examples:**
```css
h1 { letter-spacing: var(--tracking-tighter); }
h2, h3 { letter-spacing: var(--tracking-tight); }
p { letter-spacing: var(--tracking-normal); }
button { letter-spacing: var(--tracking-wide); }
.label-caps { letter-spacing: var(--tracking-wider); text-transform: uppercase; }
```

### Typography Usage Examples

```html
<!-- Primary Heading -->
<h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
           font-size: 32px;
           font-weight: 700;
           line-height: 1.2;
           color: #37352F;">
  Welcome to tahc
</h1>

<!-- Body Text -->
<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
          color: #37352F;">
  A connected workspace where better, faster work happens.
</p>

<!-- Secondary Text -->
<span style="font-size: 14px;
             font-weight: 400;
             color: #787774;">
  Last edited 2 hours ago
</span>
```

---

## Spacing System (Nothing OS Refined Grid)

tahc uses a consistent spacing system based on the **8px grid system**, with micro-spacing (2px, 6px) for precision and Nothing OS-inspired tight layouts.

### Enhanced Spacing Scale

**Complete Scale (with micro-spacing):**
```css
--space-0: 0px;              /* No spacing */
--space-px: 1px;             /* Hairline borders */
--space-0_5: 2px;            /* Ultra-tight spacing */
--space-1: 4px;              /* Micro spacing */
--space-1_5: 6px;            /* Between micro and small */
--space-2: 8px;              /* Extra small */
--space-3: 12px;             /* Small */
--space-4: 16px;             /* Medium (base unit) */
--space-5: 20px;             /* Between medium and large */
--space-6: 24px;             /* Large */
--space-7: 28px;             /* Between large and XL */
--space-8: 32px;             /* Extra large */
--space-10: 40px;            /* XXL */
--space-12: 48px;            /* XXXL */
--space-14: 56px;            /* Huge */
--space-16: 64px;            /* Extra huge */
--space-20: 80px;            /* Massive */
--space-24: 96px;            /* Ultra */
```

### Spacing Philosophy

**Tight spacing for minimalism (Nothing OS inspired):**
- List items: `8px` vertical gap
- Inline elements: `4px` - `8px`
- Button padding: `8px × 16px` (compact)
- Input padding: `10px × 12px`
- Card content: `16px` - `24px`

**Generous breathing room (Notion inspired):**
- Between sections: `32px` - `48px`
- Page margins: `40px` - `60px`
- Modal padding: `32px`
- Hero spacing: `64px` - `96px`

### Spacing Applications

**Padding:**
- Button padding: `8px 16px` (vertical horizontal)
- Card padding: `16px` to `24px`
- Container padding: `20px` to `40px`
- Page padding: `40px 20px 60px 20px` (top right bottom left)

**Margin:**
- Component margin: `8px` to `16px`
- Section margin: `24px` to `32px`
- Page section margin: `40px` to `60px`

**Gap (for Flexbox/Grid):**
- Tight: `8px`
- Normal: `12px` to `16px`
- Loose: `24px` to `32px`

### Spacing Examples

```html
<!-- Button with standard padding -->
<button style="padding: 8px 16px; margin: 8px 0;">
  Click me
</button>

<!-- Card with standard spacing -->
<div style="padding: 24px; margin: 16px 0;">
  <h3 style="margin-bottom: 12px;">Card Title</h3>
  <p style="margin-bottom: 16px;">Card content goes here</p>
  <button style="margin-top: 8px;">Action</button>
</div>

<!-- Container with page-level spacing -->
<div style="padding: 40px 20px 60px 20px;">
  <!-- Page content -->
</div>
```

---

## Component Styles

### Buttons

tahc's buttons are clean, minimal, and emphasize clarity and action.

#### Primary Button (Black CTA)

**Visual Description:** Solid black background with white text, subtle rounded corners, minimal shadow.

**Styles:**
```css
.btn-primary {
  background-color: #000000;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.btn-primary:hover {
  background-color: #1a1a1a;
  transform: translateY(-1px);
}

.btn-primary:active {
  background-color: #000000;
  transform: translateY(0);
}

.btn-primary:focus {
  outline: 2px solid #487CA5;
  outline-offset: 2px;
}
```

**HTML Example:**
```html
<button class="btn-primary">Get tahc free</button>
```

#### Secondary Button (Outline)

**Visual Description:** Transparent background with border, dark text, matches primary in size.

**Styles:**
```css
.btn-secondary {
  background-color: transparent;
  color: #37352F;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid #37352F;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: #F1F1EF;
  border-color: #000000;
}

.btn-secondary:active {
  background-color: #EEEEEC;
}

.btn-secondary:focus {
  outline: 2px solid #487CA5;
  outline-offset: 2px;
}
```

**HTML Example:**
```html
<button class="btn-secondary">Request a demo</button>
```

#### Link Button

**Visual Description:** Text-only button with subtle underline on hover.

**Styles:**
```css
.btn-link {
  background: none;
  color: #487CA5;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

.btn-link:hover {
  color: #447ACB;
  text-decoration: underline;
}

.btn-link:focus {
  outline: 2px solid #487CA5;
  outline-offset: 2px;
  border-radius: 4px;
}
```

#### Button States

**Disabled:**
```css
.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Loading:**
```css
.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}
```

### Forms and Inputs

#### Text Input

**Visual Description:** Clean rectangular input with subtle border, focus state with blue outline.

**Styles:**
```css
.input-text {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  color: #37352F;
  background-color: #FFFFFF;
  border: 1px solid #EEEEEC;
  border-radius: 4px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-text::placeholder {
  color: #787774;
}

.input-text:hover {
  border-color: #37352F;
}

.input-text:focus {
  outline: none;
  border-color: #487CA5;
  box-shadow: 0 0 0 3px rgba(72, 124, 165, 0.1);
}

.input-text:disabled {
  background-color: #F1F1EF;
  color: #787774;
  cursor: not-allowed;
}
```

**HTML Example:**
```html
<input type="text" class="input-text" placeholder="Enter your email">
```

#### Input with Label

```html
<div style="margin-bottom: 16px;">
  <label style="display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #37352F;">
    Email address
  </label>
  <input type="email"
         class="input-text"
         placeholder="you@example.com">
</div>
```

#### Error State

```css
.input-text.error {
  border-color: #C4554D;
}

.input-text.error:focus {
  border-color: #C4554D;
  box-shadow: 0 0 0 3px rgba(196, 85, 77, 0.1);
}

.input-error-message {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #C4554D;
}
```

**HTML Example:**
```html
<div>
  <input type="email" class="input-text error" value="invalid-email">
  <span class="input-error-message">Please enter a valid email address</span>
</div>
```

#### Success State

```css
.input-text.success {
  border-color: #548164;
}

.input-text.success:focus {
  border-color: #548164;
  box-shadow: 0 0 0 3px rgba(84, 129, 100, 0.1);
}
```

#### Textarea

```css
.textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  color: #37352F;
  background-color: #FFFFFF;
  border: 1px solid #EEEEEC;
  border-radius: 4px;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.textarea:focus {
  outline: none;
  border-color: #487CA5;
  box-shadow: 0 0 0 3px rgba(72, 124, 165, 0.1);
}
```

#### Checkbox

```css
.checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #EEEEEC;
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

.checkbox:hover {
  border-color: #37352F;
}

.checkbox:checked {
  background-color: #487CA5;
  border-color: #487CA5;
}

.checkbox:checked::after {
  content: "";
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

**HTML Example:**
```html
<label style="display: flex; align-items: center; cursor: pointer;">
  <input type="checkbox" class="checkbox">
  <span style="margin-left: 8px; font-size: 14px; color: #37352F;">
    I agree to the terms and conditions
  </span>
</label>
```

### Cards

**Visual Description:** Clean containers with subtle borders, optional shadows, rounded corners.

#### Basic Card

```css
.card {
  background-color: #FFFFFF;
  border: 1px solid #EEEEEC;
  border-radius: 8px;
  padding: 24px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

**HTML Example:**
```html
<div class="card">
  <h3 style="font-size: 18px;
             font-weight: 600;
             margin-bottom: 12px;
             color: #37352F;">
    Card Title
  </h3>
  <p style="font-size: 14px;
            line-height: 1.5;
            color: #787774;
            margin-bottom: 16px;">
    This is the card content. It can contain text, images, and other elements.
  </p>
  <button class="btn-primary">Learn more</button>
</div>
```

#### Colored Background Card (Bento Style)

```css
.card-bento {
  border-radius: 12px;
  padding: 32px;
  border: none;
  position: relative;
  overflow: hidden;
}

.card-bento.teal {
  background-color: #E0F2F1;
}

.card-bento.red {
  background-color: #FAECEC;
}

.card-bento.blue {
  background-color: #E9F3F7;
}

.card-bento.yellow {
  background-color: #FAF3DD;
}
```

**HTML Example:**
```html
<div class="card-bento blue">
  <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">
    Collaborate seamlessly
  </h2>
  <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
    Work together in real-time with your team.
  </p>
  <img src="feature-image.png" alt="Feature" style="width: 100%; border-radius: 8px;">
</div>
```

### Navigation

#### Top Navigation Bar

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #EEEEEC;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #37352F;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: #F1F1EF;
  color: #000000;
}

.nav-link.active {
  color: #487CA5;
  background-color: #E9F3F7;
}
```

**HTML Example:**
```html
<nav class="navbar">
  <div style="display: flex; align-items: center; gap: 24px;">
    <img src="logo.svg" alt="tahc" style="height: 24px;">
    <div class="nav-links">
      <a href="#" class="nav-link active">Product</a>
      <a href="#" class="nav-link">Teams</a>
      <a href="#" class="nav-link">Learn</a>
      <a href="#" class="nav-link">Build</a>
    </div>
  </div>
  <div style="display: flex; gap: 12px;">
    <button class="btn-secondary">Log in</button>
    <button class="btn-primary">Get tahc free</button>
  </div>
</nav>
```

#### Dropdown Menu

```css
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #FFFFFF;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 8px 0;
  margin-top: 4px;
  z-index: 1000;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  color: #37352F;
  text-decoration: none;
  font-size: 14px;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #F1F1EF;
}
```

**HTML Example:**
```html
<div class="dropdown">
  <a href="#" class="nav-link">Product ▼</a>
  <div class="dropdown-content">
    <a href="#" class="dropdown-item">Features</a>
    <a href="#" class="dropdown-item">Templates</a>
    <a href="#" class="dropdown-item">Pricing</a>
  </div>
</div>
```

### Callout / Alert Blocks

**Visual Description:** Colored containers used for notes, warnings, and information.

```css
.callout {
  display: flex;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  margin: 16px 0;
}

.callout-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.callout.info {
  background-color: #E9F3F7;
  color: #37352F;
}

.callout.success {
  background-color: #EEF3ED;
  color: #37352F;
}

.callout.warning {
  background-color: #F8ECDF;
  color: #37352F;
}

.callout.error {
  background-color: #FAECEC;
  color: #37352F;
}
```

**HTML Example:**
```html
<div class="callout info">
  <span class="callout-icon">ℹ️</span>
  <div>This is an informational callout with helpful details.</div>
</div>

<div class="callout success">
  <span class="callout-icon">✓</span>
  <div>Your changes have been saved successfully!</div>
</div>

<div class="callout warning">
  <span class="callout-icon">⚠️</span>
  <div>Please review these items before proceeding.</div>
</div>

<div class="callout error">
  <span class="callout-icon">✕</span>
  <div>An error occurred. Please try again.</div>
</div>
```

### Badges / Tags

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.badge.default {
  background-color: #F1F1EF;
  color: #37352F;
}

.badge.blue {
  background-color: #E9F3F7;
  color: #487CA5;
}

.badge.green {
  background-color: #EEF3ED;
  color: #548164;
}

.badge.red {
  background-color: #FAECEC;
  color: #C4554D;
}

.badge.yellow {
  background-color: #FAF3DD;
  color: #C29343;
}
```

**HTML Example:**
```html
<span class="badge default">Draft</span>
<span class="badge blue">In Progress</span>
<span class="badge green">Published</span>
<span class="badge red">Archived</span>
<span class="badge yellow">Pending</span>
```

### Lists

#### Unordered List

```css
.list {
  margin: 16px 0;
  padding-left: 24px;
}

.list li {
  font-size: 14px;
  line-height: 1.6;
  color: #37352F;
  margin-bottom: 8px;
}

.list li::marker {
  color: #787774;
}
```

**HTML Example:**
```html
<ul class="list">
  <li>First item in the list</li>
  <li>Second item with more content</li>
  <li>Third item to complete the set</li>
</ul>
```

---

## Shadows and Elevation

tahc uses subtle, layered shadows to create depth and hierarchy.

### Shadow Scale

**Level 0 (None):**
```css
box-shadow: none;
```
Usage: Flat elements, inline content

**Level 1 (Subtle):**
```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
```
Usage: Slight elevation, hovering cards

**Level 2 (Soft):**
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
```
Usage: Cards on hover, floating elements

**Level 3 (Medium):**
```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```
Usage: Dropdowns, popovers, modals

**Level 4 (Strong):**
```css
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
```
Usage: Modal overlays, important dialogs

**Level 5 (Maximum):**
```css
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.20);
```
Usage: Large modals, full-screen overlays

### Layered Shadows

For more realistic depth:

```css
/* Combined shadow for enhanced depth */
.card-elevated {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 16px rgba(0, 0, 0, 0.08);
}

/* Button with subtle 3D effect */
.button-raised {
  box-shadow:
    2px 2px 12px rgba(218, 218, 218, 0.5),
    -1px -1px 12px rgba(255, 255, 255, 0.5);
}
```

### Focus Shadows

```css
/* Focus ring for accessibility */
.focus-visible {
  box-shadow: 0 0 0 3px rgba(72, 124, 165, 0.1);
}
```

---

## Border Radius

tahc uses consistent border-radius values for a cohesive, modern feel.

### Border Radius Scale

**None:**
```css
border-radius: 0;
```
Usage: Tables, strict layouts

**Small:**
```css
border-radius: 3px;
```
Usage: Checkboxes, small UI elements

**Default:**
```css
border-radius: 4px;
```
Usage: Inputs, small buttons

**Medium:**
```css
border-radius: 6px;
```
Usage: Buttons, navigation items

**Large:**
```css
border-radius: 8px;
```
Usage: Cards, containers

**Extra Large:**
```css
border-radius: 12px;
```
Usage: Bento cards, hero sections, feature cards

**Pill:**
```css
border-radius: 20px;
```
Usage: Badges, tags, pill-shaped buttons

**Circle:**
```css
border-radius: 50%;
```
Usage: Avatars, circular icons

### Usage Examples

```css
/* Input field */
.input {
  border-radius: 4px;
}

/* Standard button */
.button {
  border-radius: 6px;
}

/* Card component */
.card {
  border-radius: 8px;
}

/* Large feature card */
.feature-card {
  border-radius: 12px;
}

/* Badge */
.badge {
  border-radius: 20px;
}

/* Avatar */
.avatar {
  border-radius: 50%;
}
```

---

## Animations and Transitions

tahc uses smooth, subtle animations to enhance user experience without being distracting.

### Transition Durations

**Fast (Quick responses):**
```css
transition-duration: 0.1s;
```
Usage: Button presses, quick state changes

**Normal (Standard interactions):**
```css
transition-duration: 0.15s - 0.2s;
```
Usage: Hover effects, color changes, border changes

**Slow (Deliberate movements):**
```css
transition-duration: 0.3s - 0.4s;
```
Usage: Panel slides, modal appearances

**Very Slow (Attention-grabbing):**
```css
transition-duration: 0.5s - 0.6s;
```
Usage: Loading states, major UI changes

### Timing Functions

**Ease (Default):**
```css
transition-timing-function: ease;
```
Usage: General purpose, natural feel

**Ease-In-Out:**
```css
transition-timing-function: ease-in-out;
```
Usage: Smooth starts and stops

**Ease-Out:**
```css
transition-timing-function: ease-out;
```
Usage: Elements appearing, dropdowns

**Ease-In:**
```css
transition-timing-function: ease-in;
```
Usage: Elements disappearing

**Custom Cubic Bezier:**
```css
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```
Usage: Custom easing for specific effects

### Common Transitions

**Button Hover:**
```css
.button {
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button:active {
  transform: translateY(0);
}
```

**Input Focus:**
```css
.input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  border-color: #487CA5;
  box-shadow: 0 0 0 3px rgba(72, 124, 165, 0.1);
}
```

**Card Hover:**
```css
.card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

**Link Hover:**
```css
.link {
  transition: color 0.2s ease;
}

.link:hover {
  color: #447ACB;
}
```

### Keyframe Animations

**Spinner (Loading):**
```css
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spinner 0.6s linear infinite;
}
```

**Fade In:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}
```

**Slide In from Bottom:**
```css
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in-up {
  animation: slideInUp 0.4s ease-out;
}
```

**Pulse (Attention):**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

**Skeleton Loading:**
```css
@keyframes skeleton {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton {
  background-color: #F1F1EF;
  background-image: linear-gradient(
    90deg,
    #F1F1EF 0px,
    #E5E5E3 40px,
    #F1F1EF 80px
  );
  background-size: 200px 100%;
  animation: skeleton 1.2s ease-in-out infinite;
}
```

---

## Enhanced Motion System (Google M3 Expressive)

This section defines the complete motion design system inspired by Google's Material Design 3 Expressive Motion, combining precise timing with expressive easing curves for delightful interactions while maintaining tahc's minimalist aesthetic.

### Motion Duration Tokens

**Complete Duration Scale:**
```css
/* Quick Feedback (Micro-interactions) */
--duration-instant: 50ms;      /* Instant responses, hover previews */
--duration-fast: 100ms;        /* Button presses, quick toggles */
--duration-quick: 150ms;       /* Checkbox, toggle switches */
--duration-normal: 200ms;      /* Standard UI interactions */

/* Standard Transitions */
--duration-smooth: 300ms;      /* Fade animations, color changes */
--duration-medium: 350ms;      /* Hover effects with movement */
--duration-deliberate: 500ms;  /* Panel slides, drawer open/close */

/* Complex Animations */
--duration-slow: 650ms;        /* Modal entries, full transitions */
--duration-extra-slow: 800ms;  /* Loading states, major UI changes */
```

### Expressive Easing Curves (Cubic-Bezier)

**Expressive Curves (With subtle bounce/overshoot):**
```css
/* For spatial movements (position, scale) */
--ease-expressive-fast: cubic-bezier(0.42, 1.85, 0.21, 0.90);
  /* 350ms - Quick with bounce (buttons, small components) */

--ease-expressive: cubic-bezier(0.38, 1.21, 0.22, 1.00);
  /* 500ms - Moderate bounce (modals, panels) */

--ease-expressive-slow: cubic-bezier(0.39, 1.29, 0.35, 0.98);
  /* 650ms - Gentle bounce (full-screen transitions) */

/* For effects (opacity, color, border) */
--ease-expressive-fast-effects: cubic-bezier(0.31, 0.94, 0.34, 1.00);
  /* 150ms - Subtle for color/opacity */

--ease-expressive-effects: cubic-bezier(0.34, 0.80, 0.34, 1.00);
  /* 200-300ms - Standard effects (Notion-style subtlety) */

--ease-expressive-slow-effects: cubic-bezier(0.34, 0.88, 0.34, 1.00);
  /* 300ms+ - Slower effects */
```

**Standard Curves (Smooth, no overshoot):**
```css
--ease-standard: cubic-bezier(0.27, 1.06, 0.18, 1.00);
  /* General purpose smooth easing */

--ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1.0);
  /* Material emphasized deceleration */

--ease-emphasized-accel: cubic-bezier(0.3, 0, 0.8, 0.15);
  /* Material emphasized acceleration */
```

**Basic Easing:**
```css
--ease-linear: cubic-bezier(0, 0, 1, 1);
--ease-in: cubic-bezier(0.42, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.58, 1);
--ease-in-out: cubic-bezier(0.42, 0, 0.58, 1);
```

### Spring Physics (For Framer Motion)

**JavaScript/TypeScript Spring Configurations:**
```typescript
// Fast spatial (buttons, small components)
const fastSpatial = {
  type: "spring",
  stiffness: 1400,
  damping: 30,
  mass: 1,
};

// Fast effects (color, opacity)
const fastEffects = {
  type: "spring",
  stiffness: 3800,
  damping: 40,
  mass: 1,
};

// Default spatial (partial screen animations)
const defaultSpatial = {
  type: "spring",
  stiffness: 700,
  damping: 30,
  mass: 1,
};

// Default effects (opacity, color transitions)
const defaultEffects = {
  type: "spring",
  stiffness: 1600,
  damping: 35,
  mass: 1,
};

// Slow spatial (full screen, modals)
const slowSpatial = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};
```

### Animation Categories by Use Case

#### 1. Micro-interactions (50-200ms)

**Checkbox Toggle:**
```css
.checkbox-toggle {
  transition:
    background-color 150ms var(--ease-expressive-fast-effects),
    border-color 150ms var(--ease-expressive-fast-effects),
    transform 100ms var(--ease-out);
}

.checkbox-toggle:active {
  transform: scale(0.95);
}
```

**Button Press:**
```css
.button-press {
  transition: transform 100ms var(--ease-in-out);
}

.button-press:active {
  transform: scale(0.98);
}
```

#### 2. Hover Effects (200-350ms)

**Card Hover with Lift:**
```css
.card-hover {
  transition:
    box-shadow 300ms var(--ease-expressive-effects),
    transform 300ms var(--ease-expressive-effects);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

**Link Color Change:**
```css
.link-hover {
  transition: color 200ms var(--ease-expressive-effects);
}

.link-hover:hover {
  color: #447ACB;
}
```

#### 3. Entry/Exit Animations (300-500ms)

**Fade In (Notion-style):**
```css
@keyframes fadeInExpressive {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter {
  animation: fadeInExpressive 300ms var(--ease-expressive-effects);
}
```

**Modal Entry with Bounce:**
```css
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-enter {
  animation: modalEnter 500ms var(--ease-expressive);
}
```

**Exit Animation (Slide Left):**
```css
@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100px);
  }
}

.slide-exit {
  animation: slideOutLeft 300ms var(--ease-emphasized);
}
```

#### 4. Spatial Transitions (350-650ms)

**Drawer Slide In:**
```css
.drawer-slide {
  transition:
    transform 500ms var(--ease-expressive),
    opacity 300ms var(--ease-expressive-effects);
}

.drawer-slide.open {
  transform: translateX(0);
  opacity: 1;
}

.drawer-slide.closed {
  transform: translateX(100%);
  opacity: 0;
}
```

**Panel Expansion:**
```css
.panel-expand {
  overflow: hidden;
  transition:
    max-height 500ms var(--ease-expressive),
    opacity 300ms var(--ease-expressive-effects);
}
```

### Animation Decision Matrix

Use this table to choose the correct animation for each interaction:

| Interaction | Duration | Easing Curve | Reason |
|-------------|----------|--------------|--------|
| **Checkbox toggle** | 150ms | `expressive-fast-effects` | Instant feedback, subtle |
| **Button press** | 100ms | `ease-out` | Quick response, no overshoot |
| **Todo fade in/out** | 300ms | `expressive-effects` | Smooth, Notion-style subtlety |
| **Card hover** | 300ms | `expressive-effects` | Gentle elevation feedback |
| **Input focus** | 200ms | `expressive-effects` | Calm, professional feel |
| **Modal open** | 500ms | `expressive` | Spatial context with bounce |
| **Drawer slide** | 500ms | `expressive` | Spatial movement |
| **Save indicator** | 400ms | `expressive-effects` | Satisfying feedback |
| **Loading spinner** | 600ms | `linear` | Consistent rotation |
| **Delete animation** | 300ms | `emphasized` | Smooth exit |
| **Drag feedback** | 100ms | `ease-out` | Immediate response |
| **Color transition** | 200ms | `expressive-effects` | Smooth blend |

### Framer Motion Implementation

**Complete Motion Configuration for tahc:**
```typescript
// src/lib/motionConfig.ts

export const motionConfig = {
  // Todo item entry (subtle fade)
  todoEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.3,
      ease: [0.34, 0.80, 0.34, 1.00], // expressive-effects
    },
  },

  // Checkbox toggle (spring bounce)
  checkboxToggle: {
    whileTap: { scale: 0.95 },
    transition: {
      type: "spring",
      stiffness: 3800,
      damping: 40,
    },
  },

  // Button press (minimal)
  buttonPress: {
    whileTap: { scale: 0.98 },
    transition: {
      duration: 0.1,
      ease: [0, 0, 0.58, 1], // ease-out
    },
  },

  // Save indicator pulse
  saveIndicator: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 0.4,
      ease: [0.34, 0.80, 0.34, 1.00],
    },
  },

  // Drag handle hover
  dragHandle: {
    whileHover: { scale: 1.05, opacity: 1 },
    transition: {
      duration: 0.15,
      ease: [0.34, 0.80, 0.34, 1.00],
    },
  },

  // Modal backdrop
  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  // Modal content
  modalContent: {
    initial: { opacity: 0, scale: 0.96, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: 20 },
    transition: {
      duration: 0.5,
      ease: [0.38, 1.21, 0.22, 1.00], // expressive
    },
  },
};
```

### CSS Utility Classes

**Ready-to-use animation classes:**
```css
/* === TRANSITION UTILITIES === */

.transition-expressive-fast {
  transition: all 150ms cubic-bezier(0.31, 0.94, 0.34, 1.00);
}

.transition-expressive {
  transition: all 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00);
}

.transition-expressive-spatial {
  transition: all 500ms cubic-bezier(0.38, 1.21, 0.22, 1.00);
}

.transition-emphasized {
  transition: all 300ms cubic-bezier(0.05, 0.7, 0.1, 1.0);
}

/* === ANIMATION UTILITIES === */

.animate-fade-in {
  animation: fadeInExpressive 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00);
}

.animate-slide-up {
  animation: slideUp 500ms cubic-bezier(0.38, 1.21, 0.22, 1.00);
}

.animate-pulse-save {
  animation: pulseSave 400ms cubic-bezier(0.34, 0.80, 0.34, 1.00);
}

/* === HOVER UTILITIES === */

.hover-lift {
  transition: transform 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00);
}

.hover-lift:hover {
  transform: translateY(-2px);
}

.active-press:active {
  transform: scale(0.98);
  transition: transform 100ms cubic-bezier(0, 0, 0.58, 1);
}
```

---

## Minimalist Animation Philosophy (Notion Inspired)

This section defines when and how to use animations while maintaining tahc's "zero BS" minimalist aesthetic.

### Core Principles

**Functional Minimalism** - Every animation must serve a purpose:

1. **Communicate state changes** - Saved, loading, error states
2. **Provide spatial context** - Where did this element come from?
3. **Reinforce user actions** - Acknowledge button clicks, form submissions
4. **Never distract** from content - Animations should be subtle

### Motion Rules

**✓ DO:**
- Fade in new content (300ms)
- Subtle scale on button press (100ms, scale to 0.98)
- Smooth color transitions (200ms)
- Gentle position shifts for spatial awareness (300ms)
- Skeleton loaders for perceived performance
- Micro-animations for feedback (checkbox, save indicator)

**✗ DON'T:**
- Excessive bounce effects (unless intentional feedback like save confirmation)
- Rotate animations (except loading spinners)
- Multiple simultaneous animations
- Animations longer than 600ms (feels slow, breaks flow)
- Attention-grabbing animations for regular interactions
- Animate on every state change (be selective)

### Notion-Style Micro-interactions

**Subtle Checkbox (with haptic feel simulation):**
```css
.checkbox-notion {
  transition:
    background-color 150ms cubic-bezier(0.34, 0.80, 0.34, 1.00),
    border-color 150ms cubic-bezier(0.34, 0.80, 0.34, 1.00),
    transform 100ms cubic-bezier(0, 0, 0.58, 1);
}

.checkbox-notion:active {
  transform: scale(0.95);
}

.checkbox-notion:checked {
  background-color: #4F9768;
  border-color: #4F9768;
}
```

**Soft Block Fade on Delete:**
```css
.block-delete {
  animation: fadeOutGentle 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00) forwards;
}

@keyframes fadeOutGentle {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-8px);
  }
}
```

**Calm Hover for Navigation:**
```css
.nav-item-notion {
  transition:
    background-color 200ms cubic-bezier(0.34, 0.80, 0.34, 1.00),
    color 200ms cubic-bezier(0.34, 0.80, 0.34, 1.00);
}

.nav-item-notion:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
```

**Input Focus (Professional):**
```css
.input-notion {
  transition:
    border-color 200ms cubic-bezier(0.34, 0.80, 0.34, 1.00),
    box-shadow 200ms cubic-bezier(0.34, 0.80, 0.34, 1.00),
    transform 150ms cubic-bezier(0, 0, 0.58, 1);
}

.input-notion:focus {
  border-color: #447ACB;
  box-shadow: 0 0 0 3px rgba(68, 122, 203, 0.1);
  transform: translateY(-1px);
}
```

### Animation Hierarchy for tahc

**Critical (Always animate):**
- Todo add/delete (300ms fade)
- Checkbox toggle (150ms spring)
- Save status changes (400ms pulse)
- Error/success states (300ms)

**Important (Should animate):**
- Button presses (100ms scale)
- Input focus states (200ms)
- Hover effects on interactive elements (200-300ms)
- Modal/drawer open/close (500ms)

**Optional (Can skip for performance):**
- Card hovers (decorative)
- Secondary button effects
- Non-critical decorative animations
- Transitions during initial page load

### Performance Optimization

**Only animate these properties (GPU-accelerated):**
```css
/* ✓ GOOD - GPU accelerated */
transform: translateX() | translateY() | scale() | rotate();
opacity: 0 to 1;

/* ✗ AVOID - Causes reflow/repaint */
width, height, top, left, margin, padding;
```

**Use `will-change` sparingly:**
```css
/* Only for animations that will definitely happen */
.modal-backdrop {
  will-change: opacity;
}

/* Remove after animation completes */
.modal-backdrop.entered {
  will-change: auto;
}
```

### Best Practices Summary

1. **Default to 300ms** for most animations
2. **Use expressive-effects** easing for Notion-style subtlety
3. **Add bounce selectively** for feedback moments (save, delete)
4. **Test on low-end devices** - animations should never cause jank
5. **Respect `prefers-reduced-motion`** - disable non-essential animations
6. **Keep exit animations shorter** than entry (200-300ms vs 300-500ms)
7. **Layer animations** - opacity changes should complete before spatial movements

---

## Layout System

### Container Widths

**Full Width:**
```css
.container-full {
  width: 100%;
  max-width: 100%;
}
```

**Extra Wide:**
```css
.container-xl {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}
```

**Wide:**
```css
.container-lg {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

**Medium:**
```css
.container-md {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}
```

**Small:**
```css
.container-sm {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Responsive Breakpoints

tahc uses standard responsive breakpoints for different device sizes:

```css
/* Mobile First Approach */

/* Extra Small (Mobile) */
/* Default styles apply */

/* Small (Large Mobile / Small Tablet) */
@media (min-width: 576px) {
  /* Styles */
}

/* Medium (Tablet) */
@media (min-width: 768px) {
  /* Styles */
}

/* Large (Desktop) */
@media (min-width: 1024px) {
  /* Styles */
}

/* Extra Large (Wide Desktop) */
@media (min-width: 1280px) {
  /* Styles */
}

/* XXL (Ultra Wide) */
@media (min-width: 1536px) {
  /* Styles */
}
```

### Grid System

**Flexbox Grid:**
```css
.row {
  display: flex;
  flex-wrap: wrap;
  margin: -12px; /* Negative margin for gutters */
}

.col {
  flex: 1;
  padding: 12px; /* Gutter */
}

.col-2 {
  flex: 0 0 50%;
  padding: 12px;
}

.col-3 {
  flex: 0 0 33.333%;
  padding: 12px;
}

.col-4 {
  flex: 0 0 25%;
  padding: 12px;
}
```

**CSS Grid:**
```css
.grid {
  display: grid;
  gap: 24px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

/* Responsive Grid */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```

**HTML Example:**
```html
<!-- Flexbox Grid -->
<div class="row">
  <div class="col-3">
    <div class="card">Column 1</div>
  </div>
  <div class="col-3">
    <div class="card">Column 2</div>
  </div>
  <div class="col-3">
    <div class="card">Column 3</div>
  </div>
</div>

<!-- CSS Grid -->
<div class="grid grid-3">
  <div class="card">Grid Item 1</div>
  <div class="card">Grid Item 2</div>
  <div class="card">Grid Item 3</div>
</div>
```

### Responsive Typography

```css
/* Base font size */
html {
  font-size: 16px;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  html {
    font-size: 14px;
  }

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  .container-lg,
  .container-md,
  .container-sm {
    padding: 0 16px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  html {
    font-size: 16px;
  }

  h1 {
    font-size: 40px;
  }
}
```

---

## Z-Index Scale

tahc uses a structured z-index system to manage layering.

```css
/* Base Layer */
.z-base { z-index: 1; }

/* Dropdowns and Popovers */
.z-dropdown { z-index: 100; }

/* Fixed Headers */
.z-header { z-index: 200; }

/* Overlays */
.z-overlay { z-index: 300; }

/* Modals */
.z-modal { z-index: 400; }

/* Tooltips */
.z-tooltip { z-index: 500; }

/* Notifications/Toasts */
.z-notification { z-index: 600; }

/* Maximum (Emergency) */
.z-max { z-index: 9999; }
```

**Usage Guidelines:**
- Keep related elements within the same hundred (e.g., all dropdowns 100-199)
- Leave gaps for future additions
- Document why an element needs a specific z-index
- Avoid arbitrary large values

---

## Icons and Assets

### Icon System

tahc uses a combination of:
- Custom icon set
- Emoji support (comprehensive Unicode emoji)
- SVG icons for UI elements

**Icon Sizes:**
- Tiny: `12px`
- Small: `16px`
- Medium: `20px` (default)
- Large: `24px`
- Extra Large: `32px`
- Huge: `48px`

**Icon Colors:**
```css
.icon {
  color: #37352F; /* Default */
}

.icon-muted {
  color: #787774; /* Secondary */
}

.icon-primary {
  color: #487CA5; /* Accent */
}
```

### Image Optimization

tahc uses Next.js image optimization with responsive variants:

**Desktop Images:**
- Standard: 1728px width
- 2x: 3456px width
- 3x: 3840px width

**Mobile Images:**
- Standard: 800px width
- 2x: 1600px width

**Image Styles:**
```css
.img-responsive {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
```

---

## Interactive States

### Hover States

**Button Hover:**
```css
.button:hover {
  background-color: #1a1a1a;
  transform: translateY(-1px);
}
```

**Link Hover:**
```css
.link:hover {
  color: #447ACB;
  text-decoration: underline;
}
```

**Card Hover:**
```css
.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

**Input Hover:**
```css
.input:hover {
  border-color: #37352F;
}
```

### Focus States

**Keyboard Focus (Accessibility):**
```css
.interactive:focus-visible {
  outline: 2px solid #487CA5;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove outline for mouse users */
.interactive:focus:not(:focus-visible) {
  outline: none;
}
```

**Input Focus:**
```css
.input:focus {
  outline: none;
  border-color: #487CA5;
  box-shadow: 0 0 0 3px rgba(72, 124, 165, 0.1);
}
```

### Active States

**Button Active (Pressed):**
```css
.button:active {
  transform: translateY(0);
  background-color: #000000;
}
```

**Link Active:**
```css
.link:active {
  color: #37352F;
}
```

### Disabled States

**Button Disabled:**
```css
.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Input Disabled:**
```css
.input:disabled {
  background-color: #F1F1EF;
  color: #787774;
  cursor: not-allowed;
}
```

### Selection States

**Selected Item:**
```css
.item.selected {
  background-color: #E9F3F7;
  color: #487CA5;
  border-left: 3px solid #487CA5;
}
```

**Checkbox Checked:**
```css
.checkbox:checked {
  background-color: #487CA5;
  border-color: #487CA5;
}
```

---

## Additional Design Patterns

### Loading States

**Spinner:**
```html
<div style="display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #EEEEEC;
            border-top-color: #487CA5;
            border-radius: 50%;
            animation: spinner 0.6s linear infinite;">
</div>
```

**Skeleton Screen:**
```html
<div class="skeleton" style="height: 20px; border-radius: 4px; margin-bottom: 12px;"></div>
<div class="skeleton" style="height: 20px; width: 80%; border-radius: 4px; margin-bottom: 12px;"></div>
<div class="skeleton" style="height: 100px; border-radius: 8px;"></div>
```

**Progress Bar:**
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #F1F1EF;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #487CA5;
  transition: width 0.3s ease;
}
```

```html
<div class="progress-bar">
  <div class="progress-bar-fill" style="width: 60%;"></div>
</div>
```

### Tooltips

```css
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  visibility: hidden;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #37352F;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 500;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tooltip:hover .tooltip-content {
  visibility: visible;
  opacity: 1;
}

.tooltip-content::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #37352F transparent transparent transparent;
}
```

**HTML Example:**
```html
<span class="tooltip">
  Hover me
  <span class="tooltip-content">This is a tooltip</span>
</span>
```

### Modal / Dialog

```css
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 400;
  backdrop-filter: blur(4px);
}

.modal {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.20);
  animation: slideInUp 0.3s ease-out;
}

.modal-header {
  margin-bottom: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #37352F;
  margin-bottom: 8px;
}

.modal-body {
  margin-bottom: 24px;
  color: #37352F;
  font-size: 14px;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

**HTML Example:**
```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Confirm Action</h2>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to proceed with this action?</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary">Cancel</button>
      <button class="btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Dividers

```css
.divider {
  height: 1px;
  background-color: #EEEEEC;
  margin: 24px 0;
  border: none;
}

.divider-vertical {
  width: 1px;
  background-color: #EEEEEC;
  margin: 0 16px;
  border: none;
}

.divider-text {
  display: flex;
  align-items: center;
  margin: 24px 0;
  font-size: 12px;
  color: #787774;
  text-transform: uppercase;
}

.divider-text::before,
.divider-text::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: #EEEEEC;
}

.divider-text::before {
  margin-right: 16px;
}

.divider-text::after {
  margin-left: 16px;
}
```

**HTML Example:**
```html
<hr class="divider">

<div class="divider-text">OR</div>
```

---

## Best Practices

### Consistency Guidelines

1. **Always use the defined spacing scale** (4px, 8px, 12px, 16px, 24px, etc.)
2. **Stick to the color palette** - avoid introducing new colors without documentation
3. **Use semantic color names** (success, error, warning) rather than specific colors
4. **Apply transitions consistently** - standard interactions should use 0.2s ease
5. **Maintain border-radius consistency** - use defined scale values
6. **Follow the typography scale** - don't create arbitrary font sizes

### Accessibility Recommendations

1. **Color Contrast:**
   - Ensure minimum 4.5:1 contrast ratio for normal text
   - Ensure minimum 3:1 contrast ratio for large text
   - Test with tools like WebAIM Contrast Checker

2. **Focus Indicators:**
   - Always provide visible focus states
   - Use `:focus-visible` to show focus only for keyboard users
   - Maintain 2px outline with adequate offset

3. **Interactive Elements:**
   - Minimum touch target size: 44x44px (mobile)
   - Minimum click target size: 24x24px (desktop)
   - Provide adequate spacing between interactive elements

4. **Screen Reader Support:**
   - Use semantic HTML elements
   - Provide aria-labels for icon-only buttons
   - Ensure proper heading hierarchy

### Performance Optimization

1. **Use CSS transforms for animations** (transform, opacity) - GPU accelerated
2. **Avoid animating properties** like width, height, top, left
3. **Implement skeleton screens** for perceived performance
4. **Lazy load images** outside viewport
5. **Use system fonts** when possible to reduce load time

### Responsive Design

1. **Mobile First Approach:**
   - Design for mobile first, enhance for larger screens
   - Test on actual devices, not just browser tools
   - Consider touch interactions and gestures

2. **Breakpoint Usage:**
   - Don't rely solely on standard breakpoints
   - Use content-based breakpoints when needed
   - Test layouts at various widths, not just breakpoints

3. **Flexible Layouts:**
   - Use relative units (rem, em, %) over absolute (px) when appropriate
   - Implement fluid typography with clamp() when supported
   - Ensure layouts work at any viewport width

### Dark Mode Considerations

When implementing dark mode:

1. **Invert colors appropriately** - don't just flip backgrounds
2. **Reduce pure white and black** - use softer alternatives (#191919 instead of #000)
3. **Adjust shadows** - darker backgrounds need lighter, more subtle shadows
4. **Test color contrast** - ensure readability in both modes
5. **Provide smooth transitions** between modes
6. **Use CSS custom properties** for easy theme switching

### Component Development

1. **Build reusable components** following this style guide
2. **Document variations and states** for each component
3. **Provide clear usage examples** with HTML and CSS
4. **Test components** in isolation and in context
5. **Ensure components are accessible** by default

---

## Implementation Notes

### CSS Custom Properties (Variables)

For easier theme management, consider implementing CSS variables:

```css
:root {
  /* Colors */
  --color-text-primary: #37352F;
  --color-text-secondary: #787774;
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F1F1EF;
  --color-border: #EEEEEC;
  --color-accent: #487CA5;
  --color-success: #548164;
  --color-error: #C4554D;
  --color-warning: #CC782F;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 18px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Transitions */
  --transition-fast: 0.1s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #D4D4D4;
    --color-bg-primary: #191919;
    --color-bg-secondary: #2A2A2A;
    --color-border: #2A2A2A;
  }
}
```

### Framework Integration

**Tailwind CSS Configuration (Enhanced with Motion System):**

Complete Tailwind config for tahc with Nothing OS spacing, Google M3 motion, and Notion minimalism:

```javascript
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode (primary)
        'dark-bg': '#191919',
        'dark-bg-elevated': '#2A2A2A',
        'dark-text': '#D4D4D4',
        'dark-text-secondary': '#9B9B9B',
        'dark-border': '#2A2A2A',

        // Nothing OS accent
        'accent-red': '#FF3B30',
        'accent-red-hover': '#FF5247',

        // Semantic colors
        'success-green': '#4F9768',
        'error-red': '#E06C75',
        'info-blue': '#447ACB',
        'warning-orange': '#E5C07B',
      },

      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Courier New', 'monospace'],
      },

      // Nothing OS refined spacing
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },

      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
        wider: '0.01em',
        widest: '0.02em',
      },

      // Google M3 Expressive Motion
      transitionDuration: {
        'instant': '50ms',
        'fast': '100ms',
        'quick': '150ms',
        'normal': '200ms',
        'smooth': '300ms',
        'medium': '350ms',
        'deliberate': '500ms',
        'slow': '650ms',
      },

      transitionTimingFunction: {
        // Expressive curves (with bounce)
        'expressive-fast': 'cubic-bezier(0.42, 1.85, 0.21, 0.90)',
        'expressive': 'cubic-bezier(0.38, 1.21, 0.22, 1.00)',
        'expressive-slow': 'cubic-bezier(0.39, 1.29, 0.35, 0.98)',

        // Effects curves (subtle)
        'expressive-fast-effects': 'cubic-bezier(0.31, 0.94, 0.34, 1.00)',
        'expressive-effects': 'cubic-bezier(0.34, 0.80, 0.34, 1.00)',
        'expressive-slow-effects': 'cubic-bezier(0.34, 0.88, 0.34, 1.00)',

        // Standard
        'standard': 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
        'emphasized': 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
      },

      animation: {
        'fade-in': 'fadeIn 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00)',
        'fade-out': 'fadeOut 300ms cubic-bezier(0.34, 0.80, 0.34, 1.00)',
        'slide-up': 'slideUp 500ms cubic-bezier(0.38, 1.21, 0.22, 1.00)',
        'slide-out-left': 'slideOutLeft 300ms cubic-bezier(0.05, 0.7, 0.1, 1.0)',
        'pulse-save': 'pulseSave 400ms cubic-bezier(0.34, 0.80, 0.34, 1.00)',
        'modal-enter': 'modalEnter 500ms cubic-bezier(0.38, 1.21, 0.22, 1.00)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideOutLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-100px)' },
        },
        pulseSave: {
          '0%, 100%': { scale: '1', opacity: '1' },
          '50%': { scale: '1.1', opacity: '0.8' },
        },
        modalEnter: {
          '0%': { opacity: '0', scale: '0.96', transform: 'translateY(20px)' },
          '100%': { opacity: '1', scale: '1', transform: 'translateY(0)' },
        },
      },

      borderRadius: {
        'sm': '3px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
};
```

---

## Version History

**Version 2.0** - Cohesive Design Language Integration
- **Enhanced Motion System (Google M3 Expressive)**
  - Complete duration tokens (50ms - 800ms)
  - Expressive easing curves with cubic-bezier specifications
  - Spring physics parameters for Framer Motion
  - Animation decision matrix with use cases
  - Comprehensive code examples (CSS + TypeScript)
- **Nothing OS Design Elements**
  - Monospace font stack for technical elements
  - Refined letter-spacing scale
  - Micro-spacing values (2px, 6px, etc.)
  - Optional red accent color (#FF3B30)
- **Notion Minimalism Philosophy**
  - Functional motion principles
  - Animation hierarchy (critical/important/optional)
  - Performance optimization guidelines
  - When to animate vs. keep static
- **Enhanced Tailwind Configuration**
  - Motion timing functions (expressive, emphasized, standard)
  - Custom animation keyframes
  - Complete spacing and typography scales
- **Cohesive Implementation**
  - Framer Motion configurations for tahc
  - CSS utility classes for animations
  - Practical examples for todo app

**Version 1.0** - Initial comprehensive style guide
- Complete color palette documentation (light and dark modes)
- Typography system with Inter font
- Spacing scale based on 8px grid
- Component library with examples
- Shadow and elevation system
- Border radius scale
- Animation and transition guidelines
- Layout and grid systems
- Z-index management
- Accessibility guidelines
- Best practices and recommendations

---

## References and Resources

**Official tahc Resources:**
- tahc.com - Main website
- tahc Help Center - Style and customization guides

**Design System Inspiration:**
- Inter Typeface - https://rsms.me/inter/
- Nothing OS UI - Typography, spacing, and minimalist aesthetic
- Google Material Design 3 - Expressive Motion system
- Notion Design - Minimalist animation philosophy
- 8-Point Grid System
- Apple Human Interface Guidelines - Typography and spacing

**Color Resources:**
- tahc Colors Hex Codes - matthiasfrank.de/en/tahc-colors/
- Nothing OS Design Language
- Material Design Color System

**Tools for Implementation:**
- WebAIM Contrast Checker - Accessibility testing
- Chrome DevTools - Inspect and debug styles
- Figma - Design and prototyping

---

## Conclusion

This style guide represents a comprehensive analysis of tahc's design system, providing detailed specifications for colors, typography, spacing, components, and interactions. Use this as a reference for maintaining design consistency across your project.

**Key Takeaways:**
- tahc emphasizes **simplicity and minimalism** (Notion-inspired)
- **Nothing OS** influence: tight spacing, monospace accents, clean aesthetic
- **Google M3 Expressive Motion**: Precise timing with subtle bounce for delightful interactions
- The design uses **generous white space** and **clean typography**
- **Consistency** is maintained through defined scales for spacing, colors, sizing, and motion
- **Accessibility** is built-in with proper contrast ratios and focus states
- **Performance-first animations**: Only transform/opacity, GPU-accelerated
- The system is **flexible** enough to accommodate various content types while maintaining cohesion
- **Functional minimalism**: Every animation serves a purpose, no distractions

For questions or updates to this style guide, maintain documentation of any changes and ensure all team members are informed of design system updates.
