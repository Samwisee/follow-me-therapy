import type * as React from 'react';
type Tone = 'purple' | 'teal' | 'sun' | 'pink';
type Icon24Name = 'smile' | 'video' | 'pin' | 'info' | 'book' | 'heart' | 'chevron';
type Icon40Name = 'footprints' | 'stairs' | 'blocks' | 'clipboard' | 'hands-heart' | 'medicare-cross' | 'shield-tick';
export interface IconProps { name: Icon24Name; label?: string }
export declare function Icon(props: IconProps): React.ReactElement;
export interface ChipProps { tone?: Tone | 'outline'; icon?: Icon24Name; live?: string; children?: React.ReactNode }
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
export interface ButtonProps { variant?: 'primary' | 'teal' | 'quiet'; href?: string; onClick?: () => void; children?: React.ReactNode }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface FootstepTrailProps { steps?: number; direction?: 'across' | 'down'; ink?: 'light' | 'strong' | 'sun' | 'teal'; size?: number }
export declare function FootstepTrail(props: FootstepTrailProps): React.ReactElement;
export interface Step { label: string; done?: boolean }
export interface StepPathProps { steps: Step[]; direction?: 'across' | 'down'; doneText?: string }
export declare function StepPath(props: StepPathProps): React.ReactElement;
export interface LogoProps { variant?: 'stacked' | 'horizontal' | 'mark'; inverse?: boolean; height?: number | string; label?: string }
export declare function Logo(props: LogoProps): React.ReactElement;
export interface SwashProps { children?: React.ReactNode }
export declare function Swash(props: SwashProps): React.ReactElement;
export interface WorksheetProps { tag?: string; tagTone?: Tone; title: React.ReactNode; name?: boolean; tip?: React.ReactNode; children?: React.ReactNode }
export declare function Worksheet(props: WorksheetProps): React.ReactElement;
export interface BookPageProps { side?: 'left' | 'right'; folio?: number; ground?: 'paper' | 'teal-tint' | 'purple-tint' | 'butter'; children?: React.ReactNode }
export declare function BookPage(props: BookPageProps): React.ReactElement;
declare global { interface Window { FollowMeTherapy: { Icon: typeof Icon; Chip: typeof Chip; Chips: typeof Chips; Tag: typeof Tag; TickList: typeof TickList; InfoNote: typeof InfoNote; IconTile: typeof IconTile; Card: typeof Card; Button: typeof Button; FootstepTrail: typeof FootstepTrail; StepPath: typeof StepPath; Logo: typeof Logo; Swash: typeof Swash; Worksheet: typeof Worksheet; BookPage: typeof BookPage } } }
