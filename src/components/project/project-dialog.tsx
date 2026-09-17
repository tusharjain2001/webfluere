import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type FormEvent, type ReactNode } from 'react'
import { ArrowUpRight, CheckCircle, X } from '@phosphor-icons/react'
import { PlateAction } from '@/components/ui/plate-button'
import { site } from '@/lib/site'
import { cn } from '@/lib/utils'

type ProjectDialog = { open: () => void }

const ProjectDialogContext = createContext<ProjectDialog>({ open: () => {} })

export const useProjectDialog = () => useContext(ProjectDialogContext)

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Owns the one conversion path: a short project form (name, email, message) in a modal dialog.
 * Submissions go to Web3Forms, which emails them to the address the access key belongs to.
 * `onOpenChange` lets the page pause smooth scrolling while the form is open.
 */
export function ProjectDialogProvider({ children, onOpenChange }: { children: ReactNode; onOpenChange?: (open: boolean) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  const open = useCallback(() => {
    const el = dialog.current
    if (!el || el.open) return
    setStatus((s) => (s === 'sent' ? 'idle' : s))
    el.showModal()
    onOpenChange?.(true)
  }, [onOpenChange])

  const close = () => dialog.current?.close()

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onClose = () => onOpenChange?.(false)
    el.addEventListener('close', onClose)
    return () => el.removeEventListener('close', onClose)
  }, [onOpenChange])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    if (data.botcheck) return

    if (!site.formKey) {
      console.error('Project form: set VITE_WEB3FORMS_KEY in .env.local to receive submissions by email.')
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.formKey,
          subject: `New project enquiry from ${data.name}`,
          from_name: 'Webfluere website',
          replyto: data.email,
          Name: data.name,
          Email: data.email,
          Message: data.message,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message ?? 'Submission failed')
      form.reset()
      setStatus('sent')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <ProjectDialogContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="project-title"
        data-lenis-prevent
        onClick={(e) => {
          // Clicks on the dimmed area around the panel close the form.
          if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop !== undefined) close()
        }}
        className="project-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 text-silver"
      >
        <div data-backdrop className="flex min-h-full items-end justify-center md:items-center md:p-8">
          <div className="project-panel relative w-full max-w-[560px] overflow-hidden rounded-t-[6px] border border-smoke/70 bg-plate-raised shadow-[0_40px_120px_-30px_rgba(30,111,230,0.45)] md:rounded-[4px]">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(30,111,230,0.22),transparent_70%)]" />
            <button
              type="button"
              onClick={close}
              aria-label="Close the project form"
              className="absolute top-4 right-4 z-10 grid size-10 cursor-pointer place-items-center rounded-full text-pewter transition-colors duration-200 hover:bg-smoke/60 hover:text-silver"
            >
              <X className="size-5" />
            </button>

            {status === 'sent' ? (
              <div className="relative flex flex-col items-center px-6 py-16 text-center md:px-12 md:py-20">
                <CheckCircle aria-hidden weight="fill" className="size-12 text-sky" />
                <h2 id="project-title" className="mt-6 text-3xl font-semibold tracking-[-0.03em]">
                  Thanks, it&rsquo;s with us.
                </h2>
                <p className="mt-4 max-w-[38ch] leading-relaxed text-pewter">
                  We read every message and will reply to your email soon. You can also find us on Instagram at{' '}
                  <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="text-sky underline decoration-sky/40 hover:decoration-sky">
                    {site.instagramHandle}
                  </a>
                  .
                </p>
                <PlateAction onClick={close} variant="hairline" className="mt-10">
                  Close
                </PlateAction>
              </div>
            ) : (
              <form onSubmit={submit} className="relative px-5 pt-10 pb-6 md:px-10 md:pt-12 md:pb-10">
                <h2 id="project-title" className="pr-10 text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.05] font-semibold tracking-[-0.03em]">
                  Tell us about <span className="text-sky">your project.</span>
                </h2>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-pewter">We&rsquo;ll reply to your email.</p>

                <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                <div className="mt-8 grid gap-5">
                  <Field label="Name" name="name" autoComplete="name" required />
                  <Field label="Email" name="email" type="email" autoComplete="email" required />
                  <label className="grid gap-2">
                    <span className="text-sm text-pewter">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your business and what you want to build."
                      className={cn(inputClass, 'h-auto min-h-32 resize-y py-3 leading-relaxed')}
                    />
                  </label>
                </div>

                {status === 'error' && (
                  <p role="alert" className="mt-6 rounded-[2px] border border-[#ff8a8a]/40 bg-[#ff8a8a]/10 px-4 py-3 text-sm leading-relaxed text-[#ffc2c2]">
                    Something went wrong sending your message. Please try again, or message us on Instagram at{' '}
                    <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="underline">
                      {site.instagramHandle}
                    </a>
                    .
                  </p>
                )}

                <PlateAction type="submit" disabled={status === 'sending'} className="mt-8 w-full">
                  {status === 'sending' ? 'Sending' : 'Send message'}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </PlateAction>
              </form>
            )}
          </div>
        </div>
      </dialog>
    </ProjectDialogContext.Provider>
  )
}

const inputClass =
  'h-12 w-full rounded-[2px] border border-smoke bg-plate/70 px-4 text-base text-silver transition-colors duration-200 placeholder:text-pewter/60 hover:border-pewter/60 focus:border-sky focus:ring-1 focus:ring-sky focus:outline-none focus-visible:outline-none user-invalid:border-[#ff8a8a]'

function Field({ label, ...props }: { label: string; name: string } & ComponentProps<'input'>) {
  return (
    <label className="grid gap-2">
      <span className="text-sm text-pewter">{label}</span>
      <input {...props} className={inputClass} />
    </label>
  )
}

/** The primary call to action anywhere on the page. */
export function StartProjectButton({ size, className, children }: { size?: 'md' | 'sm'; className?: string; children?: ReactNode }) {
  const { open } = useProjectDialog()
  return (
    <PlateAction size={size} className={className} onClick={open} aria-haspopup="dialog">
      {site.cta}
      {children}
    </PlateAction>
  )
}
