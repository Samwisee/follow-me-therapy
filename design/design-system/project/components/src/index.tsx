import * as React from 'react';
import { LOGO } from './logo';

type Tone = 'purple' | 'teal' | 'sun' | 'pink';
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');

/* ── Icons (24px inline, 40px tile) ── */
const ICON24: Record<string, string> = {
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0"/><path d="M9 9.8v.1M15 9.8v.1"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10.5l5-3v9l-5-3"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6v.1"/>',
  book: '<path d="M3 5.5c3-1.3 6-1.3 9 .5 3-1.8 6-1.8 9-.5V19c-3-1.3-6-1.3-9 .5-3-1.8-6-1.8-9-.5z"/><path d="M12 6v13.5"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  chevron: '<path d="M9 5l7 7-7 7"/>',
};
const FOOT = '<ellipse cx="11.5" cy="3.1" rx="2.05" ry="2.55"/><circle cx="8.15" cy="2.25" r="1.35"/><circle cx="5.85" cy="2.9" r="1.2"/><circle cx="3.95" cy="4.15" r="1.05"/><circle cx="2.55" cy="5.85" r="0.9"/><path d="M7.6 6.6C11.2 6.2 13.9 7.8 13.6 10.8 13.4 12.8 11.4 14 10.9 16.2 10.5 18 11.6 19.4 11.2 21.2 10.8 23.2 9.3 24 7.7 24 5.6 24 4.3 22.7 4.3 20.6 4.3 17.6 3 15.8 2.8 12.8 2.5 9.2 4.4 6.9 7.6 6.6Z"/>';
const ICON40: Record<string, { d: string; filled?: boolean }> = {
  footprints: { filled: true, d: `<g transform="translate(6 7) rotate(-6 8 12) scale(.95)">${FOOT}</g><g transform="translate(19 4) rotate(6 8 12) scale(.95)"><g transform="translate(16 0) scale(-1 1)">${FOOT}</g></g>` },
  stairs: { d: '<path d="M6 33h8v-7h7v-7h7v-7h6"/><path d="M30 12V5l5 2.5-5 2.5"/>' },
  blocks: { d: '<rect x="6" y="22" width="12" height="12" rx="2.5"/><rect x="22" y="22" width="12" height="12" rx="2.5"/><rect x="14" y="7" width="12" height="12" rx="2.5" transform="rotate(8 20 13)"/>' },
  clipboard: { d: '<rect x="9" y="7" width="22" height="28" rx="4"/><rect x="15" y="4" width="10" height="6" rx="2"/><path d="M15 22l4 4 7-8"/>' },
  'hands-heart': { d: '<path d="M20 21c-4.2-3-7-5.6-7-8.6a3.6 3.6 0 0 1 7-1.3 3.6 3.6 0 0 1 7 1.3c0 3-2.8 5.6-7 8.6z"/><path d="M5 26h5.5l6 3.5h6.5a2.4 2.4 0 0 0 0-4.8h-4.5"/><path d="M10.5 33h11l11-6.6a2.3 2.3 0 0 0-2.6-3.7L24 25.7"/><path d="M5 23v13"/>' },
  'medicare-cross': { d: '<rect x="7" y="7" width="26" height="26" rx="7"/><path d="M20 13v14M13 20h14"/>' },
  'shield-tick': { d: '<path d="M20 5l12 5v9c0 8-5 13-12 16C13 32 8 27 8 19v-9z"/><path d="M15 20l4 4 7-8"/>' },
};
export type Icon24Name = keyof typeof ICON24;
export type Icon40Name = keyof typeof ICON40;

/** A 24×24 line icon in the current text colour. Decorative unless `label` is set. */
export function Icon({ name, label }: { name: Icon24Name; label?: string }) {
  return <svg viewBox="0 0 24 24" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
    dangerouslySetInnerHTML={{ __html: (label ? `<title>${label}</title>` : '') + ICON24[name] }} />;
}

/* ── Chip ── */
export interface ChipProps { tone?: Tone | 'outline'; icon?: Icon24Name; live?: string; href?: string; children?: React.ReactNode }
/** A bordered pastel pill that states one fact. Purple = who, teal = telehealth, sun = in person, pink = reports. */
export function Chip({ tone = 'purple', icon, live, href, children }: ChipProps) {
  const inner = <>{icon && <Icon name={icon} />}{children}{live && <span className="fmt-live">{live}</span>}</>;
  return <li className={cx('fmt-chip', 'is-' + tone)}>{href ? <a href={href}>{inner}</a> : inner}</li>;
}
/** A list of chips; `stacked` centres them in a column. */
export function Chips({ stacked, children }: { stacked?: boolean; children?: React.ReactNode }) {
  return <ul className={cx('fmt-chips', stacked && 'is-stacked')}>{children}</ul>;
}

/* ── Tag ── */
export interface TagProps { tone?: Tone; children?: React.ReactNode }
/** A small solid label above a title. Sun takes ink text; the others white. */
export function Tag({ tone = 'purple', children }: TagProps) {
  return <span className={cx('fmt-tag', tone !== 'purple' && 'is-' + tone)}>{children}</span>;
}

/* ── TickList ── */
export interface TickListProps { items: React.ReactNode[]; blank?: boolean }
/** Plain ticked lines. `blank` draws empty boxes to tick by hand on paper. */
export function TickList({ items, blank }: TickListProps) {
  return <ul className={cx('fmt-ticks', blank && 'is-blank')}>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>;
}

/* ── InfoNote ── */
export interface InfoNoteProps { kind?: 'info' | 'evidence' | 'promise'; children?: React.ReactNode }
/** A tinted strip with a round badge: a caveat (info), research (evidence) or the practice's promise. */
export function InfoNote({ kind = 'info', children }: InfoNoteProps) {
  const icon = kind === 'evidence' ? 'book' : kind === 'promise' ? 'heart' : 'info';
  return <p className={cx('fmt-note', kind === 'evidence' && 'is-teal', kind === 'promise' && 'is-promise')}><i><Icon name={icon} /></i><span>{children}</span></p>;
}

/* ── IconTile ── */
export interface IconTileProps { icon: Icon40Name; tone?: Tone; small?: boolean; label?: string }
/** A rounded tint square with a 40×40 icon in the matching colour. */
export function IconTile({ icon, tone = 'purple', small, label }: IconTileProps) {
  const ic = ICON40[icon];
  return <span className={cx('fmt-tile', 'is-' + tone, small && 'is-small')} role={label ? 'img' : undefined} aria-label={label}>
    <svg viewBox="0 0 40 40" aria-hidden="true" className={ic.filled ? 'is-filled' : undefined} dangerouslySetInnerHTML={{ __html: ic.d }} />
  </span>;
}

/* ── Card ── */
export interface CardProps { icon: Icon40Name; tone?: Tone; title: string; more?: string; href?: string; children?: React.ReactNode }
/** A service or funding card: tile, title, one or two sentences, and a "Learn more ›" line. */
export function Card({ icon, tone = 'purple', title, more = 'Learn more', href, children }: CardProps) {
  const body = <>
    <IconTile icon={icon} tone={tone} />
    <h3>{title}</h3>
    {children && <p>{children}</p>}
    {more && <span className="fmt-more">{more}<Icon name="chevron" /></span>}
  </>;
  return href ? <a className="fmt-card" href={href} style={{ textDecoration: 'none' }}>{body}</a> : <div className="fmt-card">{body}</div>;
}

/* ── Button ── */
export interface ButtonProps { variant?: 'primary' | 'teal' | 'quiet'; href?: string; onClick?: () => void; children?: React.ReactNode }
/** Pill button in the heading face; one primary per view. Quiet ones end with a chevron. */
export function Button({ variant = 'primary', href, onClick, children }: ButtonProps) {
  const cls = cx('fmt-btn', variant !== 'primary' && 'is-' + variant);
  const inner = <>{children}{variant === 'quiet' && <Icon name="chevron" />}</>;
  return href ? <a className={cls} href={href}>{inner}</a> : <button type="button" className={cls} onClick={onClick}>{inner}</button>;
}

/* ── FootstepTrail ── */
export interface FootstepTrailProps { steps?: number; direction?: 'across' | 'down'; ink?: 'light' | 'strong' | 'sun' | 'teal'; size?: number }
/** Anatomical left and right footprints walking across or down. Decorative. */
export function FootstepTrail({ steps = 7, direction = 'across', ink = 'light', size }: FootstepTrailProps) {
  return <span aria-hidden="true" className={cx('fmt-trail', direction === 'down' && 'is-down', ink !== 'light' && 'is-' + ink)}
    style={size ? ({ '--step': size + 'px' } as React.CSSProperties) : undefined}>
    {Array.from({ length: steps }, (_, i) => <i key={i} />)}
  </span>;
}

/* ── StepPath ── */
export interface Step { label: string; done?: boolean }
export interface StepPathProps { steps: Step[]; direction?: 'across' | 'down'; doneText?: string }
/** Numbered steps joined by footprints. An ordered list, so screen readers hear the order. */
export function StepPath({ steps, direction = 'across', doneText = 'done' }: StepPathProps) {
  return <ol className={cx('fmt-steps', direction === 'down' && 'is-down')}>
    {steps.map((s, i) => <li key={i} className={s.done ? 'is-done' : undefined}>
      <span className="fmt-step">{s.label}{s.done && <span className="fmt-sr"> ({doneText})</span>}</span>
    </li>)}
  </ol>;
}

/* ── Logo ── */
export interface LogoProps { variant?: 'stacked' | 'horizontal' | 'mark'; inverse?: boolean; height?: number | string; label?: string }
/** The mark and lockups, drawn in `brand-ink` (the same token as the name) or white with `inverse`. */
export function Logo({ variant = 'horizontal', inverse, height = 48, label = 'Follow Me Therapy' }: LogoProps) {
  const l = LOGO[variant];
  return <svg viewBox={l.viewBox} role="img" aria-label={label}
    style={{ height, width: 'auto', color: inverse ? 'var(--paper)' : 'var(--brand-ink)', display: 'block' }}
    dangerouslySetInnerHTML={{ __html: `<title>${label}</title>` + l.body }} />;
}

/* ── Swash ── */
/** The hand-drawn sun underline for one key word. */
export function Swash({ children }: { children?: React.ReactNode }) {
  return <span className="fmt-swash">{children}</span>;
}

/* ── Print: Worksheet and BookPage ── */
export interface WorksheetProps { tag?: string; tagTone?: Tone; title: React.ReactNode; name?: boolean; tip?: React.ReactNode; children?: React.ReactNode }
/** An A4 handout (210 × 297 mm): tinted header, the activity, a tip for grown-ups and the footer. */
export function Worksheet({ tag, tagTone = 'teal', title, name = true, tip, children }: WorksheetProps) {
  return <section className="fmt-sheet">
    <header className="fmt-head">
      <div>{tag && <Tag tone={tagTone}>{tag}</Tag>}<h1 style={{ marginTop: '3mm' }}>{title}</h1></div>
      {name && <div className="fmt-name">Name<span /></div>}
    </header>
    {children}
    {tip && <InfoNote kind="evidence"><b style={{ color: 'var(--ink)' }}>For grown-ups: </b>{tip}</InfoNote>}
    <footer className="fmt-foot"><Logo variant="horizontal" height="9mm" /><span>Simone · Paediatric OT · followmetherapy.com.au</span><FootstepTrail steps={5} size={10} /></footer>
  </section>;
}
export interface BookPageProps { side?: 'left' | 'right'; folio?: number; ground?: 'paper' | 'teal-tint' | 'purple-tint' | 'butter'; children?: React.ReactNode }
/** One A5 staple-book page (148 × 210 mm) with the fold-side margin on the correct side. */
export function BookPage({ side = 'right', folio, ground = 'paper', children }: BookPageProps) {
  return <section className={cx('fmt-page', side === 'left' && 'is-left')} style={{ background: `var(--${ground})` }}>
    {children}
    {folio != null && <span className="fmt-folio" style={{ marginTop: 'auto', alignSelf: side === 'left' ? 'flex-start' : 'flex-end' }}>{folio}</span>}
  </section>;
}
