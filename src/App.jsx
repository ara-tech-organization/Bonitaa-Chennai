import { lazy } from 'react'
import CallProvider from './CallProvider'
import Booking from './components/Booking'
import CallModal from './components/CallModal'
import CallbackInvite from './components/CallbackInvite'
import Header from './components/Header'
import Hero from './components/hero/Hero'
import LazySection from './components/LazySection'
import ActionBar from './components/ActionBar'
import TrustBar from './components/TrustBar'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import useSmoothScroll, { useCleanAnchors } from './hooks/useSmoothScroll'
import './App.css'

/* Everything from About down is below the fold on every viewport, so it ships
   as its own chunk and downloads on approach. The hero, the booking form and
   the trust bar stay eager — they are the first screen and the first scroll. */
const About = lazy(() => import('./components/About'))
const Results = lazy(() => import('./components/Results'))
const Services = lazy(() => import('./components/Services'))
const WhyUs = lazy(() => import('./components/WhyUs'))
const Reviews = lazy(() => import('./components/Reviews'))
const Faq = lazy(() => import('./components/Faq'))
const Footer = lazy(() => import('./components/Footer'))

export default function App() {
  const reduced = usePrefersReducedMotion()
  // Momentum scrolling is a motion effect — off when the user opts out.
  useSmoothScroll(!reduced)
  // Section links scroll without leaving a fragment behind in the URL.
  useCleanAnchors()

  return (
    <CallProvider>
      <Header />
      <main>
        <Hero />
        <Booking />
        <TrustBar />

        <LazySection anchorId="about" minHeight={620}>
          <About />
        </LazySection>

        <LazySection anchorId="results" minHeight={720}>
          <Results />
        </LazySection>

        <LazySection anchorId="treatments" minHeight={760}>
          <Services />
        </LazySection>

        <LazySection minHeight={520}>
          <WhyUs />
        </LazySection>

        <LazySection anchorId="reviews" minHeight={760}>
          <Reviews />
        </LazySection>

        <LazySection anchorId="faq" minHeight={620}>
          <Faq />
        </LazySection>
      </main>

      <LazySection minHeight={480}>
        <Footer />
      </LazySection>

      <ActionBar />
      <CallbackInvite />
      <CallModal />
    </CallProvider>
  )
}
