import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Counter from "./Counter";
import { Link } from "react-router-dom";

const ProductRenderLine = ({
  product,
  counters,
  setCounter,
  setHub,
  renderWithoutConter,
}) => {
  return (
    <div>
      <div className="primary d-flex justify-content-between align-items-center">
        <Link
          to={`/product/${product.slug}-${product.sku}`}
          state={{
            setHub: "setHub",
            counters: "counters",
            setCounter: "setCounter",
          }}
        >
          <img
            className="imageProductSearch"
            src={product?.thumbnail}
            alt={product?.name}
          ></img>
        </Link>
        <div className="w-75">
          {product?.name.length > 24 ? (
            <OverlayTrigger
              overlay={
                <Tooltip id="tooltip-disabled">
                  {product?.name.split(" ").slice(4).join(" ")}
                </Tooltip>
              }
            >
              <p className="text-center text-wrap mb-0">
                {product?.name.split(" ").slice(0, 4).join(" ")} ...
              </p>
            </OverlayTrigger>
          ) : (
            <p className="text-center text-wrap mb-0">{product?.name}...</p>
          )}

          <p className="text-center font-weight-bold">
            {new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(product?.price?.amount)}
          </p>
        </div>
        {!renderWithoutConter && (
          <div>
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
        )}
      </div>
    </div>
  );
};

export default ProductRenderLine;
