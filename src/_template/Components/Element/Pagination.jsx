import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const PaginationComp = ({ StoreProductLength, dataPerPage, paginate, currentPage, addClass }) => {
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(StoreProductLength / dataPerPage); i++) {
    pageNumber.push(i);
  }
  return (
    <nav className={`page-section ${addClass ? addClass : ''}`}>
      <Pagination>
        <PaginationItem onClick={() => paginate(currentPage - 1)}>
          <PaginationLink>
            <span aria-hidden='true'>
              <i className='fas fa-chevron-left'></i>
            </span>
          </PaginationLink>
        </PaginationItem>
        {pageNumber.map((number, i) => {
          return (
            <PaginationItem className={`${currentPage === number ? 'active' : ''}`} onClick={() => paginate(number)} key={i}>
              <PaginationLink>{number}</PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem onClick={() => paginate(currentPage + 1)}>
          <PaginationLink>
            <span aria-hidden='true'>
              <i className='fas fa-chevron-right'></i>
            </span>
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </nav>
  );
};

export default PaginationComp;
