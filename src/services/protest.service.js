import ServiceBase from "./service.base";

class ProtestService extends ServiceBase {
    constructor() {
        super();
    }

    createProtest(data) {
        return this.post("/protest", data);
    }

    getAllProtests() {
        return this.get("/protest");
    }

    getProtestByPresenter(presenter) {
        return this.get(`/protest/presenter/${presenter}`);
    }

    getProtestByNotation(notation) {
        return this.get(`/protest/${notation}`);
    }

    deleteProtestByNotation(notation) {
        return this.delete(`/protest/${notation}`);
    }

    editProtestByNotation(notation, data) {
        return this.put(`/protest/${notation}`, data);
    }

    getProtestFromTrash() {
        return this.get("/protest/trash");
    }

    restoreProtestFromTrash(notation) {
        return this.put(`/protest/trash/${notation}`, {});
    }

    // deleteProtestFromTrash(id) {
    //     return this.delete(`/protest/trash/${id}`);
    // }
}

export default ProtestService;
