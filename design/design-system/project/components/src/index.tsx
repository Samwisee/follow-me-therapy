import * as React from 'react';
import { LOGO } from './logo';

type Tone = 'purple' | 'teal' | 'sun' | 'pink' | 'green' | 'blue';
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(' ');

/* ── Icons: generated from design/icons.json (the single source, shared with the app) ── */
import { ICONS } from './icons';
import { LETTERS } from './letters';
const ICON40 = Object.fromEntries(Object.entries(ICONS).filter(([, v]) => v.grid === 40).map(([k, v]) => [k, { d: v.svg, filled: 'filled' in v && v.filled }])) as Record<string, { d: string; filled?: boolean }>;
export type Icon24Name = string;
export type Icon40Name = string;

/** A 24×24 line icon in the current text colour. Decorative unless `label` is set. */
export function Icon({ name, label }: { name: Icon24Name; label?: string }) {
  const ic = ICONS[name as keyof typeof ICONS];
  return <svg viewBox={`0 0 ${ic.grid} ${ic.grid}`} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
    className={'filled' in ic && ic.filled ? 'is-filled' : undefined}
    dangerouslySetInnerHTML={{ __html: (label ? `<title>${label}</title>` : '') + ic.svg }} />;
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
export interface CardProps { icon: Icon40Name; tone?: Tone; title: string; more?: string; href?: string; progress?: number; progressLabel?: string; done?: boolean; celebrate?: boolean; children?: React.ReactNode }
/** A service or funding card: tile, title, one or two sentences, and a "Learn more ›" line. */
export function Card({ icon, tone = 'purple', title, more = 'Learn more', href, progress, progressLabel, done, celebrate, children }: CardProps) {
  const body = <>
    <IconTile icon={icon} tone={tone} />
    <h3>{title}</h3>
    {done && <span className="fmt-done" role="img" aria-label="Done"><Star state="done" pop={celebrate} label="Done" /></span>}
    {children && <p>{children}</p>}
    {progress != null && <ProgressBar value={progress} label={progressLabel} />}
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
export interface ButtonProps { variant?: 'primary' | 'teal' | 'quiet'; outline?: boolean; chevron?: boolean; disabled?: boolean; busy?: boolean; href?: string; onClick?: () => void; children?: React.ReactNode }
/** Pill button in the heading face; one primary per view. Teal is "Ask a question". `chevron` (›) for going on; quiet ones always end with one. */
export function Button({ variant = 'primary', outline, chevron, disabled, busy, href, onClick, children }: ButtonProps) {
  const cls = cx('fmt-btn', variant !== 'primary' && 'is-' + variant, outline && 'is-outline');
  const inner = <>{children}{(chevron || variant === 'quiet') && <Icon name="chevron" />}</>;
  return href && !disabled ? <a className={cls} href={href} aria-busy={busy || undefined}>{inner}</a> : <button type="button" className={cls} onClick={onClick} disabled={disabled} aria-busy={busy || undefined}>{inner}</button>;
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
  // label="" makes it decorative (when the name is written beside it).
  return <svg viewBox={l.viewBox} role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}
    className={cx('fmt-logo', inverse && 'is-inverse')} style={{ height }}
    dangerouslySetInnerHTML={{ __html: (label ? `<title>${label}</title>` : '') + l.body }} />;
}

/* ── Swash ── */
/** The hand-drawn sun underline for one key word. */
export function Swash({ children }: { children?: React.ReactNode }) {
  return <span className="fmt-swash">{children}</span>;
}

/* ── Activity parts: the same on paper, tablet, phone and the app ── */
/** A heading and what it introduces, group-gap apart. `fill` takes the spare height. */
export interface PanelProps { title?: React.ReactNode; tone?: Tone; children?: React.ReactNode }
/** A tinted section of a screen: a heading and what it holds on the tone's ground, its words at the text edge. */
export function Panel({ title, tone = 'purple', children }: PanelProps) {
  return <section className={cx('fmt-panel', tone !== 'purple' && 'is-' + tone)}>{title && <h2>{title}</h2>}{children}</section>;
}
export function Group({ title, fill, children }: { title?: React.ReactNode; fill?: boolean; children?: React.ReactNode }) {
  return <div className={cx('fmt-group', fill && 'is-fill')}>{title && <h2>{title}</h2>}{children}</div>;
}
/** Lines to write on (`kid`: wider spacing for a child's writing). */
export function WriteLines({ lines = 2, kid }: { lines?: number; kid?: boolean }) {
  return <div className={cx('fmt-write', kid && 'is-kid')} aria-hidden="true">{Array.from({ length: lines }, (_, i) => <i key={i} />)}</div>;
}
/** Somewhere to type on screens: a dashed outline on all sides (paper uses WriteLines). */
export function Field({ label, placeholder, lines = 1, value, onChange }: { label: string; placeholder?: string; lines?: number; value?: string; onChange?: (v: string) => void }) {
  const input = lines > 1
    ? <textarea aria-label={label} placeholder={placeholder} rows={lines} value={value} onChange={e => onChange?.(e.target.value)} />
    : <input aria-label={label} placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)} />;
  return <label className="fmt-field">{input}</label>;
}
/** "07:30" → "7:30am", "16:00" → "4pm": times as people say them. */
export function showTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}${m ? ':' + String(m).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`;
}
/** A time to pick, with a clock: tapping it opens our clock (TimePicker). `value` is 24-hour, "07:30". */
export function TimeField({ label, value = '07:30', onChange }: { label: string; value?: string; onChange?: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  return <>
    <button type="button" className="fmt-field is-time" aria-label={`${label}, ${showTime(value)}. Change the time`} onClick={() => setOpen(true)}><Icon name="clock" />{showTime(value)}</button>
    {open && <TimePicker title={label} value={value} onDone={v => { onChange?.(v); setOpen(false); }} onCancel={() => setOpen(false)} />}
  </>;
}

/* ── Picker: our clock and calendar ── */
const HOUR_WORDS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
export interface TimePickerProps { title?: string; value?: string; onDone?: (v: string) => void; onCancel?: () => void }
/** Our clock: the time large (tap the hour or the minutes), am / pm, and a dial of 12 hours, then minutes in fives. */
export function TimePicker({ title = 'Choose a time', value = '07:30', onDone, onCancel }: TimePickerProps) {
  const [h0, m0] = value.split(':').map(Number);
  const [h, setH] = React.useState(h0 % 12);
  const [m, setM] = React.useState(Math.round(m0 / 5) * 5 % 60);
  const [pm, setPm] = React.useState(h0 >= 12);
  const [mode, setMode] = React.useState<'hour' | 'minute'>('hour');
  const pick = mode === 'hour' ? h : m / 5;
  const out = `${String(h + (pm ? 12 : 0)).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return <div className="fmt-picker" role="dialog" aria-label={title}>
    <h2>{title}</h2>
    <div className="fmt-picker-time">
      <button type="button" aria-pressed={mode === 'hour'} onClick={() => setMode('hour')} aria-label={`Hour, ${h || 12}`}>{h || 12}</button>:
      <button type="button" aria-pressed={mode === 'minute'} onClick={() => setMode('minute')} aria-label={`Minutes, ${m}`}>{String(m).padStart(2, '0')}</button>
      <span className="fmt-chips"><ToggleChip on={!pm} onToggle={() => setPm(false)}>am</ToggleChip><ToggleChip on={pm} onToggle={() => setPm(true)}>pm</ToggleChip></span>
    </div>
    <div className="fmt-picker-dial">
      <i className="fmt-picker-hand" style={{ transform: `rotate(${pick * 30 - 90}deg)` }} />
      {HOUR_WORDS.map((w, i) => { const a = (i * 30 - 90) * Math.PI / 180;
        const label = mode === 'hour' ? w : String(i * 5).padStart(2, '0');
        return <button key={i} type="button" aria-pressed={pick === i} style={{ left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 40 * Math.sin(a)}%` }}
          aria-label={mode === 'hour' ? `${w} o'clock` : `${i * 5} minutes`}
          onClick={() => { if (mode === 'hour') { setH(i); setMode('minute'); } else setM(i * 5); }}>{label}</button>; })}
    </div>
    <div className="fmt-picker-foot"><Button outline onClick={onCancel}>Cancel</Button><Button onClick={() => onDone?.(out)}>Done</Button></div>
  </div>;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export interface DatePickerProps { title?: string; value?: string; today?: string; onDone?: (v: string) => void; onCancel?: () => void }
/** Our calendar: the month with ‹ ›, Monday first; today ringed, the chosen day a purple circle. Dates are yyyy-mm-dd. */
export function DatePicker({ title = 'Choose a date', value, today = new Date().toISOString().slice(0, 10), onDone, onCancel }: DatePickerProps) {
  const [sel, setSel] = React.useState(value || today);
  const [y0, mo0] = sel.split('-').map(Number);
  const [view, setView] = React.useState({ y: y0, m: mo0 - 1 });
  const first = new Date(Date.UTC(view.y, view.m, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const iso = (d: number) => `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const move = (k: number) => setView(v => { const m = v.m + k; return { y: v.y + Math.floor(m / 12), m: (m + 12) % 12 }; });
  return <div className="fmt-picker" role="dialog" aria-label={title}>
    <h2>{title}</h2>
    <div className="fmt-picker-month">
      <button type="button" className="fmt-iconbtn" aria-label="Last month" onClick={() => move(-1)}><Icon name="back" /></button>
      <b aria-live="polite">{MONTHS[view.m]} {view.y}</b>
      <button type="button" className="fmt-iconbtn" aria-label="Next month" onClick={() => move(1)}><Icon name="chevron" /></button>
    </div>
    <div className="fmt-picker-days">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={'w' + i} aria-hidden="true">{d}</span>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {Array.from({ length: days }, (_, i) => { const d = i + 1, id = iso(d);
        return <button key={id} type="button" className={cx(id === today && 'is-today')} aria-pressed={id === sel}
          aria-label={`${WEEKDAYS[(lead + i) % 7]} ${d} ${MONTHS[view.m]}${id === today ? ', today' : ''}`} onClick={() => setSel(id)}>{d}</button>; })}
    </div>
    <div className="fmt-picker-foot"><Button outline onClick={onCancel}>Cancel</Button><Button onClick={() => onDone?.(sel)}>Done</Button></div>
  </div>;
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
  const [done, setDone] = React.useState<string[]>([]);
  const [pop, setPop] = React.useState<string | null>(null);
  return <table className="fmt-tracker">
    <thead><tr><th scope="col">{label}</th>{days.map(d => <th scope="col" key={d}>{d}</th>)}</tr></thead>
    <tbody>{Array.from({ length: rows }, (_, r) => <tr key={r}><td><span className="fmt-sr">Activity {r + 1}</span></td>
      {days.map(d => { const k = r + d, on = done.includes(k);
        return <td key={d}><Star state={on ? 'done' : 'planned'} pop={pop === k} label={`${d}, activity ${r + 1}`}
          onToggle={() => { setDone(on ? done.filter(x => x !== k) : [...done, k]); setPop(on ? null : k); }} /></td>; })}</tr>)}</tbody>
  </table>;
}

/** A star: planned (outline), partly done (pale), done (gold). With onToggle it's a button; adding it bursts (spring, twist, sparkles). */
function Star({ state, pop, label, onToggle }: { state: 'planned' | 'partial' | 'done'; pop?: boolean; label: string; onToggle?: () => void }) {
  const cls = cx('fmt-star', state !== 'planned' && 'is-' + state, pop && 'is-pop');
  const icon = <>{pop && <span className="fmt-star-burst" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</span>}<Icon name="star" /></>;
  return onToggle ? <button type="button" className={cls} aria-pressed={state === 'done'} aria-label={label} onClick={onToggle}>{icon}</button>
    : <span className={cls}>{icon}</span>;
}

/* ── Print: Worksheet and BookPage ── */
export interface WorksheetProps { tag?: string; tone?: Tone; title: React.ReactNode; name?: boolean; note?: React.ReactNode; noteLeadIn?: string; tip?: React.ReactNode; children?: React.ReactNode }
/** An A4 handout (210 × 297 mm, .medium-paper): tinted header, the activity in groups, a tip for grown-ups, and the footer with the sign-off and copyright line. */
export function Worksheet({ tag, tone = 'purple', title, name = true, note, noteLeadIn, tip, children }: WorksheetProps) {
  const t = tone !== 'purple' ? 'is-' + tone : undefined;
  return <section className="fmt-sheet">
    <header className={cx('fmt-head', t)}>
      <div><h1>{title}</h1>{tag && <Tag tone={tone}>{tag}</Tag>}</div>
      {name && <p className="fmt-name">Name<span /></p>}
      {note && <p className="fmt-head-note">{noteLeadIn && <b>{noteLeadIn} </b>}{note}</p>}
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

/* ── App chrome: the same parts as the app (Compose), for screens on the web ── */
/** The wave where one band meets the next. `down` hangs it under a bar; `stroked` outlines its edge in bar.line (the app's bars). */
export interface WaveProps { down?: boolean; stroked?: boolean; ground?: string }
export function Wave({ down, stroked, ground = 'var(--bar-fill)' }: WaveProps) {
  return <span aria-hidden="true" className={cx('fmt-wave', down && 'is-down', stroked && 'is-stroked')} style={{ ['--wave-fill' as any]: ground }} />;
}
export interface ProgressBarProps { value: number; label?: string }
/** A slim purple-line track with a purple fill that glides to its length. */
export function ProgressBar({ value, label = 'Progress' }: ProgressBarProps) {
  const v = Math.max(0, Math.min(1, value));
  return <span className="fmt-progress" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
    <i style={{ width: `max(${v * 100}%, var(--space-2))` }} /></span>;
}
export interface AppBarProps { title: string; brand?: boolean; onBack?: () => void; back?: boolean; progress?: number; progressLabel?: string }
/** The app's lilac top bar: a round back button, the title (or the lockup on the home screen), progress for flows, and a shallow stroked wave beneath. In an app it stays put while screens change. */
export function AppBar({ title, brand, onBack, back, progress, progressLabel }: AppBarProps) {
  return <div className="fmt-appbar-wrap">
    <header className="fmt-appbar">
      <div className="fmt-appbar-row">
        {(back || onBack) && <button type="button" className="fmt-iconbtn" aria-label="Back" onClick={onBack}><Icon name="back" /></button>}
        {brand ? <h1 className="fmt-appbar-brand"><Logo variant="mark" height="calc(var(--text-lg) * 1.45)" label="" /><span>Follow Me Therapy</span></h1> : <h1>{title}</h1>}
      </div>
      {progress != null && <div className="fmt-appbar-progress"><ProgressBar value={progress} label={progressLabel} />{progressLabel && <span>{progressLabel}</span>}</div>}
    </header>
    <Wave down stroked />
  </div>;
}
export interface Tab { label: string; icon: Icon24Name }
export interface TabBarProps { tabs: Tab[]; selected?: number; onSelect?: (i: number) => void }
/** The app's lilac tab bar: icon and label per tab; a wave crest rises over the chosen tab and glides between tabs. */
export function TabBar({ tabs, selected = 0, onSelect }: TabBarProps) {
  return <nav className="fmt-tabbar" style={{ ['--at' as any]: selected, ['--n' as any]: tabs.length }}>
    <div role="tablist">{tabs.map((t, i) => <button key={i} type="button" role="tab" aria-selected={i === selected} onClick={() => onSelect?.(i)}>
      <Icon name={t.icon} /><span>{t.label}</span></button>)}</div>
  </nav>;
}
export interface Action { label: string; variant?: 'primary' | 'teal'; outline?: boolean; chevron?: boolean; disabled?: boolean; onClick?: () => void }
/** A flow's buttons: Back (or another way out) at the start, the next step at the end, floating with no panel. In an app they stay on screen between steps. */
export function ActionBar({ start, end }: { start?: Action; end?: Action }) {
  const b = (a?: Action) => a ? <Button variant={a.variant} outline={a.outline} chevron={a.chevron} disabled={a.disabled} onClick={a.onClick}>{a.label}</Button> : <span />;
  return <div className="fmt-actionbar">{b(start)}{b(end)}</div>;
}
export interface StepFocusProps { number: number; total: number; label: string; done?: boolean }
/** One step, big: "Step n of N", the number in a disc (teal with a tick when done) and the words in the heading face, to read across the room. */
export function StepFocus({ number, total, label, done }: StepFocusProps) {
  return <div className={cx('fmt-stepfocus', done && 'is-done')} aria-live="polite">
    <p>Step {number} of {total}</p>
    <span className="fmt-stepfocus-disc">{done ? <Icon name="tick" label="Done" /> : number}</span>
    <h2>{label}</h2>
  </div>;
}
export interface CelebrationProps { title: React.ReactNode; message: React.ReactNode }
/** The end of a flow: a sun disc with a star that springs in, a title (put the swash on one word) and a short message. */
export function Celebration({ title, message }: CelebrationProps) {
  return <div className="fmt-celebrate" aria-live="polite">
    <span className="fmt-celebrate-sun"><Icon name="star" /></span>
    <h2>{title}</h2>
    <p>{message}</p>
  </div>;
}

export interface BreathingProps { label?: string }
/** A breathing guide: a teal disc that grows for four seconds and shrinks for four, the words changing to match. */
export function Breathing({ label = 'Take 5 slow breaths. Follow the circle.' }: BreathingProps) {
  return <div className="fmt-breathe" role="img" aria-label={label}><span className="fmt-breathe-disc" /><p aria-hidden="true" /></div>;
}
export interface ToggleChipProps { tone?: Tone; on?: boolean; onToggle?: () => void; children?: React.ReactNode }
/** A chip you tap to choose (a day, an option): a toggle button with a tick when on, so it never relies on colour alone. */
export function ToggleChip({ tone = 'purple', on = false, onToggle, children }: ToggleChipProps) {
  return <button type="button" className={cx('fmt-chip', 'is-toggle', tone !== 'purple' && 'is-' + tone)} aria-pressed={on} onClick={onToggle}>
    {on && <Icon name="tick" />}{children}</button>;
}

export interface FilterChipProps { tone?: Tone; on?: boolean; onSelect?: () => void; icon?: Icon24Name; label?: string; children?: React.ReactNode }
/** A chip that filters a list, in the tone of what it filters; on = the tone's ink with white words, no tick. Icon-only (info) chips take a spoken label. */
export function FilterChip({ tone = 'purple', on = false, onSelect, icon, label, children }: FilterChipProps) {
  return <button type="button" className={cx('fmt-chip', 'is-filter', tone !== 'purple' && 'is-' + tone)} aria-pressed={on} aria-label={label} onClick={onSelect}>
    {icon && <Icon name={icon} />}{children}</button>;
}

export type CalendarDay = 'none' | 'planned' | 'partial' | 'done';
export interface CalendarRow { label: string; tone?: Tone; days: CalendarDay[]; onToggle?: (day: number) => void; href?: string }
export interface WeekCalendarProps { days?: string[]; dates?: (string | number)[]; today?: number; rows: CalendarRow[] }
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_WORDS: Record<CalendarDay, string> = { none: 'not planned', planned: 'planned', partial: 'partly done', done: 'done' };
/** A week of an activity plan: days across (today on lilac), each activity's days planned (a ring), partly done (tinted) or done (teal with a tick). */
export function WeekCalendar({ days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], dates, today, rows }: WeekCalendarProps) {
  const [pop, setPop] = React.useState<string | null>(null);
  return <div className="fmt-calendar">
    <div className="fmt-calendar-days" aria-hidden="true">{days.map((d, i) => <span key={i} className={cx(i === today && 'is-today')}>{d}{dates && <b>{dates[i]}</b>}</span>)}</div>
    {rows.map((r, ri) => { const link = r.href && !r.onToggle;
      const summary = r.days.map((st, i) => `${FULL_DAYS[i]}: ${DAY_WORDS[st]}`).join(', ');
      const Row = (link ? 'a' : 'div') as 'a';
      return <Row key={ri} className="fmt-calendar-row" href={link ? r.href : undefined} aria-label={link ? `${r.label}. ${summary}` : undefined}>
      {link ? <span>{r.label}<Icon name="chevron" /></span> : <p>{r.label}</p>}
      <ol aria-hidden={link ? true : undefined}>{r.days.map((st, i) => { const words = `${FULL_DAYS[i]}, ${r.label}`;
        return <li key={i} className={cx('is-' + st, i === today && 'is-today')} aria-label={r.onToggle ? undefined : `${words}: ${DAY_WORDS[st]}`}>
          {st === 'none' && !r.onToggle ? <span /> : <Star state={st === 'none' ? 'planned' : st} pop={pop === ri + '/' + i} label={words}
            onToggle={r.onToggle && (() => { setPop(st === 'done' ? null : ri + '/' + i); r.onToggle!(i); })} />}</li>; })}</ol>
    </Row>; })}
  </div>;
}

export interface LetterTraceProps { letter: string; mode?: 'model' | 'trace' }
/** A letter (a–z, A–Z) or a pre-writing shape ('circle', 'loops'…) on writing lines: the model (solid, a gold start dot, numbered strokes, an arrow the way to go) or a dashed copy to trace. Shapes from design/letters.json. */
export function LetterTrace({ letter, mode = 'model' }: LetterTraceProps) {
  const set: Record<string, { w: number; s: readonly string[] }> = letter.length > 1 ? LETTERS.shapes : letter === letter.toLowerCase() ? LETTERS.lowercase : LETTERS.capitals;
  const g = set[letter];
  if (!g) return null;
  const strokes = g.s.map(st => st.split(' ').map(p => p.split(',').map(Number)));
  const { top, waist, base, descender } = LETTERS.lines;
  const model = mode === 'model';
  const words = letter.length > 1 ? `Shape to trace: ${letter}.` : `Letter ${letter}. ${strokes.length} ${strokes.length === 1 ? 'stroke' : 'strokes'}.`;
  return <svg className={cx('fmt-letter', !model && 'is-trace')} viewBox={`0 0 ${g.w} 100`} role="img" aria-label={words}>
    <line className="fmt-letter-guide" x1="0" x2={g.w} y1={top} y2={top} />
    <line className="fmt-letter-guide is-waist" x1="0" x2={g.w} y1={waist} y2={waist} />
    <line className="fmt-letter-base" x1="0" x2={g.w} y1={base} y2={base} />
    <line className="fmt-letter-guide" x1="0" x2={g.w} y1={descender} y2={descender} />
    {strokes.map((st, i) => <polyline key={'s' + i} className="fmt-letter-stroke" points={st.map(p => p.join(',')).join(' ')} />)}
    {model && strokes.map((st, i) => {
      // An arrow a little way along, beside the stroke, the way it goes.
      const k = Math.min(8, st.length - 2), [x0, y0] = st[k], [x1, y1] = st[Math.min(k + 3, st.length - 1)];
      const len = Math.hypot(x1 - x0, y1 - y0) || 1, dx = (x1 - x0) / len, dy = (y1 - y0) / len, nx = dy, ny = -dx;
      const ax = x0 + nx * 7, ay = y0 + ny * 7;
      return <polyline key={'a' + i} className="fmt-letter-arrow" points={`${ax - dx * 3 + nx * 2.5},${ay - dy * 3 + ny * 2.5} ${ax},${ay} ${ax - dx * 3 - nx * 2.5},${ay - dy * 3 - ny * 2.5}`} />;
    })}
    {strokes.map((st, i) => <circle key={'d' + i} className="fmt-letter-start" cx={st[0][0]} cy={st[0][1]} r="3.5" />)}
    {model && strokes.length > 1 && strokes.map((st, i) => <text key={'n' + i} className="fmt-letter-num" x={st[0][0] - 9} y={st[0][1] - 4 - 9 * strokes.slice(0, i).filter(o => Math.hypot(o[0][0] - st[0][0], o[0][1] - st[0][1]) < 6).length}>{i + 1}</text>)}
  </svg>;
}
