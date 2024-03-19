import { useRouter } from "next/navigation"
import { useEffect } from "react"

const withIsAdmin = (ComponentAdmin) => {
    const wrapper = (props) => {
        const router = useRouter()

        useEffect(() => {
            // const accessToken = sessionStorage.getItem("accessToken")
            // const refreshToken = sessionStorage.getItem("refreshToken")
            const isAdmin = sessionStorage.getItem("isAdmin")
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
