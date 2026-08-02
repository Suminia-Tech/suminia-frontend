"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Input } from "reactstrap";
import BreadCrumb from "@/Components/Element/BreadCrumb";
import PasswordToggle from "@/Components/Element/PasswordToggle";
import Layout6 from "@/Layout/Layout6";
import { OPENLOGINMODAL } from "@/ReduxToolkit/Reducers/ModalReducer";
import { useResetPasswordMutation, useValidateResetTokenMutation } from "@/services/suminiaApi";

/* Destino del enlace que envia el backend al pedir un restablecimiento:
   {FRONTEND_URL}/reset-password?token=<token>

   El token se valida al entrar para no pedir una contrasena nueva si ya caduco
   o se uso, que serian dos minutos perdidos antes de un error. */

/* Requisito de IsStrongPassword del backend con sus opciones por defecto. */
const isStrongPassword = (value) =>
  value.length >= 8 &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /[0-9]/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = searchParams.get("token");

  const [validateResetToken] = useValidateResetTokenMutation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [status, setStatus] = useState(token ? "validating" : "invalid");
  const [errorMessage, setErrorMessage] = useState(
    token ? null : "El enlace no incluye un token de restablecimiento.",
  );
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });

  useEffect(() => {
    if (!token) return;

    validateResetToken(token)
      .unwrap()
      .then(() => setStatus("ready"))
      .catch((error) => {
        setErrorMessage(error?.data?.message || "El enlace no es válido o ya caducó.");
        setStatus("invalid");
      });
  }, [token, validateResetToken]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const toggleVisible = (field) => () =>
    setVisible((current) => ({ ...current, [field]: !current[field] }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.password) nextErrors.password = "Ingresa una contraseña";
    else if (!isStrongPassword(form.password))
      nextErrors.password = "Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirma tu contraseña";
    else if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Las contraseñas no coinciden";

    if (Object.keys(nextErrors).length > 0) return setErrors(nextErrors);

    try {
      await resetPassword({ token, password: form.password }).unwrap();
      setStatus("done");
    } catch (error) {
      setErrorMessage(error?.data?.message || "No se pudo restablecer la contraseña.");
      setStatus("invalid");
    }
  };

  return (
    <Layout6 isCategories={true}>
      <BreadCrumb parent={"Restablecer contraseña"} title={"Restablecer contraseña"} />

      <div className="login-section">
        <div className="materialContainer">
          <div className="box">
            {status === "validating" && (
              <>
                <div className="login-title">
                  <h2>Comprobando el enlace</h2>
                </div>
                <p className="text-muted">Esto toma solo un momento.</p>
              </>
            )}

            {status === "ready" && (
              <>
                <div className="login-title">
                  <h2>Nueva contraseña</h2>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="input">
                    <Input
                      type={visible.password ? "text" : "password"}
                      placeholder="Nueva contraseña"
                      value={form.password}
                      onChange={handleChange("password")}
                      invalid={!!errors.password}
                    />
                    <PasswordToggle visible={visible.password} onToggle={toggleVisible("password")} />
                    <span className="spin"></span>
                    {errors.password && (
                      <small className="text-danger d-block mt-1">{errors.password}</small>
                    )}
                  </div>

                  <div className="input">
                    <Input
                      type={visible.confirmPassword ? "text" : "password"}
                      placeholder="Confirmar contraseña"
                      value={form.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      invalid={!!errors.confirmPassword}
                    />
                    <PasswordToggle
                      visible={visible.confirmPassword}
                      onToggle={toggleVisible("confirmPassword")}
                    />
                    <span className="spin"></span>
                    {errors.confirmPassword && (
                      <small className="text-danger d-block mt-1">{errors.confirmPassword}</small>
                    )}
                  </div>

                  <div className="button login button-1">
                    <button type="submit" className="btn btn-animation w-100" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Restablecer contraseña"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {status === "done" && (
              <>
                <div className="login-title">
                  <h2>Contraseña actualizada</h2>
                </div>
                <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
                <button
                  type="button"
                  className="btn btn-animation w-100 mt-3"
                  onClick={() => {
                    router.push("/");
                    dispatch(OPENLOGINMODAL());
                  }}
                >
                  Iniciar sesión
                </button>
              </>
            )}

            {status === "invalid" && (
              <>
                <div className="login-title">
                  <h2>Enlace no válido</h2>
                </div>
                <p className="text-muted">{errorMessage}</p>
                <p className="text-muted">
                  Los enlaces caducan a las 2 horas y solo se pueden usar una vez. Solicita uno nuevo.
                </p>
                <button
                  type="button"
                  className="btn btn-animation w-100 mt-3"
                  onClick={() => router.push("/page/forgot_password")}
                >
                  Solicitar otro enlace
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout6>
  );
};

export default ResetPassword;
