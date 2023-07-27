import {React, useEffect, useState} from 'react';
import { Container, Form } from 'react-bootstrap';
import "../../styles/Login.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ResetPassword(){
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const[confirmPassword, setConfirmPassword]=useState("");
    const[errors,setErrors]=useState({});
    const[user,setUser] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
       // fetchUser();
    }, [])

    const fetchUser = async() => {
        try{
            const response = await axios.get('http://localhost:8081/api/v1.0/moviebooking/users');
            const data = response.data;
            const user = data.flatMap((users) => users.loginId);
            setUser(user.toString())
            console.log(user.toString())
        }catch(error){
            alert(error)
    }
    }



    const PasswordReset = async(event) => {
        event.preventDefault();
        const newErrors ={};
        setLoginId(localStorage.getItem('loginId'))
        if(password === ''){
            newErrors.password = "Please Enter Password"
        }
        if((Object.keys(newErrors).length > 0)){
            setErrors(newErrors);
        }else{
        // if(user.includes(loginId)){
            if(password === confirmPassword){
                try{
                    const response = axios.put(`http://localhost:8081/api/v1.0/moviebooking/${localStorage.getItem('loginId')}/forgot`, {
                       loginId:localStorage.getItem('loginId'),
                       password:password
                   },{
                       headers:{
                           'Content-Type': 'application/json',
                           Authorization:`Bearer ${localStorage.getItem('accessToken')}`
                          }
                   });

                   toast.success('Password Changed Successfully!', {
                    position: 'top-right',
                    autoClose: 3000, // Duration for which the toast will be displayed (in milliseconds)
                  });
                   
                   console.log(response.data);
               }catch(error){
                toast.error('Error in Resetting password', {
                    position: 'top-right',
                    autoClose: 3000, // Duration for which the toast will be displayed (in milliseconds)
                  });
                
               }
            }else{
                toast.error('Password And ConfirmPassword should be same', {
                    position: 'top-right',
                    autoClose: 3000, // Duration for which the toast will be displayed (in milliseconds)
                  });
             
            }
        // }else{
            // alert("UserName Not Registered")
        // }
    }

    }





    return(
        <main>
            <Container className='login-container' >
            
            <Form className='login-form' >
            <h2> Reset Password</h2>
            <Form.Group  controlId='loginId'  >
                        <Form.Label column sm='2'> LoginID/UserName: </Form.Label>
                        {errors.loginId && <span className='error-message'>{errors.loginId}</span> }
                        <Form.Control
                        type='loginId'
                        placeholder='Enter Username'
                        value={localStorage.getItem('loginId')}
                        onChange={(event) => {
                            setLoginId(localStorage.getItem('loginId'));
                        }}
                        required
                        ></Form.Control>
                        
                    </Form.Group>
                    <Form.Group   controlId='password' >
                        <Form.Label> Password: </Form.Label>
                        {errors.password && <span className='error-message'>{errors.password}</span> }
                         <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                        required></Form.Control>
                        
                    </Form.Group>
                    <Form.Group   controlId='confirmPassword' >
                        <Form.Label> Confirm Password: </Form.Label>
                        
                        <Form.Control
                        type='password'
                        placeholder='Enter Password Again'
                        value={confirmPassword}
                        onChange={(event) => {
                            setConfirmPassword(event.target.value);
                        }}
                        required></Form.Control>
                        
                    </Form.Group>
                    <div className='button-groups'>
                        <button onClick={PasswordReset}>Reset </button>
                        <button onClick={() => {
                            navigate('/login')
                        }}> Back To Login</button>
                    </div>
            </Form>
            </Container>
        </main>
    )
}
export default ResetPassword;