import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {
    const { setUser, unsetUser } = useContext(UserContext);

   
    unsetUser();
    setUser({ id: null, isAdmin: false });


    return <Navigate to="/login" />;
}
