import Link from "next/link";
import { Fragment } from "react";

/* El texto del banner.

   Sin oferta ni precio tachado: no hay ninguna promocion, y un "30% OFF" con un
   precio en dolares al lado promete algo que no se cumple al entrar. Lo que
   queda es lo que si es cierto.

   El boton lleva al registro y no a la tienda porque sin cuenta aprobada no se
   ven precios: mandar a alguien al catalogo a descubrirlo por su cuenta es
   perder al que venia a comprar. El formulario ya arranca en "Comprador". */
const VegeLeftContain = ({ HomeSliderData }) => {
  return (
    <>
      {HomeSliderData.map((elem, i) => {
        return (
          <Fragment key={i}>
            <div className="left-side-contain">
              <div className="banner-left">
                <h1>
                  {elem.heading} <span>{elem.headingbottom}</span>
                </h1>
                <p>
                  {elem.bottomtitletop}{" "}
                  <span className="theme-color">{elem.bottomtitlebottom}</span>
                </p>
                <p className="poster-details">{elem.description}</p>
                <div className="banner-btn-grup">
                  <Link href="/register" className="btn btn-solid-default">
                    Regístrate Ahora
                  </Link>
                </div>
              </div>
            </div>
            <div className="right-side-contain">
              {elem?.socials?.map((item, i) => {
                return (
                  <div className="social-image" key={i}>
                    <a href={item.link} target="new">
                      <h6>{item.name}</h6>
                    </a>
                  </div>
                );
              })}
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

export default VegeLeftContain;
