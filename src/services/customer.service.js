const { default: customAxios } = require("./middleware");


class Customer {
    async createCustomer(data, accessToken) {
        return customAxios.post("/customer", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    async customers(accessToken) {
        return customAxios.get("/customers", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    async editCustomer(cpfcnpj, data, accessToken) {
        return customAxios.put(`/customer/${cpfcnpj}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    async deleteCustomer(cpfcnpj, accessToken) {
        return customAxios.delete(`/customer/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}

export default Customer