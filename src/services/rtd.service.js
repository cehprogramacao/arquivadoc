import ServiceBase from "./service.base";

class RTDService extends ServiceBase {
    constructor() {
        super();
    }

    createRTD(rtdData) {
        return this.post("/rtd", rtdData);
    }

    getAllRTD() {
        return this.get("/rtd");
    }

    getAllRTDInTrash() {
        return this.get("/rtd/trash");
    }

    restoreRtdFromTrash(notation) {
        return this.post(`/rgi/restore/${notation}`, {});
    }

    getRTDByPresenter(presenter) {
        return this.get(`/rtd/presenter/${presenter}`);
    }

    getRTDByNotation(notation) {
        return this.get(`/rtd/${notation}`);
    }

    updateRTDByNotation(notation, newData) {
        return this.put(`/rtd/${notation}`, newData);
    }

    deleteRTDByNotation(notation) {
        return this.delete(`/rtd/${notation}`);
    }

    createRTDType(typeData) {
        return this.post("/rtd/type", typeData);
    }

    getAllRTDTypes() {
        return this.get("/rtd/type/all");
    }

    deleteRTDTypeById(typeId) {
        return this.delete(`/rtd/type/${typeId}`);
    }
}

export default RTDService;
