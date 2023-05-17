import React, { useEffect, useState } from 'react'
import { ApiService } from '../Services/ApiService';
import  loadingImg from '../assets/loading.gif';

function Utilisateur() {

    // Pour les trois tabs
    const [tabs, setTabs] = useState('autre');
    const changeTab = (tab) => {
        setTabs(tab);
    }

    // Les niveaux de formation
    const listNiveau = [
        {
          "code": "L",
          "libelle": "Licence"
        },
        {
          "code": "M",
          "libelle": "Master"
        },
        {
          "code": "D",
          "libelle": "Doctorat"
        }
      ];
      // Les niveaux de formation
     const  telObjet  = {
        "L": "Licence",
        "M": "Master",
        "D": "Doctorat"
      }

      const [listRoles,  setListRoles] = useState([
        {
        "code": "ROLE_ADMIN",
        "libelle": "Administrateur"
        },
        {
        "code": "ROLE_USER",
        "libelle": "Utilisateur"
        },
        {
        "code": "ROLE_GUEST",
        "libelle": "Invité"
        }
      ]);
    
     const rolesObjet  = {
        "ROLE_ADMIN": "Administrateur",
        "ROLE_USER": "Utilisateur",
        "ROLE_PROF": "Enseignant",
        "ROLE_ETUDIANT": "Étudiant",
        "ROLE_GUEST": "Invité"
      }

    // variables utilisateurs
    const [allUtilisateur, setAllUtilisateur] = useState([]);

    const [isEdit, setEdit] = useState(false);
    const [editUserId, setEditUserId] = useState(null); // ID de l'utilisateur en cours de modification
    const [modalTitle, setModalTitle] = useState("Ajouter un nouvel utilisateur"); // Titre du modal
    const [nom, setNom] = useState(''); // nom de l'utilisateur
    const [prenom, setPrenom] = useState(''); // prenom de l'utilisateur
    const [filiere, setFiliere] = useState(''); // filiere de l'utilisateur
    const [utilisateurs, SetUser] = useState([]); // Utilisateur de l'utilisateur
    const [filiereList, setFiliereList] = useState([]); // liste des filieres
    const [isLoading, setLoading] = useState(false); // est-ce que l'on est en cours de chargement?
    const [email, setEmail] = useState(''); // email de l'utilisateur
    const [tel, setTel] = useState(''); // telephone de l'utilisateur
    const [role, setRole] = useState(''); // role de l'utilisateur
    const [password, setPassword] = useState(''); // password de l'utilisateur
    const [responsabilite, setResponsabilite] = useState(''); // responsabilité de l'utilisateur
    const [diplome, setDiplome] = useState(''); // diplome de l'utilisateur
    const [volumeHoraire, setVolumeHoraire] = useState(''); // volume horaire de l'utilisateur

    // Gestionnaire d'événement pour la modification du champ "Nom"
    const handleNomChange = (event) => {
        setNom(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du champ "Prenom"
    const handlePrenomChange = (event) => {
        setPrenom(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du menu déroulant "Filiere"
    const handleFiliereChange = (event) => {
        setFiliere(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du menu déroulant "Responsabilité"
    const handleResponsabiliteChange = (event) => {
        setResponsabilite(event.target.value);
    };
    
    // Gestionnaire d'événement pour la modification du menu déroulant "Dimplome"
    const handleDimplomeChange = (event) => {
        setDiplome(event.target.value);
    };
    
    // Gestionnaire d'événement pour la modification du menu déroulant "Volume horaire"
    const handleVolumeHoraireChange = (event) => {
        setVolumeHoraire(event.target.value);
    };
    
    // Gestionnaire d'événement pour la modification du menu déroulant "Role"
    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };
    
    // Gestionnaire d'événement pour la modification du champ "Email"
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    
    // Gestionnaire d'événement pour la modification du champ "Telephone"
    const handleTelChange = (event) => {
        setTel(event.target.value);
    };
    
    // Gestionnaire d'événement pour la modification du champ "Password"
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    

    const handleEdit = (item) => {
        // Ouvrir le modal pour modifier l'Utilisateur correspondant à l'ID donné

        setEditUserId(item.id);
        setModalTitle("Modifier un utilisateur");
        setNom(item.nom);
        setPrenom(item?.prenom);
        setTel(item?.tel);
        setEmail(item?.email);
        setRole(item?.roles[0]);
        setFiliere(item?.etudiant?.filiere?.id);
        setResponsabilite(item?.enseignant?.responsabilite_ens);
        setDiplome(item?.etudiant?.diplome_etudiant);
        setVolumeHoraire(item?.enseignant?.volume_horaire);
        toggleModal();
    };

    const handleInsert = () => {
        // Logique pour la insertion de l'élément
        setEditUserId(null);
        setModalTitle("Ajouter un nouvel utilisateur");
        setNom('');
        setPrenom('');
        setFiliere('');
        toggleModal();
    };

    const handleDelete = (id) => {
        // Logique pour la suppression de l'élément avec l'ID donné
        if(window.confirm("Voulez-vous vraiment supprimer cet utilisateur?")) {
            ApiService.remove(`/utilisateurs/${id}`)
            .then(response => {
                getUtilisateur();
            })
            .catch(error => {
                console.log(error);
            });
        }
    };

    const [paginationDetail, setPaginationDetail] = useState({
        offset: 5, // Valeur par défaut de l'offset
        page: 1 // Valeur par défaut de la page
    });
    const offsetOptions = [3, 5, 7]; // Options disponibles pour l'offset
    const [totalPages, setTotalPages] = useState(1); // Nombre total de pages
    
    // Fonction pour gérer le changement de la page
    const onPageChange = (pageNumber) => {
        setPaginationDetail({ ...paginationDetail, page: pageNumber });
    };
    
    // Fonction pour gérer le changement de l'offset
    const onOffsetChange = (event) => {
        const newOffset = parseInt(event.target.value);
        setPaginationDetail({ ...paginationDetail, offset: newOffset });
    };
    
    // Fonction pour gérer le clic sur le bouton Précédent
    const onPrevious = () => {
        if (paginationDetail.page > 1) {
        setPaginationDetail({ ...paginationDetail, page: paginationDetail.page - 1 });
        }
    };
    
    // Fonction pour gérer le clic sur le bouton Suivant
    const onNext = () => {
        if (paginationDetail.page < totalPages) {
        setPaginationDetail({ ...paginationDetail, page: paginationDetail.page + 1 });
        }
    };

    // fonction pour ouvrir et fermer le modal
    const toggleModal = () => {
        setEdit(!isEdit);
        if(tabs == "etudiants"){
            setListRoles( [
                {
                  "code": "ROLE_ETUDIANT",
                  "libelle": "Étudiant"
                }
              ]);
          }else if(tabs == "enseignants"){
            setListRoles([
              {
                "code": "ROLE_PROF",
                "libelle": "Enseignant"
              }
            ]);
          }else{
            setListRoles([
              {
                "code": "ROLE_ADMIN",
                "libelle": "Administrateur"
              },
              {
                "code": "ROLE_USER",
                "libelle": "Utilisateur"
              },
              {
                "code": "ROLE_GUEST",
                "libelle": "Invité"
              }
            ])
        }
    }

    const saveData = () => {
        // Logique pour sauvegarder les données du formulaire

        //data qui va etre envoye vers l'API
        if(nom && prenom){
            const data = {
                "nom" : nom,
                "prenom": prenom,
                "email" : email,
                "tel" : tel,
                "roles": [role]
            };

            if(password.length > 0){
                data.password = password;
            }
      
            if(editUserId){
                //Appel API pour update un utilisateur
                if(tabs == "etudiants"){
                    const etudiantData = {
                        "id_filiere": filiere,
                        "diplome_etudiant": diplome,
                        "id_utilisateur": editUserId
                    }
                    updateOneEtudiant(editUserId, etudiantData, data);
                }else if(tabs == "enseignants"){
                    const enseignantData = {
                        "responsabilite_ens": responsabilite,
                        "volume_horaire": volumeHoraire,
                        "id_utilisateur": editUserId
                    }
                    updateOneEnseignant(editUserId, enseignantData, data);
                }else{
                    updateOneUtilisateur(editUserId, data);
                }
                
            }else{
                // Appel API pour créer un utilisateur
                if(tabs == "etudiants"){
                    data["etudiant"] = {
                        "id_filiere": filiere,
                        "diplome_etudiant": diplome,
                    }
                }else if(tabs == "enseignants"){
                    data["enseignant"] = {
                        "responsabilite_ens": responsabilite,
                        "volume_horaire": parseInt(volumeHoraire)
                    }
                }
                createOneUtilisateur(data);
            }
        }else{
            alert("Veuillez remplir tous les champs");
        }
    };

    const createOneUtilisateur = (data = {}) => {
        ApiService.post('/utilisateurs/', data)
        .then(response => {
            reinitialiserData();
            getUtilisateur();
            alert("Utilisateur ajouté");
        })
    }

    const createOneEtudiant = (data = {}) => {
        ApiService.post('/etudiants/', data)
       .then(response => {
            reinitialiserData();
            getUtilisateur();
            alert("Étudiant ajouté");
       });
    }

    const createOneEnseignant = (data = {}) => {
        ApiService.post('/enseignants/', data)
        .then(response => {
            reinitialiserData();
            getUtilisateur();
            alert("Enseignant ajouté");
        });
    }

    const updateOneUtilisateur = (id="", data = {}) => {
        ApiService.put(`/utilisateurs/full/${id}`, data)
        .then(response => {
            reinitialiserData();
            getUtilisateur();
            alert("Utilisateur mis à jour");
        });
    }

    const updateOneEtudiant = (id="", etudiantData = {}, utilisateurData = {}) => {
        ApiService.put(`/etudiants/${id}`, etudiantData)
        .then(response => { 
            updateOneUtilisateur(id, utilisateurData);
        });
    }

    const updateOneEnseignant = (id="", enseignantData = {}, utilisateurData = {}) => {
        ApiService.put(`/enseignants/${id}`, enseignantData)
        .then(response => {
            updateOneUtilisateur(id, utilisateurData);
        });
    }



    const reinitialiserData = () => {
        setNom('');
        setFiliere('');
        setEditUserId(null);
        setPassword('');
        setDiplome('');
        setResponsabilite('');
        setPrenom('');
        setEmail('');
        setTel('');
        setRole('');
        setVolumeHoraire('');
        toggleModal();
    }

    // Utilisation du hook useEffect pour récupérer les filieres depuis l'API
    useEffect(() => {
        const getFiliere = async() => {
            try {
                const response = await ApiService.get(`/filieres/?page=1&offset=100`);
                if(response.status === 200)
                {
                    setFiliereList(response?.data?.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getFiliere()
    },[])


    // Utilisation du hook useEffect pour récupérer les données depuis l'API
    // Cette fonction doit etre utilisée pour récupérer les UEs depuis l'API 
    // avec paginationDetail dans le tableau des dépendances de useEffect, a chaque fois, paginationDetail.page et paginationDetail.offset
    // change, cela va faire appel à la fonction getUtilisateur
    const getUtilisateur = async () => {
        setLoading(true); // Affiche l'image de chargement
        try {
          const response = await ApiService.get(`/utilisateurs/?page=${paginationDetail.page}&offset=${paginationDetail.offset}&type=${tabs}`);
          if (response.status === 200) {
            SetUser(response?.data?.data);
            setLoading(false); // Cache l'image de chargement
            setTotalPages(response?.data?.total);
          }
        } catch (error) {
          console.log(error);
          setLoading(false); // Cache l'image de chargement en cas d'erreur
        }
    };
        useEffect(() => {
            getUtilisateur()
    },[paginationDetail, tabs])

    return (
        <div className='py-4'>
            <div className="w-full flex items-center justify-center mb-6 font-bold text-3xl">
                <h1>Gestion des utilisateurs</h1>
            </div>
            <div>
                <div className='flex mt-6 border-b-4 w-full border-text-color-principal'>
                    <div onClick={() => changeTab('autre')} className={`${tabs == 'autre' ? 'border-b-8 font-bold' : ''} mr-4 cursor-pointer border-color-primary-1 text-xl`}>Autres roles</div>
                    <div onClick={() => changeTab('enseignants')} className={`${tabs == 'enseignants' ? 'border-b-8 font-bold' : ''} mr-4 cursor-pointer border-color-primary-1 text-xl`}>Professeurs</div>
                    <div onClick={() => changeTab('etudiants')} className={`${tabs == 'etudiants' ? 'border-b-8 font-bold' : ''} mr-4 cursor-pointer border-color-primary-1 text-xl`}>Etudiants</div>
                </div>
            </div>
            <div>
                <div className='w-full flex items-end justify-end mb-10'>
                    <button 
                        className='text-2xl font-bold bg-blue-500 text-white px-4 py-2 rounded-lg'
                        onClick={handleInsert}// Ajout du gestionnaire d'événement onClick
                    >Ajouter un utilisateur</button>
                </div>
                {/* Ajouter un loading */}

                {isLoading && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-200 opacity-70">
                    <img src={loadingImg} alt="Loading" />
                </div>
                )}
                <table className="border-collapse border w-full">
                    <thead>
                        <tr>
                        <th className="border border-gray-400 px-4 py-2 text-left">Nom</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Prenom</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Roles</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Phone</th>
                        {tabs == "etudiants" && <th className="border border-gray-400 px-4 py-2 text-left">Diplome</th>}
                        {tabs == "etudiants" && <th className="border border-gray-400 px-4 py-2 text-left">Filiere</th>}
                        {tabs == "enseignants" && <th className="border border-gray-400 px-4 py-2 text-left">Responsabilite</th>}
                        {tabs == "enseignants" && <th className="border border-gray-400 px-4 py-2 text-left">Vol H.</th>}
                        
                        <th className="border border-gray-400 px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {utilisateurs.map((item) => (
                        <tr key={item.id}>
                            <td className="border border-gray-400 px-4 py-2 text-left">{item.nom}</td>
                            <td className="border border-gray-400 px-4 py-2 text-left">{item.prenom}</td>
                            <td className="border border-gray-400 px-4 py-2 text-left">{item.email}</td>
                            <td className="border border-gray-400 px-4 py-2 text-left">{rolesObjet[item?.roles[0]]}</td>
                            <td className="border border-gray-400 px-4 py-2 text-left">{item?.tel}</td>
                            { tabs == "etudiants" && <td className="border border-gray-400 px-4 py-2 text-left">{item?.etudiant?.diplome_etudiant}</td>}
                            { tabs == "etudiants" && <td className="border border-gray-400 px-4 py-2 text-left">{item?.etudiant?.filiere?.nom_filiere}</td>}
                            { tabs == "enseignants" && <td className="border border-gray-400 px-4 py-2 text-left">{item?.enseignant?.responsabilite_ens}</td>}
                            { tabs == "enseignants" && <td className="border border-gray-400 px-4 py-2 text-left">{item?.enseignant?.volume_horaire}</td>}
                            <td className="border border-gray-400 px-4 py-2 text-center justify-center">
                            <button
                                onClick={() => handleEdit(item)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Éditer
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Supprimer
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 text-right">
                <div className="mb-2">
                    <label htmlFor="offset">Nombre d'element par page:</label>
                    <select className="ml-4 text-center cursor-pointer" id="offset" value={paginationDetail.offset} onChange={onOffsetChange}>
                    {offsetOptions.map((offset) => (
                        <option key={offset} value={offset}>{offset}</option>
                    ))}
                    </select>
                </div>
                <div className="pagination text-white">
                    <button className={`text-white border-2 border-blue-500 bg-blue-500 blue-500   px-2 cursor-pointer rounded-md mr-2 ${paginationDetail.page <= 1 ? 'disabled' : ''}`} onClick={onPrevious}>Page précédente</button>
                    <button className={`border-2 border-blue-500 bg-blue-500 blue-500   px-2 cursor-pointer rounded-md ml-2 ${paginationDetail.page >= totalPages ? 'disabled' : ''}`} onClick={onNext}>Page suivante</button>
                </div>
            </div>
            </div>
            {/* Modal pour modifier l'Utilisateur */}
            {isEdit && (
                <>
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[800px] bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-3xl font-semibold">
                        {modalTitle}
                        </h3>
                        <button
                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => toggleModal()}
                        >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                        </span>
                        </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='nom' className='text-xl font-semibold'>Nom :</label>
                                </div>
                                <div>
                                    <input 
                                        id='nom' 
                                        name='nom' 
                                        type="text" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={nom} 
                                        onChange={handleNomChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='prenom' className='text-xl font-semibold'>Prenom :</label>
                                </div>
                                <div>
                                    <input id='prenom' 
                                        name='prenom' 
                                        type="text" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={prenom} 
                                        onChange={handlePrenomChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='prenom' className='text-xl font-semibold'>Email :</label>
                                </div>
                                <div>
                                    <input id='email' 
                                        name='email' 
                                        type="email" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={email} 
                                        onChange={handleEmailChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='password' className='text-xl font-semibold'>Mot de passe :</label>
                                </div>
                                <div>
                                    <input id='password' 
                                        name='password' 
                                        type="password" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={password} 
                                        onChange={handlePasswordChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='tel' className='text-xl font-semibold'>Tel :</label>
                                </div>
                                <div>
                                    <input id='tel' 
                                        name='tel' 
                                        type="number"
                                        min={0} 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={tel} 
                                        onChange={handleTelChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>
                            <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='role' className='text-xl font-semibold'>Role :</label>
                                </div>
                                <div>
                                <select 
                                    className="cursor-pointer w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                    value={role}
                                    onChange={handleRoleChange} // Ajout du gestionnaire d'événement onChange
                                >
                                    <option key={0} value={0}></option>
                                    {listRoles.map((item) => (
                                    <option key={item?.code} value={item?.code}>
                                        {item.libelle}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            { tabs == "etudiants" && <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='diplome' className='text-xl font-semibold'>Dimplome :</label>
                                </div>
                                <div>
                                    <input id='diplome' 
                                        name='diplome' 
                                        type="text" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={diplome} 
                                        onChange={handleDimplomeChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>}
                            { tabs == "etudiants" && <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='filiere' className='text-xl font-semibold'>Filière :</label>
                                </div>
                                <div>
                                <select 
                                    className="cursor-pointer w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                    value={filiere}
                                    onChange={handleFiliereChange} // Ajout du gestionnaire d'événement onChange
                                >
                                    <option key={0} value={0}></option>
                                    {filiereList.map((item) => (
                                    <option key={item?.id} value={item?.id}>
                                        {item.nom_filiere}
                                    </option>
                                    ))}
                                </select>
                                </div>
                            </div>}
                            { tabs == "enseignants" && <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='responsabilite' className='text-xl font-semibold'>Responsabilité :</label>
                                </div>
                                <div>
                                    <input id='responsabilite' 
                                        name='responsabilite' 
                                        type="text" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={responsabilite} 
                                        onChange={handleResponsabiliteChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>}
                            { tabs == "enseignants" && <div className='mb-6'>
                                <div className='mb-2'>
                                    <label htmlFor='volumeHoraire' className='text-xl font-semibold'>Volume horaire :</label>
                                </div>
                                <div>
                                    <input id='volumeHoraire'  
                                        name='volumeHoraire' 
                                        type="text" 
                                        className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                        value={volumeHoraire} 
                                        onChange={handleVolumeHoraireChange} // Ajout du gestionnaire d'événement onChange
                                    />
                                </div>
                            </div>}
                        </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => toggleModal()}
                        >
                        Annuler
                        </button>
                        <button
                        className="bg-blue-500 text-white active:bg-blue-500 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => saveData()}
                        >
                        Enregistrer
                        </button>
                    </div>
                    </div>
                </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
            )}
        </div>
         
    );
}

export default Utilisateur;