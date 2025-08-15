import ServiceBase from "./service.base";

class Customer extends ServiceBase {
  constructor() {
    super("user");
  }

  createCustomer(data) {
    return this.post("/customer", data);
  }

  customers() {
    return this.get("/customers");
  }

  getCustomerByCPFCNPJ(cpfcnpj) {
    return this.get(`/customer/${cpfcnpj}`);
  }

  editCustomer(cpfcnpj, data) {
    return this.put(`/customer/${cpfcnpj}`, data);
  }

  deleteCustomer(cpfcnpj) {
    return this.delete(`/customer/${cpfcnpj}`);
  }

  // Termos LGPD
  createTermLGDP(data) {
    return this.post("/customer/lgpd-term", data);
  }

  getTermLGDP(cpfcnpj) {
    return this.get(`/customer/lgpd-term/${cpfcnpj}`);
  }

  putTermLGDP(cpfcnpj, data) {
    return this.put(`/customer/lgpd-term/${cpfcnpj}`, data);
  }

  deleteTermLGDP(cpfcnpj) {
    return this.delete(`/customer/lgpd-term/${cpfcnpj}`);
  }

  // Autograph Card
  createAutographCard(data) {
    return this.post("/customer/autograph-card", data);
  }

  getAutographCard(cpfcnpj) {
    return this.get(`/customer/autograph-card/${cpfcnpj}`);
  }

  putAutographCard(cpfcnpj, data) {
    return this.put(`/customer/autograph-card/${cpfcnpj}`, data);
  }

  deleteAutographCard(cpfcnpj) {
    return this.delete(`/customer/autograph-card/${cpfcnpj}`);
  }
}

export default Customer;
