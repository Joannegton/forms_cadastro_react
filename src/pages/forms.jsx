import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import Cropper from 'react-cropper';
import "cropperjs/dist/cropper.css";


const UserForm = () => {
    const [ufs, setUfs] = useState([]);
    const [cities, setCities] = useState([]);

    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();


    useEffect(() => {
        fetchUfs();
    }, []);

    const fetchUfs = async () => {
        try {
            const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
            const data = await response.json();
            setUfs(data);
        } catch (error) {
            console.error("Erro ao carregar os estados:", error);
        }
    };

    const fetchCities = async (uf) => {
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error("Erro ao carregar as cidades:", error);
        }
    };

    const handleUfChange = (event) => {
        const uf = event.target.value;
        fetchCities(uf);
    };

    const onImageChange = (event) => {
        const files = event.target.files;
        let reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        if (cropper) {
            // Obtém o canvas com a imagem cortada
            const croppedImageUrl = cropper.getCroppedCanvas().toDataURL();
            // Atualiza o estado com a imagem cortada
            setCroppedImage(croppedImageUrl);
            // Fecha o modal após cortar a imagem
            setImage(null);
        }
    };

    const onSubmit = async (data) => {
        data.profileImage = croppedImage;

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
            navigate('/user-info', { state: { user: data } });

        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <section className="container-form bg-light">
            <form id="updateForm" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                    <h1 className="display-5 mt-1 mb-3 text-center">Cadastro de Usuário</h1>
                </div>  
                <div className="row mb-lg-3">
                    <div className="col-lg-8 col-sm-12 form-group mb-sm-3">
                        <label htmlFor="name">Nome:</label>
                        <input type="text" className="form-control" {...register("name")} placeholder="Wellington Jhon Silva"/>
                    </div>
                    <div className="col-lg-4 col-sm-12 form-group mb-3">
                        <label htmlFor="age">Idade:</label>
                        <input type="number" className="form-control" {...register("age")} placeholder="21"/>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="bio">Biografia:</label>
                    <textarea className="form-control" {...register("bio")} placeholder="Diga-nos sobre você."></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="address">Endereço:</label>
                    <input type="text" className="form-control" {...register("address")} placeholder="Rua dores de campos, 456"/>
                </div>
                <div className="form-group">
                    <label htmlFor="district">Bairro:</label>
                    <input type="text" className="form-control" {...register("district")} placeholder="Vila industrial"/>
                </div>

                <div className="row">
                    <div className="col-md-6 col-12 form-group">
                        <label htmlFor="uf">Estado:</label>
                        <select className="form-control" {...register("uf")} onChange={handleUfChange} required>
                            {ufs.map(uf => <option key={uf.id} value={uf.sigla}>{uf.nome}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6 col-12 form-group">
                        <label htmlFor="city">Cidade:</label>
                        <select className="form-control" {...register("city")} required>
                            {cities.map(city => <option key={city.id} value={city.nome}>{city.nome}</option>)}
                        </select>
                    </div>
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="profileImage">Foto de Perfil:</label>
                    <input type="file" className="form-control-file" {...register("profileImage")} accept="image/*" onChange={onImageChange} />
                    {image && (
                        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h5 className="modal-title">Ajuste sua foto</h5>
                                        <button type="button" className="close" onClick={() => setImage(null)}>
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <Cropper
                                            style={{ height: '400px', width: '100%' }}
                                            aspectRatio={1}
                                            preview=".img-preview"
                                            guides={false}
                                            src={image}
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
                <div className="form-group button-group text-center mt-3">
                    <button type="submit" className="btn btn-primary">Cadastrar</button>
                </div> 
            </form>
        </section>
    );
};

export default UserForm;
