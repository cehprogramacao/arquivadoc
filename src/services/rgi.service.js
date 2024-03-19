import customAxios from "./middleware";

class RGI {
    create(data, accessToken) {
        return customAxios.post("/rgi", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getData(accessToken) {
        return customAxios.get("/rgi", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getTrash(accessToken) {
        return customAxios.get("/trash/rgi", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getByPresenter(presenter, accessToken) {
        return customAxios.get(`/rgi/presenter/${presenter}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getByPrenotation(prenotation, accessToken) {
        return customAxios.get(`/rgi/${prenotation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    putByPrenotation(prenotation, data, accessToken) {
        return customAxios.put(`/rgi/${prenotation}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteByPrenotation(prenotation, accessToken) {
        return customAxios.delete(`/rgi/${prenotation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    createType(data, accessToken) {
        return customAxios.post("/rgi/type", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getType(accessToken) {
        return customAxios.get("/rgi/type/all", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteType(typeID, accessToken) {
        return customAxios.delete(`/rgi/type/${typeID}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
}

export default RGI;
