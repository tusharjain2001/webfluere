export function Footer() {
  return (
    <footer className="relative z-10 border-t border-smoke/50 bg-plate">
      <div className="mx-auto grid max-w-[1400px] items-end gap-6 px-5 py-12 text-sm text-pewter md:grid-cols-3 md:px-10 md:py-16">
        <p className="text-[clamp(2.5rem,6vw,5rem)] leading-none font-semibold tracking-[-0.04em] text-silver">Webfluere</p>
        <p className="md:text-center">Websites and apps, designed and built by one team</p>
        <div className="flex justify-between gap-6 md:justify-end md:gap-10">
          <p>&copy; {new Date().getFullYear()} Webfluere</p>
          <a href="#top" className="transition-colors duration-200 hover:text-silver">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
