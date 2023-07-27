import {React, useState} from 'react';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap';
import '../../styles/Registration.css'
import { useNavigate } from 'react-router-dom';
import Footer from '../../common/Footer';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Registration() {
   
    const[formData, setFormData] = useState({
        loginId:'',
        firstName:'',
        lastName:'',
        email:'',
        contactNumber:'',
        password:'',
        confirmPassword:''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const{name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]:value,
        }));
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        const validationErrors = {};
        if(formData.loginId.trim() === ''){
            validationErrors.loginId = "Please Enter LoginId"
        }
        if(formData.firstName.trim() === ''){
            validationErrors.firstName= "Please Enter First Name"
        }
        if(formData.lastName.trim() === ''){
            validationErrors.lastName = "Please Enter Last Name"
        }
        if(formData.email.trim() === ''){
            validationErrors.email = "Please Enter Email"
        }
        if(formData.contactNumber.trim() === ''){
            validationErrors.contactNumber = "Please Enter Your Contact Number"
        }
        if(formData.password.trim() === ''){
            validationErrors.password = "Please Enter Password"
        }
         if(formData.confirmPassword !== formData.password){
            validationErrors.password = "Password And Confirm Password Is Not Same"
        }
        if(formData.email === formData.loginId){
            validationErrors.email = 'Login ID And Email should be different'
        }
        if(Object.keys(validationErrors).length > 0){
            setErrors(validationErrors)
        }
        else{
            try{
                await axios.post("http://localhost:8081/api/v1.0/moviebooking/register", {
                    loginId: formData.loginId,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    contactNumber: formData.contactNumber,
                    password: formData.password
                });
                toast.success('User registered successfully!', {
                    position: 'top-right',
                    autoClose: 3000, // Duration for which the toast will be displayed (in milliseconds)
                  });
            }catch (err){
                toast.error('Something went wrong!', {
                    position: 'top-right',
                    autoClose: 3000, // Duration for which the toast will be displayed (in milliseconds)
                  });
            }
        }
        
    }



    return(
        <>
        <main>
            <Container>
                <div className='registration-container'>
                <Form className='registration-form'>
                <h2>Registration</h2>
                        <Form.Group  controlId='loginId' >
                            <Form.Label column> Login Id : <span style={{color:"red"}}>*</span></Form.Label>
                            <Form.Control 
                                type='text'
                                name='loginId'
                                placeholder='Enter Login ID/Username'
                                value={formData.loginId}
                                onChange={handleChange}
                            />
                            {errors.loginId && <span className='error-message'>{errors.loginId}</span>}

                        </Form.Group>
                        <Form.Group controlId='firstName' >
                            <Form.Label> First Name : <span style={{color:"red"}}>*</span></Form.Label>
                            {errors.firstName && <span className='error-message'>{errors.firstName}</span>}
                             <Form.Control 
                                type='text'
                                name='firstName'
                                placeholder='Enter First Name'
                                value={formData.firstName}
                                onChange={handleChange}
                                />
                        </Form.Group>
                        <Form.Group  controlId='lastName'>
                            <Form.Label> Last Name : <span style={{color:"red"}}>*</span> </Form.Label>
                            {errors.lastName && <span className='error-message'>{errors.lastName}</span>}

                            <Form.Control 
                                type='text'
                                name='lastName'
                                placeholder='Enter Last Name'
                                value={formData.lastName}
                                onChange={handleChange}
                                />
                        </Form.Group>
                        <Form.Group  controlId='email'>
                            <Form.Label> Email : <span style={{color:"red"}}>*</span></Form.Label>
                            {errors.email && <span className='error-message'>{errors.email}</span>}

                            <Form.Control 
                                type='email'
                                name='email'
                                placeholder='Enter Email'
                                value={formData.email}
                                onChange={handleChange}
                                />
                        </Form.Group>
                        <Form.Group  controlId='contactNumber'>
                            <Form.Label> Contact Number : <span style={{color:"red"}}>*</span> </Form.Label>
                            {errors.contactNumber && <span className='error-message'>{errors.contactNumber}</span>}

                            <Form.Control 
                                type='text'
                                name='contactNumber'
                                placeholder='Enter Contact Number'
                                value={formData.contactNumber}
                                onChange={handleChange}
                                />
                        </Form.Group>
                        <Form.Group  controlId='password'>
                            <Form.Label> Password : <span style={{color:"red"}}>*</span></Form.Label>
                            {errors.password && <span className='error-message'>{errors.password}</span>}

                            <Form.Control 
                                type='password'
                                name='password'
                                placeholder='Enter Password'
                                value={formData.password}
                                onChange={handleChange}
                                />
                        </Form.Group>
                        <Form.Group  controlId='confirmPassword'>
                            <Form.Label> Confrim Password : <span style={{color:"red"}}>*</span> </Form.Label>
                            {errors.confirmPassword && <span className='error-message'>{errors.confirmPassword}</span>}

                            <Form.Control 
                                type='password'
                                name='confirmPassword'
                                placeholder='Enter Password Again'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                />
                        </Form.Group>

                    <div className="button-groups">
                    <Button  type='submit'  onClick={handleSubmit}> Register </Button>

                    <Button  type='button'  onClick={(event) => {
                        navigate("/login")
                    }}> Move To Login Page</Button>
                    </div>

                </Form>
                </div>
            </Container>
            <Footer/>
        </main>
        </>
    )

}

export default Registration;