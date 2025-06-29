import api from "./api";

class UserInfo {
  async getUsers() {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      throw new Error(
        "Erro ao buscar informações dos usuários: " + error.message
      );
    }
  }
}

export default UserInfo;
