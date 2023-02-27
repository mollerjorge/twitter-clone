import React from "react";

import SideNavigation from '@/components/SideNavigation';
import Spinner from "@/components/Spinner";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";

export default function MainLayout({ children }) {
  const { currentAccount, isLoadingAccount } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!currentAccount && !isLoadingAccount) {
      // If there is no account present and we finish the get account request redirect to login
      router.push('/auth/signin');
    }
  }, [currentAccount, router, isLoadingAccount]);

  if (!currentAccount) {
    // While there is no account show a spinner
    return (
      <div className="bg-black w-full min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-black">
      <div className="min-h-screen container mx-auto">
        <div className="flex justify-center">
          <SideNavigation />

          {children}

          <div className=" w-1/4 p-5">
            <div className="relative text-gray-300 pb-0 w-full">
              <button type="submit" className="absolute ml-4 mt-3 mr-4">
                <svg
                  className="h-4 w-4 fill-current"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 56.966 56.966"
                  width="512px"
                  height="512px"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
              </button>

              <input
                type="search"
                name="search"
                placeholder="Search Twitter"
                className="h-10 px-10 pr-5 rounded-full text-sm focus:outline-none bg-gray-900 shadow w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
