# ActionCard

A choice with one full-width button at its foot: "Ready to start?" and "Have a question?" on the website's Get in touch section.

- **Wrapped in its colour:** a `border-outline` outline in the card's colour. Purple is *Start a referral*; teal is *Ask a question*, everywhere on the site.
- **Concentric corners:** the button sits in the card's bottom corners, so the card's radius = the button's radius (`size-button` / 2) + `card-pad` + `border-outline`. Never pick the card radius by eye.
- Title in `text-md`, one or two sentences in `text-base`, then the button.

```js
h(FollowMeTherapy.ActionCard, { tone: 'teal', title: 'Have a question?', action: 'Ask a question', href: ENQUIRY }, 'Not sure yet? …')
```

Plain HTML: `<div class="fmt-card is-action is-teal"><h3>…</h3><p>…</p><a class="fmt-btn is-teal">…</a></div>`
