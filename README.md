# Al Fazal Family Restaurant — Single Page Website

## Files
- `index.html` — the complete website in one page, with Home, Menu, About and Contact sections.
- `styles.css` — responsive desktop and mobile styling.
- `app.js` — navigation, menu-image lightbox, WhatsApp contact form and n8n ordering chat.
- `assets/` — restaurant logo, six original menu images and restaurant/food photography.

## Preview
Open `index.html` in a browser. For deployment, upload the contents of this ZIP directly into the GitHub Pages publishing root. Keep `index.html`, `styles.css`, `app.js`, and the `assets/` folder together.

## Ordering assistant
The persistent **Order Online** button opens the embedded chat panel. Chat requests are sent to the configured n8n chat webhook in `app.js`. Production webhook: `https://abdullahagent11.app.n8n.cloud/webhook/al-fazal-chat`. The n8n Webhook node must be Active, use POST, and allow the exact website origin `https://alfazalfaimlyrestaurant.netlify.app` in Allowed Origins (CORS). The website sends JSON fields `message` and `sessionId`.

## Contact form
The contact form opens WhatsApp with the customer's name, phone number and message prefilled. The customer presses Send in WhatsApp to submit it.
