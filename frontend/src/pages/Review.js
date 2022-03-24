import React, { useState } from 'react'
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';
import { Link } from "react-router-dom"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Textarea,
    Button
} from '@chakra-ui/react'
init("user_gNLrEaX8TC2lFKuWqbni7");

const Review = () => {

    const [name , setName] = useState();
    const [msg , setMsg] = useState();

    const templateParams = {
        name: name,
        message : msg
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if(!name || !msg){
            alert("Please fill fields provided!")
        }else{
            emailjs.send('service_ntl00xp','template_8njo9ej', templateParams)
            .then(function(response) {
               alert('MESSAGE SEND!');
            }, function(err) {
               alert('FAILED...');
            });
            setName("")
            setMsg("");
        }
    }

    return (
        <>
            <div className="container m-5 reviewsTab">
                <img className='m-2 ms-3 image-logo3' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
                <FormControl isRequired>
                <h1 className="display-6">Say Something</h1>
                    <FormLabel className='mt-3' htmlFor='first-name' >First name</FormLabel>
                    <Input id='first-name' placeholder='First name' value={name} onChange={(e) => setName(e.target.value)} />
                    <FormLabel className='mt-3' htmlFor='first-name'>Message</FormLabel>
                    <Textarea placeholder='Enter your reviews...' value={msg} onChange={(e) => setMsg(e.target.value)} />
                    <Button className='mt-4' colorScheme='blue' onClick={sendMessage} >Button</Button>
                    <Link to="/login"><Button className='mt-4 ms-3' colorScheme='red' >Go To HomePage</Button></Link>
                </FormControl>
            </div>
        </>
    )
}

export default Review