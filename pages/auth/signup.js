import React from 'react';

import classNames from 'classnames';
import { Client, Account, ID } from 'appwrite';

import { useRouter } from 'next/router';
import appwriteClient from '@/libs/appwrite';
import { FETCH_STATUS } from '@/utils/constants';

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    password: '',
    error: '',
  });
  const [signupStatus, setSignupStatus] = React.useState(FETCH_STATUS.IDLE);
  const hasErrors = !!form.error;

  const onChangeInput = (event) => {
    const {
      target: { name, value },
    } = event;
    setForm((currState) => ({ ...currState, [name]: value }));
  };

  // Important bit
  const onSubmit = async (event) => {
    event.preventDefault();
    setSignupStatus(FETCH_STATUS.LOADING);

    const account = new Account(appwriteClient);

    const { email, password, name } = form;
    // Bit that creates the account, we use ID.unique() to create a unique identifier for the user
    const promise = account.create(ID.unique(), email, password, name);

    try {
      const userAccount = await promise;
      // If this code is reached it means resource was successfully created, redirect the logged user to the sign in page
      setSignupStatus(FETCH_STATUS.SUCCESS);
      router.push('/auth/signin');
    } catch (error) {
      // If there is an error appwrite sends the message along with the code
      setForm((currForm) => ({
        ...currForm,
        error: error.message,
      }));
      setSignupStatus(FETCH_STATUS.FAIL);
    }
  };

  return (
    <>
      <div className="flex text-white flex-col justify-center py-12 sm:px-6 lg:px-8 bg-black min-h-screen">
        <div className="sm:mx-auto justify-center sm:w-full flex flex-col sm:max-w-md">
          <svg
            viewBox="0 0 24 24"
            className="h-16 w-16 text-blue-400 self-center"
            fill="currentColor"
          >
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </g>
          </svg>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign up a new account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-900  py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    placeholder="e.g. John Doe"
                    name="name"
                    type="name"
                    autoComplete="name"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm"
                    value={form.name}
                    onChange={onChangeInput}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    placeholder="e.g. johndoe@gmail.com"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm"
                    value={form.email}
                    onChange={onChangeInput}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength="8"
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-black sm:text-sm"
                    value={form.password}
                    onChange={onChangeInput}
                  />
                </div>
              </div>

              {hasErrors && (
                <div className="border-solid py-3 px-5 rounded-md border  border-red-500 bg-red-100 text-red-500">
                  <p>{form.error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className={classNames(
                    'flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    {
                      'opacity-60 cursor-not-allowed':
                        signupStatus === FETCH_STATUS.LOADING,
                    }
                  )}
                >
                  {signupStatus === FETCH_STATUS.LOADING && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {signupStatus === FETCH_STATUS.LOADING
                    ? 'Signing up...'
                    : 'Sign up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
