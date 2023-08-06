import React from 'react';
import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="row">
              <div className="contact-icons">
                <a href="https://www.linkedin.com/in/bill-stephens-04375923/">
                  <i className="fab fa-linkedin text-light mr-2"></i>
                </a>
                <a href="https://github.com/BillStephens2022">
                  <i className="fab fa-github text-light"></i>
                </a>
                <a href="https://billstephens2022.github.io/my_portfolio/">
                  <i title="Link to My Portfolio" className="fas fa-code text-light mr-2"></i>
                </a>
              </div>
            </div>
            <div className="footer-text-div">
              <h2 className="footer-text">
                &copy; 2023 <a title="Link to My Portfolio" href="https://billstephens2022.github.io/my_portfolio/" className="portfolio-link">Bill Stephens</a>
              </h2>
            </div>
          </div>
  )
}

export default Footer;