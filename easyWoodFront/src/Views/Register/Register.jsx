// src/Views/Register/Register.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import api from "../../services/api.js";
import { registerSchema } from "./validationSchema.js";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import easyWoodLogo from "/easy-wood-system.png";

export const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await api.post("/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        type: values.type,
      });

      setStatus({ success: "Cadastro realizado com sucesso!" });

      setTimeout(() => {
        navigate("/", { state: { registrationSuccess: true } });
      }, 2000);
    } catch (err) {
      console.error(
        "Erro no registro:",
        err.response?.data?.message || err.message
      );
      setStatus({
        error: err.response?.data?.message || "Erro desconhecido no registro",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <motion.div
        className="register-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="register-header">
          <img
            src={easyWoodLogo}
            alt="Easy Wood System"
            className="register-logo"
          />
          <h2>Criar nova conta</h2>
          <p>Preencha os campos abaixo para se registrar</p>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            type: "client",
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, status, values }) => (
            <Form className="register-form">
              {status?.success && (
                <motion.div
                  className="register-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {status.success}
                </motion.div>
              )}

              {status?.error && (
                <motion.div
                  className="register-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {status.error}
                </motion.div>
              )}

              <div className="form-group">
                <label htmlFor="name">Nome completo</label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Seu nome completo"
                  className="form-input register"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="seu.email@exemplo.com"
                  className="form-input register"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Crie uma senha segura"
                  className="form-input register"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password_confirmation">Confirme a senha</label>
                <Field
                  type="password"
                  name="password_confirmation"
                  placeholder="Repita a senha"
                  className="form-input register"
                />
                <ErrorMessage
                  name="password_confirmation"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label className="account-type-label">Tipo de conta</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <Field
                      type="radio"
                      name="type"
                      value="client"
                      className="radio-input"
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Cliente</span>
                  </label>

                  <label className="radio-option">
                    <Field
                      type="radio"
                      name="type"
                      value="merchant"
                      className="radio-input"
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Prestador de Serviço</span>
                  </label>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  type="submit"
                  className="register-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Criar conta"
                  )}
                </button>
              </motion.div>

              <div className="login-redirect">
                Já tem uma conta?{" "}
                <Link to="/" className="login-link">
                  Faça login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};
