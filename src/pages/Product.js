import { useState, useEffect } from "react";
import axios from "axios";
import { errorToast } from "../components/Utils";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Counter from "../components/Counter";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";

const Product = ({ counters, setCounter, setHub }) => {
  const [product, setProduct] = useState({});
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  const productSku = window.location.href
    .split("/")
    .slice(-1)
    .pop()
    .split("-")
    .slice(-1)
    .pop();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const {
          data: { message },
        } = await axios.get(`http://localhost:3001/product/${productSku}`);

        setProduct(message);
      } catch (error) {
        errorToast();
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="p-4">
      <Breadcrumb separator=">">
        <Breadcrumb.Item active>
          <Link className="text-decoration-none text-dark" to="/products">
            Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex justify-content-around">
        {product?.images?.length > 1 ? (
          <Carousel
            variant="dark"
            activeIndex={index}
            onSelect={handleSelect}
            fade
            style={{ width: "600px" }}
          >
            {product.images.map((image, key) => {
              return (
                <Carousel.Item key={key}>
                  <img
                    src={image}
                    className="d-block w-100"
                    alt={`${product.name}-image${key}`}
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>
        ) : (
          <img src={product.thumbnail} alt={`${product.name}-image`} />
        )}

        <div className="px-3">
          <h1>{product.name}</h1>
          <p>
            {new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(product?.price?.amount)}
          </p>
          <Counter
            setHub={setHub}
            counters={counters}
            setCounter={setCounter}
            productSku={product.sku}
            isAlcohol={product?.alcohol}
            quantity={product?.quantity}
            price={product?.price}
            singleProduct={true}
          ></Counter>
        </div>
      </div>
      {product?.description && (
        <div className="mt-3">
          <pre style={{ "whiteSpace": "pre-wrap" }} >

            <p className="font-weight-bold">Description</p>
            <hr></hr>
            <p>{product?.description.replaceAll("#", "")}</p>
            <hr></hr>
          </pre>
        </div>
      )}
    </div>
  );
};

export default Product;
