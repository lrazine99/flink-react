import { Outlet } from "react-router-dom";
import Header from "./Header"; 

const Layout = ({ counters, setCounter, setHub}) => {
  return (
    <>
      <Header counters={counters} setCounter={setCounter} setHub={setHub} />
      <Outlet />
    </>
  );
};

export default Layout;