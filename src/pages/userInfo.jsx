import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userImage from "../img/perfilPadrao.jpg";
const UserInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state?.userId;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await response.json();
                setData(userData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [userId]);

    const returnForm = () => {
        navigate('/', { state: { userData: data } });
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No user data!</p>;

    return (
        <section className="user-info p-4 mb-4 rounded shadow-sm">
            <button id="editButton" className="btn btn-primary mr-2" onClick={returnForm}>Editar Perfil</button>
            <div className="row align-items-center mb-3">
                <div className="col-lg-5 col-sm-12 d-flex justify-content-lg-end justify-content-sm-center my-3 my-md-0">
                    <img className="rounded-circle" style={{ width: '150px', height: '150px' }} src={data.profileImage === "" ? userImage : data.profileImage} alt="Perfil do Usuário" />                
                </div>
                <div className="col-lg-7 col-sm-12 text-left text-sm-center">
                    <h1 id="userName">{data.name}</h1>
                    <p id="userAge ">Idade: {data.age} anos</p>
                </div>
            </div>

            <div className="row justify-content-around align-items-start">
                <div className="col-lg-7 col-sm-12 card mb-3 mb-md-0 pb-2">
                    <h5 className="card-title mt-3">Sobre mim</h5>
                    <p className="card-text text-justify" id="userBio">{data.bio}</p>  
                </div>
                <div className="col-lg-4 col-sm-12 card pb-2">
                    <h5 className="card-title mt-3">Endereço</h5>
                    <p className="card-text text-justify" id="userAddress">{data.address}</p>
                    <p className="card-text text-justify" id="userDistrict">Bairro: {data.district}</p>
                    <p className="card-text text-justify" id="userCity">Cidade: {data.city}</p>
                    <p className="card-text text-justify" id="userUf">Estado: {data.uf}</p>
                </div>
            </div>               
        </section>
    );
}

export default UserInfo;
