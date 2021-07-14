import React from 'react';
import './container.css';

function Container({ children }) {
  return (
    <div className="sample-container">
      {children}
    </div>
  );
}

export default Container;
