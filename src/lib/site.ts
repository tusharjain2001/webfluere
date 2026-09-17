// Single source for contact details, claims and proof. Values in [brackets] are placeholders
// from the brand brief. Replace them before launch; never invent numbers, clients or quotes.
export const site = {
  name: 'Webfluere',
  claim: '20+ projects shipped',
  instagramHandle: '@web_fluere',
  instagramUrl: 'https://www.instagram.com/web_fluere/',
  cta: 'Start a project',
  /** Web3Forms access key (web3forms.com). Submissions are emailed to the address the key was created with. */
  formKey: import.meta.env.VITE_WEB3FORMS_KEY as string | undefined,
}

export const isPlaceholder = (value: string) => value.startsWith('[')

/** Original concept designs made by Webfluere. Always labelled as concepts. */
export const concepts = [
  { slug: 'aurel', name: 'Aurel', kind: 'Product website', phone: false, alt: 'Aurel concept: a dark product page for a wireless speaker with a sculpted 3D sphere' },
  { slug: 'tidewell', name: 'Tidewell', kind: 'Habit tracker app', phone: true, alt: 'Tidewell concept: a mobile habit tracker with a daily progress ring and checklist' },
  { slug: 'kiln', name: 'Kiln & Crumb', kind: 'Bakery website', phone: false, focus: 'object-left-top', alt: 'Kiln & Crumb concept: a bakery homepage with a large headline and a bread illustration' },
  { slug: 'fieldnote', name: 'Fieldnote', kind: 'Shop dashboard', phone: false, focus: 'object-left-top', alt: 'Fieldnote concept: a web dashboard with sales figures, a weekly chart and recent orders' },
  { slug: 'luma', name: 'Luma Clinic', kind: 'Booking app', phone: true, alt: 'Luma Clinic concept: a mobile booking screen for choosing a doctor, a day and a time' },
  { slug: 'marrow', name: 'Marrow', kind: 'Architecture studio site', phone: false, alt: 'Marrow concept: an architecture studio homepage with bold type and a building photograph' },
]

export type ClientProject = { name: string; summary: string; image: string; imageAlt: string; url?: string }
export type Testimonial = { quote: string; name: string; role: string; company?: string }

/** Real, permitted client work only. Empty until the user supplies material; the section hides while empty. */
export const clientProjects: ClientProject[] = []

/** Real, permitted client quotes only (max 3 lines each). Empty until supplied. */
export const testimonials: Testimonial[] = []
