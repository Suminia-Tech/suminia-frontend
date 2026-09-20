import Image from "next/image";
import Link from "next/link";

/* El logo de la cabecera: el simbolo y el logotipo, pegados.

   El logotipo se pinta a 105x23 y el archivo mide 87x19, de modo que se esta
   ampliando un 20%. Eso ya se nota en las letras finas. Se ve nitido en cuanto
   el archivo venga a 2x —210x46— o, mejor, vectorial; las cifras de aqui no
   cambian, solo dejan de estirar.

   `unoptimized` porque Next reencodea a calidad 75, y en una imagen de 900
   bytes con texto fino eso emborrona los bordes de las letras justo donde
   importa. No hay nada que optimizar en un archivo que pesa menos que la
   peticion. */
const HeadingLogo = () => {
  return (
    <div className="brand-logo">
      <Link href={"/"} className="d-inline-flex align-items-center brand-logo-link">
        {/* El icono si es escalable de sobra: viene a 100x102 y aqui se reduce,
            que es la direccion que no pierde nitidez. */}
        <img
          src="/assets/svg/icons.svg"
          width={34}
          height={34}
          alt=""
          className="svg-icon"
        />
        <Image
          width={105}
          height={22}
          priority
          unoptimized
          src="/assets/images/logo.png"
          alt="Suminia"
        />
      </Link>
    </div>
  );
};

export default HeadingLogo;
