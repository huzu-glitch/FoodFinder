import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/30a2cef1ff0e26a998cb02a572f85542.png'

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="header" role="banner">
        <div className="header-container">
          <div className="header-brand">
            <img 
              src={Logo}
              alt="FoodFetish Logo"
              className="header-logo"
              loading="eager"
              decoding="async"
            />
            <span className="header-brand-text" aria-label="FoodFetish - Recipe Application">
              FoodFetish
            </span>
          </div>
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
          <button 
            className="header-button" 
            onClick={() => navigate('/')}
            aria-label="Go to home page"
            type="button"
            aria-current={window.location.pathname === '/' ? 'page' : undefined}
          >
            Home
          </button>
          {user ? (
            <>
              <button 
                className="header-button" 
                onClick={() => navigate('/favorites')}
                aria-label="View your favorite recipes"
                type="button"
                aria-current={window.location.pathname === '/favorites' ? 'page' : undefined}
              >
                Favorites
              </button>
              <button 
                className="header-button header-logout-button" 
                onClick={onLogout}
                aria-label="Logout from your account"
                type="button"
                aria-describedby="logout-description"
              >
                <span>Logout</span>
                <svg 
                  className="header-logout-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  strokeMiterlimit="2" 
                  strokeLinejoin="round" 
                  fillRule="evenodd" 
                  clipRule="evenodd"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path fillRule="nonzero" d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"></path>
                </svg>
              </button>
              <div id="logout-description" className="sr-only">
                This will log you out of your account and redirect you to the home page
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="header-button"
                aria-label="Login to your account"
                aria-current={window.location.pathname === '/login' ? 'page' : undefined}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="header-button"
                aria-label="Create a new account"
                aria-current={window.location.pathname === '/register' ? 'page' : undefined}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
    </>
  );
}

export default Header;
