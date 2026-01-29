import ServiceBase from "./service.base";

class RGI extends ServiceBase {
  constructor() {
    super("user");
  }

  create(data) {
    return this.post("/rgi", data);
  }

  getData() {
    return this.get("/rgi");
  }

  getTrash() {
    return this.get("/rgi/trash");
  }

  getByPresenter(presenter) {
    return this.get(`/rgi/presenter/${presenter}`);
  }

  getByPrenotation(prenotation) {
    return this.get(`/rgi/${prenotation}`);
  }

  putByPrenotation(prenotation, data) {
    return this.put(`/rgi/${prenotation}`, data);
  }

  deleteByPrenotation(prenotation) {
    return this.delete(`/rgi/${prenotation}`);
  }

  createType(data) {
    return this.post("/rgi/type", data);
  }

  getType() {
    return this.get("/rgi/type/all");
  }

  deleteType(typeID) {
    return this.delete(`/rgi/type/${typeID}`);
  }
}

export default RGI;
