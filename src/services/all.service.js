import ServiceBase from "./service.base"


class All extends ServiceBase {
    constructor(){
        super("user")
    }
    getLogs() {
        return this.get("/logs")
    }
    getAllRecents() {
        return this.get("/all")
    }
}

export default All