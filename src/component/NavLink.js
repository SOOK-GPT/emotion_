import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";

const NavLink = ({ children, to }) => {
    const location = useLocation();
    const pathname = location.pathname;
    return (
        <Link className="NavLink" style={{ color: pathname !== to ? '#303031' : '#71a894' }} to={to}>
        {children}
        </Link>
    );
}

export default NavLink;