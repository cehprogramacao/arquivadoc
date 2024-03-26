const { default: customAxios } = require("./middleware");


class Customer {
    createCustomer(data, accessToken) {
        return customAxios.post("/customer", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    customers(accessToken) {
        return customAxios.get("/customers", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    getCustomerByCPFCNPJ(cpfcnpj, accessToken) {
        return customAxios.get(`/customer/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    editCustomer(cpfcnpj, data, accessToken) {
        return customAxios.put(`/customer/${cpfcnpj}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    deleteCustomer(cpfcnpj, accessToken) {
        return customAxios.delete(`/customer/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    // Termos LGPD
    createTermLGDP(data, accessToken) {
        return customAxios.post(`/customer/lgpd-term`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    getTermLGDP(cpfcnpj, accessToken) {
        return customAxios.get(`/customer/lgpd-term/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    putTermLGDP(cpfcnpj, data, accessToken) {
        return customAxios.put(`/customer/lgpd-term/${cpfcnpj}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    deleteTermLGDP(cpfcnpj, accessToken) {
        return customAxios.delete(`/customer/lgpd-term/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }

    // Cartões
    createAutographCard(data, accessToken) {
        return customAxios.post(`/customer/autograph-card`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    getAutographCard(cpfcnpj, accessToken) {
        return customAxios.get(`/customer/autograph-card/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    putAutographCard(cpfcnpj, data, accessToken) {
        return customAxios.put(`/customer/autograph-card/${cpfcnpj}`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
    deleteAutographCard(cpfcnpj, accessToken) {
        return customAxios.delete(`/customer/autograph-card/${cpfcnpj}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}

export default Customer