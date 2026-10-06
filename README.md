# VOGUE · The Anniversary Issue

A Vogue-style online magazine for Ziyad & Fatima's 6-month anniversary: 30 pages with a realistic page-flip animation (hard covers, soft pages and a paper sound), scrapbook stickers, and games. It's built phone-first: on phones each page fills the screen.

It's plain HTML/CSS/JS with no build step. Open `index.html` (or run `npx serve .`), or deploy to Vercel as-is.

## Adding your photos

Put your photos in the `images/` folder, named `image1.png`, `image2.png`, … `image36.png`.
`.jpg`, `.jpeg` and `.webp` work too (e.g. `image7.jpg`). Until a photo exists, the mockup picture shows with its file name on top, so you can see where each photo goes.

> Vercel is case-sensitive: use `image1.png`, not `Image1.PNG` or `image1.png.png`.

| File | Page | Where / best shape |
|---|---|---|
| image1 | 00 Front cover | Full page, portrait: you two together |
| image2 | 01 Dylan Blue ad | Full page, portrait: Ziyad as "the model" |
| image3 | 02 Contents | Tall arch |
| image4 | 04 Editor's letter | Portrait of Fatima |
| image5 | 05 Contributors | Square: Ziyad |
| image6 | 05 Contributors | Square: Fatima |
| image7 | 06 By the Numbers | Circle |
| image8 | 07 Cover story | Full page, portrait |
| image9 | 09 Love story, part I | Landscape |
| image10 | 10 Love story, part II | Landscape (bottom half of the page) |
| image11–12 | 11 The Road to Us | Polaroids |
| image13–14 | 12 The Road to Us | Polaroids |
| image15–20 | 13 Our Best Memories | 6 polaroids |
| image21 | 14 36 Questions | Wide strip |
| image22 | 16 The Contract | Party B's witness |
| image23 | 16 The Contract | Party A's witness |
| image24 | 16 The Contract | "(emotional support)": the Kinder Bueno |
| image25 | 17 Beauty Secrets | Wide pill |
| image26 | 18 Bucket List | Landscape polaroid |
| image27 | 21 Love-opoly | Landscape |
| image28 | 22 Survival Kit | Wide strip |
| image29 | 23 Soundtrack | Vinyl label (circle, keep the subject centred) |
| image30–31 | 24 Love letter | Ovals |
| image32–34 | 26 Wish You Were Here | Landscape postcards (Funghi, Brew, Turkey) |
| image35 | 28 Last Look | Large landscape/square |
| image36 | 29 Back cover | Full page, portrait |

**Crop looks off?** Add a focus point to that slot in `index.html`, e.g.
`<figure class="ph bleed" data-img="1" style="--pos:center 20%">` (moves the crop toward the top).

## Audio (the `audio/` folder)

Tapping the record plays `audio/The_Cuppy_Cake_Song-639983-mobiles24.mp3`. To use a different song, drop the file in `audio/` and change `song.file` in `js/config.js`. If the file ever fails to load, it falls back to the official YouTube upload.

## Photo filenames

`js/config.js` has an `images` list that maps each slot to its exact file (`.png`, `.jpg` and `.jpeg` are all fine). If you replace a photo with a different extension, update its line there. Slot 16 currently reuses `image3.jpg`.

To crop out bars or borders in a photo, add a zoom to its slot in `index.html`, e.g. `style="--zoom:1.2"`.

## Personalising the text

- **`js/config.js`** has the names, the date you became official (powers the live day counter), and all game content: crossword words/clues (the grid builds itself), "Who's more likely to…", Love-opoly squares, bucket list, love coupons.
- **`index.html`** has every article's text, each page marked with a comment such as `<!-- 15 · THE CONTRACT (part one) -->`.

## Controls

Swipe or tap the arrows on phones. On a computer, drag a page corner or use the ← → keys. The top bar has Contents, page sound on/off and fullscreen.

## Deploy (GitHub → Vercel)

```bash
git init
git add .
git commit -m "Vogue anniversary issue"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then on vercel.com: **Add New → Project → import the repo**. Leave Framework Preset as **Other**, with no build command and no output directory. Click **Deploy**. To add photos or audio later, put them in the folders, commit and push. Vercel redeploys automatically.

## Credits

- Page flip: [StPageFlip](https://github.com/Nodlik/StPageFlip) (MIT), bundled in `js/vendor/`
- Fonts: Bodoni Moda, EB Garamond, Jost, Pinyon Script, Caveat, Gloria Hallelujah, Courier Prime (Google Fonts)
- Placeholder photo: Unsplash · Stickers and the Dylan Blue bottle are drawn in SVG in `index.html`
- The Cuppycake Song by Amy Castle, played from its official YouTube upload
