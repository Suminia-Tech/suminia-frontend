import Img from '@/Components/Element/Images';
import { CommonPath } from '@/Constant';

const SocialTab = ({ elem }) => {
  return (
    <div className='home-social'>
      <ul>
        {elem?.social?.map((result, i) => {
          return (
            <li key={i}>
              <a className='font-default' href={result.link}>
                <Img src={`${CommonPath}/${result.image}`} className='img-fluid' alt='SocialTab' />
                <span>{result.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SocialTab;
