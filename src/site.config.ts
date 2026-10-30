/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the ONLY file you need to edit to set up a new clinic.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every page, component, SEO tag, sitemap, Open Graph image and JSON-LD
 *  schema reads from this object. Nothing clinic-specific is hard-coded
 *  anywhere else in the codebase.
 *
 *  Everything below is NEUTRAL DEMO DATA. Replace it with the clinic's real
 *  details before going live (see README → "Set up a new clinic").
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Plan = "basic" | "pro" | "premium";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHours = {
  /** Days this time range applies to. */
  days: DayOfWeek[];
  /** 24-hour "HH:MM" */
  opens: string;
  /** 24-hour "HH:MM" */
  closes: string;
};

export type IconName =
  | "spine"
  | "sports"
  | "surgery"
  | "wellness"
  | "pelvic"
  | "balance"
  | "hands";

/** One opening window, 24-hour "HH:MM" (clinic timezone). */
export type TimeRange = { opens: string; closes: string };

export type BookingBreak = {
  /** 24-hour "HH:MM" */
  start: string;
  /** 24-hour "HH:MM" */
  end: string;
  label?: string;
  /** Days the break applies to. Leave out to apply every day. */
  days?: DayOfWeek[];
};

export type BookingHoliday = {
  /** "YYYY-MM-DD" in the clinic timezone */
  date: string;
  label: string;
};

export type Therapist = {
  name: string;
  /** Used in friendly copy such as "Hi, I'm …" and "Book with …" */
  firstName: string;
  title: string;
  /** Short line shown under the name on the home page photo card */
  shortCredentials: string;
  qualifications: string[];
  /** One paragraph per array item */
  bio: string[];
  photo: string;
  photoAlt: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
  /** e.g. "45–60 min" */
  duration?: string;
  /** Price in INR (number, no symbol). Leave undefined to hide the price. */
  priceINR?: number;
  icon: IconName;
};

export type Condition = {
  title: string;
  description: string;
  icon: IconName;
  /** Optional anchor on the services page, e.g. "sports-injury" */
  serviceId?: string;
};

export type Stat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** true = placeholder figure that must be replaced with the clinic's real number */
  isSample: boolean;
};

export type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  /** 1–5 */
  rating?: number;
  /** true = invented sample review. Replace with real, consented reviews. */
  isSample: boolean;
};

export const siteConfig = {
  /* ── Plan & feature switches ─────────────────────────────────────────── */
  /** "basic" = request form only. "pro" = adds online booking (see features.onlineBooking). */
  plan: "basic" as Plan,
  features: {
    /**
     * PRO — Online appointment booking (live calendar, instant confirmation,
     * patient manage link, clinic admin at /admin).
     *
     * Default OFF so the site works without a database. When off, the Book
     * page shows the FormSubmit request form exactly as before.
     * Turn it on here, or per deployment with the env var
     * NEXT_PUBLIC_FEATURE_ONLINE_BOOKING=true (the env var wins when set).
     * Needs DATABASE_URL (or POSTGRES_URL) and SESSION_SECRET — if they are
     * missing the Book page falls back to the request form with a notice.
     * Settings live in `onlineBooking` below.
     */
    onlineBooking: false,
    /** "form" = FormSubmit email form (Basic). Pro/Premium may add "calendar". */
    booking: "form" as "form" | "whatsapp-only" | "calendar",
    payments: false,
    calendar: false,
    blog: false,
    multiLocation: false,
    analytics: false,
  },

  /**
   * Shows a subtle "Sample reviews / sample figures" label wherever sample
   * testimonials or stats are displayed. Set to false ONLY once every
   * testimonial and stat below is real (isSample: false).
   */
  showSampleNotice: true,

  /* ── Brand ───────────────────────────────────────────────────────────── */
  brand: {
    /** Full legal / display name */
    name: "Your Clinic Physiotherapy",
    /** Big word in the logo lock-up */
    shortName: "Your Clinic",
    /** Small caps line under the logo word */
    logoSubtitle: "Physiotherapy",
    tagline:
      "Helping you move better, feel better and live better with personalised, evidence-based care.",
    /** Optional image logo (e.g. "/images/logo.svg"). Leave empty to use the built-in icon mark. */
    logo: "",
    /** localStorage key used to remember light/dark mode */
    themeStorageKey: "clinic-theme",
  },

  /* ── Contact ─────────────────────────────────────────────────────────── */
  contact: {
    /** What visitors see */
    phoneDisplay: "+91 98XXX XXXXX",
    /** What tel: links dial (E.164). DEMO number – does not belong to anyone real. */
    phoneTel: "+919000000000",
    /** Country code + number, digits only, for wa.me links. DEMO number. */
    whatsappNumber: "919000000000",
    /** Set to false once real numbers are entered – removes the "Demo number" label. */
    isDemoNumber: true,
    email: "hello@yourclinic.example",
    whatsappMessages: {
      default: "Hi, I'd like to book a physiotherapy appointment.",
      book: "Hi, I'd like to book a physiotherapy appointment. Please share the next available slot.",
      ask: "Hi, I have a question about physiotherapy at your clinic.",
      followup:
        "Hi, I just sent an appointment request through your website and would like to confirm it on WhatsApp.",
    },
    emailReplyTime: "We reply within 1 business day",
  },

  /* ── Booking form (FormSubmit.co) ───────────────────────────────────── */
  booking: {
    /**
     * FormSubmit sends each request to this address. The first submission
     * triggers an activation email that the clinic MUST click once.
     * While this ends in ".example" the form runs in demo mode (nothing is sent).
     */
    formSubmitEmail: "hello@yourclinic.example",
    emailSubject: "New appointment request (website)",
    whatToExpect: [
      "The clinic reviews your request and contacts you to confirm a time.",
      "An initial assessment usually takes 45–60 minutes.",
      "Wear comfortable clothing you can move in.",
    ],
  },

  /* ── Online booking (Pro) — used only when features.onlineBooking is on ── */
  onlineBooking: {
    /** All times are shown and calculated in this timezone (IST). */
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    /** Length of one appointment slot in minutes (e.g. 30 or 45). */
    slotMinutes: 45,
    /** Bookable hours per weekday. An empty list = closed that day. */
    hours: {
      Monday: [{ opens: "09:00", closes: "19:00" }],
      Tuesday: [{ opens: "09:00", closes: "19:00" }],
      Wednesday: [{ opens: "09:00", closes: "19:00" }],
      Thursday: [{ opens: "09:00", closes: "19:00" }],
      Friday: [{ opens: "09:00", closes: "19:00" }],
      Saturday: [{ opens: "09:00", closes: "14:00" }],
      Sunday: [],
    } as Record<DayOfWeek, TimeRange[]>,
    /** Breaks inside opening hours (no slots offered). */
    breaks: [
      { start: "13:00", end: "14:00", label: "Lunch", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    ] as BookingBreak[],
    /** Clinic closed on these dates (more leave days can be blocked in /admin). DEMO dates. */
    holidays: [
      { date: "2026-11-08", label: "Diwali" },
      { date: "2026-12-25", label: "Christmas" },
      { date: "2027-01-26", label: "Republic Day" },
    ] as BookingHoliday[],
    /** How many days ahead patients can book (today = day 0). */
    maxDaysAhead: 30,
    /** Earliest bookable slot is at least this many minutes from now. */
    minNoticeMinutes: 60,
    /** Patients can cancel or reschedule online until this many hours before the appointment. */
    cancellationCutoffHours: 4,
    /** true = bookings are confirmed instantly. false = they wait for the clinic to confirm in /admin. */
    autoConfirm: true,
    /** Anti-spam: max upcoming bookings one phone number can hold at a time. */
    maxUpcomingPerPhone: 3,
    /** Where new-booking emails go. "" = contact.email. Can be overridden with CLINIC_NOTIFY_EMAIL. */
    clinicNotifyEmail: "",
  },

  /* ── Location ────────────────────────────────────────────────────────── */
  address: {
    lines: ["Your street", "Your area"],
    city: "Your city",
    region: "Your state",
    postalCode: "PIN",
    countryCode: "IN",
    /** Used for the JSON-LD schema. Demo value = central New Delhi. */
    geo: { latitude: 28.6315, longitude: 77.2167 },
    /** Google Maps → Share → Embed a map → copy the src URL. Demo = New Delhi city centre. */
    mapEmbedUrl:
      "https://www.google.com/maps?q=Connaught+Place,+New+Delhi&z=14&output=embed",
    mapTitle: "Clinic location on Google Maps (demo location)",
  },

  /* ── Opening hours (rendered on Contact, Book, footer and schema) ───── */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    { days: ["Saturday"], opens: "09:00", closes: "14:00" },
  ] as OpeningHours[],

  /* ── Team ────────────────────────────────────────────────────────────── */
  therapists: [
    {
      name: "Dr. Jane Doe (Demo)",
      firstName: "Jane",
      title: "Principal Physiotherapist",
      shortCredentials: "Principal Physiotherapist · BPT, MPT",
      qualifications: [
        "Bachelor of Physiotherapy (BPT)",
        "Master of Physiotherapy (MPT) – Musculoskeletal",
        "Member, Indian Association of Physiotherapists (IAP)",
        "Certified in Dry Needling",
        "Sports Physiotherapy certification",
      ],
      bio: [
        "This is sample text for the demo website. Replace it with the therapist's own story: why they became a physiotherapist and what patients can expect.",
        "Typical content: years of clinical experience, settings worked in (hospital, sports, private practice) and the kinds of patients treated — from desk workers with neck pain to athletes recovering from injury.",
        "Finish with the treatment approach, for example hands-on care combined with clear education and a practical home-exercise plan.",
      ],
      photo: "/images/therapist.jpg",
      photoAlt: "Portrait of the clinic's physiotherapist (demo placeholder image)",
    },
  ] as Therapist[],

  /* ── Page copy ───────────────────────────────────────────────────────── */
  hero: {
    eyebrow: "Physiotherapy · Your city",
    headingStart: "Expert care to get you",
    headingHighlight: "moving pain-free",
    subheading:
      "Personalised, evidence-based physiotherapy. Hands-on treatment and clear guidance so you can return to the life you love.",
    image: "/images/hero.jpg",
    imageAlt:
      "Physiotherapist guiding a patient through a resistance-band shoulder exercise",
    badgeTitle: "Appointments on request",
    badgeText: "Send a request online in minutes",
    highlights: ["One-to-one sessions", "Personalised plans"],
  },

  philosophy: [
    { title: "Listen First", text: "We take time to understand your story, goals and concerns before any treatment begins." },
    { title: "Evidence-Based", text: "Treatment is guided by current research combined with clinical experience." },
    { title: "You Are the Expert", text: "We collaborate with you — your feedback and goals drive the plan." },
    { title: "Long-Term Results", text: "We focus on lasting change, not just temporary symptom relief." },
  ],

  galleryImages: [
    {
      src: "/images/clinic-1.jpg",
      alt: "Physiotherapist supporting an older patient during a balance exercise (illustrative image)",
    },
    {
      src: "/images/clinic-2.jpg",
      alt: "Rehabilitation area with treatment tables and exercise equipment (illustrative image)",
    },
  ],

  /* ── Services (Services page, footer, booking form) ─────────────────── */
  services: [
    {
      id: "back-neck-pain",
      name: "Back & Neck Pain",
      description:
        "Targeted treatment for neck, upper back and lower back pain to restore mobility and reduce discomfort, combining manual therapy, exercise prescription and education.",
      features: ["Spinal assessment", "Manual therapy", "Posture correction", "Home exercise programs"],
      duration: "45 min",
      icon: "spine",
    },
    {
      id: "sports-injury",
      name: "Sports Injury Rehabilitation",
      description:
        "Rehab to help you recover from sports injuries, regain strength and return to performance safely. Suitable for recreational and competitive athletes.",
      features: ["Injury assessment", "Sport-specific rehab", "Return-to-play planning", "Injury prevention"],
      duration: "45–60 min",
      icon: "sports",
    },
    {
      id: "post-surgical",
      name: "Post-Surgical Rehab",
      description:
        "Structured rehabilitation after surgery to optimise recovery, restore function and help you reach your goals with confidence.",
      features: ["Pre & post-op care", "Scar management", "Progressive loading", "Functional recovery"],
      duration: "45 min",
      icon: "surgery",
    },
    {
      id: "pelvic-floor",
      name: "Pelvic Floor Therapy",
      description:
        "Care for pelvic health concerns including incontinence, pelvic pain and pre/postnatal support in a private and supportive environment.",
      features: ["Pelvic assessment", "Bladder training", "Pregnancy support", "Postnatal recovery"],
      duration: "45 min",
      icon: "pelvic",
    },
    {
      id: "vestibular-balance",
      name: "Vestibular & Balance",
      description:
        "Assessment and treatment for dizziness, vertigo and balance problems to improve stability and confidence in daily activities.",
      features: ["Vestibular assessment", "Repositioning manoeuvres", "Balance retraining", "Fall prevention"],
      duration: "45 min",
      icon: "balance",
    },
    {
      id: "manual-therapy",
      name: "Manual Therapy",
      description:
        "Hands-on techniques including joint mobilisation and soft tissue therapy to relieve pain and improve movement.",
      features: ["Joint mobilisation", "Soft tissue release", "Trigger point therapy", "Myofascial techniques"],
      duration: "30–45 min",
      icon: "hands",
    },
  ] as Service[],

  /** Home page "Conditions we help you recover from" cards */
  conditions: [
    { title: "Sports Physiotherapy", description: "Performance, recovery and injury prevention for active lives.", icon: "sports", serviceId: "sports-injury" },
    { title: "Back & Neck Pain", description: "Targeted treatment for lasting relief and better posture.", icon: "spine", serviceId: "back-neck-pain" },
    { title: "Post-Surgery Rehab", description: "Personalised rehab to restore strength, mobility and confidence.", icon: "surgery", serviceId: "post-surgical" },
    { title: "Movement & Wellness", description: "Improve mobility, prevent injury and move with ease every day.", icon: "wellness" },
  ] as Condition[],

  faq: [
    {
      q: "Do I need a referral?",
      a: "No. You can book directly with us. If you have reports or a referral from your doctor, please bring them to your first visit.",
    },
    {
      q: "What should I wear?",
      a: "Wear comfortable, loose-fitting clothes you can move in — for example shorts or activewear for lower body, and a T-shirt for upper body assessments. Supportive footwear is helpful if you have leg or mobility concerns.",
    },
    {
      q: "How many sessions will I need?",
      a: "It depends on your condition, goals and how your body responds. After your first assessment we will outline a clear plan and expected timeline.",
    },
    {
      q: "How long is a session?",
      a: "An initial assessment usually takes 45–60 minutes. Follow-up sessions are typically 30–45 minutes, depending on your treatment plan.",
    },
  ],

  /* ── Sample content (replace with real figures / reviews) ───────────── */
  stats: [
    { value: 500, suffix: "+", label: "Patients treated", isSample: true },
    { value: 10, suffix: "+", label: "Years of experience", isSample: true },
    { value: 6, label: "Specialised services", isSample: true },
    { value: 45, suffix: " min", label: "Initial assessment", isSample: true },
  ] as Stat[],

  testimonials: [
    {
      quote: "The therapist listened, explained everything clearly, and helped me get back to running after months of knee pain.",
      name: "Sample patient A.",
      detail: "Runner · Knee injury",
      rating: 5,
      isSample: true,
    },
    {
      quote: "After my shoulder surgery the rehab plan was clear and progressive. I always knew what the next step was.",
      name: "Sample patient B.",
      detail: "Post-surgical rehab",
      rating: 5,
      isSample: true,
    },
    {
      quote: "Practical advice about my desk setup and a short daily routine made a real difference to my neck pain.",
      name: "Sample patient C.",
      detail: "Office worker · Neck pain",
      rating: 5,
      isSample: true,
    },
    {
      quote: "Private, respectful and supportive care for my postnatal recovery. I felt comfortable from the first visit.",
      name: "Sample patient D.",
      detail: "Pelvic floor therapy",
      rating: 5,
      isSample: true,
    },
    {
      quote: "Clear communication, hands-on treatment and a home exercise programme that I could actually stick to.",
      name: "Sample patient E.",
      detail: "Lower back pain",
      rating: 5,
      isSample: true,
    },
    {
      quote: "The balance sessions helped my father feel more confident walking at home again.",
      name: "Sample patient F.",
      detail: "Balance · Elderly care",
      rating: 5,
      isSample: true,
    },
  ] as Testimonial[],

  /* ── Social links (leave "" to hide) ─────────────────────────────────── */
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    linkedin: "",
    googleBusiness: "",
  },

  /* ── Legal (Privacy Policy & Terms, DPDP Act 2023) ──────────────────── */
  legal: {
    /** Legal entity that runs the clinic (the "Data Fiduciary") */
    entityName: "Your Clinic Physiotherapy (demo entity)",
    grievanceOfficer: {
      name: "Clinic Manager (demo)",
      email: "privacy@yourclinic.example",
      phone: "+91 98XXX XXXXX",
    },
    /** How long appointment enquiries are kept if they don't become a patient record */
    enquiryRetentionMonths: 12,
    /** Courts with jurisdiction for the Terms */
    jurisdictionCity: "Your city",
    lastUpdated: "2026-10-30",
  },

  /* ── SEO defaults ────────────────────────────────────────────────────── */
  seo: {
    /**
     * Production URL, no trailing slash, e.g. "https://www.yourclinic.in".
     * Used for canonical URLs, sitemap, robots and Open Graph tags.
     * Leave "" to fall back to NEXT_PUBLIC_SITE_URL, then Vercel's production URL.
     */
    siteUrl: "",
    defaultTitle: "Your Clinic Physiotherapy | Expert Physiotherapy in Your City",
    titleTemplate: "%s | Your Clinic Physiotherapy",
    defaultDescription:
      "Personalised physiotherapy for back and neck pain, sports injuries, post-surgical rehab and more. Request an appointment online or on WhatsApp.",
    keywords: [
      "physiotherapy",
      "physiotherapist near me",
      "back pain treatment",
      "sports injury rehab",
      "post surgical physiotherapy",
    ],
    locale: "en_IN",
    language: "en-IN",
    /** Optional @handle for Twitter/X cards */
    twitterHandle: "",
  },
};

export type SiteConfig = typeof siteConfig;
export default siteConfig;
