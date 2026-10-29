# Nest

The rule for rounded things inside rounded things: the outer radius equals the inner radius plus the gap between them, plus the outer border. The two curves then run parallel instead of pinching at the corners.

- Markup: add `class="fmt-nest"` to the container and set `--nest-inner` (the child's radius), `--nest-gap` (the space around it) and, if it has one, `--nest-border`.
- Worked examples on the website: Simone's card (photo 16px + 24px gap = 40px) and the side menu (22px pill + 8px gap + 2px border = 32px).
- Change the gap or the child's radius and the outer corner follows. Never hand-pick an outer radius for a nested container.
