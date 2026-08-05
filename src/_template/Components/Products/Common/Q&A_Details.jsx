import { QADetails } from '../../../Data/ProductDetailsData';

const QA_Details = () => {
  return (
    <div className='question-answer'>
      <ul>
        {QADetails.map((elem) => {
          return (
            <li key={elem.id}>
              <div className='que'>
                <i className='fas fa-question'></i>
                <div className='que-details'>
                  <h6>{elem.question}</h6>
                  <p className='font-light'>{elem.answer}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default QA_Details;
