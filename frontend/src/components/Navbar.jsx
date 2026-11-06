// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/plan', label: 'Plan My Trip' },
    { to: '/hotels', label: 'Hotels' },
    { to: '/bookings', label: 'My Bookings' },
    { to: '/admin', label: 'Business Analytics' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 shadow-xs sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
        {/* Logo / Global Branding */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary tracking-tight">
          <span className="w-3 h-3 rounded-full bg-accent inline-block"></span>
          <span>Tourism<span className="text-accent">360</span></span>
          <span className="hidden sm:inline-block text-[11px] font-normal text-gray-400 pl-2 border-l border-gray-200">
            Global Travel & Intelligence
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors pb-1 ${
                    isActive
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-primary hover:text-accent'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Action */}
        <div className="hidden md:block">
          <Link
            to="/plan"
            className="inline-flex items-center bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-accent transition-colors shadow-xs"
          >
            Plan Trip
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary p-2 rounded-lg hover:bg-gray-100 focus:outline-none cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4 shadow-lg">
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-accent font-semibold' : 'text-primary hover:text-accent'
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Link
              to="/plan"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-primary text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-accent transition-colors"
            >
              Plan Trip
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
