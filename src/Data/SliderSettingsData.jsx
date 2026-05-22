import { CustomeArrowNext, CustomeArrowPrev, FlowerCustomeArrowNext, FlowerCustomeArrowPrev } from './CustomeArrows';

export const InstaSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '20px',
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const NewArrivalSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const MainHomeSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  autoplay: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: '<div className="custom-arrow next"><span>Next</span><i className="fas fa-chevron-right ms-3"></i></div>',
  prevArrow: '<div className="custom-arrow prev"><i className="fas fa-chevron-left me-3"></i><span>Prev</span></div>',
};
// ----------------*****************----------------******************------------
export const FlowerBrandSlider = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const HomePosterSlider = {
  nextArrow: <FlowerCustomeArrowNext />,
  prevArrow: <FlowerCustomeArrowPrev />,
};
// ----------------*****************----------------******************------------
export const FlowerLatestSlider = {
  dots: true,
  infinite: false,
  speed: 500,
  arrows: false,
  slidesToShow: 5,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const FlowerOurSlider = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const FlowerProductSlider = {
  dots: false,
  infinite: true,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};
// ----------------*****************----------------******************------------
export const FlowerUpdateSlider = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const CategoryBannerSlider = {
  dots: false,
  infinite: true,
  arrows: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1425,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        speed: 500,
        autoplay: false,
        fade: true,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const FurnitureMainSlider = {
  nextArrow: '<div className="custom-arrow next"><span>Next</span><i className="fas fa-chevron-right ms-3"></i></div>',
  prevArrow: '<div className="custom-arrow prev"><i className="fas fa-chevron-left me-3"></i><span>Prev</span></div>',
};
// ----------------*****************----------------******************------------
export const FurnitureThreeSlider = {
  dots: false,
  infinite: true,
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
};
// ----------------*****************----------------******************------------
export const FurnitureProductSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 1367,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 740,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ElectronicMainSlider = {
  dots: false,
  infinite: true,
  speed: 500,
  arrows: false,
  autoplay: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
};
// ----------------*****************----------------******************------------
export const ShoesMainSlider = {
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        infinite: false,
        arrows: false,
        slidesToShow: 1,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ElectronicProductSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 705,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const VRSlider = {
  dots: true,
  infinite: true,
  arrows: false,
  slidesToShow: 7,
  slidesToScroll: 1,
  speed: 500,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 1367,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 740,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 481,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ShoesProductSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 705,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ShoesCategorySlider = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1501,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 970,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        fade: true,
        speed: 800,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ShoesNewSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const VegetableMainSlider = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  fade: true,
  nextArrow: <CustomeArrowNext />,
  prevArrow: <CustomeArrowPrev />,
};
// ----------------*****************----------------******************------------
export const VegetableNavSlider = {
  slidesToShow: 3,
  slidesToScroll: 1,
  width: '146px',
  dots: true,
  focusOnSelect: true,
};
// ----------------*****************----------------******************------------
export const VegetableFreshSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 705,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const FreshFruitsSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 705,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const SliderFruit = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const BottomBanner = {
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const BlogSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ShopSliderData = {
  dots: true,
  infinite: false,
  arrows: false,
  slidesToShow: 7,
  slidesToScroll: 1,
  speed: 500,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1630,
      settings: {
        slidesToShow: 6,
      },
    },
    {
      breakpoint: 1367,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 740,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const AutoFadeSliderPosterData = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  autoplay: true,
  autoplaySpeed: 3000,
};
// ----------------*****************----------------******************------------
export const AutoFadeSliderNavData = {
  slidesToShow: 3,
  slidesToScroll: 1,
  dots: false,
  centerMode: true,
  focusOnSelect: true,
  centerPadding: 0,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 3000,
};
// ----------------*****************----------------******************------------
export const ThumbNavSlider = {
  slidesToShow: 3,
  slidesToScroll: 1,
  dots: false,
  centerMode: true,
  focusOnSelect: true,
  vertical: true,
  centerPadding: 0,
  arrows: false,
  infinite: true,
  responsive: [
    {
      breakpoint: 991,
      settings: {
        vertical: false,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ThumbPosterSlider = {
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
};
// ----------------*****************----------------******************------------
export const RelativeProductSlider = {
  dots: true,
  infinite: true,
  speed: 500,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 420,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};
// ----------------*****************----------------******************------------
export const ProductPosterModalSlider = {
  dots: false,
  infinite: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
};
// ----------------*****************----------------******************------------
export const ProductNavModalSlider = {
  slidesToScroll: 1,
  vertical: true,
  arrows: false,
  dots: false,
  focusOnSelect: true,
};
// ----------------*****************----------------******************------------
export const FlowerMainHeaderSlider = {
  arrows: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  nextArrow: <FlowerCustomeArrowNext />,
  prevArrow: <FlowerCustomeArrowPrev />,
};
// ----------------*****************----------------******************------------
// ----------------*****************----------------******************------------
// ----------------*****************----------------******************------------
