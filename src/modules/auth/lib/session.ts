/* Lo que dura la señal de entrar y de salir, en milisegundos.

   Es el mismo segundo que el tema deja su animacion al abrir la tienda, de modo
   que entrar y salir se reconocen como la misma espera y no como un parpadeo.

   Existe porque ninguna de las dos cosas tarda: entrar responde en milisegundos
   y salir es borrar localStorage. Sin este minimo, la pantalla cambia de golpe
   y queda la duda de si pasó algo. */
export const SESSION_FEEDBACK_MS = 1000;
