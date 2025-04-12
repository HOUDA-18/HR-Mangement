import "./Navbar.scss";

import { Link } from "react-router-dom";
import NavItem from "./NavItem";
import React from "react";

export default function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg navbar-light py-4'>
      <div className='container'>
        <Link to='/' className='navbar-brand fs-2 fw-bold'>
          HR <span className='text-secondary'>Management</span>
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarmenu'
          aria-controls='navbarmenu'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarmenu'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0 w-100 justify-content-center'>
            <NavItem linkTo='' name='Home' iconClassName='bi bi-house' />
            <NavItem linkTo='/jobadvert' name='Find a Job' iconClassName='bi bi-search' />
            <NavItem linkTo='/about' name='About Us' iconClassName='bi bi-info-circle' />
{/*             <NavItem linkTo='/jobadvert/add' name='Post a Job' iconClassName='bi bi-card-text' />
 */}          </ul>
        </div>
        <div>
         
        </div>
      </div>
    </nav>
  );
}
