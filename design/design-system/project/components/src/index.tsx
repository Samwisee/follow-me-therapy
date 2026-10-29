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
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.8l6.1-.9z"/>',
};
const FOOT = '<ellipse cx="11.5" cy="3.1" rx="2.05" ry="2.55"/><circle cx="8.15" cy="2.25" r="1.35"/><circle cx="5.85" cy="2.9" r="1.2"/><circle cx="3.95" cy="4.15" r="1.05"/><circle cx="2.55" cy="5.85" r="0.9"/><path d="M7.6 6.6C11.2 6.2 13.9 7.8 13.6 10.8 13.4 12.8 11.4 14 10.9 16.2 10.5 18 11.6 19.4 11.2 21.2 10.8 23.2 9.3 24 7.7 24 5.6 24 4.3 22.7 4.3 20.6 4.3 17.6 3 15.8 2.8 12.8 2.5 9.2 4.4 6.9 7.6 6.6Z"/>';
const ICON40: Record<string, { d: string; filled?: boolean }> = {
  footprints: { filled: true, d: `<g transform="translate(6 7) rotate(-6 8 12) scale(.95)">${FOOT}</g><g transform="translate(19 4) rotate(6 8 12) scale(.95)"><g transform="translate(16 0) scale(-1 1)">${FOOT}</g></g>` },
  stairs: { d: '<path d="M6 31h8v-7h7v-7h7v-7h6"/>' },
  blocks: { d: '<rect x="6" y="22" width="12" height="12" rx="2.5"/><rect x="22" y="22" width="12" height="12" rx="2.5"/><rect x="14" y="7" width="12" height="12" rx="2.5" transform="rotate(8 20 13)"/>' },
  clipboard: { d: '<rect x="9" y="7" width="22" height="28" rx="4"/><rect x="15" y="4" width="10" height="6" rx="2"/><path d="M15 22l4 4 7-8"/>' },
  umbrella: { d: '<path d="M6 20a14 14 0 0 1 28 0"/><path d="M6 20c2.3-2.2 4.7-2.2 7 0 2.3-2.2 4.7-2.2 7 0 2.3-2.2 4.7-2.2 7 0 2.3-2.2 4.7-2.2 7 0"/><path d="M20 20v10.5a3.5 3.5 0 0 1-7 0"/><path d="M20 6V4"/>' },
  'medicare-cross': { d: '<rect x="7" y="7" width="26" height="26" rx="7"/><path d="M20 13v14M13 20h14"/>' },
  'shield-tick': { d: '<path d="M20 5l12 5v9c0 8-5 13-12 16C13 32 8 27 8 19v-9z"/><path d="M15 20l4 4 7-8"/>' },
  // Calm-down strategies (worksheets and, later, the app)
  breathe: { d: '<path d="M7 16h17a5 5 0 1 0-5-5"/><path d="M7 24h21a5 5 0 1 1-5 5"/><path d="M7 20h11"/>' },
  cushion: { d: '<path d="M9 11c7 3 15 3 22 0c-2 6-2 12 0 18c-7-3-15-3-22 0c2-6 2-12 0-18z"/>' },
  'push-wall': { d: '<path d="M32 6v28"/><path d="M26 13v11"/><path d="M22 11v13"/><path d="M18 12v12"/><path d="M14 16v11a6 6 0 0 0 6 6h3a3 3 0 0 0 3-3v-6"/>' },
  water: { d: '<path d="M11 9h18l-2.5 23h-13z"/><path d="M12.5 18h15"/>' },
  hug: { d: '<path d="M20 32s-11-7-11-15a6 6 0 0 1 11-3.5a6 6 0 0 1 11 3.5c0 8-11 15-11 15z"/>' },
  'quiet-spot': { d: '<path d="M5 32L20 8l15 24z"/><path d="M15 32l5-8 5 8"/>' },
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
  const cls = cx('fmt-card', tone !== 'purple' && 'is-' + tone);
  return href ? <a className={cls} href={href} style={{ textDecoration: 'none' }}>{body}</a> : <div className={cls}>{body}</div>;
}

/* ── ActionCard ── */
export interface ActionCardProps { tone?: 'purple' | 'teal'; title: string; action: string; href?: string; children?: React.ReactNode }
/** A choice with one full-width button at its foot (Ready to start? / Have a question?), wrapped in its colour. */
export function ActionCard({ tone = 'purple', title, action, href = '#', children }: ActionCardProps) {
  return <div className={cx('fmt-card', 'is-action', tone !== 'purple' && 'is-' + tone)}>
    <h3>{title}</h3>
    {children && <p>{children}</p>}
    <a className={cx('fmt-btn', tone !== 'purple' && 'is-' + tone)} href={href}>{action}</a>
  </div>;
}

/* ── SectionTitle ── */
export interface SectionTitleProps { title: string; subtitle?: React.ReactNode; accent?: 'purple' | 'teal' | 'sun' }
/** Every section's title: centred, a squiggle in the band's accent, an optional subtitle. */
export function SectionTitle({ title, subtitle, accent = 'purple' }: SectionTitleProps) {
  return <header className={cx('fmt-title', accent !== 'purple' && 'is-' + accent)}><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</header>;
}

/* ── Button ── */
export interface ButtonProps { variant?: 'primary' | 'teal' | 'quiet'; outline?: boolean; href?: string; onClick?: () => void; children?: React.ReactNode }
/** Pill button in the heading face; one primary per view. Teal is "Ask a question". Quiet ones end with a chevron. */
export function Button({ variant = 'primary', outline, href, onClick, children }: ButtonProps) {
  const cls = cx('fmt-btn', variant !== 'primary' && 'is-' + variant, outline && 'is-outline');
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
export interface StepPathProps { steps: Step[]; direction?: 'across' | 'down'; doneText?: string; plain?: boolean; kid?: boolean }
/** Numbered steps joined by footprints (`plain`: numbers only; `kid`: child-sized labels). An ordered list, so screen readers hear the order. */
export function StepPath({ steps, direction = 'across', doneText = 'done', plain, kid }: StepPathProps) {
  return <ol className={cx('fmt-steps', direction === 'down' && 'is-down', plain && 'is-plain', kid && 'is-kid')}>
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

/* ── Activity parts: the same on paper, tablet, phone and the app ── */
/** A heading and what it introduces, group-gap apart. `fill` takes the spare height. */
export function Group({ title, fill, children }: { title?: React.ReactNode; fill?: boolean; children?: React.ReactNode }) {
  return <div className={cx('fmt-group', fill && 'is-fill')}>{title && <h2>{title}</h2>}{children}</div>;
}
/** Lines to write on (`kid`: wider spacing for a child's writing). */
export function WriteLines({ lines = 2, kid }: { lines?: number; kid?: boolean }) {
  return <div className={cx('fmt-write', kid && 'is-kid')} aria-hidden="true">{Array.from({ length: lines }, (_, i) => <i key={i} />)}</div>;
}
/** A dashed box to draw in, with its prompt at the foot. */
export function DrawBox({ prompt, fill }: { prompt?: React.ReactNode; fill?: boolean }) {
  return <div className={cx('fmt-draw', fill && 'is-fill')}>{prompt}</div>;
}
export interface Choice { label: string; icon?: Icon40Name }
export interface ChoicesProps { items: Choice[]; tone?: Tone; columns?: number; selected?: number[]; onToggle?: (index: number) => void }
/** Tiles to circle on paper or tap on a screen. With `onToggle` each tile is a toggle button (aria-pressed). */
export function Choices({ items, tone = 'purple', columns = 3, selected = [], onToggle }: ChoicesProps) {
  return <ul className="fmt-choices" style={{ ['--cols' as any]: columns }}>
    {items.map((c, i) => {
      const inner = <>{c.icon && <IconTile icon={c.icon} tone={tone} small />}<span>{c.label}</span></>;
      const cls = cx('fmt-choice', tone !== 'purple' && 'is-' + tone);
      return <li key={i}>{onToggle
        ? <button type="button" className={cls} aria-pressed={selected.includes(i)} onClick={() => onToggle(i)}>{inner}</button>
        : <div className={cls}>{inner}</div>}</li>;
    })}
  </ul>;
}
// Each path's viewBox is cropped to its ink (plus the stroke), so the gap from
// a heading to its line is the same group-gap for every shape.
const CUTS = {
  straight: { box: '0 36 600 8', d: 'M8 40H588' },
  wavy: { box: '0 15.5 600 49', d: 'M8 40C55 10 100 10 148 40S242 70 290 40S384 10 432 40S526 70 574 40L588 32' },
  zigzag: { box: '0 12 600 56', d: 'M8 40L66 16L124 64L182 16L240 64L298 16L356 64L414 16L472 64L530 16L588 40' },
  curve: { box: '0 10 600 64', d: 'M8 70C140 -5 460 -5 588 70', low: true },
  castle: { box: '0 21 600 38', d: 'M8 56H76V24H148V56H220V24H292V56H364V24H436V56H508V24H588', low: true },
} as const;
/** A line to cut along, from a yellow start dot. */
export function CutLine({ shape = 'straight' }: { shape?: keyof typeof CUTS }) {
  const c = CUTS[shape];
  return <div className={cx('fmt-cut', 'low' in c && 'is-low')}><svg viewBox={c.box} aria-hidden="true"><path d={c.d} /></svg></div>;
}
export interface TrackerProps { rows?: number; days?: string[]; label?: string }
/** A week tracker: rows to write an activity in, a star to colour per day. */
export function Tracker({ rows = 4, days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], label = 'My activity' }: TrackerProps) {
  return <table className="fmt-tracker">
    <thead><tr><th scope="col">{label}</th>{days.map(d => <th scope="col" key={d}>{d}</th>)}</tr></thead>
    <tbody>{Array.from({ length: rows }, (_, r) => <tr key={r}><td><span className="fmt-sr">Activity {r + 1}</span></td>
      {days.map(d => <td key={d}><Icon name="star" /></td>)}</tr>)}</tbody>
  </table>;
}

/* ── Print: Worksheet and BookPage ── */
export interface WorksheetProps { tag?: string; tone?: Tone; title: React.ReactNode; name?: boolean; tip?: React.ReactNode; children?: React.ReactNode }
/** An A4 handout (210 × 297 mm, .medium-paper): tinted header, the activity in groups, a tip for grown-ups, and the footer with the sign-off and copyright line. */
export function Worksheet({ tag, tone = 'purple', title, name = true, tip, children }: WorksheetProps) {
  const t = tone !== 'purple' ? 'is-' + tone : undefined;
  return <section className="fmt-sheet">
    <header className={cx('fmt-head', t)}>
      <div><h1>{title}</h1>{tag && <Tag tone={tone}>{tag}</Tag>}</div>
      {name && <p className="fmt-name">Name<span /></p>}
    </header>
    {children}
    {tip && <p className={cx('fmt-note', 'is-centred', t)}><i><Icon name="info" /></i><span><b style={{ color: 'var(--ink)' }}>For grown-ups: </b>{tip}</span></p>}
    <footer className="fmt-foot"><Logo variant="horizontal" height="var(--size-tile-sm)" />
      <span>Simone · Paediatric OT · followmetherapy.com.au<br />© Follow Me Therapy 2026. For use by the family it was given to.</span></footer>
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
