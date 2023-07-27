import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Header.css'

function UserHeader(){
    const navigate = useNavigate();

    return(
        <main className='adminHeader'>
       
        <div className='look'>
            <button onClick={(event) => {
                navigate("/userHome")
            }}>Home</button>
            <button className='buttonlog' onClick={(event) => {
                navigate("/login")
            }}>Logout</button>
        </div>
        
    
        </main>
    );
};

export default UserHeader;