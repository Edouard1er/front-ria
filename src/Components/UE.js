import React, { useEffect, useState } from 'react'
import { ApiService } from '../Services/ApiService';
import  loadingImg from '../assets/loading.gif';

function UE() {

    const [isEdit, setEdit] = useState(false);
    const [editCoursId, setEditCoursId] = useState(null); // ID de l'ue en cours de modification
    const [modalTitle, setModalTitle] = useState("Ajouter une nouvelle UE"); // Titre du modal
    const [libelleUe, setLibelleUe] = useState(''); // libelle_ue de l'ue
    const [description, setDescription] = useState(''); // description de l'ue
    const [filiere, setFiliere] = useState(''); // filiere de l'ue
    const [ue, setUE] = useState([]); // UE de l'ue
    const [filiereList, setFiliereList] = useState([]); // liste des filieres
    const [ueList, setUEList] = useState([]); // liste des UEs
    const [isLoading, setLoading] = useState(false); // est-ce que l'on est en cours de chargement?

    // Gestionnaire d'événement pour la modification du champ "Nom"
    const handleNomChange = (event) => {
        setLibelleUe(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du champ "Description"
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    // Gestionnaire d'événement pour la modification du menu déroulant "Filiere"
    const handleFiliereChange = (event) => {
        setFiliere(event.target.value);
    };


    const handleEdit = (item) => {
        // Ouvrir le modal pour modifier l'UE correspondant à l'ID donné
        setEditCoursId(item.id);
        setModalTitle("Modifier une UE");
        setLibelleUe(item.libelle_ue);
        setDescription(item?.description);
        setFiliere(item?.filiere?.id);
        toggleModal();
    };

    const handleInsert = () => {
        // Logique pour la insertion de l'élément
        setEditCoursId(null);
        setModalTitle("Ajouter une nouvelle UE");
        setLibelleUe('');
        setDescription('');
        setFiliere('');
        toggleModal();
    };

    const handleDelete = (id) => {
        // Logique pour la suppression de l'élément avec l'ID donné
        if(window.confirm("Voulez-vous vraiment supprimer cette UE?")) {
            ApiService.remove(`/ues/${id}`)
            .then(response => {
                getUE();
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
    }

    const saveData = () => {
        // Logique pour sauvegarder les données du formulaire

        //data qui va etre envoye vers l'API
        if(libelleUe && description && filiere && ue){
            const data = {
                "libelle_ue" : libelleUe,
                  "description": description,
                  "id_filiere": filiere,
              };
      
              if(editCoursId){
                  //Appel API pour update une UE
                  ApiService.put(`/ues/${editCoursId}`, data)
                  .then(response => {
                      setEditCoursId(null);
                      setLibelleUe('');
                      setDescription('');
                      setFiliere('');
                      toggleModal();
                      getUE();
                      alert("UE mise à jour");
                  })
              }else{
                  // Appel API pour créer une UE
                  ApiService.post('/ues/', data)
                  .then(response => {
                      setEditCoursId(null);
                      setLibelleUe('');
                      setDescription('');
                      setFiliere('');
                      toggleModal();
                      getUE();
                      alert("UE ajoutée");
                  })
            }
        }else{
            alert("Veuillez remplir tous les champs");
        }
    };

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
    // change, cela va faire appel à la fonction getUE
    const getUE = async () => {
        setLoading(true); // Affiche l'image de chargement
        try {
          const response = await ApiService.get(`/ues/?page=${paginationDetail.page}&offset=${paginationDetail.offset}`);
          if (response.status === 200) {
            setUE(response?.data?.data);
            setLoading(false); // Cache l'image de chargement
          }
        } catch (error) {
          console.log(error);
          setLoading(false); // Cache l'image de chargement en cas d'erreur
        }
    };
        useEffect(() => {
            getUE()
    },[paginationDetail])

  return (
    <div className="py-10">
        <div>
            <div className="w-full flex items-center justify-center mb-6 font-bold text-3xl">
                <h1>Gestion des UEs</h1>
            </div>
            <div className='w-full flex items-end justify-end mb-10'>
                <button 
                    className='text-2xl font-bold bg-blue-500 text-white px-4 py-2 rounded-lg'
                    onClick={handleInsert}// Ajout du gestionnaire d'événement onClick
                >Ajouter une UE</button>
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
                    <th className="border border-gray-400 px-4 py-2">Nom</th>
                    <th className="border border-gray-400 px-4 py-2">Description</th>
                    <th className="border border-gray-400 px-4 py-2">Filière</th>
                    <th className="border border-gray-400 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {ue.map((item) => (
                    <tr key={item.id}>
                        <td className="border border-gray-400 px-4 py-2">{item.libelle_ue}</td>
                        <td className="border border-gray-400 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-400 px-4 py-2">{item?.filiere?.nom_filiere}</td>
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
        {/* Modal pour modifier l'UE */}
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
                            <label htmlFor='libelle_ue' className='text-xl font-semibold'>Nom :</label>
                        </div>
                        <div>
                            <input 
                                id='libelle_ue' 
                                name='libelle_ue' 
                                type="text" 
                                className="w-full border-2 border-gray-400 border-solid rounded-xl px-3 py-3" 
                                value={libelleUe} 
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
                                value={description} 
                                onChange={handleDescriptionChange} // Ajout du gestionnaire d'événement onChange
                             />
                        </div>
                    </div>
                    <div className='mb-6'>
                        <div className='mb-2'>
                            <label htmlFor='filiere' className='text-xl font-semibold'>Filiere :</label>
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

export default UE;