import {React} from 'react'
import '../styles/Footer.css'
import { Container, Col, Row } from 'react-bootstrap';
function Footer(){
    return(
        <footer className='footer'>
            <div className='container'>
                <p>&copy; {new Date().getFullYear()} Movie Booking App. All rights reserved</p>
                
            </div>
        </footer>
    //     <footer>
    //     <Container>
    //         <Row>
    //             <Col className='text-center py-3'>
    //                 Copyright &copy; 2022 Wuugs. All Rights Reserved.
    //             </Col>
    //         </Row>
    //     </Container>
    // </footer>
    )
}
export default Footer;