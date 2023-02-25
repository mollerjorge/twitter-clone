import React from 'react';

import MainLayout from '@/components/Layouts/MainLayout';
import useUser from '@/hooks/useUser';
import { FETCH_STATUS } from '@/utils/constants';

export default function Profile() {
  const [profileStatus, setProfileStatus] = React.useState(FETCH_STATUS.IDLE);
  const { currentAccount } = useUser();
  console.log(currentAccount);
  const [profileForm, setProfileForm] = React.useState({
    name: '',
    bio: '',
    website: '',
    error: '',
  });

  React.useEffect(() => {
    if (currentAccount) {
      // When we have the current acount, pre fill the form with values
      setProfileForm({
        name: currentAccount?.name,
        bio: currentAccount.prefs?.bio,
        website: currentAccount.prefs?.website,
      });
    }
  }, [currentAccount]);

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
        body: JSON.stringify({ ...profileForm, userId: currentAccount.$id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.status !== 200) {
        setError(data.error);
        setProfileStatus(FETCH_STATUS.FAIL);
        return;
      }

      setProfileStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <MainLayout>
      <div className="text-white px-10 py-20 w-1/2 border border-gray-600 h-auto  border-t-0">
        <h1 className="text-xl">Edit Profile</h1>

        <form className="flex flex-col mt-6 text-white" onSubmit={onSubmit}>
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
