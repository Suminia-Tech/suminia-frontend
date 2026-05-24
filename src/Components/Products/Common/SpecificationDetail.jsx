const SpecificationDetail = ({ singleProduct }) => {
  const product = singleProduct?.[0];

  const specs = [
    { label: 'Marca', value: product?.brand },
    { label: 'Categoría', value: product?.category },
    { label: 'Tipo', value: product?.type },
    { label: 'Fabricante', value: product?.manufacturer },
    { label: 'Departamento', value: product?.department },
    { label: 'Disponible desde', value: product?.first_available_date },
  ].filter((s) => s.value && s.value !== 'none');

  if (!product) return null;

  return (
    <div className='pro mb-4'>
      <div className='table-responsive'>
        <table className='table'>
          <tbody>
            {specs.map((spec, i) => (
              <tr key={i}>
                <td className='font-light' style={{ width: '40%' }}>{spec.label}</td>
                <td>{spec.value}</td>
              </tr>
            ))}
            {specs.length === 0 && (
              <tr>
                <td colSpan={2} className='font-light'>Sin especificaciones disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificationDetail;
