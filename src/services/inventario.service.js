import ServiceBase from "./service.base";

class InventarioService extends ServiceBase {
  constructor() {
    super("user");
  }

  createItem(item) {
    return this.post("/inventario/", item);
  }

  getAllItems() {
    return this.get("/inventario/");
  }

  getItemById(id) {
    return this.get(`/inventario/${id}`);
  }

  getItemsBySetor(setor) {
    return this.get(`/inventario/setor/${setor}`);
  }

  updateItem(id, item) {
    return this.put(`/inventario/${id}`, item);
  }

  deleteItem(id) {
    return this.delete(`/inventario/${id}`);
  }

  generatePDF(setor) {
    return this.get(`/inventario/generate-pdf?setor=${setor || "todos"}`);
  }

  generateExcel(setor) {
    return this.get(`/inventario/generate-excel?setor=${setor || "todos"}`);
  }

  getSetorTypes() {
    return this.get("/inventario/setor-types");
  }

  getFiles(setor, fileType, dateFrom, dateTo) {
    const params = new URLSearchParams();
    if (setor) params.append("setor", setor);
    if (fileType) params.append("file_type", fileType);
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    const query = params.toString();
    return this.get(`/inventario/files${query ? `?${query}` : ""}`);
  }

  getFileContent(fileId) {
    return this.get(`/inventario/files/${fileId}`);
  }

  deleteFile(fileId) {
    return this.delete(`/inventario/files/${fileId}`);
  }
}

export default InventarioService;
