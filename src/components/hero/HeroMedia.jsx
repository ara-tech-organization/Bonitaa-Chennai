import hero800 from '../../assets/hero-800.webp'
import hero1280 from '../../assets/hero-1280.webp'
import hero1920 from '../../assets/hero-1920.webp'

/**
 * The hero photograph, plus the scrims that keep the copy legible over it.
 *
 * Deliberately static: no entrance animation, no parallax, no loader. The
 * image is the LCP element, so it paints once and stays put — anything that
 * fades or moves it delays that paint and reads as a flash on reload.
 *
 * The source art already reserves clean white space on its left, so on wide
 * screens the image simply sits behind everything. The scrims exist for the
 * narrow crops, where that white space is cropped away and text would
 * otherwise land on the model.
 *
 * Served as WebP at three widths — the 1.7MB PNG master stays in the repo but
 * is never shipped.
 */
export default function HeroMedia() {
  return (
    <div className="hm" aria-hidden="true">
      <img
        className="hm__img"
        src={hero1280}
        srcSet={`${hero800} 800w, ${hero1280} 1280w, ${hero1920} 1920w`}
        sizes="100vw"
        width="1920"
        height="1280"
        alt=""
        fetchPriority="high"
        decoding="sync"
      />

      {/* Left wash — guarantees contrast for the copy at every crop. */}
      <div className="hm__wash" />
      {/* Bottom fade, so the hero dissolves into the page rather than stopping. */}
      <div className="hm__foot" />
      <div className="hm__grain" />
    </div>
  )
}
