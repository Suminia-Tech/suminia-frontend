/* Textos de las pantallas de auth. Vienen del Constant global de la plantilla;
   viven aqui para que el feature no dependa de _template. Cuando se conecte
   i18n, este es el unico archivo que cambia. */
export const authLabels = {
  login: 'Iniciar sesión',
  loginTitle: 'Iniciar sesión',
  loggingIn: 'Ingresando...',
  forgotYourPassword: '¿Olvidaste tu contraseña?',
  notAMember: '¿No eres miembro?',
  signUpNow: 'Regístrate ahora',
  register: 'Registrarse',
  signUp: 'Registrarse',
  registering: 'Registrando empresa...',
  alreadyHaveAccount: '¿Ya tienes una cuenta?',
  forgotPassword: 'Olvidé mi contraseña',
  send: 'Enviar',
  sending: 'Enviando...',
  backToLogin: 'Volver a iniciar sesión',
} as const;
