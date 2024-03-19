import customAxios from "./middleware"


class All {
    getLogs(accessToken) {
        return customAxios.get("/logs", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    getAllRecents(accessToken) {
        return customAxios.get("/all", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}

export default All