import React from "react";
import { NavLink } from 'react-router-dom';


function Sidebar() {
    const userInfo = JSON.parse(localStorage.getItem("current_user"));
  return (
    <div className="h-full">
        { 1==1 ? (<div className="h-full flex flex-col bg-gray-800 text-white w-64 px-5">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        ESPACE ACADEMIQUE
      </div>
      <div className="flex-grow w-40">
        <ul className="flex flex-col items-left justify-center h-full">
          <li className="my-2">
            <a className="text-gray-400 hover:text-white">
              <NavLink to="/filiere" >Filières</NavLink>
            </a>
          </li>
          <li className="my-2">
            <a className="text-gray-400 hover:text-white">
              <NavLink to="/ue" >UE</NavLink>
            </a>
          </li>
          <li className="my-2">
            
            <a className="text-gray-400 hover:text-white">
              <NavLink to="/cours" >Cours</NavLink>
            </a>
          </li>
          <li className="my-2">
            <a className="text-gray-400 hover:text-white">
              <NavLink to="/utilisateur" >Utilisateurs</NavLink>
            </a>
          </li>
          {/* <li className="my-2">
            <a href="#" className="text-gray-400 hover:text-white">
              Emploi du temps
            </a>
          </li> */}
        </ul>
      </div>
    </div>)
        :(<div></div>)}
    </div>
    
  );
}

export default Sidebar;
