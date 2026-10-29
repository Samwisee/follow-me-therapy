# FootstepTrail

Real footprints, left and right, walking across or down the page. It's the practice's name drawn as a path: follow me.

- Markup: `<span class="fmt-trail" aria-hidden="true">` with five to nine empty `<i>`. Odd steps are left feet, even steps right feet.
- Direction: across by default (walking right); `is-down` walks down the page.
- Ink: `trail` (`purple-light`) by default; `is-strong` (purple), `is-sun`, `is-teal`. Set `--step` to resize (14px default, one print is 1.5× as tall as it is wide).
- Use it to lead the eye: towards a button, along a page footer, or down the side of a routine. Use `StepPath` when the steps are numbered.
- Decorative only. Always `aria-hidden`, and never the only way something is shown.
- One trail per page or spread. On the website it may walk in once as the page loads; never loop it, and switch it off under `prefers-reduced-motion`.
