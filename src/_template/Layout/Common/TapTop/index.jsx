import react, { useState, useEffect } from 'react';
const TapTop = () => {
  const [taptopStyle, setTapTopStyle] = useState(false);

  const executeScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (window.scrollY > 600) {
      setTapTopStyle(true);
    } else {
      setTapTopStyle(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className={`tap-to-top ${taptopStyle ? 'show' : ''}`}>
      <a href='#javascript' onClick={() => executeScroll()}>
        <i className='fas fa-chevron-up'></i>
      </a>
    </div>
  );
};
export default TapTop;
