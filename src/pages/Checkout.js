import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { errorToast, formatNumberEur } from "../components/Utils";
import Loader from "../components/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";

const Checkout = ({ counter }) => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  console.log(process.env.REACT_APP_STRIPE_KEY)
  const today = new Date();
  const day = today.toLocaleDateString("en-GB", { day: "2-digit" });
  const month = today.toLocaleDateString("en-GB", { month: "2-digit" });
  const year = today.getFullYear();
  const currentDate = `${day}/${month}/${year}`;
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line
  const [order, setOrder] = useState([]);
  // eslint-disable-next-line
  const [paymentState, setPaymentState] = useState(false);

  const navigate = useNavigate();
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

          setOrder(message);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);

          errorToast();
        }
      };

      fetchProducts();
    }
    // eslint-disable-next-line
  }, []);

  return isLoading ? (
    <Loader></Loader>
  ) : (
    <main className="p-3">
      <div>
        <p
          className="text-decoration-none text-dark pointerHover"
          onClick={() => {
            navigate(-1);
          }}
        >
          {"< Retour"}
        </p>
        <div className="d-flex justify-content-between">
          <div>
            <h3 className="my-2 font-weight-bold">Caisse</h3>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                setPaymentState={setPaymentState}
                counter={counter}
                currentDate={currentDate}
              />
            </Elements>
          </div>

          <div>
            <h3 className="my-2 font-weight-bold">
              Récapitulatif de la commande
            </h3>

            <div className="bg-light mb-2">
              <div className="d-flex justify-content-between">
                <span>Sous total :</span>
                <span>{formatNumberEur(numTotal ? counter.total : 0)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Caution :</span>
                <span>{formatNumberEur(0)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Frais de livraison :</span>
                <span>{formatNumberEur(numTotal ? 1.8 : 0)}</span>
              </div>
              <hr className="my-0" />
              <div className="d-flex justify-content-between">
                <span className="font-weight-bold">Total :</span>
                <span className="font-weight-bold">
                  {formatNumberEur(numTotal ? counter.total + 1.8 : 0)}
                </span>
              </div>
              <small className="text-muted">TVA incluse</small>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
