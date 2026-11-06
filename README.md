# AM Media NZ — website

A plain HTML + CSS site. No build tools, no frameworks. Open the folder in VS Code and edit.

## Folder map

```
am-media-nz-website/
├── index.html                 Home page
├── projects.html              Personal projects (dark page)
├── sport.html                 I.   Sport & fitness
├── events.html                II.  Events
├── music.html                 III. Live music
├── portraits-weddings.html    IV.  Portraits & weddings
├── business.html              Business & brand (hidden for now, see below)
├── css/
│   └── style.css              All styling, for every page
├── js/
│   ├── aperture.js            The aperture ring animation
│   ├── exif-flip.js           Click a photo to flip it and see camera settings
│   └── motion.js              Section fade-ups, header shadow
├── video/
│   └── hero-reel.mp4          Optional home hero reel (see video/README.txt)
└── images/
    ├── home/                  Home page photos
    ├── projects/              Projects page photos
    ├── sport/
    ├── events/
    ├── music/
    ├── portraits-weddings/
    └── business/
```

Every section in the HTML starts with a big comment banner, like:

```html
<!-- =====================================================================
     SECTION 2 — DISCIPLINES
     Images: images/home/sport.jpg …
     ===================================================================== -->
```

Search for `SECTION` in VS Code to jump between them.

## Adding your photos

**Easiest way:** replace the placeholder file with your photo, using the same name.

- Example: save your hero shot as `images/home/hero.jpg`. Done.
- Each placeholder shows its file path and the recommended size.
- The frame crops your photo to fit, so close-enough sizes are fine.

**Then update the alt text.** Find the `<img>` and change `alt="[Describe the …]"` to a short description, e.g. `alt="Basketball player mid-dunk at HoopNation Classic"`. It helps Google and screen readers.

**Keep files light.** Export at the recommended size, JPG quality 75–80. Aim for under 400 KB each. [Squoosh](https://squoosh.app) does this free.

### Recommended sizes

| Spot | Shape | Size (px) |
| --- | --- | --- |
| Home hero | 2:1 | 2400 × 1200 |
| Home discipline rows | 4:3 | 1600 × 1200 |
| About portrait | 4:5 | 1200 × 1500 |
| Instagram tiles (8 — best first) | 1:1 | 1080 × 1080 |
| Discipline page heroes | 16:7 | 2400 × 1050 |
| Portraits & weddings hero | 4:5 | 1200 × 1500 |
| Galleries — sport, music, portraits | 4:5 | 1200 × 1500 |
| Galleries — events, business | 3:2 | 1800 × 1200 |

To add more gallery photos, copy one `<div class="photo …">` line and bump the number.

## Fill these in before launch

Search VS Code for `[` to find them all:

- `portraits-weddings.html` → `[WEDDING PRICE]`
- `projects.html` → the moto and mountain bike photos and their `alt="[…]"`

## The enquiry form

Enquiries go straight to your inbox through Formspree (form `xaeezndr`).

- Change where they're sent, see submissions or turn on spam filtering at [formspree.io](https://formspree.io).
- `js/form.js` keeps visitors on the page and shows a thank-you message.
- The hidden `_gotcha` field catches spam bots. Leave it in.

## Hosting it

Any static host works. Three easy options:

- **Netlify Drop** — drag the whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop). Live in a minute.
- **GitHub Pages** — push the folder to a repo, then Settings → Pages.
- **Your own host (cPanel)** — upload the folder contents into `public_html`.

Point `ammedianz.com` at it from your domain settings.

## Changing the look

All colours and fonts live at the top of `css/style.css` under **01. BRAND TOKENS**. Change one value there and it updates everywhere.

## The aperture ring

The f-stop ring on the right edge turns as visitors scroll: top of the page is f/1.4, bottom is f/22. It spins in on page load and only shows on screens wider than 1180px.

- Look: `css/style.css` → section 19
- Movement: `js/aperture.js` (change `STOPS`, `EASE` for a heavier or lighter ring, `RADIUS` for more or less curve)
- Visitors with "reduce motion" switched on get a still ring that follows the scroll.

## Depth & motion

Kept quiet on purpose: soft shadows, a slow zoom on photos when hovered, and one gentle fade-up per section.

- **Shadows, hover zoom, sticky header:** `css/style.css` → section 20. Edit `--shadow-soft` to go softer or deeper.
- **Fade-ups:** `js/motion.js`. Add or remove sections in `BLOCKS`.
- Visitors with "reduce motion" switched on get a still page.

## Projects page

`projects.html` is your personal-work showcase, set on a dark palette (`<body class="theme-dark">`).

- **Start a new project:** copy the whole *Project 01: Skate at the Mount* section, change the number, text and images, and set its status (`In progress`, `Ongoing series`, or `Planned`).
- **Move a "Next on the list" card up** once you start shooting it.
- The home page teaser (section 2 of `index.html`) features one project. Swap it to your latest.

## Hero reel

Drop a short muted loop into `video/hero-reel.mp4` and it plays on the home page automatically. Until then, `images/home/hero.jpg` shows.

## Featured film

The Business page plays `video/tokoroa-pools.mp4` (section 4b), with `images/business/film-poster.jpg` as the cover frame. Swap in a new film by changing those two paths. Keep films 1280 × 720 and under ~15 MB. Styles: `css/style.css` → section 23.

## Camera-settings flip cards

Click (or tap) a photo and it flips to show the camera, lens, focal length, aperture, shutter, ISO and date.

- **Automatic:** the details come from the camera data (EXIF) inside each JPG. When exporting from Lightroom, set *Metadata* to **All Metadata, except Camera Raw info**, and tick **Remove Location Info**. That keeps the settings but drops GPS.
- **No data in the file?** That photo stays a normal photo. Or type the details in by hand on its `.photo` frame:
  `<div class="photo ratio-4-5" data-camera="Sony α7 V" data-lens="Sony FE 70-200mm F2.8 GM II" data-focal="200mm" data-aperture="f/2.8" data-shutter="1/1600s" data-iso="ISO 400" data-date="16 May 2026">`
- **Which photos flip:** galleries, page heroes, the Projects teaser and the "Next on the list" cards. Home discipline rows and Instagram tiles are links, so they don't flip.
- Look: `css/style.css` → section 22 · Behaviour: `js/exif-flip.js`

## Business page (hidden)

`business.html` is still in the folder but nothing links to it, and it carries a `noindex` tag so Google skips it. To bring it back:

1. In `business.html`, delete the `<meta name="robots" content="noindex">` line.
2. In `index.html`, section 3, un-hide Row V (instructions are in the comment) and change "Four ways" back to "Five ways".
3. Add `<a class="nav-link" href="business.html">Business</a>` back to the header (after Portraits & weddings) and the mobile menu on every page, and `<a href="business.html">Business</a>` to the home footer.

## Email signature

Open **ammedianz.com/email-signature.html**, copy the signature from the white box and paste it into Gmail (steps are on the page). The photo it uses lives at `images/email/ane.jpg`, so keep that file on the site. The page is hidden from Google.
