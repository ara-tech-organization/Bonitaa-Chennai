/**
 * Builds the favicon from the B monogram in src/assets/Logo.png.
 * The source logo is never written to — this only reads it.
 *
 * Everything here is measured off the pixels rather than eyeballed:
 *   full mark   x  58-199, y  17-220
 *   frame lines x  77- 79 and x 198-199 (verticals), y 17-19 / 218-220
 *   glyph       x  58-189, y  34-200
 *
 * The frame is 2-3px of hairline. It vanishes at 32px and only steals room from
 * the glyph, so the crop is the monogram alone — but its left vertical runs
 * straight through the glyph's box, and the stretch the glyph does not cover
 * was left behind as a stray tick. That segment is cleared first.
 */
import sharp from 'sharp'

const SRC = 'src/assets/Logo.png'
const FRAME_X = [77, 78, 79]
const GLYPH = { left: 58, top: 34, width: 132, height: 167 }
const CREAM = { r: 253, g: 250, b: 244, alpha: 1 }

async function main() {
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info
  const alphaAt = (x, y) => data[(y * W + x) * C + 3] > 40

  /* Clear the frame's left hairline wherever the glyph is not riding on it —
     tested by looking a few pixels either side rather than by row range, so a
     flourish that crosses the line keeps its pixels. */
  let cleared = 0
  for (let y = 0; y < H; y++) {
    const covered = alphaAt(74, y) || alphaAt(75, y) || alphaAt(82, y) || alphaAt(83, y)
    if (covered) continue
    for (const x of FRAME_X) {
      const i = (y * W + x) * C
      if (data[i + 3] === 0) continue
      data[i + 3] = 0
      cleared++
    }
  }

  const cleaned = await sharp(data, { raw: { width: W, height: H, channels: C } })
    .png()
    .toBuffer()

  const pad = Math.round(GLYPH.height * 0.08)
  const side = Math.max(GLYPH.width, GLYPH.height) + pad * 2
  const mark = await sharp(cleaned).extract(GLYPH).png().toBuffer()
  const place = [
    {
      input: mark,
      left: Math.round((side - GLYPH.width) / 2),
      top: Math.round((side - GLYPH.height) / 2),
    },
  ]

  /* On the page's own cream rather than transparency: the single icon has to
     look right on iOS too, and iOS composites transparency onto black. */
  const opaque = await sharp({
    create: { width: side, height: side, channels: 4, background: CREAM },
  })
    .composite(place)
    .png()
    .toBuffer()

  /* One file for everything — tab, bookmark, Android home screen, iOS home
     screen. Browsers downscale a 512px icon perfectly well, and three
     near-identical PNGs was three things to keep in step for no visible gain.
     It is the opaque version because iOS composites a transparent touch icon
     onto black, which would have made the one shared file look wrong on
     exactly one platform. */
  await sharp(opaque).resize(512, 512).png({ compressionLevel: 9 }).toFile('public/favicon.png')

  console.log(`cleared ${cleared} frame px · tile ${side}px · wrote public/favicon.png`)
}

main()
