import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Search from "./pages/Search";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import Cookies from "js-cookie";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [counters, setCounter] = useState(
    Cookies.get("basket") ? JSON.parse(Cookies.get("basket")) : {}
  );
  const [hub, setHub] = useState(
    Cookies.get("validLocation") ? JSON.parse(Cookies.get("validLocation")) : {}
  );

  return (
    <Router>
      <Routes>
        <Route
          element={
            <Layout
              counters={counters}
              setCounter={setCounter}
              setHub={setHub}
            />
          }
        >
          <Route
            path="/products"
            element={
              <Products
                counters={counters}
                setCounter={setCounter}
                setHub={setHub}
                hub={hub}
              />
            }
          />
          <Route
            path="/search"
            element={
              <Search
                counters={counters}
                setCounter={setCounter}
                setHub={setHub}
                hub={hub}
              />
            }
          />

          <Route
            path="/product/:slugSku"
            element={
              <Product
                setHub={setHub}
                counters={counters}
                setCounter={setCounter}
              />
            }
          />

          <Route
            path="/cart"
            element={<Cart counter={counters} setCounter={setCounter} />}
          />

          <Route
            path="/checkout"
            element={<Checkout counter={counters} />}
          />
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;
