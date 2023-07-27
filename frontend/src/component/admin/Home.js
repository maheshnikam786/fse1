import {React, useEffect, useState} from 'react';
import axios from 'axios';
import AdminHeader from './AdminHeader';
import '../../styles/Common.css';
import {  Link } from 'react-router-dom';
import Footer from '../../common/Footer';


function Home(){
    const[movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async() => {
        try{
            const response = await axios.get('http://localhost:8081/api/v1.0/moviebooking/all', {
                validateStatus: function (status) {
                    return status >= 200 && status < 303; // default
                  },
                  
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            });
            setMovies(response.data);
        } catch(error){
            console.error('Error fetching movies:', error);
            //console.log(localStorage.getItem('accessToken'));
        }
    } ;

    const updateTicketStatus = (movieName,noOfTicketsAvailable,ticketsStatus) => {
        if(noOfTicketsAvailable === 0 && ticketsStatus === 'SOLD OUT'){
            alert("Ticket Status already updated")
        }else{
        if(noOfTicketsAvailable === 0){
            axios.put(`http://localhost:8081/api/v1.0/moviebooking/${movieName}/update`,{},{
                headers:{
                    'Content-Type': 'application/json',
                    Authorization:`Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then(response => {
                alert("Ticket status Updated Successfully")
                console.log(response.data)
                fetchMovies();
            })
            .catch(error => {
                //console.log(movieName,noOfTicketsAvailable,ticketStatus);
                console.error('Error Updating Ticket Status : ', error);
            });
        }else{
            alert('Ticket Status Cannot be Updated Because Number Of Tickets Available is greater than 0');
            fetchMovies();
        }
    }
    }

    const deleteMovie = (movieName) => {
        
        axios.delete(`http://localhost:8081/api/v1.0/moviebooking/${movieName}/delete`,{
            headers:{
                'Content-Type': 'application/json',
                Authorization:`Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            alert("Movie Deleted Successfully")
            console.log("Movie Deleted successfully");
            fetchMovies();
        })
        .catch(error => {
            console.error('Error deleting movie : ', error);
        });
    }
  

    
    
    return(
        <main>
            <AdminHeader/>
            <h2 className='headings'>All Shows</h2>
            <div>
            <table className='table-border'>
                <thead >
                    <tr>
                        <th>Movie ID</th>
                        <th>Movie Name</th>
                        <th>Theater Name</th>
                        <th>Ticket Available</th>
                        <th>Ticket Status</th>
                        <th>Ticket Details</th>
                        <th>Update Ticket Status</th>
                        <th>Delete Movie</th>
                    </tr>
                </thead>
                <tbody >
                {movies.map((movie) => (
                    <tr key={movie.id}>
                        <td>{movie.id}</td>
                        <td>{movie.movieName}</td>
                        <td>{movie.theatreName}</td>
                        <td>{movie.noOfTicketsAvailable}</td>
                        <td>{movie.ticketsStatus}</td>
                        <td><Link className='button-book'
                        to= {`/bookedTickets/${movie.movieName}`}>
                        Details</Link></td>
                        <td><button className='button-book' onClick={() => updateTicketStatus(movie.movieName,movie.noOfTicketsAvailable,movie.ticketStatus)}>Update</button></td>
                        <td><button onClick={() => deleteMovie(movie.movieName)}
                         className='button-delete'> Delete </button></td>
                        </tr>
                ))}
                </tbody>
            </table>
            </div>
        <Footer/>
    </main>
        
    );
};

export default Home;