import React from "react";
import './copyright.css'
function Copyright() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {currentYear} RoadXamine. All Rights Reserved.</p>
    </footer>
  );
  
}

export default Copyright;
