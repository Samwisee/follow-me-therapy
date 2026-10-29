# Button

Pill buttons in the heading face. Purple is the main action; teal a second one; quiet (sun-tint, chevron at the end) is a link to another page.

- Markup: `<a class="fmt-btn">` (or `<button>`), plus `is-teal` or `is-quiet`.
- One purple button per view, usually "Start a referral" or "Follow Me!".
- Words say what happens: "Start a referral", not "Submit" or "Click here".
- On print, buttons become a short line of text with the web address, e.g. "Start a referral at followmetherapy.com.au".
- Every button is at least 48px tall, so it's an easy target on a phone.
- Keyboard focus shows an `ink` ring with a `paper` gap inside it (the `focus` token), which reads on every ground, including `deep`. Never remove it.
- In code: `<Button variant="quiet" href="…">ESDM in Melbourne</Button>`.
