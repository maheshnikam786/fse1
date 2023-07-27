import {React, useState, useEffect} from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import { useParams } from 'react-router-dom';
import Footer from '../../common/Footer';

function BookedTickets(){
    const{movieName} = useParams()
    const[allTickets, setAllTickets] = useState([]);

    const fetchAllTickets = async() => {
        try{
            const response = await axios.get(`http://localhost:8081/api/v1.0/moviebooking/getallbookedtickets/${movieName}`,{
                        headers:{
                            'Content-Type': 'application/json',
                            Authorization:`Bearer ${localStorage.getItem('accessToken')}`
                           }
                    });
            const data = response.data;
            setAllTickets(data);
            console.log(data);
                     
        }catch(error){
            console.log("Error in fetching tickets",error)
        }
    }

    useEffect(() => {
        fetchAllTickets();
    }, []);

    return(
        <main>
            <AdminHeader/>
            <h3>All Booked Tickets</h3>
            <table className='table-border'>
                <thead>
                    <tr>
                        <th>UserName</th>
                        <th>Movie Name</th>
                        <th>Theatre Name</th>
                        <th>Number Of Tickets</th>
                        <th>Seat Numbers</th>
                    </tr>
                </thead>
                <tbody >
                    {allTickets.map((tickets) => (
                        <tr key={tickets.movieName}>
                            <td>{tickets.loginId}</td>
                            <td>{tickets.movieName}</td>
                            <td>{tickets.theatreName}</td>
                            <td>{tickets.noOfTickets}</td>
                            <td>{tickets.seatNumber.join(',')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Footer/>
        </main>
    )
}

export default BookedTickets;