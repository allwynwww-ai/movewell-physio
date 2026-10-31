/**
 * Exercise library content (Pro — features.exerciseLibrary).
 *
 * Add, edit or remove exercises here; pages, filters and the sitemap update
 * automatically. Keep the wording general (education / wellness) — no promises
 * of cure or diagnosis — and keep the safety notice on every exercise.
 */

export type BodyArea = "Knee" | "Back" | "Neck" | "Shoulder" | "Ankle" | "Hip";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Exercise = {
  /** URL id, e.g. "heel-slides" → /exercises/heel-slides */
  slug: string;
  title: string;
  bodyArea: BodyArea;
  difficulty: Difficulty;
  /** One or two sentences shown on the list and in search results */
  summary: string;
  /** What you need, e.g. "A mat" */
  equipment?: string;
  steps: string[];
  /** Sets / reps / hold — e.g. { sets: "2–3", reps: "10", hold: "5 seconds" } */
  dosage: { sets?: string; reps?: string; hold?: string; frequency?: string };
  tips: string[];
  /**
   * Optional picture shown on the exercise page and list card (Start / End
   * positions). Put the file in /public and set `src`, e.g.
   * "/images/exercises/heel-slides.webp". Without it, a simple line icon is shown.
   * `width`/`height` are the file's pixel size (default 1280×720, 16:9).
   * `og` is an optional JPG/PNG for link previews (WhatsApp, Facebook); `src` is used if not set.
   */
  image?: { src: string; alt: string; width?: number; height?: number; og?: string };
};

/** Shown on every exercise page and the list page. */
export const EXERCISE_DISCLAIMER =
  "General information only, not a substitute for a personal assessment. Consult your physiotherapist before starting a new exercise, especially after an injury or surgery. Stop if you feel pain, dizziness or numbness, and seek advice.";

export const exercises: Exercise[] = [
  {
    slug: "heel-slides",
    image: {
      src: "/images/exercises/heel-slides.webp",
      og: "/images/exercises/og/heel-slides.jpg",
      alt: "Heel slides: start lying flat on a mat with both legs straight; end with one knee bent and the heel slid towards the buttocks",
    },
    title: "Heel Slides",
    bodyArea: "Knee",
    difficulty: "Beginner",
    summary: "A gentle lying-down movement to help keep the knee moving comfortably through its range.",
    equipment: "A mat or bed; a towel under the heel can help it glide",
    steps: [
      "Lie on your back with both legs straight.",
      "Slowly slide one heel towards your bottom, bending the knee as far as is comfortable.",
      "Pause briefly, then slide the heel back until the leg is straight.",
      "Repeat, then switch legs.",
    ],
    dosage: { sets: "2", reps: "10 each leg", frequency: "Once or twice a day" },
    tips: [
      "Move slowly and smoothly — no bouncing.",
      "Keep your back relaxed on the floor.",
      "A mild stretch is fine; sharp pain is a signal to stop.",
    ],
  },
  {
    slug: "cat-camel",
    image: {
      src: "/images/exercises/cat-camel.webp",
      og: "/images/exercises/og/cat-camel.jpg",
      alt: "Cat-camel stretch: start on hands and knees with the back gently rounded up and head lowered; end with the back gently dipped and head lifted",
    },
    title: "Cat–Camel Stretch",
    bodyArea: "Back",
    difficulty: "Beginner",
    summary: "A slow, rhythmic movement on hands and knees to gently mobilise the spine.",
    equipment: "A mat",
    steps: [
      "Start on your hands and knees, hands under shoulders and knees under hips.",
      "Breathe out and slowly round your back towards the ceiling, letting your head drop.",
      "Breathe in and gently let your back sag, lifting your chest and looking slightly forward.",
      "Move between the two positions slowly and within a comfortable range.",
    ],
    dosage: { sets: "2", reps: "8–10", frequency: "Daily" },
    tips: [
      "Let your breathing set the pace.",
      "Keep the movement small if your back feels stiff — it often eases as you go.",
      "Use a folded towel under your knees if kneeling is uncomfortable.",
    ],
  },
  {
    slug: "chin-tucks",
    image: {
      src: "/images/exercises/chin-tucks.webp",
      og: "/images/exercises/og/chin-tucks.jpg",
      alt: "Chin tucks: start sitting upright on a chair looking forward; end with the chin drawn straight back, keeping the eyes level",
    },
    title: "Chin Tucks",
    bodyArea: "Neck",
    difficulty: "Beginner",
    summary: "A simple posture exercise for the neck that you can do at your desk.",
    equipment: "None — sit or stand tall",
    steps: [
      "Sit or stand upright with your shoulders relaxed.",
      "Look straight ahead and gently draw your chin straight back, as if making a double chin.",
      "Hold, keeping your eyes level (don't tip your head up or down).",
      "Relax back to the start position.",
    ],
    dosage: { sets: "2", reps: "10", hold: "3–5 seconds", frequency: "A few times a day" },
    tips: [
      "Think 'slide back', not 'nod down'.",
      "A good reminder during long periods at a screen.",
      "You should feel a gentle stretch at the base of the skull, not pain.",
    ],
  },
  {
    slug: "pendulum-swings",
    image: {
      src: "/images/exercises/pendulum-swings.webp",
      og: "/images/exercises/og/pendulum-swings.jpg",
      alt: "Pendulum swings: start leaning forward with one hand on a table and the other arm hanging down; end with the hanging arm swinging in small, relaxed circles",
    },
    title: "Pendulum Swings",
    bodyArea: "Shoulder",
    difficulty: "Beginner",
    summary: "A relaxed swinging movement that lets the shoulder move gently with gravity.",
    equipment: "A table or sturdy chair to lean on",
    steps: [
      "Stand beside a table and rest your good hand on it for support.",
      "Lean forward slightly and let the other arm hang down loosely.",
      "Gently shift your body so the hanging arm swings in small circles.",
      "Do circles in both directions, then swing forwards–backwards and side to side.",
    ],
    dosage: { sets: "1–2", reps: "30–60 seconds each direction", frequency: "2–3 times a day" },
    tips: [
      "Let the arm stay relaxed — the movement comes from your body, not your shoulder muscles.",
      "Start with small circles and only make them bigger if comfortable.",
    ],
  },
  {
    slug: "ankle-alphabet",
    image: {
      src: "/images/exercises/ankle-alphabet.webp",
      og: "/images/exercises/og/ankle-alphabet.jpg",
      alt: "Ankle alphabet: start seated with the leg resting on a cushion on a stool; end tracing a letter of the alphabet in the air with the toes",
    },
    title: "Ankle Alphabet",
    bodyArea: "Ankle",
    difficulty: "Beginner",
    summary: "Trace the letters of the alphabet with your foot to move the ankle in every direction.",
    equipment: "A chair",
    steps: [
      "Sit on a chair with one leg lifted slightly, or rest your calf on a cushion.",
      "Using your big toe as a 'pen', slowly trace the letters A to Z in the air.",
      "Keep the movement at the ankle — try not to move your knee or hip.",
      "Switch to the other foot.",
    ],
    dosage: { sets: "1–2", reps: "A–Z each foot", frequency: "Once or twice a day" },
    tips: [
      "Make the letters as large as feels comfortable.",
      "Go slowly; smooth control matters more than speed.",
    ],
  },
];

export const BODY_AREAS: BodyArea[] = Array.from(new Set(exercises.map((e) => e.bodyArea)));

/** Default pixel size of the bundled illustrations. */
export const EXERCISE_IMAGE_SIZE = { width: 1280, height: 720 };

export function getExercise(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

/** "body-area" style id for filters, e.g. "Knee" → "knee" */
export function areaId(area: string): string {
  return area.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
