# Al Fazal Family Restaurant — Single Page Website

## Files
- `index.html` — the complete website in one page, with Home, Menu, About and Contact sections.
- `styles.css` — responsive desktop and mobile styling.
- `app.js` — navigation, menu-image lightbox, WhatsApp contact form and n8n ordering chat.
- `assets/` — restaurant logo, six original menu images and restaurant/food photography.

## Preview
Open `index.html` in a browser. For deployment, upload the complete folder while keeping the `assets` folder beside `index.html`.

## Ordering assistant
The persistent **Order Online** button opens the embedded chat panel. Chat requests are sent to the configured n8n chat webhook in `app.js`. The webhook must be active and configured to accept browser requests (CORS) from the website's published domain.

## Contact form
The contact form opens WhatsApp with the customer's name, phone number and message prefilled. The customer presses Send in WhatsApp to submit it.
