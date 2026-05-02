# Unified Brand Gateway Design (Gateway.md)

## Objective
Create a central entry point for both DySalatto and DyCake that handles user onboarding, authentication, and guest access while emphasizing the unified brand ecosystem.

## UI/UX Plan

### 1. Layout: "The Immersive Portal"
- **Background:** A high-end split-screen image (Artisan Bowl on left, Gourmet Cake on right) with a deep cinematic overlay.
- **Center Piece:** A premium "Bento Box" style modal with glassmorphism effects (`backdrop-blur-xl`).
- **Typography:** Bold, tracking-tighter brand headings.

### 2. Value Proposition (The Hook)
Highlight 3 key reasons to join:
- **Artisan Discount:** 15% off on your first masterpiece.
- **Sanat Puan:** Earn points with every bite, redeem for exclusive treats.
- **Elite Events:** Early access to seasonal tastings and workshops.

### 3. Interaction Flow
- **Default State:** Side-by-side "Guest Checkout" vs "Join the Art".
- **Toggle State:** Smooth transition between Login and Registration forms.
- **Feedback:** 60-90 FPS micro-animations for input focus and button hovers.

### 4. Technical Integration
- **Route:** `/gateway`
- **Trigger:** Navbar "SİPARİŞ VER" button.
- **Auth:** Connects to the previously built `/api/auth` backend.

## Roadmap
- [x] Create task documentation.
- [ ] Implement `Gateway` page structure.
- [ ] Add interactive Login/Register/Guest forms.
- [ ] Update Navbar links to point to `/gateway`.
- [ ] Final visual polish (grain, glows, refined transitions).
