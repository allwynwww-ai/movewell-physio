# Image credits and licences

Every image shipped in `public/images/` must be listed here with its source and licence
**before** the site is delivered to a clinic. If you can't say where an image came from and
what licence allows commercial use, don't ship it.

## Current images (demo placeholders)

| File | Size | What it shows | Source | Licence / status |
|------|------|---------------|--------|------------------|
| `hero.jpg` | 1152×864 | Physiotherapist in teal scrubs guiding a patient through a resistance-band exercise | AI-generated for this template (Grok Bot image generation, 30 Oct 2026) | Generated placeholder. No real people, logos or trademarks. Replace with the clinic's own photo before go-live. |
| `therapist.jpg` | 864×1152 | Portrait of a physiotherapist in navy scrubs | AI-generated for this template (Grok Bot image generation, 30 Oct 2026) | Generated placeholder. **Not a real therapist** – must be replaced with the clinic's real therapist photo (patients will assume it's the person treating them). |
| `clinic-1.jpg` | 1280×720 | Therapist supporting an older patient with a balance exercise | AI-generated for this template (Grok Bot image generation, 30 Oct 2026) | Generated placeholder. Replace with real clinic photos. |
| `clinic-2.jpg` | 1280×720 | Empty rehabilitation room | AI-generated for this template (Grok Bot image generation, 30 Oct 2026) | Generated placeholder. Replace with real clinic photos. |

### Exercise illustrations

| File | Size | What it shows | Source | Licence / status |
|------|------|---------------|--------|------------------|
| `exercises/heel-slides.webp` | 1280×720 | Heel slides – start and end positions (two panels) | Original artwork created for this project (generated, 31 Oct 2026) | Owned by the project; no third-party licence. |
| `exercises/cat-camel.webp` | 1280×720 | Cat-camel stretch – start and end positions | Original artwork created for this project (generated, 31 Oct 2026) | Owned by the project; no third-party licence. |
| `exercises/chin-tucks.webp` | 1280×720 | Chin tucks – start and end positions | Original artwork created for this project (generated, 31 Oct 2026) | Owned by the project; no third-party licence. |
| `exercises/pendulum-swings.webp` | 1280×720 | Pendulum swings – start and end positions | Original artwork created for this project (generated, 31 Oct 2026) | Owned by the project; no third-party licence. |
| `exercises/ankle-alphabet.webp` | 1280×720 | Ankle alphabet – start and end positions | Original artwork created for this project (generated, 31 Oct 2026) | Owned by the project; no third-party licence. |
| `exercises/og/*.jpg` | 1200×675 | JPG copies of the five illustrations above, for link previews | Same as above | Same as above |

Illustrated figures, not real people. Clinics may swap them for their own photos (see README →
Exercise library).

Generated (not photographed) images are used so the template contains no third-party stock
photos with unclear rights. Check the image tool's current terms if you plan to keep any of
them on a paying client's site, and never present a generated person as a real staff member.

## Removed images (do not restore)

These were in the original MoveWell demo and were removed on 30 Oct 2026 because their origin
and licence could not be verified:

| File | Problem |
|------|---------|
| `hero.jpg`, `therapist.jpg` (old versions) | Stock-style photos. The old `README.txt` said "free Unsplash images" but gave no photographer, photo ID or link, and the files carried no metadata. Source unverifiable. |
| `clinic-1.jpg`, `clinic-2.jpg`, `clinic-1-full.jpg`, `clinic-2-full.jpg` (old versions) | Appeared to be AI-generated (visible Google Gemini sparkle watermark). `clinic-2` showed a "PhysioCare" logo on the scrubs – a third-party brand name. Origin and terms unverified. |

The old files are still in git history (tag `v1.0-original`) if anyone needs to investigate them.

## When you add a clinic's real photos

Add a row per image:

| File | What it shows | Photographer / source | Licence | Permission notes |
|------|---------------|-----------------------|---------|------------------|
| `hero.jpg` | e.g. Treatment room | e.g. Clinic's own photo, taken by … | Owned by the clinic | Written consent from any patient shown |

Tips:
- Prefer the clinic's own photos. Get **written consent** from any patient or staff member who
  appears in them.
- If you use stock photos, keep the licence page URL / download receipt (Unsplash, Pexels,
  paid stock, etc.) and record it here.
- Keep sizes similar to the placeholders (hero 4:3, therapist 3:4 portrait, gallery 16:9) and
  under ~300 KB each (JPEG quality ~80).
