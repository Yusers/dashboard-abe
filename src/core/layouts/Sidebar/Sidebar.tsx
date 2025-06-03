import React from 'react';
import './Sidebar.scss';
import team from '../../../assets/img/dashbroad-item.png';
import mail from '../../../assets/img/dashbroad-item (1).png';
import avatar from '../../../assets/img/Ellipse.png';
import signOut from '../../../assets/img/Button.png';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };
  return (
    <div className='sidebar'>
      <div className='logo'>
        <img src='/logo192.png' alt='Logo' className='logo' />
      </div>
      <div className='icon' onClick={() => handleNavigate('dashboard/members')}>
        <img src={team} alt='team' />
      </div>
      <div className='icon' onClick={() => handleNavigate('dashboard/mail')}>
        <img src={mail} alt='mail' />
      </div>
      <div className='bottom-icon'>
        <div className='bottom-info'>
          <img width={38} height={38} src={avatar} alt={'avatar'} />
        </div>
        <button className='bottom-button'>
          <img src={signOut} alt='signOut' />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
