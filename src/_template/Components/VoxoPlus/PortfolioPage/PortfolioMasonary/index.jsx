import { useCallback, useState } from 'react';
import { Container } from 'reactstrap';
import GridNav from '../PortFolioGrid/GridNav';
import PortfolioMasonary from './PortfolioMasonary';

const PortfolioMasonaryContain = ({ portfoliodata, colclass, masonaryclass, rowclass, noSpace }) => {
  const [val, setVal] = useState();
  const handleClick = useCallback((value) => {
    setVal(value);
  }, []);
  return (
    <section id='portfolio' className='portfolio section-b-space'>
      <Container>
        <GridNav handleClick={handleClick} val={val} />
        <PortfolioMasonary portfoliodata={portfoliodata} val={val} colclass={colclass} masonaryclass={masonaryclass} rowclass={rowclass} noSpace={noSpace} />
      </Container>
    </section>
  );
};

export default PortfolioMasonaryContain;
