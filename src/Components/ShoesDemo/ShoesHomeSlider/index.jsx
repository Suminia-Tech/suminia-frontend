import ShoesSlider from './ShoesSlider';

const ShoesHomeSlider = ({ mainSlider }) => {
  const ShoesMainFilter = mainSlider?.filter((el) => el.type === 'shoes');
  return (
    <section className='pt-0 overflow-hidden home-section home-section-3'>
      <div>
        <div className='banner-slider box-arrow'>
          <ShoesSlider ShoesMainFilter={ShoesMainFilter} />
        </div>
      </div>
    </section>
  );
};
export default ShoesHomeSlider;
