# Woodex Live Builder — User Guide

> **Version:** 1.0  
> **Access:** Click the gold **"W"** button (bottom-left corner of any page) or press `Ctrl+Shift+B`  
> **Password:** `woodex2024`

---

## Table of Contents

1. [What is the Live Builder?](#what-is-the-live-builder)
2. [Getting Started](#getting-started)
3. [The Builder Interface](#the-builder-interface)
4. [Editing Content](#editing-content)
5. [Editing Styles](#editing-styles)
6. [Managing Elements](#managing-elements)
7. [Import / Export](#import--export)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Troubleshooting](#troubleshooting)

---

## What is the Live Builder?

The Woodex Live Builder is a real-time visual editing tool that lets you modify the website's content and appearance directly from any page — without touching code.

**Key capabilities:**

- **Inline text editing** — Double-click any text to edit it directly on the page
- **Style inspector** — Change fonts, colors, spacing, borders, shadows and more via a side panel
- **Image swapping** — Click any image to replace its URL
- **Element visibility** — Hide or show sections of a page
- **Drag-and-drop** — Reorder sections by dragging them
- **Export / Import** — Save your changes as JSON and restore them later

All changes are saved automatically to your browser's local storage and persist between sessions.

---

## Getting Started

### Opening the Builder

There are three ways to open the builder:

1. **Click the gold "W" button** in the bottom-left corner of any page
2. **Press `Ctrl+Shift+B`** (`Cmd+Shift+B` on Mac)
3. Navigate to the Dashboard → **Live Builder** page

### Logging In

The first time you open the builder, you'll see a login prompt.

1. Enter the builder password: `woodex2024`
2. Click **Login**

> **Note:** Builder access is separate from the dashboard login. The password is configured in `builderStore.tsx` and uses a default password for local development.

### The Onboarding Guide

The first time you use the builder, a step-by-step guide will walk you through the basic features. You can dismiss it by clicking **"Don't show this again"** or access it later via the Settings tab in the inspector panel.

---

## The Builder Interface

When the builder is active, the page displays three new UI elements:

### 1. Top Bar

A dark bar at the top of the screen showing:

- **"Live Builder"** badge (left)
- **Current page name** (center) — e.g. "Home", "About", "Services"
- **"Exit Builder"** button (right)

### 2. Gold Toggle Button

The gold **"W"** button in the bottom-left corner pulses when the builder is active. Click it to toggle the builder on/off.

When the builder is off, this button is the only visible element — it's static and non-pulsing.

### 3. Inspector Panel

A side panel on the right with three tabs:

| Tab | Purpose |
|-----|---------|
| **Content** | Edit text, images, links, and visibility |
| **Style** | Change fonts, colors, spacing, borders, effects |
| **Settings** | View element info, export/import, reset overrides |

The panel opens automatically when you select an element on the page.

---

## Editing Content

### Selecting an Element

1. Make sure the builder is active (gold toggle is glowing)
2. **Click** any text, heading, image, or section on the page
3. The element gets a **gold outline**, and the Inspector Panel opens on the right

Elements with a dashed outline on hover are editable.

### Editing Text Inline

1. **Double-click** a text element directly on the page
2. The text becomes editable — type your changes
3. Press **Enter** to save, or **Escape** to cancel
4. Changes are saved automatically

### Using the Content Tab

The Content tab in the Inspector Panel provides fields for:

| Field | What it does |
|-------|-------------|
| **Text Content** | Replace the text of headings, paragraphs, buttons |
| **Image URL** | Change the image source URL |
| **Alt Text** | Update the image's alt attribute for accessibility |
| **Link URL** | Change where a linked element points to |

### Replacing an Image

- **Click any image element** when the builder is active
- A prompt will ask for the new image URL
- Enter the URL and click OK

Alternatively, use the **Content tab** → **Image URL** field.

### Hiding an Element

In the Content tab, click the **"Hide Element"** button (red) to hide a section. Click **"Show Element"** (green) to make it visible again.

Hidden elements don't appear on the live site at all.

---

## Editing Styles

Open the **Style** tab in the Inspector Panel to modify the visual appearance of any selected element.

### Typography

| Control | Options |
|---------|---------|
| **Font Family** | Serif (Cormorant Garamond), Sans (Montserrat), Mono (JetBrains Mono) |
| **Font Size** | Preset sizes (XS through 8XL) or custom value in px |
| **Font Weight** | 300 (Light) through 900 (Black) |
| **Text Align** | Left, Center, Right, Justify |
| **Text Transform** | Normal, UPPERCASE, lowercase, Capitalize |
| **Line Height** | Custom value (e.g. 1.5) |
| **Letter Spacing** | Custom value in em (e.g. 0.05em) |

### Colors

| Control | What it changes |
|---------|----------------|
| **Text Color** | The color of text content |
| **Background Color** | The element's background |

Each has a **color picker**, a **hex input**, and a **preset swatch grid** of brand colors:

| Swatch | Hex |
|--------|-----|
| White | `#FFFFFF` |
| Gold | `#C9A84C` |
| Gold Light | `#E2C97E` |
| Cream | `#FAF7F2` |
| Espresso | `#0A0A0A` |
| Body Text | `#D4C5A9` |
| Muted | `#8A8073` |
| Border | `#E5E0D8` |
| Success | `#16A34A` |
| Danger | `#DC2626` |
| Blue | `#2563EB` |
| Purple | `#7C3AED` |

### Spacing

| Control | What it changes |
|---------|----------------|
| **Padding** | Space inside the element (all sides) |
| **Margin Top** | Space above the element |
| **Margin Bottom** | Space below the element |

### Border

| Control | Options |
|---------|---------|
| **Border Radius** | None, SM (4px), MD (8px), LG (16px), XL (24px), Pill (9999px) |
| **Border Width** | Custom value in px |
| **Border Color** | Color picker or hex input |

### Effects

| Control | Options |
|---------|---------|
| **Opacity** | Slider from 0 (invisible) to 1 (fully opaque) |
| **Box Shadow** | None, Small, Medium, Large, XL, Gold Glow, Inner |

---

## Managing Elements

### Drag-and-Drop Reordering

Sections marked with a label (e.g. "Hero", "Services Grid") can be reordered:

1. Hover over a section — its label appears at the top edge
2. **Drag** the section by clicking and holding
3. A gold outline appears on valid drop targets
4. **Release** to place the section in its new position

### Resetting Changes

In the **Settings** tab:

| Action | What it does |
|--------|-------------|
| **Reset Element** | Clears all overrides for the currently selected element |
| **Reset Page** | Clears all overrides for the current page |
| **Clear All Overrides** | Erases ALL changes across ALL pages (requires confirmation) |

---

## Import / Export

The builder saves changes to your browser's local storage automatically. You can also export and import settings as JSON for backup or transfer.

### Exporting

1. Open the **Settings** tab
2. Click **Export All**
3. The JSON data is copied to your clipboard
4. Paste it into a file for safekeeping

### Importing

1. Open the **Settings** tab
2. Click **Import**
3. Paste your JSON into the text area
4. Click **Apply Import**

### Override Data

The Settings tab also shows the raw JSON for the currently selected element. This is read-only and provided for reference.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl` + `Shift` + `B` | Toggle builder on/off |
| `Ctrl` + `Z` | Undo (browser native) |
| `Ctrl` + `Shift` + `Z` | Redo (browser native) |
| `Escape` | Close panel / deselect element |
| `Enter` | Save inline text edit |
| `Escape` | Cancel inline text edit |
| `ArrowLeft` / `ArrowRight` | Navigate onboarding guide steps |

---

## How It Works (Behind the Scenes)

The builder uses a **layered override system** that sits on top of the static site content:

1. Each editable element on the page has a unique dot-notation path (e.g. `home.hero.heading`)
2. When you edit content or change a style, the new values are stored as an **override** in the `BuilderProvider` context
3. Overrides are persisted to `localStorage` under the key `woodex-builder-overrides`
4. When the builder is inactive, elements render normally with zero overhead — no event listeners, no style computation
5. When the builder is active, `EditableElement` components read their overrides and apply them to the rendered output

This means you can safely use the builder on a production site — changes are local to your browser and don't modify the source code.

### Data Flow

```
You edit an element
      ↓
EditableElement captures the change
      ↓
BuilderProvider stores the override in context
      ↓
Debounced save writes to localStorage
      ↓
On next page load, overrides are restored from localStorage
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Builder won't open** | Check the password is `woodex2024`. Ensure browser allows localStorage. |
| **Can't see the gold button** | It's positioned bottom-left. Scroll down if needed. |
| **Changes disappeared** | Check that localStorage isn't cleared (private browsing may clear on exit). Export your changes as JSON for backup. |
| **Element doesn't respond to clicks** | Not all elements are wired with `data-wpi-path`. Add `EditableElement` wrapper in code. |
| **Style changes not visible** | Some CSS properties may be overridden by site CSS. Use more specific values. |
| **Drag-and-drop not working** | Only elements with `asSection` prop are draggable. |
| **Builder error screen** | Click "Click to Reset" to reload. Export overrides first if possible. |
| **Inspect panel is empty** | Make sure you've clicked an editable element first. |

---

## Technical Reference

### EditableElement Props

Used by developers to make any component editable:

```tsx
<EditableElement
  path="page.section.element"    // Unique dot-notation path
  contentText="Default text"     // Enables inline text editing
  contentSrc="/images/hero.jpg"  // Enables image URL editing
  asSection                      // Enables drag-and-drop reordering
  sectionLabel="Hero Section"    // Label shown above section in builder
  className="..."                // CSS classes
  style={{...}}                  // Inline styles (merged with overrides)
>
  {children}
</EditableElement>
```

### Page Names

| Route | Page Key |
|-------|----------|
| `/` | `home` |
| `/about` | `about` |
| `/services` | `services` |
| `/projects` | `projects` |
| `/insights` | `insights` |
| `/contact` | `contact` |

---

*Woodex Live Builder — Edit your site visually, in real-time.*
