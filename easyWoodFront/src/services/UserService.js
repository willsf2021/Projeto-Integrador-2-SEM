import api from "./api";

class UserInfo {
  async getUser() {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      throw new Error(
        "Erro ao buscar informações do usuário: " + error.message
      );
    }
  }
}

export default UserInfo;
