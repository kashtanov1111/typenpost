import React from 'react';

export const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    className='a a-without-underline-onhover'
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));
