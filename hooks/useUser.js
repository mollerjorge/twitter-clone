import React from 'react';

import { Account } from 'appwrite';
import appwriteClient from '@/libs/appwrite';
import { useRouter } from 'next/router';
import { FETCH_STATUS } from '@/utils/constants';

export default function useUser() {
  const account = new Account(appwriteClient);
  const [currentAccount, setCurrentAccount] = React.useState();
  const [accountStatus, setAccountStatus] = React.useState(
    FETCH_STATUS.LOADING
  );
  const router = useRouter();

  const getSession = async () => {
    setAccountStatus(FETCH_STATUS.LOADING);

    const promise = account.get();
    let currentAccount = null;

    try {
      currentAccount = await promise;
      setAccountStatus(FETCH_STATUS.SUCCESS);
    } catch (error) {
      console.log(error);
      setAccountStatus(FETCH_STATUS.FAIL);
    } finally {
      setCurrentAccount(currentAccount);
    }
  };

  const logout = async () => {
    const promise = await account.deleteSession('current');
    setCurrentAccount(null)
    router.push('/auth/signin')
  };

  React.useEffect(() => {
    getSession();
  }, []);

  return {
    currentAccount,
    isLoadingAccount: accountStatus === FETCH_STATUS.LOADING,
    logout,
  };
}
