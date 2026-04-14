# Floating Interest Objects — Design Spec

## Summary

Add 9 interactive floating objects scattered throughout the space portfolio's scroll journey, each representing a personal interest. Visitors discover them by clicking, building toward a "found X/9" collection counter. Objects are Three.js sprites living in the 3D canvas alongside planets.

## Goals

- Add personality and interactivity beyond the Saturn orbit interaction
- Encourage full-page exploration via gamified discovery mechanic
- Showcase Mani's sports achievements, musical background, and personal interests
- Keep performance impact near-zero
- Make it trivial to add, remove, or reorder interests in the future

## Approach

Canvas-side Three.js Sprite meshes with emoji textures (billboard quads that always face camera). Detail cards and discovery counter are DOM overlays — same pattern as the existing Saturn project cards.

## New Components

### 1. InterestObjects.jsx (Canvas component)

Lives inside `SpaceCanvas` alongside planets. Renders 9 `Sprite` meshes at fixed 3D coordinates along the camera path, positioned off to the sides so they appear in peripheral vision without blocking planets or section content.

**Sprite visuals:**
- Emoji rendered to `CanvasTexture` at init (no network requests)
- Soft golden glow aura via additive blending
- Gentle vertical bob (`sin(time)`, ~0.3 unit amplitude)
- Slow Y-axis rotation

**Visual states:**
- **Idle:** Golden glow, gentle bob + rotation
- **Hover (desktop):** Glow intensifies, scale 1.0 → 1.2, pointer cursor
- **Discovered:** Glow shifts to section accent color, dimmer (already found), still clickable
- **Click moment:** Particle burst animation, triggers card + counter update

**Interaction:**
- Raycaster fires on click/tap only (not per-frame)
- On hit: mark as discovered, show InterestCard, increment counter
- Already-discovered objects: re-show the card on click

### 2. DiscoveryCounter.jsx (DOM overlay)

Fixed-position glass-morphism pill in the bottom-right corner (top-right on mobile).

**Display:** `✦ 3 / 9` format
- Denominator derived from `interests.length` (never hardcoded)
- Hidden during Big Bang intro, appears once scroll begins
- Pulse animation on new discovery: border glows gold, number bumps, fades back
- Special glow state when all 9 found

### 3. InterestCard.jsx (DOM overlay)

Glass card popup centered on screen (bottom sheet on mobile).

**Content:**
- Large emoji
- "DISCOVERED" label (monospace, gold)
- Interest name
- Achievement/description line
- "click anywhere to dismiss" hint

**Mobile:** Bottom sheet with swipe-down to dismiss (matches existing Saturn project card pattern).

## Data File

### interests.js

Single source of truth. Array of objects:

```js
{
  id: "badminton",
  emoji: "🏸",
  name: "Badminton",
  description: "District Level, Age 16",
  position: [x, y, z],
  color: "#FFD700",
}
```

Add/remove/reorder by editing this array. All components derive from it.

### Interest Content

| Emoji | Name | Description |
|-------|------|-------------|
| 🏸 | Badminton | District Level, Age 16 |
| ⛸️ | Roller Skating | District Champ, Age 5-7 |
| ⚽ | Football | District Level, 2019-2020 |
| 🏊 | Swimming | District Level, Age 12 |
| 🥁 | Percussion | Snare, Tabla, Mridangam & more. Band Parade Lead |
| 🏋️ | Gym | 195kg Deadlift |
| 🎧 | Music | Hip-hop, RnB, Trap & Telugu. Daily listener |
| 📖 | Reading | Always got a book going |
| ☕ | Coffee | Fueled by caffeine |

## Object Placement

Objects alternate left and right of the camera path, placed in gaps between planets:

1. ☕ Coffee — between Earth and Mars (right)
2. 🏸 Shuttlecock — between Mars and Jupiter (left)
3. ⛸️ Roller Skate — between Mars and Jupiter (right)
4. 🥁 Drum — between Jupiter and Saturn (left)
5. ⚽ Football — between Jupiter and Saturn (right)
6. 🏊 Swimmer — between Saturn and Uranus (left)
7. 🏋️ Dumbbell — between Uranus and Neptune (right)
8. 🎧 Headphones — between Uranus and Neptune (left)
9. 📖 Book — after Neptune (right)

Exact `[x, y, z]` coordinates to be determined during implementation based on existing planet positions in `constants.js`. Positions are easily adjustable in `interests.js`.

## State Management

- Discovered items tracked as state in `SpaceExperience.jsx` (lifted state or context)
- Persisted to `localStorage` as a JSON array of discovered IDs
- Read once on mount, written on each new discovery
- Components consume via props or context

## Mobile Behavior

- No hover state — tap to discover directly
- Interest card renders as bottom sheet (existing pattern from ProjectsSection)
- Swipe down or tap outside to dismiss
- Discovery counter positioned top-right to avoid thumb zone
- Sprites slightly larger for easier tap targets
- Sprites positioned closer to center of camera path (smaller viewport)
- Glow aura slightly brighter for visibility
- Reduced bob amplitude to prevent off-screen drift

## Performance

| Concern | Impact |
|---------|--------|
| Sprites | 9 quads — negligible draw calls |
| Textures | 9 CanvasTexture at init — no network requests |
| Raycaster | Click/tap only, not per-frame — zero ongoing cost |
| Animations | sin/cos per sprite in useFrame — trivial |
| GPU tier scaling | Low-end: disable glow aura, static sprites |
| localStorage | Single JSON key, read once on mount |

## Files Changed

**New files:**
- `src/experiences/space/canvas/InterestObjects.jsx`
- `src/experiences/space/components/DiscoveryCounter.jsx`
- `src/experiences/space/components/InterestCard.jsx`
- `src/experiences/space/data/interests.js`

**Modified files:**
- `src/experiences/space/canvas/SpaceCanvas.jsx` — add `<InterestObjects />` child
- `src/experiences/space/SpaceExperience.jsx` — add discovery state, render counter + card overlays
