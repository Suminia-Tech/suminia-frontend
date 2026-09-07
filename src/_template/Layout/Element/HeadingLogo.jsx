import Image from "next/image";
import Link from "next/link";

/* El logo de la cabecera.

   Se pinta al tamaño real del archivo y no mas grande. logo.png mide 87x18 y
   antes se estiraba a 210 de ancho: dos veces y media, que es exactamente lo
   que se veia borroso. Un mapa de bits no gana detalle al ampliarlo.

   `unoptimized` porque Next reencodea a calidad 75 y en una imagen de 900
   bytes con texto fino eso se nota: emborrona los bordes de las letras justo
   donde importa.

   Para enseñarlo mas grande hace falta otro archivo —el mismo logo a 2x o 3x,
   o vectorial—; con este no hay forma. */
const HeadingLogo = () => {
  return (
    <div className="brand-logo">
      <Link href={"/"} className="d-inline-flex align-items-center gap-2">
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
          width={87}
          height={18}
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
