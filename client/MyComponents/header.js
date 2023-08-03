import React from "react";
import './header.css'
function Header() {
    document.title = "RoadXamine-Home";
    return (
        <div>
            <div className="header">
                <div className="header-text">
                    <p>Alert today... <br /> <span>Alive tomorrow</span></p>
                    <h1>Road<span>X</span>amine</h1>
                </div>
            </div>
        </div>
    );
}
export default Header;










