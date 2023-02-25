import React from 'react';

import Feed from '@/components/Feed';
import MainLayout from '@/components/Layouts/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <Feed />
    </MainLayout>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
