import React from 'react';

import { useAppSelector } from '../redux/hooks'
import { RootState } from '../redux/store';

const Profile: React.FC = () => {
  const { currentUser } = useAppSelector((state: RootState) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser?.avatar} alt={currentUser?.username + 'photo'} className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' />
        <input type="text" id='username' placeholder='username' className='border p-3 rounded-lg' />
        <input type="email" id='email' placeholder='email' className='border p-3 rounded-lg' />
        <input type="password" id='password' placeholder='password' className='border p-3 rounded-lg' />
        <button type='submit' className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>

      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
