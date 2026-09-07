import Image from "next/image";
import Link from "next/link";

/* El logo de la cabecera.

   logo.png mide 87x18 y antes se estiraba a 210 de ancho: dos veces y media,
   que es lo que se veia borroso. Aqui va a 130, un punto y medio, que es donde
   deja de notarse el pixelado y todavia se lee con presencia en la cabecera.

   Con este archivo no se puede mas: un mapa de bits no gana detalle al
   ampliarlo. Para enseñarlo del tamaño que tenia hace falta el mismo logo a 3x
   —261x54— o vectorial; entonces solo hay que cambiar estas dos cifras.

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
          width={130}
          height={27}
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
