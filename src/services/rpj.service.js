import ServiceBase from "./service.base";

class RPJService extends ServiceBase {
    constructor() {
        super();
    }

    createRPJ(rpjData) {
        return this.post("/rpj", rpjData);
    }

    getAllRPJ() {
        return this.get("/rpj");
    }
    
    getAllRPJInTrash() {
        return this.get("/rpj/trash/");
    }

    restoreRpjFromTrash(notation) {
        return this.post(`/rpj/restore/${notation}`, {});
    }

    getRPJByPresenter(presenter) {
        return this.get(`/rpj/presenter/${presenter}`);
    }

    getRPJByNotation(notation) {
        return this.get(`/rpj/${notation}`);
    }

    updateRPJByNotation(notation, newData) {
        return this.put(`/rpj/${notation}`, newData);
    }

    deleteRPJByNotation(notation) {
        return this.delete(`/rpj/${notation}`);
    }

    createRPJType(typeData) {
        return this.post("/rpj/type", typeData);
    }

    getAllRPJTypes() {
        return this.get("/rpj/type/all");
    }

    deleteRPJTypeById(typeId) {
        return this.delete(`/rpj/type/${typeId}`);
    }
}

export default RPJService;
