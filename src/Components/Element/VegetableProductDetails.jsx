const VegetableProductDetails = ({ data }) => {
  return (
    <div className='product-details'>
      <h4>product details</h4>
      <ul>
        <li>
          <span className='font-light'>Display type :</span> {data?.name}
        </li>
        <li>
          <span className='font-light'>Mechanism:</span> {data?.type}
        </li>
      </ul>
    </div>
  );
};
export default VegetableProductDetails;
