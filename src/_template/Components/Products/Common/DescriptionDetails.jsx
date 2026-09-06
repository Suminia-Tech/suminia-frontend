const DescriptionDetails = ({ singleProduct }) => {
  const product = singleProduct?.[0];

  return (
    <div className='shipping-chart'>
      <div className='part'>
        <p className='font-light'>{product?.description || 'Sin descripción disponible.'}</p>
      </div>
    </div>
  );
};

export default DescriptionDetails;
