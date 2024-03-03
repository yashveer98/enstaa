
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queryAndMutation"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"
import { sidebarLinks } from "@/constants"
import { INavLink } from "@/types"

export const LeftSideBar = () => {
    const { mutate: signOut, isSuccess } = useSignOutAccount()
    const { user } = useUserContext()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    useEffect(() => {
        if (isSuccess) navigate(0)
    }, [isSuccess])
    return (
        <nav className='leftsidebar'>
            <div className='flex flex-col gap-11'>
                <Link to='/' className='flex gap-3'>
                    <img src='/assets/images/logo.svg' alt='logo' height={36} width={170}></img>
                </Link>
                <Link to={`/profile/${user.id}`} className='flex gap-3 item-center'>
                    <img src={user.imageUrl || "/assets/icons/logo-placeholder.svg"} alt='logo' className='h-10 w-10 rounded-full'></img>
                    <div className='flex flex-col'>
                        <p className='body-bold'>
                            {user.name}
                        </p>
                        <p className='small-regular text-light-3'>
                            @{user.username}
                        </p>
                    </div>
                </Link>
                <ul className='flex flex-col gap-6'>
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route
                        return (
                            <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                                <NavLink to={link.route} className="flex gap-4 item-center p-4">
                                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`}>
                                    </img>
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })}

                </ul>
            </div>
            <Button variant='ghost' className="shad-button_ghost" onClick={() => signOut()}>
                <img src="\assets\icons\logout.svg" alt="logout"></img>
                <p className="small-medium lg:base-medium">
                    Logout
                </p>
            </Button>
        </nav >
    )
}
