import { SizeColumn, SizeData } from '../../../Data/SizeGuideData';
import DataTables from '../../Element/DataTable';

const SizeGuideDetails = () => {
  return (
    <div className='table-responsive table-pane'>
      <DataTables columns={SizeColumn} data={SizeData} />
    </div>
  );
};

export default SizeGuideDetails;
