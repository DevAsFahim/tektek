import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import app from '../../firebase/firebase.config';

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // login wiht google 
    const loginWithGoogle = () => {
        setLoading(false)
        return signInWithPopup(auth, googleProvider)
    }
    // create new user with email and password
    const createUser = (email, password) => {
        setLoading(false)
        return createUserWithEmailAndPassword(auth, email, password)
    }
    // add user profile picture and name
    const updateUserProfile = (profile) => {
        setLoading(false)
        return updateProfile(auth.currentUser, profile)
    }
    // load user information
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
            console.log(currentUser);
        });

        return () => {
            unsubscribe()
        }
    }, [])

    // user login
    const userLogIn = (email, password) => {
        setLoading(false)
        return signInWithEmailAndPassword(auth, email, password)
    }

    // log out user
    const logOut = () => {
        setLoading(false)
        return signOut(auth)
    }

    const authInfo = { 
        loginWithGoogle,
        createUser,
        updateUserProfile,
        user,
        loading,
        userLogIn,
        logOut
    };
    return (
        <AuthContext.Provider  value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;