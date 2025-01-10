import React from 'react';

function Error({ message }) {
  return (
    <div className="error-message">
      <p>Error: {message}</p>
    </div>
  );
}

export default Error; 