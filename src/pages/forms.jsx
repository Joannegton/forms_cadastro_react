import React, { useReducer, useEffect, useRef} from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom';
import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";

// Estado inicial do Reducer
const initialState = {
    ufs: [],
    cities: [],
    formData: {},
    image: null,
    croppedImage: null
};

// Reducer para tratamento de alterações de estado
function reducer(state, action) {
    switch (action.type) {
        case 'SET_UFS':
            return { ...state, ufs: action.payload };
        case 'SET_CITIES':
            return { ...state, cities: action.payload };
        case 'SET_FORM_DATA':
            return { ...state, formData: action.payload };
        case 'SET_IMAGE':
            return { ...state, image: action.payload };
        case 'SET_CROPPED_IMAGE':
            return { ...state, croppedImage: action.payload };
        default:
            throw new Error();
    }
}

const UserForm = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const cropperRef = useRef(null);
    const { register, handleSubmit, setValue } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData;

    useEffect(() => {
        fetchUfs();
        if (userData) {
            dispatch({ type: 'SET_FORM_DATA', payload: userData });
            for (const field in userData) {
                setValue(field, userData[field]);
            }
        }
    }, [userData, setValue]);


    useEffect(() => {
        if (state.formData.uf) {
            fetchCities(state.formData.uf);
        }
    }, [state.formData.uf]);

    // Pega as UFs
    const fetchUfs = async () => {
        try {
            const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
            const data = await response.json();
            dispatch({ type: 'SET_UFS', payload: data });
        } catch (error) {
            console.error("Erro ao carregar os estados:", error);
        }
    };

    // Pega as cidades de acordo com a UF
    const fetchCities = async (uf) => {
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
            const data = await response.json();
            dispatch({ type: 'SET_CITIES', payload: data });
        } catch (error) {
            console.error("Erro ao carregar as cidades:", error);
        }
    };

    // Trata as alterações de UF
    const handleUfChange = (event) => {
        const uf = event.target.value;
        dispatch({ type: 'SET_FORM_DATA', payload: { ...state.formData, uf } });
        dispatch({ type: 'SET_CITIES', payload: [] });
        fetchCities(uf);
    };

  
    // Corta a imagem
    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (cropper) {
            const croppedImageUrl = cropper.getCroppedCanvas().toDataURL();
            dispatch({ type: 'SET_CROPPED_IMAGE', payload: croppedImageUrl });
            dispatch({ type: 'SET_IMAGE', payload: null });
        }
    };

      // Trata a alteração de imagem
      const onImageChange = (event) => {
        const files = event.target.files;
        let reader = new FileReader();
        reader.onload = () => {
            dispatch({ type: 'SET_IMAGE', payload: reader.result });
        };
        reader.readAsDataURL(files[0]);
    };

    // Envia a informações do usuario para o backend
    const onSubmit = async (data) => {
        data.profileImage = state.croppedImage;

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const dataResponse = await response.json();
            const userId = dataResponse.user._id

            navigate('/user-info', { state: { userId: userId } });

        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Atualiza as informações do usuário
    const onUpdate = async (data) => {
        if (state.croppedImage) {
            data.profileImage = state.croppedImage;
        }

        try {
            const userId = userData._id;
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            navigate('/user-info', { state: { userId: userId } });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // trata as mudanças do imput
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        dispatch({ type: 'SET_FORM_DATA', payload: { ...state.formData, [name]: value } });
    };

    return (
        <section className="container-form bg-light">
        <form id="updateForm" onSubmit={handleSubmit(userData ? onUpdate : onSubmit)}>                
                <div>
                    <h1 className="display-5 mt-1 mb-3 text-center">{userData? "Editar Úsuario" : "Cadastro de Usuário"}</h1>
                </div>  
                <div className="row">
                    <div className="col-lg-8 col-sm-12 form-group mb-3">
                        <label htmlFor="name">Nome:</label>
                        <input type="text" className="form-control" {...register("name")} value={state.formData.name || ''} onChange={handleInputChange} placeholder="Wellington Jhon Silva" required/>
                    </div>
                    <div className="col-lg-4 col-sm-12 form-group mb-3">
                        <label htmlFor="age">Idade:</label>
                        <input type="number" className="form-control" {...register("age")} value={state.formData.age || ''} onChange={handleInputChange} placeholder="21" required/>
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="bio">Biografia:</label>
                    <textarea className="form-control" {...register("bio")} value={state.formData.bio || ''} onChange={handleInputChange} placeholder="Diga-nos sobre você." required></textarea>
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="address">Endereço:</label>
                    <input type="text" className="form-control" {...register("address")} value={state.formData.address || ''} onChange={handleInputChange} placeholder="Rua dores de campos, 456" autoComplete="new-password" required/>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="district">Bairro:</label>
                    <input type="text" className="form-control" {...register("district")} value={state.formData.district || ''} onChange={handleInputChange} placeholder="Vila industrial" autoComplete="new-password" required/>
                </div>

                <div className="row">
                    <div className="col-md-6 col-12 form-group mb-sm-3">
                        <label htmlFor="uf">Estado:</label>
                        <select className="form-control" {...register("uf")} onChange={handleUfChange} value={state.formData.uf || ''} autoComplete="new-password" required>
                            {state.ufs.map(uf => <option key={uf.id} value={uf.sigla}>{uf.nome}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6 col-12 form-group mb-4">
                        <label htmlFor="city">Cidade:</label>
                        <select
                            className="form-control"
                            {...register("city")}
                            value={state.formData.city || ''}
                            onChange={handleInputChange}
                            required>
                            {state.cities.map(city => <option key={city.id} value={city.nome}>{city.nome}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="profileImage">Foto de Perfil:</label>
                    <input type="file" className="form-control-file" {...register("profileImage")} accept="image/*" onChange={onImageChange} />
                    {state.image && (
                        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h5 className="modal-title">Ajuste sua foto</h5>
                                        <button type="button" className="close" onClick={() => dispatch({ type: 'SET_IMAGE', payload: null })}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <Cropper
                                            style={{ height: '400px', width: '100%' }}
                                            aspectRatio={1}
                                            preview=".img-preview"
                                            guides={false}
                                            src={state.image}
                                            ref={cropperRef}/>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-primary" onClick={onCrop}>Cortar Imagem</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div> 
                <div className="form-group button-group text-center mt-4">
                    <button type="submit" className="btn btn-primary">
                        {userData ? 'Atualizar' : 'Cadastrar'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default UserForm;