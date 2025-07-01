// src/Views/Register/validationSchema.js
import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Nome muito curto")
    .max(50, "Nome muito longo")
    .required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Senhas não conferem")
    .required("Confirmação de senha é obrigatória"),
  type: Yup.string()
    .oneOf(["client", "merchant"], "Tipo de conta inválido")
    .required("Tipo de conta é obrigatório"),
});
