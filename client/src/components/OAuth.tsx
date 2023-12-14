import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

import { app } from '../firebase';
import { useAppDispatch } from '../redux/hooks';
import { signInSuccess } from '../redux/user/userSlice';
// import { UserType } from '../redux/user/types';
import { authAPI } from '../api/api';

const OAuth: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await authAPI.googleAuth(idToken);
      console.log(response)

      // const response = await fetch('/api/auth/google', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     name: result.user.displayName,
      //     email: result.user.email,
      //     photo: result.user.photoURL,
      //   }),
      // });
      // const data: UserType = await response.json();
      dispatch(signInSuccess(response));
      navigate('/');
    } catch (error) {
      console.log('Could not authorize with Google', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
      Continue with Google
    </button>
  );
};

export default OAuth;
