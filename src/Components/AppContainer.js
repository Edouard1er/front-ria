import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Sidebar from './SideBar';
import Cours from './Cours';
import AccountMenu from './AccountMenu';
import LoginBody from './LoginBody';
import Filiere from './Filiere';
import UE from './UE';
import Utilisateur from './Utilisateur';
import NotFoundBody from './NotFoundBody';

function AppContainer() {
  return (
    <Router>
      <Helmet>
        <title>RIA</title>
      </Helmet>
      <div className="flex h-screen bg-gray-200">
        <Sidebar />
          <div className="flex-grow">
            <div class="h-20 bg-gray-400 pl-52">
                <div class="flex float-right mt-4">
                  {
                    // Affichage du nom de l'utilisateur
                  }
                  <AccountMenu></AccountMenu>
                </div>
            </div>
            <div className='px-10'>
              {
              // Mes routes
              }
              <Routes>
                <Route path='/' element={<Cours/>} />
                <Route path='/login' element={<LoginBody />} />
                <Route path='/filiere' element={<Filiere />} />
                <Route path='/ue' element={<UE />} />
                <Route path='/utilisateur' element={<Utilisateur />} />
                <Route path='/cours' element={<Cours />} />
                <Route path='*' element={<NotFoundBody />} />
              </Routes>
            </div>
        </div>
      </div>
    </Router>
  )
}

export default AppContainer