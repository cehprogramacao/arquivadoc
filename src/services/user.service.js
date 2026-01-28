import ServiceBase from "./service.base";

class User extends ServiceBase {
  constructor() {
    super("user");
  }

  getUsers() {
    return this.get("/users");
  }

  getUser() {
    return this.get("/user");
  }

  addUserByAdmin(payload) {
    return this.post("/user", payload);
  }

  updateUser(payload) {
    return this.put("/user", payload);
  }

  updateUserFoto(payload) {
    return this.post("/user/upload-foto", payload);
  }

  updateUserByAdmin(userId, payload) {
    return this.put(`/user/${userId}/update`, payload);
  }

  changeUserPassword(payload) {
    return this.put("/user/change-password", payload);
  }

  verifyCurrentPassword(payload) {
    return this.post("/user/verify-password", payload);
  }

  updateEmail(payload) {
    return this.put("/user/update-email", payload);
  }

  disableUser(userId) {
    return this.get(`/user/${userId}/disable`);
  }

  enableUser(userId) {
    return this.get(`/user/${userId}/enable`);
  }

  setAdmin(userId) {
    return this.get(`/user/${userId}/set-admin`);
  }

  unsetAdmin(userId) {
    return this.get(`/user/${userId}/unset-admin`);
  }

  getUserById(userId) {
    return this.get(`/user/${userId}`);
  }

  deleteUser(userId) {
    return this.delete(`/user/${userId}`);
  }
}

export default User;
