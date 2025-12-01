import ServiceBase from "./service.base";

class Calling extends ServiceBase {
  constructor() {
    super("user");
  }

  createCalling(calling) {
    return this.post("/calling/", calling);
  }

  getAllCallings() {
    return this.get("/calling/");
  }

  getAllCallingsInTrash() {
    return this.get("/calling/trash/calling");
  }

  getCallingByEntity(entity) {
    return this.get(`/calling/entity/${entity}`);
  }

  getCallingByNumber(number) {
    return this.get(`/calling/${number}`);
  }

  updateCallingByNumber(number, calling) {
    return this.put(`/calling/${number}`, calling);
  }

  deleteCallingByNumber(number) {
    return this.delete(`/calling/${number}`);
  }

  createCallingType(type) {
    return this.post("/calling/type", type);
  }

  getAllCallingTypes() {
    return this.get("/calling/types/all");
  }

  deleteCallingType(typeid) {
    return this.delete(`/calling/type/${typeid}`);
  }

  createCallingEntity(entity) {
    return this.post("/calling/entity", entity);
  }

  getAllCallingEntities() {
    return this.get("/calling/entitys/all");
  }

  deleteCallingEntity(entityid) {
    return this.delete(`/calling/entity/${entityid}`);
  }
}

export default Calling;
