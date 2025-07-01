import { Formik, Form, Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";
import api from "../../services/api.js";
import { schema } from "./validationSchema.js";
import "./login.css";
import woodTexture from "/wood-texture.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";

const easyWoodLogo = "/easy-wood-system.png";

export const Login = () => {
  const navigate = useNavigate();
  const handleLogin = async (values, { setSubmitting, setStatus }) => {
    try {
      const response = await api.post("/login", {
        email: values.email,
        password: values.password,
      });

      const { user, access_token } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("type", user.type);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("email", user.email);

      setStatus({ success: true });

      setTimeout(() => {
        if (user.type == "client") {
          navigate("/dashboard-cliente");
        } else {
          navigate("/dashboard-prestador");
        }
      }, 1500);
    } catch (err) {
      console.error(
        "Erro no login:",
        err.response?.data?.message || err.message
      );
      setStatus({
        error: err.response?.data?.message || "Erro desconhecido no login",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content-wrapper">
        <div className="login-form-section">
          <motion.div
            className="login-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="login-header">
              <div className="logo-container">
                <img
                  src={easyWoodLogo}
                  alt="Easy Wood System"
                  className="easywood-logo"
                />
              </div>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={schema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, status }) => (
                <Form className="login-form">
                  {status?.success && (
                    <motion.div
                      className="login-success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Login realizado! Redirecionando...
                    </motion.div>
                  )}

                  {status?.error && (
                    <motion.div
                      className="login-error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {status.error}
                    </motion.div>
                  )}

                  <div className="form-group">
                    <div className="input-container">
                      <Field
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        className="form-input login"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <div className="input-container">
                      <Field
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="form-input login"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      className="login-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="spinner">
                          <div className="bounce1"></div>
                          <div className="bounce2"></div>
                          <div className="bounce3"></div>
                        </div>
                      ) : (
                        "Entrar"
                      )}
                    </button>
                  </motion.div>
                  <div className="register-link">
                    Não tem uma conta? <Link to="/register">Registre-se</Link>
                  </div>
                </Form>
              )}
            </Formik>
          </motion.div>
        </div>

        <div
          className="login-image-section"
          style={{ backgroundImage: `url(${woodTexture})` }}
        >
          <div className="login-image-overlay"></div>
          <div className="login-image-overlay"></div>
          <div className="login-image-overlay"></div>

          <motion.div
            className="image-overlay-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
};
