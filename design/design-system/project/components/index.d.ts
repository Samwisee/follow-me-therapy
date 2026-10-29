import type * as React from 'react';
type Tone = 'purple' | 'teal' | 'sun' | 'pink';
type Icon24Name = 'smile' | 'video' | 'pin' | 'info' | 'book' | 'heart' | 'chevron' | 'star';
type Icon40Name = 'footprints' | 'stairs' | 'blocks' | 'clipboard' | 'umbrella' | 'medicare-cross' | 'shield-tick' | 'breathe' | 'cushion' | 'push-wall' | 'water' | 'hug' | 'quiet-spot';
export interface IconProps { name: Icon24Name; label?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface ChipProps { tone?: Tone | 'outline'; icon?: Icon24Name; live?: string; href?: string; children?: React.ReactNode }
export declare function Chip(props: ChipProps): React.ReactElement;
export interface ChipsProps { stacked?: boolean; children?: React.ReactNode }
export declare function Chips(props: ChipsProps): React.ReactElement;
export interface TagProps { tone?: Tone; children?: React.ReactNode }
export declare function Tag(props: TagProps): React.ReactElement;
export interface TickListProps { items: React.ReactNode[]; blank?: boolean }
export declare function TickList(props: TickListProps): React.ReactElement;
export interface InfoNoteProps { kind?: 'info' | 'evidence' | 'promise'; children?: React.ReactNode }
export declare function InfoNote(props: InfoNoteProps): React.ReactElement;
export interface IconTileProps { icon: Icon40Name; tone?: Tone; small?: boolean; label?: string }
export declare function IconTile(props: IconTileProps): React.ReactElement;
export interface CardProps { icon: Icon40Name; tone?: Tone; title: string; more?: string; href?: string; children?: React.ReactNode }
export declare function Card(props: CardProps): React.ReactElement;
export interface ActionCardProps { tone?: 'purple' | 'teal'; title: string; action: string; href?: string; children?: React.ReactNode }
export declare function ActionCard(props: ActionCardProps): React.ReactElement;
export interface SectionTitleProps { title: string; subtitle?: React.ReactNode; accent?: 'purple' | 'teal' | 'sun' }
export declare function SectionTitle(props: SectionTitleProps): React.ReactElement;
export interface ButtonProps { variant?: 'primary' | 'teal' | 'quiet'; outline?: boolean; href?: string; onClick?: () => void; children?: React.ReactNode }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface FootstepTrailProps { steps?: number; direction?: 'across' | 'down'; ink?: 'light' | 'strong' | 'sun' | 'teal'; size?: number }
export declare function FootstepTrail(props: FootstepTrailProps): React.ReactElement;
export interface Step { label: string; done?: boolean }
export interface StepPathProps { steps: Step[]; direction?: 'across' | 'down'; doneText?: string; plain?: boolean; kid?: boolean }
export declare function StepPath(props: StepPathProps): React.ReactElement;
export interface LogoProps { variant?: 'stacked' | 'horizontal' | 'mark'; inverse?: boolean; height?: number | string; label?: string }
export declare function Logo(props: LogoProps): React.ReactElement;
export interface SwashProps { children?: React.ReactNode }
export declare function Swash(props: SwashProps): React.ReactElement;
export interface GroupProps { title?: React.ReactNode; fill?: boolean; children?: React.ReactNode }
export declare function Group(props: GroupProps): React.ReactElement;
export interface WriteLinesProps { lines?: number; kid?: boolean }
export declare function WriteLines(props: WriteLinesProps): React.ReactElement;
export interface DrawBoxProps { prompt?: React.ReactNode; fill?: boolean }
export declare function DrawBox(props: DrawBoxProps): React.ReactElement;
export interface Choice { label: string; icon?: Icon40Name }
export interface ChoicesProps { items: Choice[]; tone?: Tone; columns?: number; selected?: number[]; onToggle?: (index: number) => void }
export declare function Choices(props: ChoicesProps): React.ReactElement;
export interface CutLineProps { shape?: 'straight' | 'wavy' | 'zigzag' | 'curve' }
export declare function CutLine(props: CutLineProps): React.ReactElement;
export interface TrackerProps { rows?: number; days?: string[]; label?: string }
export declare function Tracker(props: TrackerProps): React.ReactElement;
export interface WorksheetProps { tag?: string; tone?: Tone; title: React.ReactNode; name?: boolean; tip?: React.ReactNode; children?: React.ReactNode }
export declare function Worksheet(props: WorksheetProps): React.ReactElement;
export interface BookPageProps { side?: 'left' | 'right'; folio?: number; ground?: 'paper' | 'teal-tint' | 'purple-tint' | 'butter'; children?: React.ReactNode }
export declare function BookPage(props: BookPageProps): React.ReactElement;
declare global { interface Window { FollowMeTherapy: { Icon: typeof Icon; Chip: typeof Chip; Chips: typeof Chips; Tag: typeof Tag; TickList: typeof TickList; InfoNote: typeof InfoNote; IconTile: typeof IconTile; Card: typeof Card; ActionCard: typeof ActionCard; SectionTitle: typeof SectionTitle; Button: typeof Button; FootstepTrail: typeof FootstepTrail; StepPath: typeof StepPath; Logo: typeof Logo; Swash: typeof Swash; Group: typeof Group; WriteLines: typeof WriteLines; DrawBox: typeof DrawBox; Choices: typeof Choices; CutLine: typeof CutLine; Tracker: typeof Tracker; Worksheet: typeof Worksheet; BookPage: typeof BookPage } } }
