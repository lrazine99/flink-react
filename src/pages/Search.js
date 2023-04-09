import { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";
import SideNav from "../components/SideNav";
import ProductRenderCard from "../components/ProductRenderCard";
import axios from "axios";
import { errorToast } from "../components/Utils";

const Search = ({ setCounter, counters, hub, setHub }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const product = useRef([]);
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get("q");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { message },
        } = await axios.get(
          `${process.env.REACT_APP_BACK_ENDPOINT}/categories`
        );

        setCategories(message.sort((a, b) => a.rank - b.rank));

        const { data } = await axios.get(
          `${process.env.REACT_APP_BACK_ENDPOINT}/products/search?q=${search}`
        );

        product.current = data.message;

        setIsLoading(false);
      } catch (error) {
        errorToast();
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  return isLoading ? (
    <Loader></Loader>
  ) : (
    <main className="">
      <div className="d-flex">
        <SideNav
          categories={categories}
          hub={hub}
          setHub={setHub}
          pageSearch={true}
        ></SideNav>
        <div className="d-flex flex-column w-75">
          <h3> il y a {product.current.count} produits</h3>
          <div className="d-flex flex-wrap">
            {product.current.results.map((product) => {
              return (
                <div style={{ width: "200px" }} key={product._id}>
                  <ProductRenderCard
                    setHub={setHub}
                    setCounter={setCounter}
                    counters={counters}
                    product={product}
                  ></ProductRenderCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Search;
