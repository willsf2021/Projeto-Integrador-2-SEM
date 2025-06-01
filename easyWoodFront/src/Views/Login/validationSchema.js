import * as Yup from "yup";

export const schema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Campo obrigatório"),
  password: Yup.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .required("Campo obrigatório"),
});
