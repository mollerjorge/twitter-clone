import React from 'react';

import { Account } from 'appwrite';
import appwriteClient from '@/libs/appwrite';

import classNames from 'classnames';

import { FETCH_STATUS } from '@/utils/constants';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ResetPassword() {
  const [form, setForm] = React.useState({
    password: '',
    error: '',
  });
  const [resetPasswordStatus, setResetPasswordStatus] = React.useState(
    FETCH_STATUS.IDLE
  );
  const router = useRouter();
  const hasErrors = !!form.error;

  const onSubmit = async (event) => {
    event.preventDefault();
    setForm((currForm) => ({ ...currForm, error: '' }));

    const { password } = form;
    const { userId, secret } = router.query;

    const account = new Account(appwriteClient);
    const promise = account.updateRecovery(userId, secret, password, password);

    try {
      const userAccount = await promise;

      setResetPasswordStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
      setForm((currForm) => ({
        ...currForm,
        error: error.message,
      }));
      setResetPasswordStatus(FETCH_STATUS.FAIL);
      return;
    }
  };

  const onChangeInput = (event) => {
    const {
      target: { name, value },
    } = event;
    setForm((currForm) => ({ ...currForm, [name]: value }));
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
            Reset your password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-900  py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
                >
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    onChange={onChangeInput}
                    value={form.password}
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-black"
                  />
                </div>
              </div>

              {hasErrors && (
                <div className="border-solid py-3 px-5 rounded-md border  border-red-500 bg-red-100 text-red-500">
                  <p>{form.error}</p>
                </div>
              )}

              {resetPasswordStatus === FETCH_STATUS.SUCCESS && (
                <div className="border-solid py-3 px-5 rounded-md border  border-green-500 bg-green-100 text-green-500">
                  <p>
                    You password has been changed successfully! try{' '}
                    <Link
                      href="/auth/signin"
                      className=" text-blue-400 underline"
                    >
                      Signing in
                    </Link>
                  </p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className={classNames(
                    'flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    {
                      'opacity-60 cursor-not-allowed':
                        resetPasswordStatus === FETCH_STATUS.LOADING,
                    }
                  )}
                >
                  {resetPasswordStatus === FETCH_STATUS.LOADING && (
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
                  {resetPasswordStatus === FETCH_STATUS.LOADING
                    ? 'Resetting...'
                    : 'Reset password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
