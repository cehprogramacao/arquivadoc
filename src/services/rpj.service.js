import customAxios from "./middleware";

class RPJService {
    createRPJ(accessToken, rpjData) {
        return customAxios.post("/rpj", rpjData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllRPJ(accessToken) {
        return customAxios.get("/rpj", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllRPJInTrash(accessToken) {
        return customAxios.get("/rpj/trash/", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    restoreRpjFromTrash(notation, accessToken) {
        return customAxios.post(`/rpj/restore/${notation}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }   
        });
    }
    getRPJByPresenter(accessToken, presenter) {
        return customAxios.get(`/rpj/presenter/${presenter}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getRPJByNotation(accessToken, notation) {
        return customAxios.get(`/rpj/${notation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    updateRPJByNotation(accessToken, notation, newData) {
        return customAxios.put(`/rpj/${notation}`, newData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteRPJByNotation(accessToken, notation) {
        return customAxios.delete(`/rpj/${notation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    createRPJType(accessToken, typeData) {
        return customAxios.post("/rpj/type", typeData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllRPJTypes(accessToken) {
        return customAxios.get("/rpj/type/all", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteRPJTypeById(accessToken, typeId) {
        return customAxios.delete(`/rpj/type/${typeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
}

export default RPJService;
