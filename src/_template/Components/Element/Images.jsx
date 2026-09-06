/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";

const Img = (props) => {
  const { alt } = props;
  const bgImg = useRef(null);

  useEffect(() => {
    const image = bgImg.current;
    if (image.classList.contains("bg-img")) {
      const parentElement = image.parentElement;
      const src = image.getAttribute("src");
      parentElement.classList.add("bg-size");
      image.style.display = "none";
      parentElement.setAttribute(
        "style",
        `
        background-image: url(${src});
        background-size:cover; 
        background-position: center;
        background-repeat: no-repeat;
        display: block;
        `
      );
    }
  }, []);

  return <img ref={bgImg} {...props} alt={alt} />;
};
export default Img;
