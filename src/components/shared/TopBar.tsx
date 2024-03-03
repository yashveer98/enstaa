import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queryAndMutation"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

export const TopBar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount()
    const { user } = useUserContext()
    const navigate = useNavigate()
    useEffect(() => {
        if (isSuccess) navigate(0)
    }, [isSuccess])
    return (
        <section className="topbar">
            <div className='flex flex-between py-4 px-5'>
                <Link to={'/'} className="flex gap-3 item-center">
                    <img src="\assets\images\logo.svg" alt="logo" height={325} width={130}></img>
                </Link>
                <div className="flex gap-4">
                    <Button variant='ghost' className="shad-button_ghost" onClick={() => signOut()}>
                        <img src="\assets\icons\logout.svg" alt="logout"></img>
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                        <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile" className="h-8 w-8 rounded-full">
                        </img>
                    </Link>
                </div>
            </div>

        </section>
    )
}
