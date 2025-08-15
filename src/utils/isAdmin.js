import { useRouter } from "next/navigation"
import { useEffect } from "react"

const withIsAdmin = (ComponentAdmin) => {
    const wrapper = (props) => {
        const router = useRouter()

        useEffect(() => {
            // const accessToken = localStorage.getItem("accessToken")
            // const refreshToken = localStorage.getItem("refreshToken")
            const isAdmin = localStorage.getItem("isAdmin")
            if (isAdmin !== "1") {
                router.push("/")
                console.log("Não é um administrador!")
                return;
            }
        }, [router])
        return <ComponentAdmin {...props} />
    }
    return wrapper
}

export default withIsAdmin
