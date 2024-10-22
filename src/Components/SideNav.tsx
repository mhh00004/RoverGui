import './SideNav.css'
import { NavLink } from 'react-router-dom';
import SideNavData from './SideNavData'

function SideNav() {
    return (
        <div id="nav">
            <div id="logo">Placeholder</div>
            <ul>
                {SideNavData.map((page, index) => {
                    return (
                        <li className="nav-item" key={index}>
                            <NavLink to={page.path} className={({isActive}) => [isActive ? "active" : null].join(" ")}>
                                    {page.title}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default SideNav