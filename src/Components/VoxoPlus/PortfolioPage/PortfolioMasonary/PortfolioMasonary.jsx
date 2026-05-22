import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';
import Masonry from 'react-masonry-css';

const PortfolioMasonary = ({ portfoliodata, val, colclass, masonaryclass, rowclass, noSpace }) => {
  const breakpointColumnsObj = {
    default: masonaryclass,
    991: 2,
    575: 1,
  };
  return (
    <Masonry className={`row ${rowclass ? rowclass : 'g-3'} filter-gallery mt-3 content grid`} breakpointCols={breakpointColumnsObj} columnClassName={`grid-item app ${colclass}`}>
      {portfoliodata &&
        portfoliodata.map((el) => {
          return el.children
            .filter((ee) => {
              if (val === 'all' || val === undefined) return true;
              else return ee.filter === val;
            })
            .map((elem) => {
              return (
                <div className={`parent-container ${!noSpace ? 'mb-3' : ''}`} key={elem.id}>
                  <a>
                    <Img src={`${CommonPath}/${elem.src}`} className='img-fluid images' alt='images' />
                    <div className='overlay-color'>
                      <div className='overlay-icon'>
                        <div>
                          <h3>{elem.title}</h3>
                          <p className='font-light'>{elem.description}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            });
        })}
    </Masonry>
  );
};

export default PortfolioMasonary;
