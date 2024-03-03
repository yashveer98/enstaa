import { bottombarLinks } from "@/constants"
import { Link, useLocation } from "react-router-dom"

export const BottomBar = () => {
    const { pathname } = useLocation()
    return (
        <section className="bottom-bar">
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route
                return (

                    <Link to={link.route} key={link.label}
                        className={`bottombar-link group ${isActive && 'bg-primary-500 rounded-[10px]'}  flex-center
                        gap-1 p-2 transition flex-col`}>
                        <img src={link.imgURL} alt={link.label} className={` ${isActive && 'invert-white'}`}
                            height={16}
                            width={16}>
                        </img>
                        <p className="tiny-medium text-light-2">
                            {link.label}
                        </p>
                    </Link>

                )
            })}

        </section>
    )
}
