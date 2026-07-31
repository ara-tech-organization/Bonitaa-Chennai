import CallProvider from './CallProvider'
import About from './components/About'
import Booking from './components/Booking'
import CallModal from './components/CallModal'
import CallbackInvite from './components/CallbackInvite'
import Faq from './components/Faq'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Results from './components/Results'
import Reviews from './components/Reviews'
import Services from './components/Services'
import ActionBar from './components/ActionBar'
import TrustBar from './components/TrustBar'
import WhyUs from './components/WhyUs'
import './App.css'

export default function App() {
  return (
    <CallProvider>
      <Header />
      <main>
        <Hero />
        <Booking />
        <TrustBar />
        <About />
        <Results />
        <Services />
        <WhyUs />
        <Reviews />
        <Faq />
      </main>
      <Footer />
      <ActionBar />
      <CallbackInvite />
      <CallModal />
    </CallProvider>
  )
}
