import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to onboarding flow
    navigate('/onboarding', { replace: true });
  }, [navigate]);
  
  return null;
}

export default RegisterPage; 
