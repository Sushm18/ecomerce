
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';

const SellerActivationPage = () => {

    const {activation_token}=useParams();
    const [error,setError]=useState(false);


    useEffect(()=>{
             if(activation_token){
              console.log(activation_token)
       
              const sendRequest=async()=>{
               
                
                try {
                   
                    const res=await axios.post('http://localhost:5000/api/v2/shop/activation',{
                  //  const res=axios.post(`${server}/shop/activation`,{
                    activation_token,

                   }) 
                   console.log(res.data.message);
                } catch (error) {
                    console.log(error.response.data.message)
                    setError(true);
                }
            };

            sendRequest();
        }
    },[activation_token])

 return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {error ? (
        <p>Your token is expired!</p>
      ) : (
        <p>Your account has been created suceessfully!</p>
      )}
    </div>
  );
};


export default SellerActivationPage