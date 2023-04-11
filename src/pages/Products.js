import { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import ProductRenderCard from "../components/ProductRenderCard";
import SideNav from "../components/SideNav";
import { useLocation } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { errorToast } from "../components/Utils";

const Products = ({ counters, setCounter, setHub, hub }) => {
  const location = useLocation();
  const data = location.state;
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesDisplay, setCategoriesDisplay] = useState(
    data?.childrenCategories || []
  );
  const [productsDisplay, setProductsDisplay] = useState([]);
  const [categories, setCategories] = useState(data?.parentCategories || []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!categoriesDisplay.length) {
          const {
            data: { message },
          } = await axios.get(
            `${process.env.REACT_APP_BACK_ENDPOINT}/categories`
          );

          setCategories(message.sort((a, b) => a.rank - b.rank));

          const filtedredMessage = message.filter(
            (element) => element?.is_special
          );

          setCategoriesDisplay(filtedredMessage);
        }
        setIsLoading(true);

        const productSkus = categoriesDisplay.length
          ? categoriesDisplay.map((element) => element?.product_skus).flat()
          : [];

        if (
          productSkus.length &&
          productsDisplay.every((item) => !productSkus.includes(item._id))
        ) {
          const {
            data: { message: productsToFetch },
          } = await axios.post(
            `${process.env.REACT_APP_BACK_ENDPOINT}/products`,
            {
              product_skus: productSkus,
            }
          );

          setProductsDisplay(productsToFetch);
          setIsLoading(false);
        }
      } catch (error) {
        errorToast();
      }
    };

    fetchData();

  // eslint-disable-next-line
  }, [categoriesDisplay]);

  return (
    <main className="">
      <div className="d-flex">
        <SideNav
          setCategoriesDisplay={setCategoriesDisplay}
          categoriesDisplay={categoriesDisplay}
          categories={categories}
          hub={hub}
          setHub={setHub}
          defaultActivated={data?.categoryKey || null}
        ></SideNav>

        {isLoading ? (
          <Loader></Loader>
        ) : (
          <div className="d-flex flex-column w-75">
            {document.querySelector('[aria-expanded="true"]')?.textContent && (
              <Breadcrumb separator=">" className="mx-2 mt-2">
                <Breadcrumb.Item active>
                  <span
                    className="font-weight-bold text-decoration-none pointerHover text-dark"
                    onClick={() => {
                      setCategoriesDisplay([]);

                      document.querySelector('[aria-expanded="true"]').click();
                      document.querySelector(".sticky-side-nav").scrollTop = 0;
                    }}
                  >
                    Home
                  </span>
                </Breadcrumb.Item>

                <Breadcrumb.Item active>
                  <span className="font-weight-bold text-dark">
                    {
                      document.querySelector('[aria-expanded="true"]')
                        ?.textContent
                    }
                  </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            )}

            {categoriesDisplay.map((category, categoryKey) => {
              return (
                <div
                  className="m-2"
                  key={categoryKey}
                  id={categoryKey}
                  style={{ scrollMarginTop: " 72px" }}
                >
                  <h3 className="font-weight-bold">{category.name}</h3>
                  <div className=" horizontalScroll">
                    {productsDisplay
                      .filter((element) => {
                        return category?.product_skus.includes(element?.sku);
                      })
                      .map((product) => {
                        return (
                          <ProductRenderCard
                            setHub={setHub}
                            setCounter={setCounter}
                            counters={counters}
                            product={product}
                            key={product._id}
                          ></ProductRenderCard>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
