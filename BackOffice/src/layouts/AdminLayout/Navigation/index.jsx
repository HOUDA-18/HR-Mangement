import React, { useContext } from 'react';

// project import
import { ConfigContext } from '../../../contexts/ConfigContext';
import useWindowSize from '../../../hooks/useWindowSize';

import NavContent from './NavContent';
import navigation from '../../../menu-items';

// ==============================|| NAVIGATION ||============================== //
const user = JSON.parse(localStorage.getItem("user"));      // Retrieve user info

const Navigation = () => {
  const configContext = useContext(ConfigContext);
  const { layoutType, collapseMenu } = configContext.state;
  const windowSize = useWindowSize();

  const scroll = () => {
    document.querySelector('.pcoded-navbar').removeAttribute('style');
  };

  let navClass = ['pcoded-navbar', layoutType];
  navClass = [...navClass, 'menupos-fixed'];
  window.removeEventListener('scroll', scroll, false);

  if (windowSize.width < 992 && collapseMenu) {
    navClass = [...navClass, 'mob-open'];
  } else if (collapseMenu) {
    navClass = [...navClass, 'navbar-collapsed'];
  }

// Function to filter menu items based on role
const filterMenuItems = (items) => {
  // Ensure user and user.role exist
  if (!user || !user.role) {
    return [];
  }
  
  return items
    .map((group) => {
      const filteredChildren = group.children
        ? group.children.filter((item) => {
            // Check if item.roles exists and is an array
            if (Array.isArray(item.roles)) {
              return item.roles.includes(user.role);
            }
            return false;
          })
        : [];
      return { ...group, children: filteredChildren };
    })
    .filter((group) => group.children.length > 0);
};



// Apply filtering
const filteredNavigation = filterMenuItems(navigation.items);



  let navBarClass = ['navbar-wrapper'];
  let navContent = (
    <div className={navBarClass.join(' ')}>
      <NavContent navigation={navigation.items} />
    </div>
  );


  if (windowSize.width < 992) {
    navContent = (
      <div className="navbar-wrapper">
        <NavContent navigation={navigation.items} />
      </div>
    );
  }
  return (
    <React.Fragment>
      <nav className={navClass.join(' ')}>{navContent}</nav>
    </React.Fragment>
  );
};

export default Navigation;
