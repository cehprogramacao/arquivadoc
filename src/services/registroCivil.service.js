import ServiceBase from "./service.base";

class RegistroCivil extends ServiceBase {
  constructor() {
    super("user");
  }

  // Tipos CRUD
  getAllTipos() {
    return this.get("/registro-civil/tipos");
  }

  createTipo(data) {
    return this.post("/registro-civil/tipos", data);
  }

  dropTipo(id) {
    return this.delete(`/registro-civil/tipos/${id}`);
  }

  // Tipos Participacao CRUD
  getAllTiposParticipacao() {
    return this.get("/registro-civil/tipos-participacao");
  }

  createTipoParticipacao(data) {
    return this.post("/registro-civil/tipos-participacao", data);
  }

  dropTipoParticipacao(id) {
    return this.delete(`/registro-civil/tipos-participacao/${id}`);
  }

  // Registros
  create(data) {
    return this.post("/registro-civil", data);
  }

  getData() {
    return this.get("/registro-civil");
  }

  getTrash() {
    return this.get("/registro-civil/trash");
  }

  getById(id) {
    return this.get(`/registro-civil/${id}`);
  }

  getByTipo(tipo) {
    return this.get(`/registro-civil/tipo/${tipo}`);
  }

  getByNome(nome) {
    return this.get(`/registro-civil/nome/${nome}`);
  }

  search(params) {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
    return this.get(`/registro-civil/search?${new URLSearchParams(filtered)}`);
  }

  update(id, data) {
    return this.put(`/registro-civil/${id}`, data);
  }

  deleteById(id) {
    return this.delete(`/registro-civil/${id}`);
  }

  dropReal(id) {
    return this.delete(`/registro-civil/${id}/real`);
  }

  restoreById(id) {
    return this.post(`/registro-civil/restore/${id}`);
  }

  addAverbacao(id, data) {
    return this.post(`/registro-civil/${id}/averbacoes`, data);
  }

  getAverbacoes(id) {
    return this.get(`/registro-civil/${id}/averbacoes`);
  }

  addDocumento(id, data) {
    return this.post(`/registro-civil/${id}/documentos`, data);
  }

  getDocumentos(id) {
    return this.get(`/registro-civil/${id}/documentos`);
  }

  emitirCertidao(id, data) {
    return this.post(`/registro-civil/${id}/certidoes`, data);
  }

  getCertidoes(id) {
    return this.get(`/registro-civil/${id}/certidoes`);
  }
}

export default RegistroCivil;
