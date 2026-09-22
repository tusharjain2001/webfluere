// Single source for contact details, claims and proof. Values in [brackets] are placeholders
// from the brand brief. Replace them before launch; never invent numbers, clients or quotes.
// Webfluere is led by its founder, Tushar, so his verified Upwork record is the agency's record.
export const site = {
  name: 'Webfluere',
  claim: '20+ projects shipped',
  instagramHandle: '@web_fluere',
  instagramUrl: 'https://www.instagram.com/web_fluere/',
  cta: 'Start a project',
  /** Public Upwork profile. While it is a [placeholder], the "read every review" link stays hidden. */
  upworkUrl: 'https://www.upwork.com/freelancers/tusharjain2001',
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
export type Testimonial = { quote: string; project: string; date: string }

/**
 * Verified numbers from the founder's Upwork profile (Tushar J., Top Rated), checked against screenshots on
 * 2026-09-22. Update them when the profile changes; never round up. Earnings, hours and job prices are left
 * out on purpose because small per-job figures undersell agency work.
 */
export const stats = [
  { value: '5.0', label: 'Average rating', note: '8 of 8 completed Upwork jobs rated five stars' },
  { value: '100%', label: 'Job Success', note: 'Upwork’s score for delivering what was agreed' },
  { value: 'Top Rated', label: 'On Upwork', note: 'A badge Upwork gives its most consistent freelancers' },
  { value: '20+', label: 'Projects shipped', note: 'Websites, landing pages and web apps, live' },
]

/** Qualities clients endorsed in their Upwork reviews, with how many clients named each (Upwork "Insights"). */
export const endorsements = [
  { label: 'Detail oriented', count: 2 },
  { label: 'Accountable for outcomes', count: 1 },
  { label: 'Clear communicator', count: 1 },
  { label: 'Committed to quality', count: 1 },
  { label: 'Reliable', count: 1 },
  { label: 'Solution oriented', count: 1 },
  { label: 'Collaborative', count: 1 },
  { label: 'Professional', count: 1 },
]

/**
 * Unedited screenshots of all 8 completed Upwork jobs (public/proof/), best quotes first. Width and height are the
 * files' real pixel sizes; they are 1x captures, so they are never shown larger than that.
 */
export const reviewShots = [
  { src: '/proof/nextjs-landing-page.png', width: 776, height: 222, alt: 'Upwork review, five stars: Need to Deploy Ready Next.js Landing Page, Oct to Nov 2025. "Tushar is a professional & quite experienced developer, It was really a pleasure & smooth experience working with him, Highly Recommended." Endorsed: Collaborative, Professional.' },
  { src: '/proof/responsive-website-psd.png', width: 779, height: 223, alt: 'Upwork review, five stars: A Simple Responsive Website, Dec 2025 to Jan 2026. "I was specifically looking for a provider who could take my PSD files for desktop & mobile layouts and make a site that flows that way. That’s what Tushar provided." Endorsed: Clear Communicator, Detail Oriented.' },
  { src: '/proof/website-clone-html.png', width: 728, height: 200, alt: 'Upwork review, five stars: Experienced Web Developer Wanted For Cloning Website, Feb 2026. "Tushar was able to start right away and deliver the following HTML template on time. Thanks Again." Endorsed: Reliable, Detail Oriented, Accountable for Outcomes.' },
  { src: '/proof/figma-to-frontend.png', width: 594, height: 243, alt: 'Upwork review, five stars: Website Frontend Coding from Figma Design, Jun 2026. Endorsed: Front-End Development, HTML, Committed to Quality, Solution Oriented.' },
  { src: '/proof/react-landing-pages.png', width: 528, height: 167, alt: 'Upwork review, five stars: React Developer for Web Landing Pages, Jul 2026. Skills: React, Landing Page, Next.js, JavaScript, ExpressJS.' },
  { src: '/proof/ecommerce-frontend.png', width: 436, height: 138, alt: 'Upwork review, five stars: Develop ecom website frontend in 1 week, Sep to Nov 2025. "excellent"' },
  { src: '/proof/node-dev.png', width: 447, height: 145, alt: 'Upwork review, five stars: Node dev, Nov 2025 to Feb 2026. "excellent"' },
  { src: '/proof/javascript-fix.png', width: 357, height: 97, alt: 'Upwork review, five stars: Javascript fix, Dec 2025.' },
]

/** Real, permitted client work only. Empty until the user supplies material; the grid hides while empty. */
export const clientProjects: ClientProject[] = []

/** Word-for-word Upwork reviews (five stars each). Clients are anonymous on Upwork, so we cite the job instead. */
export const testimonials: Testimonial[] = [
  {
    quote: 'Tushar is a professional & quite experienced developer, It was really a pleasure & smooth experience working with him, Highly Recommended.',
    project: 'Next.js landing page deployment',
    date: 'Nov 2025',
  },
  {
    quote: 'I was specifically looking for a provider who could take my PSD files for desktop & mobile layouts and make a site that flows that way. That’s what Tushar provided.',
    project: 'Responsive website from PSD',
    date: 'Jan 2026',
  },
  {
    quote: 'Tushar was able to start right away and deliver the following HTML template on time. Thanks Again',
    project: 'Website rebuild in HTML & CSS',
    date: 'Feb 2026',
  },
]

export type Partner = {
  name: string
  role: string
  bio: string
  skills: string[]
  photo: string
  initials: string
  linkedin: string
  github: string
  upwork?: string
}

/**
 * The two partners, both developers with 2 years of experience each (confirmed by the user, 2026-09-22). Photos go in public/team/; until a file
 * exists the card shows initials. A [placeholder] bio is hidden in production, so never fill it with guesses.
 */
export const partners: Partner[] = [
  {
    name: 'Tushar Jain',
    role: 'Co-founder, developer',
    bio: 'Two years building with React and Next.js, turning Figma and PSD designs into fast, responsive websites. Top Rated on Upwork with a 100% Job Success score.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    photo: '/team/tushar.jpg',
    initials: 'TJ',
    linkedin: 'https://www.linkedin.com/in/tushar-jain2001/',
    github: 'https://github.com/tusharjain2001',
    upwork: 'https://www.upwork.com/freelancers/tusharjain2001',
  },
  {
    name: 'Manan Utsav',
    role: 'Co-founder, developer',
    bio: 'Two years building websites and web apps, from the front end people see to the back end that runs it.',
    skills: [],
    photo: '/team/manan.jpg',
    initials: 'MU',
    linkedin: 'https://www.linkedin.com/in/manan-utsav-a9679b1b6/',
    github: 'https://github.com/MananUtsav07',
  },
]
