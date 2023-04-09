import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Form from "react-bootstrap/Form";
import { errorToast, formatNumberEur } from "../components/Utils";
import Cookies from "js-cookie";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Loader from "../components/Loader";

const BackOffice = ({ logedAdmin, setLogedAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [errorPassword, setErrorPassword] = useState(false);
  const [password, setPassWord] = useState(null);
  const [show, setShow] = useState(false);
  const [orderToDisplay, setOrderToDisplay] = useState([]);
  const [idCommand, setIdCommand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setIsloading] = useState(true);

  useEffect(() => {
    if (logedAdmin) {
      const fetchOrders = async () => {
        try {
          const {
            data: { message },
          } = await axios.get(
            `${process.env.REACT_APP_BACK_ENDPOINT}/backoffice/orders`
          );

          setOrders(message);
          const {
            data: { message: products },
          } = await axios.post(
            `${process.env.REACT_APP_BACK_ENDPOINT}/products`,
            {
              product_skus: message
                .map((order) => Object.keys(order.counter))
                .flat(),
            }
          );

          setProducts(products);
          setIsloading(false);
        } catch (error) {
          errorToast();
        }
      };

      fetchOrders();
    }
    // eslint-disable-next-line
  }, [logedAdmin]);

  const handleModalOrders = (event) => {
    setOrderToDisplay(
      Object.keys(
        Object.values(orders).find(
          (element) => element._id === event.target.parentElement.id
        ).counter
      )
    );
    setIdCommand(event.target.parentElement.id);
    setShow(true);
    return <p></p>;
  };

  return logedAdmin ? (
    loading ? (
      <Loader></Loader>
    ) : (
      <main>
        <h3 className="my-2 font-weight-bold">
          {`Vos ${orders.length} commandes`}
        </h3>

        <table className="borderPink mx-auto">
          <thead className="borderPink">
            <tr className="borderPink">
              <th className="borderPink">Date</th>
              <th className="borderPink">Nom</th>
              <th className="borderPink">Prénom</th>
              <th className="borderPink">Email</th>
              <th className="borderPink">Total</th>
            </tr>
          </thead>
          <tbody className="borderPink orders">
            {orders.map((order) => {
              return (
                <tr
                  className="borderPink"
                  key={order._id}
                  id={order._id}
                  onClick={handleModalOrders}
                >
                  <td className="borderPink">{order.date}</td>
                  <td className="borderPink">{order.lastName}</td>
                  <td className="borderPink">{order.firstName}</td>
                  <td className="borderPink">{order.mail}</td>
                  <td className="borderPink">
                    {formatNumberEur(order.counter.total + 1.8)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Details de la commande</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {products
              .filter((element) => orderToDisplay.includes(element.sku))
              .map((product) => {
                return (
                  <div
                    key={product._id}
                    className="w-50 primary d-flex justify-content-between align-items-center"
                  >
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
                        <p className="text-center text-wrap mb-0">
                          {product?.name}...
                        </p>
                      )}

                      <p className="text-center font-weight-bold">
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        }).format(product?.price?.amount)}
                      </p>
                    </div>

                    <div>
                      {
                        Object.values(orders).find(
                          (element) => element._id === idCommand
                        ).counter[product.sku].count
                      }
                    </div>
                  </div>
                );
              })}
          </Modal.Body>
        </Modal>
      </main>
    )
  ) : (
    <main>
      <h3 className="my-2 font-weight-bold">Connectez-vous</h3>

      <div className="mx-auto w-25 ">
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            if (password === "HelloWorld!") {
              setErrorPassword(false);
              setLogedAdmin(true);
              Cookies.set("logedAdmin", true);
            } else {
              setErrorPassword(true);
            }
          }}
        >
          <Form.Group
            className="mb-3"
            controlId="formPasword"
            onChange={(event) => setPassWord(event.target.value)}
          >
            <Form.Control
              type="text"
              placeholder="Votre mot de passe"
              isInvalid={errorPassword}
            />
            <Form.Control.Feedback type="invalid">
              Mauvais mot de passe.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="dark" type="submit">
            Valider
          </Button>
        </Form>
      </div>
    </main>
  );
};

export default BackOffice;
