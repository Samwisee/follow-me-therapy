# SectionTitle

Every section on the website opens the same way: the title centred, a short hand-drawn squiggle under it, and an optional one-line subtitle.

- Title: Fredoka 600, `text-3xl` (fluid: 30px on a phone to 40px on desktop).
- The squiggle is the same stroke as the swash and the wavy section edges, in the band's accent: purple on lilac and white, `sun-deep` on butter, teal on mint. It's decorative (no meaning of its own).
- Subtitle: `text-base`, `ink-soft`, at most `measure` wide.
- The squiggle sits `space-4` under the words. Space under the whole title: `stack` (fluid 28–40px). A section's top padding is `section-top` (48–72px), less than its bottom (`section-space`), because the wave above already adds air.
- Page titles (h1 on the inner pages) stay left-aligned in the hero, with no squiggle.

```js
h(FollowMeTherapy.SectionTitle, { title: 'Funding options', accent: 'sun', subtitle: 'Tap an option to see how it works.' })
```

Plain HTML on the website: any `h2` directly in a section (`.content-section h2`, `.band > .wrap > h2`) gets this style automatically.
