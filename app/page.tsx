import React from 'react';
import Category from './components/Categories';
import Products from './components/Products';
import Navbar from './components/Navbar';

const HomePage = () => {
  return (
    <main>
      <Navbar />
      <Category />
      <Products />
    </main>
  );
};

export default HomePage;