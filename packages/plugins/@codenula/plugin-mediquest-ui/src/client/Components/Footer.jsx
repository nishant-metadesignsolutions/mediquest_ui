
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

const Footer = (props) => {
  return (
    <footer className="footer-cntr">
      <div className="container">
        <div className="footer-logo">
          <a href="/">
            <img src={`https://mediquest.codenula.com${props.footerData.company_logo[0].url}`} alt="" />
          </a>
        </div>
        <nav className="footer-navbar">
          <ul className="menu-list">
            <li>
              <a href="/policies#termsConditions">{props.footerData.terms_conditions}</a>
            </li>
            <li>
              <a href="/policies#privacyPolicy">{props.footerData.privacy_policy}</a>
            </li>
            <li>
              <a href="/policies#cancellationsRefunds">{props.footerData.cancellation_refunds}</a>
            </li>
            <li>
              <a href="/about">{props.footerData.abount_us}</a>
            </li>
            <li>
              <a href="/contact-us">{props.footerData.contact_us}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="rights">
        <div className="container">
          <p>{props.footerData.rights_reserved}</p>
          <p>{props.footerData.owned_by}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
