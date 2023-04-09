import { Outlet } from "react-router-dom";
import Header from "./Header"; 

const Layout = ({ counters, setCounter, setHub, setLogedAdmin}) => {
  return (
    <>
      <Header counters={counters} setCounter={setCounter} setHub={setHub} setLogedAdmin={setLogedAdmin} />
      <Outlet />
    </>
  );
};

export default Layout;