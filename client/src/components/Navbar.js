import React from 'react';
import { Link } from 'react-router-dom';
import Auth from "../utils/auth";


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
        <li className='navigation_item'>
          <Link to='/logout' className='navigation_link' onClick={Auth.logout}>Log Out</Link>
        </li>
      </ul>
    </div>
  )
   
};

export default Navbar;