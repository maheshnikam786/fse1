import {React, useEffect, useState} from 'react';
import axios from 'axios';
//import AdminHeader from './AdminHeader';
import '../../styles/Common.css';
import UserHeader from './UserHeader';
import {  Link } from 'react-router-dom';
import Footer from '../../common/Footer';


function UserHome(){
    const[movies, setMovies] = useState([]);
    const[searchQuery, setSearchQuery] = useState('');
    
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

    const handleSearch = async() => {
            const filteredMovie = movies.filter((movie) => 
            movie.movieName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if(searchQuery.trim() === ""){
            fetchMovies();
        }else{
            setMovies(filteredMovie)

        }
     }
    return(
        <main>
           <UserHeader/>
           <div className='search-bar'> 
            <input 
            type="text"
            placeholder='Search Movies'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ></input>
            <button onClick={handleSearch}>Search</button>
        </div>
            <h2 className='headings'>Now Showing</h2>
            <div>
            <table className='table-border'>
                <thead >
                    <tr>
                        <th>Movie Name</th>
                        <th>Theater Name</th>
                        <th>Ticket Available</th>
                        <th>Ticket Status</th>
                        <th>BOOK</th>
                    </tr>
                </thead>
                <tbody >
                {movies.map((movie) => (
                    
                    <tr key={movie.movieName}>
                        <td>{movie.movieName}</td>
                        <td>{movie.theatreName}</td>
                        <td>{movie.noOfTicketsAvailable}</td>
                        <td>{movie.ticketsStatus}</td>
                        <td><Link className='button-book'
                        to= {`/bookingPage/${movie.movieName}/${movie.theatreName}/${movie.noOfTicketsAvailable}`}>
                        BOOK NOW</Link></td>
                        </tr>
                ))}
                </tbody>
            </table>
            </div>
            <Footer/>
        </main>
    );
};

export default UserHome;