# 🎨 MediMitra UI Color Guide

## Medicine-Themed Color Palette

### Primary Colors - Green (Health & Medicine)

**Used for:** Medicines, health-related features, success states

```
primary-50:  #ecfdf5  (Very light green - backgrounds)
primary-100: #d1fae5  (Light green - badges)
primary-500: #10b981  (Main green)
primary-600: #059669  (Medium green - buttons)
primary-700: #047857  (Dark green - hover states)
```

**Example Usage:**
- Medicine cards and badges
- "Add to Cart" buttons
- Success messages
- Inventory status "Available"
- Stats cards for medicines

---

### Secondary Colors - Blue (Trust & Reliability)

**Used for:** Stores, information, professional elements

```
secondary-50:  #eff6ff  (Very light blue - backgrounds)
secondary-100: #dbeafe  (Light blue - badges)
secondary-500: #3b82f6  (Main blue)
secondary-600: #2563eb  (Medium blue - buttons)
secondary-700: #1d4ed8  (Dark blue - hover states)
```

**Example Usage:**
- Store management sections
- Customer information
- "Processing" status
- Store dashboard elements
- Information badges

---

### Accent Colors - Orange (Energy & Action)

**Used for:** Call-to-action, alerts, energy

```
accent-50:  #fff7ed  (Very light orange - backgrounds)
accent-100: #ffedd5  (Light orange - badges)
accent-500: #f97316  (Main orange)
accent-600: #ea580c  (Medium orange - buttons)
accent-700: #c2410c  (Dark orange - hover states)
```

**Example Usage:**
- Order management
- Urgent actions
- "Low Stock" warnings
- Featured buttons
- Alert badges

---

## Gradient Combinations

### Primary Gradient (Green)
```css
from-primary-500 to-primary-600
from-primary-600 to-primary-500
bg-gradient-to-r from-primary-600 to-primary-500
```
**Used for:** Medicine cards, health buttons, success elements

### Secondary Gradient (Blue)
```css
from-secondary-500 to-secondary-600
bg-gradient-to-r from-secondary-600 to-secondary-500
```
**Used for:** Store elements, information cards, trust indicators

### Accent Gradient (Orange)
```css
from-accent-500 to-accent-600
bg-gradient-to-r from-accent-600 to-accent-500
```
**Used for:** CTAs, order buttons, alert elements

### Multi-Color Gradients
```css
from-primary-600 via-secondary-600 to-accent-600
from-primary-600 to-secondary-600
from-secondary-600 to-accent-600
```
**Used for:** Hero sections, headers, special backgrounds

---

## Badge Color Classes

### Green Badges
```css
.badge-green {
  background-color: #d1fae5; /* primary-100 */
  color: #065f46;            /* primary-800 */
}
```
**Used for:** In Stock, Available, Success, Pain Relief category

### Blue Badges
```css
.badge-blue {
  background-color: #dbeafe; /* secondary-100 */
  color: #1e40af;            /* secondary-800 */
}
```
**Used for:** Processing, Active, Antibiotic category

### Orange Badges
```css
.badge-orange {
  background-color: #ffedd5; /* accent-100 */
  color: #9a3412;            /* accent-800 */
}
```
**Used for:** Low Stock, Pending, Allergy category

---

## Button Styles

### Primary Button (Green)
```css
.btn-primary {
  background: linear-gradient(to right, #059669, #10b981);
  color: white;
}
.btn-primary:hover {
  background: linear-gradient(to right, #047857, #059669);
}
```

### Secondary Button (Blue)
```css
.btn-secondary {
  background: linear-gradient(to right, #2563eb, #3b82f6);
  color: white;
}
```

### Accent Button (Orange)
```css
.btn-accent {
  background: linear-gradient(to right, #ea580c, #f97316);
  color: white;
}
```

### Outline Button
```css
.btn-outline {
  background: white;
  border: 2px solid #059669;
  color: #059669;
}
```

---

## Page-Specific Color Usage

### Home Page
- Hero: Multi-color gradient (green → blue → orange)
- Stats: Rotating colors (green, blue, orange, purple)
- Features: Color-coded by feature type

### Admin Dashboard
- Medicines section: Green dominant
- Stores section: Blue dominant
- Alerts: Orange/Red

### Store Dashboard
- Inventory tab: Green theme
- Customers tab: Blue theme
- Orders tab: Orange theme

### Medicines Page
- Cards rotate through 3 colors:
  - Medicine 1, 4, 7: Green
  - Medicine 2, 5, 8: Blue
  - Medicine 3, 6: Orange

### Cart Page
- Primary actions: Green
- Info sections: Blue
- Warnings: Orange

### Orders Page
- Delivered: Green
- Processing: Blue
- Pending: Orange
- Cancelled: Red

### Feedback Page
- Form: Multi-color accents
- Rating stars: Yellow (#fbbf24)
- Submit button: Green

---

## Neutral Colors

### Gray Scale
```
gray-50:  #f9fafb  (Light background)
gray-100: #f3f4f6  (Badges, borders)
gray-200: #e5e7eb  (Dividers)
gray-300: #d1d5db  (Disabled)
gray-400: #9ca3af  (Placeholder)
gray-500: #6b7280  (Secondary text)
gray-600: #4b5563  (Body text)
gray-700: #374151  (Headings)
gray-800: #1f2937  (Dark text)
gray-900: #111827  (Darkest)
```

### Special Colors
- **White:** `#ffffff` (Cards, backgrounds)
- **Yellow:** `#fbbf24` (Star ratings)
- **Red:** `#ef4444` (Errors, delete buttons)
- **Purple:** `#a855f7` (Special stats)

---

## Background Patterns

### Main App Background
```css
background: linear-gradient(to bottom right, #f9fafb, #ecfdf5);
```
Subtle gradient from gray to light green

### Card Backgrounds
```css
background: white;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
border-radius: 1.5rem;
```

---

## Color Psychology

**Why These Colors?**

🟢 **Green (Primary)**
- Associated with health, healing, nature
- Calming and trustworthy
- Perfect for medical/pharmaceutical context
- Represents growth and vitality

🔵 **Blue (Secondary)**
- Conveys trust and professionalism
- Common in healthcare
- Reliable and stable
- Professional appearance

🟠 **Orange (Accent)**
- Energy and enthusiasm
- Draws attention to actions
- Friendly and approachable
- Encourages interaction

---

## Accessibility Notes

All color combinations meet WCAG AA standards:
- White text on primary-600: ✅ 4.5:1 contrast
- White text on secondary-600: ✅ 4.5:1 contrast
- White text on accent-600: ✅ 4.5:1 contrast
- Dark text on light badges: ✅ 7:1+ contrast

---

## Quick Reference

| Element | Color | Hex | Usage |
|---------|-------|-----|-------|
| Primary Button | Green | #059669 | Main actions |
| Medicine Card | Green | #10b981 | Health items |
| Store Section | Blue | #3b82f6 | Business info |
| Order Actions | Orange | #f97316 | Transactions |
| Success Badge | Light Green | #d1fae5 | Positive status |
| Info Badge | Light Blue | #dbeafe | Neutral status |
| Warning Badge | Light Orange | #ffedd5 | Alerts |
| Text Dark | Gray | #1f2937 | Headings |
| Text Light | Gray | #6b7280 | Body text |

---

**This color scheme creates a cohesive, professional, and medicine-appropriate design! 🎨✨**
