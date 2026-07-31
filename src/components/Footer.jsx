import logo from '../assets/Logo.png'
import { BRANCHES, CLINIC } from '../data'
import { useCall } from '../callStore'
import { useReveal } from '../hooks'
import Icon from './Icon'

const LINKS = [
  { label: 'Treatments', href: '#treatments' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Reviews', href: '#reviews' },
]

export default function Footer() {
  const ref = useReveal()
  const { requestCall } = useCall()

  return (
    <footer className="ftr" ref={ref}>
      <div className="shell">
        <div className="ftr__top">
          <div className="ftr__brand reveal">
            <img src={logo} alt={CLINIC.name} width="210" height="52" loading="lazy" />
            <p>
              Chennai&apos;s trusted hair clinic — part of a 35+ branch network across Tamil Nadu, 15+
              years of experience, 10,000+ patients treated.
            </p>
            <button type="button" className="ftr__phone" onClick={() => requestCall()}>
              <Icon name="Phone" size={19} />
              {CLINIC.phoneDisplay}
            </button>
          </div>

          <div className="ftr__branches reveal" style={{ '--delay': '80ms' }}>
            <h3 className="ftr__h">Our Chennai Clinics</h3>
            <div className="ftr__branch-grid">
              {BRANCHES.map((branch) => (
                <div key={branch.id} className="ftr__branch">
                  <strong>
                    <Icon name="MapPin" size={16} />
                    {branch.name}
                  </strong>
                  <address>
                    {branch.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <div className="ftr__branch-map">
                    <iframe
                      src={branch.embed}
                      title={`${branch.name} clinic location on Google Maps`}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <nav className="ftr__links reveal" style={{ '--delay': '140ms' }} aria-label="Quick links">
            <h3 className="ftr__h">Quick Links</h3>
            <ul>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>
                    <Icon name="ArrowRight" size={14} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="ftr__legal">
          <small>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</small>
          <small className="ftr__credit">
            <Icon name="Heart" size={14} fill="currentColor" className="ftr__credit-heart" />
            Crafted by
            <a href="https://discovertechnologies.co/" target="_blank" rel="noopener noreferrer">
              ARA Discover Technology
            </a>
          </small>
        </div>
      </div>
    </footer>
  )
}
