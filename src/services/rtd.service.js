import customAxios from "./middleware";

class RTDService {
    createRTD(accessToken, rtdData) {
        return customAxios.post("/rtd", rtdData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllRTD(accessToken) {
        return customAxios.get("/rtd", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllRTDInTrash(accessToken) {
        return customAxios.get("/rtd/trash", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    
    restoreRtdFromTrash(notation, accessToken) {
        return customAxios.post(`/rgi/restore/${notation}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }   
        });
    }

    getRTDByPresenter(accessToken, presenter) {
        return customAxios.get(`/rtd/presenter/${presenter}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getRTDByNotation(accessToken, notation) {
        return customAxios.get(`/rtd/${notation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    updateRTDByNotation(accessToken, notation, newData) {
        return customAxios.put(`/rtd/${notation}`, newData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteRTDByNotation(accessToken, notation) {
        return customAxios.delete(`/rtd/${notation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    createRTDType(accessToken, typeData) {
        return customAxios.post("/rtd/type", typeData, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllRTDTypes(accessToken) {
        return customAxios.get("/rtd/type/all", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteRTDTypeById(accessToken, typeId) {
        return customAxios.delete(`/rtd/type/${typeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
}

export default RTDService;
