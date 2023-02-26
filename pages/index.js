import React from 'react';

import { Databases } from 'appwrite';
import appwriteClient from '@/libs/appwrite';

import Feed from '@/components/Feed';
import MainLayout from '@/components/Layouts/MainLayout';

export default function Home({ tweets }) {
  return (
    <MainLayout>
      <Feed tweets={tweets.documents} />
    </MainLayout>
  );
}

export async function getServerSideProps() {
  const databases = new Databases(appwriteClient);

  const tweets = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE,
    process.env.NEXT_PUBLIC_TWEETS_COLLECTION
  );
  return {
    props: { tweets }, // will be passed to the page component as props
  };
}
