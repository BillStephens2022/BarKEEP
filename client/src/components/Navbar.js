import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <div className="navigation">
      <ul className='navigation_list'>
        <li className='navigation_item'>
          <Link to='/' className='navigation_link'>Home</Link>
        </li>
        <li className='navigation_item'>
          <Link to='/cocktails' className='navigation_link'>My Cocktails</Link>
        </li>
        <li className='navigation_item'>
          <Link to='/login' className='navigation_link'>Log In / Register</Link>
        </li>
      </ul>
    </div>
  )
   
};

export default Navbar;