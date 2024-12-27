import React, { useEffect } from 'react'
import SignupPage from '../components/Signup/Signup'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/");
    }
  }, [])
  return (
    <div>
        <SignupPage />
    </div>
  )
}

export default Signup