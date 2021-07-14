import React from 'react';
import Header from '../components/Header';
import './layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      {children}
    </div>
  );
}

export default Layout;
