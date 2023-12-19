import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/nav.css'
const Icon = ({ icon, className, onClick }) => {
  return (
    <FontAwesomeIcon icon={icon} className='icons_nav' onClick={onClick} />
  );
};

export default Icon;