# Role

You are an expert front-end UI/UX engineer specializing in modern, responsive web design. You write clean, semantic HTML, CSS (with Tailwind or vanilla CSS), and vanilla JavaScript. You prioritize accessibility, smooth animations, and professional aesthetics.

# Task

Create a fully functional, responsive video gallery layout using a **grid** (not a carousel). The grid should display video cards, each containing:

- A thumbnail image (placeholder or unsplash video thumbnail)
- A play icon overlay (centered, appears on hover)
- Video duration badge (e.g., "05:23")
- Title (max 2 lines, with ellipsis)
- Short description (1 line truncated)
- Author name and view count (small meta text)

# Requirements

## Typography

- Use a modern system font stack: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- Headings: weight 600, size 1.25rem
- Title: weight 500, size 1rem, line-height 1.4
- Description: weight 400, size 0.875rem, color gray-600
- Meta (author/views): weight 400, size 0.75rem, color gray-500

## Layout & Grid

- Container max-width: 1280px, centered with margin auto
- Grid: responsive
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 or 4 columns (choose 3 for best readability)
- Gap: 1.5rem (24px)
- Padding around container: 1rem on mobile, 2rem on desktop

## Card Design

- Background: white
- Border radius: 0.75rem (12px)
- Box shadow: subtle `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- Hover: lift effect – transform translateY(-4px), shadow `0 20px 25px -5px rgb(0 0 0 / 0.1)`, transition 0.2s ease
- Overflow hidden on thumbnail area

## Thumbnail & Video Interaction

- Thumbnail aspect ratio: 16:9
- Background cover, centered
- Play icon: Font Awesome or SVG (Font Awesome 6 free CDN is allowed). Centered, opacity 0, scale 0.8, transition 0.2s ease.
- On card hover: play icon opacity 1, scale 1. Also add a semi-transparent dark overlay over thumbnail.
- Duration badge: bottom-left corner of thumbnail, black background with 80% opacity, padding 0.25rem 0.5rem, border-radius 0.25rem, font-size 0.75rem, font-mono optional.

## Transitions on Enter (Initial load)

- Cards should fade in and slide up slightly when page loads.
- Use staggered transition: each card appears with animation `fadeInUp` (0.3s ease-out) with delay based on index (e.g., 0ms, 50ms, 100ms, etc.)
- `fadeInUp`: from opacity 0, transform translateY(15px) to opacity 1, translateY(0)

## Click Behavior (Video playback simulation)

- When a user clicks on any video card (the whole card is clickable), show a modal (lightbox) that simulates video playback.
- Modal should:
  - Cover full screen with semi-transparent black background (z-index high)
  - Display an embedded YouTube player or a placeholder video (use a static YouTube embed URL from a demo video, e.g., "https://www.youtube.com/embed/dQw4w9WgXcQ" – but note it's just for demo). Better: use a placeholder video element with poster image and a simulated play.
  - Include a "Close" button (X icon) in top-right corner.
  - Close modal when clicking outside the video area or pressing ESC key.
- The modal should have a smooth fade-in/out transition.

## Accessibility & Semantics

- Use `<article>` for each video card, with `role="article"`.
- Each card should have `tabindex="0"` and be keyboard accessible (Enter or Space triggers click).
- Provide `aria-label` for the modal close button.
- Ensure color contrast meets WCAG AA.

## Demo Data

- Generate 6 demo video cards with realistic placeholder data (different titles, descriptions, authors, view counts, durations). Use placeholder images from `https://picsum.photos/400/225?random=1` etc., or a dedicated video thumbnail placeholder service like `https://via.placeholder.com/400x225?text=Video+Thumbnail`. For a more professional look, use `https://picsum.photos/id/100/400/225` (camera), `https://picsum.photos/id/101/400/225` (landscape), etc.

## Code Format

- Output a single HTML file (self-contained) with `<style>` and `<script>` blocks.
- Use vanilla JavaScript (no jQuery or heavy frameworks – but Tailwind CDN is allowed if you prefer, but I prefer vanilla CSS for clarity).
- Include Font Awesome 6 free CDN for icons (play, close).
- Make sure it's fully responsive and works on modern browsers.

## Bonus (but not required)

- Lazy loading for thumbnails (loading="lazy").
- If the user clicks a video card, instead of an iframe modal, show a simple video player with a `<video>` element and a poster image (but an iframe demo is fine).

# Output

Generate the complete HTML/CSS/JS code in one block. No extra explanation – just the code.
