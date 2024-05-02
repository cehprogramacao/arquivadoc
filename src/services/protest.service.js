import { default as customAxios } from "./middleware";

class ProtestService {
    createProtest(data, accessToken) {
        return customAxios.post("/protest", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getAllProtests(accessToken) {
        return customAxios.get("/protest", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getProtestByPresenter(presenter, accessToken) {
        return customAxios.get(`/protest/presenter/${presenter}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    getProtestByNotation(notation, accessToken) {
        return customAxios.get(`/protest/${notation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    deleteProtestByNotation(notation, accessToken) {
        return customAxios.delete(`/protest/${notation}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    editProtestByNotation(notation, data, accessToken) {
        return customAxios.put(`/protest/${notation}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    getProtestFromTrash(accessToken) {
        return customAxios.get("/protest/trash", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    restoreProtestFromTrash(notation, accessToken) {
        return customAxios.put(`/protest/trash/${notation}`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }

    // deleteProtestFromTrash(id, accessToken) {
    //     return customAxios.delete(`/protest/trash/${id}`, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     });
    // }
}

export default ProtestService;
