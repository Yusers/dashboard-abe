import React from 'react';
import './index.scss';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className='app'>
      <Sidebar />
      <div className='main'>
        <Header title='Quản lý danh sách ABE' />
        <div className='body'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
