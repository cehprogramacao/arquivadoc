import customAxios from "./middleware";

class User {
    getUsers(accessToken) {
        return customAxios.get("/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    addUserByAdmin(data,accssToken) {
        return customAxios.post("/user", data,{
            headers: {
                Authorization: `Bearer ${accssToken}`
            }
        })
    }
}

export default User