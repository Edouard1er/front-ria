import React, { useEffect, useState } from 'react'
import { ApiService } from '../Services/ApiService';

function Cours() {

    const [isEdit, setEdit] = useState(false);
    const [editCoursId, setEditCoursId] = useState(null); // ID du cours en cours de modification
    const [modalTitle, setModalTitle] = useState("Ajouter un nouveau cours"); // Titre du modal
    const [nomCours, setNomCours] = useState(''); // nom du cours
    const [descriptionCours, setDescriptionCours] = useState(''); // description du cours
    const [professeur, setProfesseur] = useState(''); // professeur du cours
    const [ue, setUE] = useState(''); // UE du cours
    const [professeurList, setProfesseurList] = useState([]); // liste des professeurs
    const [ueList, setUEList] = useState([]); // liste des UEs

    // Gestionnaire d'événement pour la modification du champ "Nom"
    const handleNomChange = (event) => {
        setNomCours(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du champ "Description"
    const handleDescriptionChange = (event) => {
        setDescriptionCours(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du menu déroulant "Professeur"
    const handleProfesseurChange = (event) => {
        setProfesseur(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du menu déroulant "UE"
    const handleUeChange = (event) => {
        setUE(event.target.value);
    };

    const handleEdit = (item) => {
        // Ouvrir le modal pour modifier le cours correspondant à l'ID donné
        setEditCoursId(item.id);
        setModalTitle("Modifier un cours");
        setNomCours(item.nom);
        setDescriptionCours(item?.description);
        setProfesseur(item?.enseignant?.utilisateur.id);
        setUE(item?.ue?.id);
        toggleModal();
    };

    const handleInsert = () => {
        // Logique pour la insertion de l'élément
        setEditCoursId(null);
        setModalTitle("Ajouter un nouveau cours");
        setNomCours('');
        setDescriptionCours('');
        setProfesseur('');
        setUE('');
        toggleModal();
    };

    const handleDelete = (id) => {
        // Logique pour la suppression de l'élément avec l'ID donné
        if(window.confirm("Voulez-vous vraiment supprimer ce cours?")) {
            ApiService.remove(`/cours/${id}`)
            .then(response => {
                getCours();
            })
            .catch(error => {
                console.log(error);
            });
        }
    };

    const [paginationDetail, setPaginationDetail] = useState({
        offset: 3, // Valeur par défaut de l'offset
        page: 1 // Valeur par défaut de la page
    });
    const offsetOptions = [3, 5, 7]; // Options disponibles pour l'offset
    const totalPages = 7; // Nombre total de pages
    
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
    }

    const saveData = () => {
        // Logique pour sauvegarder les données du formulaire

        //data qui va etre envoye vers l'API
        if(nomCours && descriptionCours && professeur && ue){
            const data = {
                "nom" : nomCours,
                  "description": descriptionCours,
                  "id_enseignant": professeur,
                  "id_ue": ue
              };
      
              if(editCoursId){
                  //Appel API pour update un cours
                  ApiService.put(`/cours/${editCoursId}`, data)
                  .then(response => {
                      setEditCoursId(null);
                      setNomCours('');
                      setDescriptionCours('');
                      setProfesseur('');
                      setUE('');
                      toggleModal();
                      getCours();
                      alert("Cours mis à jour");
                  })
              }else{
                  // Appel API pour créer un cours
                  ApiService.post('/cours/', data)
                  .then(response => {
                      setEditCoursId(null);
                      setNomCours('');
                      setDescriptionCours('');
                      setProfesseur('');
                      setUE('');
                      toggleModal();
                      getCours();
                      alert("Cours ajouté");
                  })
            }
        }else{
            alert("Veuillez remplir tous les champs");
        }
    };

    // Utilisation du hook useEffect pour récupérer les professeurs depuis l'API
    useEffect(() => {
        const getProfesseur = async() => {
            try {
                const response = await ApiService.get(`/enseignants/?page=1&offset=100`);
                if(response.status === 200)
                {
                    setProfesseurList(response?.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getProfesseur()
    },[])

    //Utilisation du hook useEffect pour récupérer les UEs depuis l'API
    useEffect(() => {
        const getUE = async() => {
            try {
                const response = await ApiService.get(`/ues/?page=1&offset=100`);
                if(response.status === 200)
                {
                    setUEList(response?.data?.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUE()
    },[])

    // Utilisation du hook useEffect pour récupérer les données depuis l'API
    // Cette fonction doit etre utilisée pour récupérer les cours depuis l'API 
    // avec paginationDetail dans le tableau des dépendances de useEffect, a chaque fois, paginationDetail.page et paginationDetail.offset
    // change, cela va faire appel à la fonction getCours
    const [cours, setCours] = useState([])
    const getCours = async () => {
        try {
          const response = await ApiService.get(`/cours/?page=${paginationDetail.page}&offset=${paginationDetail.offset}`);
          if (response.status === 200) {
            setCours(response?.data?.coursList);
          }
        } catch (error) {
          console.log(error);
        }
    };
        useEffect(() => {
            getCours()
    },[paginationDetail])

  return (
    <div className="py-10">
        <div>
            <div className="w-full flex items-center justify-center mb-6 font-bold text-3xl">
                <h1>Gestion des cours</h1>
            </div>
            <div className='w-full flex items-end justify-end mb-10'>
                <button 
                    className='text-2xl font-bold bg-blue-500 text-white px-4 py-2 rounded-lg'
                    onClick={handleInsert}// Ajout du gestionnaire d'événement onClick
                >Ajouter un cours</button>
            </div>
            <table className="border-collapse border w-full">
                <thead>
                    <tr>
                    <th className="border border-gray-400 px-4 py-2">Nom</th>
                    <th className="border border-gray-400 px-4 py-2">Description</th>
                    <th className="border border-gray-400 px-4 py-2">Professeur</th>
                    <th className="border border-gray-400 px-4 py-2">UE</th>
                    <th className="border border-gray-400 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cours.map((item) => (
                    <tr key={item.id}>
                        <td className="border border-gray-400 px-4 py-2">{item.nom}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-400 px-4 py-2">{item?.enseignant?.utilisateur?.nom} {item?.enseignant?.utilisateur?.prenom}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.ue?.libelle_ue}</td>
                        <td className="border border-gray-400 px-4 py-2">
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
        {/* Modal pour modifier le cours */}
        {isEdit && (
            <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[700px] bg-white outline-none focus:outline-none">
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
                                value={nomCours} 
                                onChange={handleNomChange} // Ajout du gestionnaire d'événement onChange
                            />
                        </div>
                    </div>
                    <div className='mb-6'>
                        <div className='mb-2'>
                            <label htmlFor='description' className='text-xl font-semibold'>Description :</label>
                        </div>
                        <div>
                            <input id='description' 
                                name='description' 
                                type="text" 
                                className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                value={descriptionCours} 
                                onChange={handleDescriptionChange} // Ajout du gestionnaire d'événement onChange
                             />
                        </div>
                    </div>
                    <div className='mb-6'>
                        <div className='mb-2'>
                            <label htmlFor='professeur' className='text-xl font-semibold'>Professeur :</label>
                        </div>
                        <div>
                        <select 
                            className="cursor-pointer w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                            value={professeur}
                            onChange={handleProfesseurChange} // Ajout du gestionnaire d'événement onChange
                        >
                            <option key={0} value={0}></option>
                            {professeurList.map((item) => (
                            <option key={item?.utilisateur?.id} value={item?.utilisateur?.id}>
                                {item?.utilisateur?.nom} {item.utilisateur?.prenom}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>
                    <div>
                        <div className='mb-2'>
                            <label htmlFor='ue' className='text-xl font-semibold'>UE :</label>
                        </div>
                        <div>
                        <select 
                            className="cursor-pointer w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                            value={ue}
                            onChange={handleUeChange} // Ajout du gestionnaire d'événement onChange
                        >
                            <option key={0} value={0}></option>
                            {ueList.map((item) => (
                                <option key={item?.id} value={item?.id}>
                                    {item?.libelle_ue}
                                </option>
                            ))}
                        </select>
                        </div>
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

export default Cours;
