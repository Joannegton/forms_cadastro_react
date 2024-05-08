import React from 'react';
import { useLocation } from 'react-router-dom';

const UserInfo = () => {
    const location = useLocation();
    const user = location.state.user;

    const userimage = "../img/perfilPadrao"; 



    return (
        <section className="user-info p-4 mb-4 rounded shadow-sm">
            <button id="editButton" className="btn btn-primary mr-2 ">Editar Perfil</button>
            <div className="row align-items-center justify-content-between mb-3">
                <div className="col-lg-5 col-sm-12  text-center my-3 my-md-0">
                    <img src={user.profileImage || userimage} alt="Perfil do Usuário" className="rounded-circle" style={{ width: '150px', height: '150px' }}/>
                </div>
                <div className="col-lg-7 col-sm-12  text-lg-left text-center">
                    <h1 id="userName">{user.name}</h1>
                    <p id="userAge">{user.age} anos</p>
                </div>
            </div>

            <div className="row justify-content-around align-items-start">
                <div className="col-lg-7 col-sm-12 card mb-3 mb-md-0 pb-2">
                    <h5 className="card-title mt-3">Sobre mim</h5>
                    <p className="card-text text-justify" id="userBio">{user.bio}</p>  
                </div>
                <div className="col-lg-4 col-sm-12 card pb-2">
                    <h5 className="card-title mt-3">Endereço</h5>
                    <p className="card-text text-justify" id="userAddress">{user.address}</p>
                    <p className="card-text text-justify" id="userDistrict">{user.district}</p>
                    <p className="card-text text-justify" id="userCity">{user.city}</p>
                    <p className="card-text text-justify" id="userUf">{user.uf}</p>
                </div>
            </div>               
        </section>
    );
}

export default UserInfo;
