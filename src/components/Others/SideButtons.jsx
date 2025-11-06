import React from 'react';
import '../../styles/Btn.css';

const NavBar = () => {

  return (
    <div>
      <div className="sidebtn">
        <ul>
          <a href="#home"><li><i className='fas fa-location-arrow-up'></i></li></a>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
