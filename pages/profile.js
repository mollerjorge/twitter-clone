import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { UserIcon } from '@heroicons/react/24/outline';
import { Storage } from 'appwrite';
import appwriteClient from '@/libs/appwrite';

import MainLayout from '@/components/Layouts/MainLayout';
import useUser from '@/hooks/useUser';
import { FETCH_STATUS } from '@/utils/constants';

export default function Profile() {
  const [profileStatus, setProfileStatus] = React.useState(FETCH_STATUS.IDLE);
  const { currentAccount } = useUser();
  const [userAvatar, setUserAvatar] = React.useState('');
  const [profileForm, setProfileForm] = React.useState({
    name: '',
    bio: '',
    website: '',
    error: '',
  });

  const displayUserSettings = React.useCallback(async () => {
    const storage = new Storage(appwriteClient);
    try {
      // Fetch the users avatar using the avatar's id stored in currentAccount.prefs.avatar
      const usersAvatar = await storage.getFilePreview(
        process.env.NEXT_PUBLIC_BUCKET_ID,
        currentAccount.prefs.avatar
      );
      setUserAvatar(usersAvatar?.href);
    } catch (error) {
      console.log(error);
    }
    // When we have the current account, pre fill the form with values
    setProfileForm({
      name: currentAccount?.name,
      bio: currentAccount.prefs?.bio,
      website: currentAccount.prefs?.website,
    });
  }, [currentAccount]);

  React.useEffect(() => {
    if (currentAccount) {
      displayUserSettings();
    }
  }, [currentAccount, displayUserSettings]);

  const onChangeInput = (event) => {
    const {
      target: { name, value },
    } = event;
    setProfileForm((currProfileForm) => ({
      ...currProfileForm,
      [name]: value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setProfileStatus(FETCH_STATUS.LOADING);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({
          avatar: currentAccount.prefs.avatar,
          ...profileForm,
          userId: currentAccount.$id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await response.json();

      if (response.status !== 200) {
        setProfileStatus(FETCH_STATUS.FAIL);
        return;
      }

      setProfileStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeProfileImage = async (event) => {
    const avatar = event?.target?.files[0];
    const avatarId = uuidv4();

    const storage = new Storage(appwriteClient);
    await storage.createFile(
      process.env.NEXT_PUBLIC_BUCKET_ID,
      avatarId,
      avatar
    );

    const reader = new FileReader();
    reader.onload = function (e) {
      setUserAvatar(e.target.result);
    };
    reader.readAsDataURL(avatar);

    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        userId: currentAccount.$id,
        ...currentAccount?.prefs,
        avatar: avatarId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await response.json();
  };

  return (
    <MainLayout>
      <div className="text-white px-10 py-20 w-1/2 border border-gray-600 h-auto  border-t-0">
        <h1 className="text-xl">Edit Profile</h1>

        <form className="flex flex-col mt-6 text-white" onSubmit={onSubmit}>
          <div className="flex justify-center mt-4">
            <div className="mb-3 w-full">
              <label
                htmlFor="formFile"
                className="ml-px block pl-4 text-sm font-medium cursor-pointer"
              >
                <div
                  style={{ background: `url('${userAvatar}')` }}
                  className=" !bg-cover w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center"
                >
                  {!userAvatar && (
                    <UserIcon className="text-gray-400 w-10 h-10" />
                  )}
                </div>
              </label>
              <input
                className="hidden relative m-0 w-full min-w-0 flex-auto cursor-pointer rounded-lg border border-solid border-gray-700 bg-transparent "
                type="file"
                id="formFile"
                accept=".jpeg,.jpg,.png"
                name="avatar"
                onChange={onChangeProfileImage}
              />
            </div>
          </div>
          <div className="mt-3">
            <label
              htmlFor="name"
              className="ml-px block pl-4 text-sm font-medium "
            >
              Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                required
                className="block w-full rounded-full border-gray-800 px-4 py-3 bg-gray-800 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none sm:text-sm"
                placeholder="Jane Smith"
                onChange={onChangeInput}
                value={profileForm.name}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="name"
              className="ml-px block pl-4 text-sm font-medium "
            >
              Bio
            </label>
            <div className="mt-1">
              <textarea
                rows="8"
                type="text"
                name="bio"
                id="bio"
                className="block w-full rounded-xl border-gray-800 px-4 py-3 bg-gray-800 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none sm:text-sm"
                placeholder="Tell us something about yourself!"
                onChange={onChangeInput}
                value={profileForm.bio}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="name"
              className="ml-px block pl-4 text-sm font-medium "
            >
              Website
            </label>
            <div className="mt-1">
              <input
                rows="8"
                type="text"
                name="website"
                id="website"
                className="block w-full rounded-full border-gray-800 px-4 py-3 bg-gray-800 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none sm:text-sm"
                placeholder="e.g. https://www.johndoe.dev"
                onChange={onChangeInput}
                value={profileForm.website}
              />
            </div>
          </div>

          {profileStatus === FETCH_STATUS.SUCCESS && (
            <div className="border-solid py-3 px-5 rounded-md border mt-4  border-green-500 bg-green-100 text-green-500">
              <p>Your settings have been saved successfully!</p>
            </div>
          )}

          <button className="py-2 px-4 rounded-full border-2 text-lg w-40 border-blue-400 text-blue-400 mt-10">
            Save
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
