import React from 'react';
import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
    {/* Include the Font Awesome stylesheet for icons */}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            {/* Row for contact icons */}
            <div className="row">
              <div className="contact-icons">
              {/* LinkedIn profile link */}
                <a href="https://www.linkedin.com/in/bill-stephens-04375923/">
                  <i className="fab fa-linkedin text-light mr-2"></i>
                </a>
                {/* GitHub profile link */}
                <a href="https://github.com/BillStephens2022">
                  <i className="fab fa-github text-light"></i>
                </a>
                {/* Link to personal portfolio */}
                <a href="https://billstephens2022.github.io/my_portfolio/">
                  <i title="Link to My Portfolio" className="fas fa-code text-light mr-2"></i>
                </a>
              </div>
            </div>
            {/* Footer text */}
            <div className="footer-text-div">
              <h2 className="footer-text">
              {/* Copyright text with a link to personal portfolio */}
                &copy; 2023 <a title="Link to My Portfolio" href="https://billstephens2022.github.io/my_portfolio/" className="portfolio-link">Bill Stephens</a>
              </h2>
            </div>
          </div>
  )
}

export default Footer;