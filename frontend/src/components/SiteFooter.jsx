import brandLogo from '../assets/trieo-logo.png'

const CURRENT_YEAR = new Date().getFullYear()

function SiteFooter({ onNavigateHome }) {
  return (
    <footer className="travel-footer">
      <div className="home-container">
        <div className="footer-top"><div className="footer-intro"><a href="#" onClick={onNavigateHome} aria-label="Trieo.lk home"><img src={brandLogo} alt="Trieo.lk" width="710" height="354" /></a><p>Find the extraordinary in the nearby.<br />Your local day out starts here.</p><span className="footer-location"><span className="location-dot" /> Padalangala, Sri Lanka</span></div><div className="footer-links"><h3>Explore a little</h3><a href="#discover" onClick={onNavigateHome}>Discover destinations &gt;</a><a href="#places" onClick={onNavigateHome}>Browse attractions &gt;</a><a href="#how-it-works" onClick={onNavigateHome}>How it works &gt;</a><a href="#about" onClick={onNavigateHome}>About Trieo.lk &gt;</a></div><div className="footer-message"><span className="eyebrow">TAKE THE SCENIC WAY</span><h3>Less scrolling.<br /><em>More exploring.</em></h3><a href="#places" onClick={onNavigateHome} className="footer-explore">Find your next escape <span aria-hidden="true">&gt;</span></a></div></div>
        <div className="footer-bottom"><p>© {CURRENT_YEAR} Trieo.lk. All rights reserved.</p><span>Made for local discovery · One day at a time</span><a href="#" onClick={onNavigateHome}>Back to top ↑</a></div>
      </div>
    </footer>
  )
}

export default SiteFooter
