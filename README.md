# Children of Light Initiatives website

This corrected version was rebuilt from the **original COLI homepage**, not the replacement redesign. It preserves the original six homepage sections, their order, original dark/navy-and-black theme, electric-blue/purple accents, carousel, outreach pages, gallery and volunteer form. It adds a **2025 Annual Reports** archive, a PDF preview, direct PDF viewing and downloading, consistent navigation, and a shared responsive typography/design system.

## Run locally

1. Install Node.js 20 or later.
2. Run `npm ci` in the project root.
3. Restore your existing private `.env` file from your original project, or create one from `.env.example` and enter your own MongoDB connection string. **Do not publish the `.env` file.**
4. Run `npm start` and open `http://localhost:3000/` (or the `PORT` in `.env`).
5. Run `npm test` for a quick file-level smoke test.

The original code still retrieves gallery content from MongoDB via `/Coli/gallary` and submits volunteer applications to `/volunteers`. The site can serve static content even when MongoDB is unavailable, but the gallery and volunteer features require a working connection.

## Annual reports

- Archive page: `public/reports.html` (public URL: `/reports.html`)
- Viewable PDF: `public/reports/coli-impact-report-2025.pdf`
- Cover preview: `public/reports/impact-report-2025-cover.webp`

The PDF was processed to remove embedded JavaScript; visual checks of sample pages matched the uploaded report. The archive includes a PDF viewer, plus direct **View PDF** and **Download PDF** links that remain available even where embedded PDF previews are unsupported.

To add a future report, place its PDF and cover preview in `public/reports/`, then add another report card to `public/reports.html` following the 2025 item.

## Styling

- `public/site-polish.css`: shared typography, colors, navigation, buttons, archive styles, and mobile layouts.
- `public/site-navigation.js`: keyboard-accessible responsive menu behavior.
- The existing custom CSS and Tailwind markup remain in place for compatibility.
- The original **Inter** and **Playfair Display** font families have been restored; system fonts provide fallbacks.

The standalone `public/syu.html` financial slide deck is unrelated to the nonprofit site and has been preserved as supplied.

## Deployment and security

Deploy the **project root**, not just the `public` directory, if you need the MongoDB-backed gallery and volunteer form. Configure the MongoDB URI and `PORT` as secret environment variables in your hosting provider. The supplied `.env` and `.git` history are deliberately omitted from this delivery. Public volunteer submissions receive validation and rate limits. Reading or deleting applicant data now requires a private **COLI_ADMIN_TOKEN** (24+ characters). Set this as a secret environment variable before publishing. Add production-grade anti-abuse controls if the site receives heavy traffic.

## What was deliberately NOT redesigned

The original section headings and sequence are untouched: **Changing Lives, One Child at a Time**, **Our Programs**, **Photo Gallery**, **Our Founder’s Story**, **Voices of Impact**, **Support Our Mission**. Original photo URLs, dark animated background, electric blue and purple gradients, cards, and program page content are retained. Annual Reports is reachable through the navigation and footer; it is *not* inserted as a new homepage section.
