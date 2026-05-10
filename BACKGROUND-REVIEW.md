# UI Audit — Background System

**Status**: Reviewing "CinemaBackground" and Hero Overlays
**Aesthetic Goal**: Lumina Onyx (Cinematic Luxury)

## Current Assessment (2/4)
The current background uses a standard "Orb" (radial gradient) approach with a basic particle system. While it provides some color depth, it feels a bit "generic SaaS" rather than "Luxury Cinema Studio."

### Issues:
1. **Static Orbs**: The pulses are simple opacity changes, lacking the fluid movement of light leaks.
2. **Generic Particles**: The particles are circular and clean. In a cinema context, "dust" or "film grain" feels more authentic.
3. **Lack of Texture**: The background is too smooth. Cinematic visuals thrive on grain and subtle noise.

---

## Proposed Improvements: "The Lumina Noir Background"

### 1. Animated "Light Leaks"
- **Suggestion**: Replace static orbs with a "Light Leak" system. These are asymmetrical, moving gradients that simulate film being exposed to light.
- **Implementation**: Use a multi-layered CSS gradient animation with `filter: blur(100px)` and a rotating transform. It should feel like light dancing on a lens.

### 2. "Film Grain" & "Gate Weave"
- **Suggestion**: Add a persistent, subtle noise overlay across the whole site (not just the hero).
- **Implementation**: A high-frequency SVG noise filter or a small 128x128 tiled noise GIF with 5% opacity. This adds "texture" to the black onyx background.

### 3. "The Viewfinder" Border
- **Suggestion**: Add a very faint "Camera Viewfinder" frame that sits on the edges of the screen (top/bottom or corners).
- **Premium Detail**: Tiny red "REC" dot or focal length numbers in the corners that don't distract but add to the immersion.

### 4. "Depth Layers" (Parallax Dust)
- **Suggestion**: Improve the `Particles` component. Instead of dots, use small "Dust Motes" that are slightly elongated and blurred (bokeh).
- **Unique Factor**: The motes should respond very subtly to mouse movement, creating a sense of 3D space between the background and the text.

### 5. Sectional "Spotlight" Transitions
- **Suggestion**: As you move between sections, the background "lighting" should shift.
- **Implementation**: Use `framer-motion` to transition the center of the light leak as the user scrolls, simulating a camera moving through a lit set.

---

## Specific "Lumina Onyx" Suggestion:
Replace the current `CinemaBackground` with a **"Dark Chamber"** model:
- Base: Deep #060606 (Onyx).
- Accents: Moving "Saffron & Gold" light leaks (Lumina theme).
- Texture: 3% Opacity Film Grain.
- Foreground: Slow-moving "Bokeh Dust" motes.

**Goal**: Make the user feel like they are looking through a high-end cinema lens, not just a website.
