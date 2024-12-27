import React, { useEffect } from 'react'
import LoginPage from '../components/Login/Login'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [])
  return (
    <div><LoginPage/></div>
  )
}

export default Login