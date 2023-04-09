import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { useState, useEffect } from "react";
import { errorToast, formatNumberEur } from "../components/Utils";
import Counter from "../components/Counter";
import ProductRenderLine from "../components/ProductRenderLine";
import Button from "react-bootstrap/Button";
import Loader from "../components/Loader";

const Cart = ({ setCounter, counter }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [basket, setBasket] = useState([]);
  let numTotal = Object.keys(counter).length - 1;

  numTotal = numTotal === -1 ? 0 : numTotal;

  useEffect(() => {
    if (numTotal) {
      setIsLoading(true);

      const fetchProducts = async () => {
        try {
          const {
            data: { message },
          } = await axios.post(`http://localhost:3001/products`, {
            product_skus: Object.keys(counter).filter(
              (element) => element !== "total"
            ),
          });

          setBasket(message);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);

          errorToast();
        }
      };

      fetchProducts();
    }
    // eslint-disable-next-line
  }, [counter]);

  return isLoading ? (
    <Loader></Loader>
  ) : (
    <main className="p-3">
      <div>
        <Link to="/products" className="text-decoration-none text-dark">
          {"< Continuer les achats"}
        </Link>
      </div>
      <h3 className="my-2 font-weight-bold">Panier d'achats</h3>
      <div className="d-flex justify-content-between">
        <div>
          <Table striped bordered hover size="sm" responsive>
            <thead>
              <tr>
                <th>
                  <span className="text-uppercase">
                    vos articles {`(${numTotal})`}
                  </span>
                </th>
                <th>
                  <span className="text-uppercase">quantié</span>
                </th>
                <th>
                  <span className="text-uppercase">prix de l'article</span>
                </th>
                <th>
                  <span className="text-uppercase">articles au total</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {basket.map((product) => {
                return (
                  <tr key={product._id}>
                    <td>
                      {
                        <ProductRenderLine
                          renderWithoutConter={true}
                          product={product}
                        ></ProductRenderLine>
                      }
                    </td>
                    <td>
                      <Counter
                        counters={counter}
                        setCounter={setCounter}
                        productSku={product.sku}
                        isAlcohol={product?.alcohol}
                        quantity={product?.quantity}
                        price={product?.price}
                      ></Counter>
                    </td>
                    <td>
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(product?.price?.amount)}
                    </td>
                    <td>
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      }).format(
                        counter[product.sku]?.count * product?.price?.amount
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="w-25">
          <div className="bg-light mb-2">
            <div className="d-flex justify-content-between">
              <span>Sous total</span>
              <span>{formatNumberEur(numTotal ? counter.total : 0)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Caution</span>
              <span>{formatNumberEur(0)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Frais de livraison</span>
              <span>{formatNumberEur(numTotal ? 1.8 : 0)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>TotalTVA incluse</span>
              <span>{formatNumberEur(numTotal ? counter.total + 1.8 : 0)}</span>
            </div>
            <hr className="my-0" />
          </div>

          <Link to="/checkout">
            <Button
              style={{ backgroundColor: "#ef7ab0", borderColor: "#ef7ab0" }}
              size="lg"
            >
              caisse
            </Button>{" "}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
