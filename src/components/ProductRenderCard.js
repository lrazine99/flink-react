import { Link } from "react-router-dom";
import Counter from "./Counter.js"

const ProductRenderCard = ({product, setHub, setCounter, counters}) => {
  return (
    <div
      className="bg-light shadow-sm rounded m-2 mw-50  border justify-content-center d-flex flex-column p-2 flex-grow-1
      align-items-center"
    >
      <div className="text-decoration-none text-dark">
        <p className="text-center text-wrap mb-0">{product?.name}</p>
        <p className="text-center font-weight-bold">
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(product?.price?.amount)}
        </p>
      </div>
      <div className="position-relative">
        <Link
          to={`/product/${product.slug}-${product.sku}`}
          state={{
            setHub: "setHub",
            counters: "counters",
            setCounter: "setCounter",
          }}
        >
          <img
            className="imageProductRow"
            src={product?.thumbnail}
            alt={product?.name}
          ></img>
        </Link>
        <div className="position-absolute start-50 top-50">
          <Counter
            setHub={setHub}
            counters={counters}
            setCounter={setCounter}
            productSku={product.sku}
            isAlcohol={product?.alcohol}
            quantity={product?.quantity}
            price={product?.price}
          ></Counter>
        </div>
      </div>
    </div>
  );
};

export default ProductRenderCard;
