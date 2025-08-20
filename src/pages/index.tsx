import type { NextPage } from 'next';

const Home: NextPage & { isNextPage?: boolean } = () => {
  // Option 1: a real Next landing page
  return (
    <main className="p-6">Welcome to Logistic Intel</main>
  );
};
Home.isNextPage = true;
export default Home;