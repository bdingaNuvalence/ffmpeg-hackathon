import React from 'react';

const ThanksFooter = () => <div className="footer-sub-footer">
  <h6>Art Assets Sources:</h6>
  <ul className="footer-ty-links">
    {[{
      note: 'Sammy logo in header',
      href: 'https://www.vecteezy.com/free-vector/man-glasses',
      label: 'Man Glasses Vectors by Vecteezy'
    },
    {
      note: 'animated neutrons',
      href: 'https://www.vecteezy.com/vector-art/653945-pizza-icon-image',
      label: 'Pizza Vectors by Vecteezy'
    },
    {
      note: 'tiled backgrond images',
      href: 'https://www.transparenttextures.com/',
      label: 'Background Textures'
    }].map(({ href, label, note }, index) => <li key={`${index + 1}-${href}`}>
      <a href={ href } target="_blank" rel="noopener noreferrer">{ label }</a>
      { note && (<span className="footer-ty-link-note">{` (${note})`}</span>)}
    </li>)}
  </ul>
</div>;

export default ThanksFooter;
