# Style Analysis: NihonGo Reference

**Target Website**: [https://dynakom.github.io/NihonGo/](https://dynakom.github.io/NihonGo/)

## 1. Aesthetic Overview
The reference site employs a **"Soft Modern"** aesthetic. Key characteristics include:
-   **Generous Rounding**: Buttons and cards feature large border-radius values (12px - 24px), creating a friendly, approachable feel.
-   **Soft Depth**: Depth is achieved through subtle, expansive shadows rather than distinct borders.
-   **Vibrant Accents**: A predominantly neutral background is punctuated by a single, vibrant accent color (Pink/Red).
-   **Clean Typography**: Utilization of modern, geometric sans-serif fonts.

## 2. Color Palette

### Core Colors
| Role               | Color                | Hex       | Usage                            |
| :----------------- | :------------------- | :-------- | :------------------------------- |
| **Background**     | `rgb(248, 249, 250)` | `#F8F9FA` | Main page background (Off-white) |
| **Surface**        | `rgb(255, 255, 255)` | `#FFFFFF` | Cards, Content Containers        |
| **Text (Primary)** | `rgb(43, 45, 66)`    | `#2B2D42` | Headings, Body text (Deep Navy)  |
| **Text (Muted)**   | `rgb(108, 117, 125)` | `#6C757D` | Secondary text, placeholders     |

### Accent Colors
| Role        | Color                | Hex       | Usage                            |
| :---------- | :------------------- | :-------- | :------------------------------- |
| **Primary** | `rgb(255, 71, 126)`  | `#FF477E` | Primary actions (Buttons, Links) |
| **Border**  | `rgb(233, 236, 239)` | `#E9ECEF` | Input borders, dividers          |

## 3. Typography
-   **Font Family**: `Outfit`, sans-serif.
-   **Characteristics**: Geometric, high legibility, modern.
-   **Headings**: Bold weights (600/700).
-   **Body**: Regular/Medium (400/500).

## 4. Component Styles

### Buttons (`.btn-primary`)
-   **Background**: `#FF477E`
-   **Text**: White
-   **Border Radius**: `12px`
-   **Shadow**: None (Flat)
-   **Padding**: Generous (e.g., 12px 24px)

### Cards (`.card`, Containers)
-   **Background**: White
-   **Border Radius**: `24px` (Significant rounding)
-   **Shadow**: `0px 10px 30px 0px rgba(0, 0, 0, 0.05)` (Soft, large diffuse shadow)
-   **Border**: None (Relies on shadow)

### Inputs
-   **Background**: White
-   **Border**: `2px solid #E9ECEF`
-   **Border Radius**: `12px`
-   **Padding**: `16px`

## 5. Potential Adaptation for KosakataQ
To mimic this style while maintaining the Islamic theme:
-   **Replace Pink with Teal**: Use `#0F766E` as the vibrant accent instead of `#FF477E`.
-   **Adopt Rounding**: Increase border-radius on cards to `1.5rem` (24px) and buttons to `0.75rem` (12px).
-   **Softer Shadows**: Switch to the diffuse shadow model (`0 10px 30px rgba(0,0,0,0.05)`).
-   **Font**: Consider switching "Inter" to "Outfit" or a similarly geometric font if permitted.

![Reference Homepage](/Users/ewinsutriandi/.gemini/antigravity/brain/f7f84f34-9b87-44fe-8e12-11ed5f2f8c9a/nihongo_homepage_1767960156054.png)
