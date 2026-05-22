import { useCallback, useState } from 'react';
import { Container } from 'reactstrap';
import GridNav from './GridNav';
import GridsCard from './GridsCard';

const PortFolioGridContain = ({ portfoliodata, colclass }) => {
  const [val, setVal] = useState();
  const handleClick = useCallback((value) => {
    setVal(value);
  }, []);
  return (
    <section id='portfolio' className='portfolio section-b-space'>
      <Container>
        <GridNav handleClick={handleClick} val={val} />
        <GridsCard portfoliodata={portfoliodata} val={val} colclass={colclass} />
      </Container>
    </section>
  );
};

export default PortFolioGridContain;
