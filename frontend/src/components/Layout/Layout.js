
// src/components/Layout.jsx
import Nav from '../Navbar/Navbar.jsx';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Nav />
      <main ></main>
      <Outlet />
    </>
  );
};

export default Layout;
