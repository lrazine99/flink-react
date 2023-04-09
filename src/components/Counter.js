import Button from "react-bootstrap/Button";
import ModalLocation from "./ModalLocation";
import ModalLegalAge from "./ModalLegalAge";
import Cookies from "js-cookie";
import { useState } from "react";
import { cartTotal } from "./Utils";
import "bootstrap/dist/css/bootstrap.min.css";

const Counter = ({
  productSku,
  counters,
  setCounter,
  setHub,
  isAlcohol,
  quantity,
  price,
  singleProduct,
}) => {
  const [showModalLocation, setShowModalLocation] = useState(false);
  const [showModalAgeRequired, setShowModalAgeRequired] = useState(false);

  const countCalcul = (key, op) => {
    const obj = { ...counters };

    obj[key] =
      obj[key] !== undefined
        ? obj[key]
        : { quantity, price, isAlcohol, count: 0 };

    if (op === "-") {
      obj[key].count -= 1;
      obj[key].count === 0 && delete obj[key];
    } else if (op === "+") {
      obj[key].count += 1;
    } else {
      obj[key].count = 0;
    }

    const {total, ...rest} = obj;

    obj.total = cartTotal(rest);

    Cookies.set("basket", JSON.stringify(obj))

    return obj;
  };

  const checkAlcoholSelected = () => {
    return Object.entries(counters).find(([, { isAlcohol }]) => {
      return isAlcohol;
    });
  };

  return (
    <div className="d-flex bg-white">
      <Button
        variant="white outline-pink"
        size="sm"
        onClick={(event) => {
          event.stopPropagation();
          setCounter(countCalcul(productSku, "-"));
        }}
        style={{
          display: counters?.[productSku]?.count > 0 ? "inline" : "none",
        }}
      >
        <span className="corePink fs-4">-</span>
      </Button>
      <span
        className="corePink fs-4"
        style={{
          display: counters?.[productSku]?.count > 0 ? "inline" : "none",
        }}
      >
        {counters?.[productSku]?.count}
      </span>
      <Button
        variant="light outline-pink"
        size={singleProduct && !counters?.[productSku]?.count ? "lg" : "sm"}
        style={{
          display:
            counters?.[productSku]?.count === quantity ? "none" : "inline",
          backgroundColor:
            singleProduct && !counters?.[productSku]?.count ? "#ef7ab0" : "",
        }}
        onClick={(event) => {
          event.stopPropagation();

          if (!Cookies.get("validLocation")) {
            setShowModalLocation(true);
          } else if (isAlcohol && !checkAlcoholSelected()) {
            setShowModalAgeRequired(true);
          } else {
            setCounter(countCalcul(productSku, "+"));
          }
        }}
      >
        {singleProduct && !counters?.[productSku]?.count ? (
          <span className="text-light fs-4">Ajouter au panier</span>
        ) : (
          <span className="corePink fs-4">+</span>
        )}
      </Button>
      <ModalLocation
        show={showModalLocation}
        setHub={setHub}
        handleClose={() => setShowModalLocation(false)}
      />

      <ModalLegalAge
        show={showModalAgeRequired}
        setHub={setHub}
        handleClose={() => setShowModalAgeRequired(false)}
        handleCloseLegal={() => {
          setCounter(countCalcul(productSku, "+"));

          return setShowModalAgeRequired(false);
        }}
      />
    </div>
  );
};
export default Counter;
