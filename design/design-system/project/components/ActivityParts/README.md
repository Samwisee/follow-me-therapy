# Activity parts: Group, WriteLines, DrawBox

The pieces every worksheet and activity screen is built from.

- **Group** (`.fmt-group`): a heading and what it introduces, `group-gap` apart. Groups sit `stack` apart, so proximity shows what belongs together. `is-fill` takes the spare height of the page; `is-spread` shares it evenly between its items (cutting lines).
- **WriteLines** (`.fmt-write`, `is-kid` for a child's writing): dashed lines in `rule`, spaced `rule-write` (10 mm) or `rule-kid` (16 mm). Paper only; on a screen use a text field.
- **DrawBox** (`.fmt-draw`, `is-fill`): a dashed `rule` box with its prompt at the foot. Paper only; on a screen it's a drawing area or a photo.
- **Row** (`.fmt-row`): parts side by side, `grid-gap` apart; they stack on a narrow screen.
- Words a child reads use `.fmt-kid` (`text-kid`). Parent text stays at `text-base`.
- In code: `<Group title="What was tricky today?"><WriteLines kid lines={2} /></Group>`.
