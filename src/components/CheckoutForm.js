import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Cookies from "js-cookie";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { errorToast } from "./Utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CheckoutForm = ({ setPaymentState, currentDate, counter }) => {
  const stripe = useStripe();
  const navigate = useNavigate();
  const elements = useElements();
  const [formData, setFromDatas] = useState({
    adress: JSON.parse(Cookies.get("validLocation")).adress,
    counter: counter,
    date: currentDate,
  });

  const handleDataEmail = ({ target }) => {
    setFromDatas((data) => ({ ...data, mail: target.value }));
  };

  const handleDataFirstName = ({ target }) => {
    setFromDatas((data) => ({ ...data, firstName: target.value }));
  };

  const handleDataLastName = ({ target }) => {
    setFromDatas((data) => ({ ...data, lastName: target.value }));
  };

  const handleDataPhone = ({ target }) => {
    setFromDatas((data) => ({ ...data, phone: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardElement = elements.getElement(CardElement);
    const stripeResponse = await stripe.createToken(cardElement, {
      name: "22",
    });
    const stripeToken = stripeResponse.token.id;

    try {
      const response = await axios.post("http://localhost:3001/pay", {
        stripeToken,
      });

      if (response.data.status === "succeeded") {
        await axios.post("http://localhost:3001/checkout", {
          formData,
        });

        setPaymentState(true);
        toast.success(
          "paiment reussi votre commande est prise en compte"
        );
        navigate('/products')
      }
    } catch (error) {
      errorToast(
        "une erreur est survenue, veuillez verifier vos informations et réessayer"
      );
    }
  };

  return (
    <>
      <Form validated={false} style={{ width: "50vw" }} onSubmit={handleSubmit}>
        <Form.Label className="font-weight-bold">
          Information personnelles
        </Form.Label>

        <Form.Group className="mb-3" controlId="formBasicFirstName">
          <Form.Control
            type="text"
            placeholder="Prénom"
            onChange={handleDataFirstName}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicLastName">
          <Form.Control
            type="text"
            placeholder="Nom"
            onChange={handleDataLastName}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            onChange={handleDataEmail}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Control
            type="tel"
            placeholder="Numero de telephone"
            onChange={handleDataPhone}
          />
        </Form.Group>

        <Form.Label className="font-weight-bold">
          Adresse de livraison
        </Form.Label>
        <fieldset disabled>
          <Form.Group className="mb-3" controlId="formBasicAdress">
            <Form.Control
              type="text"
              placeholder="Adresse"
              defaultValue={JSON.parse(Cookies.get("validLocation")).adress}
            />
          </Form.Group>
        </fieldset>
        <CardElement />
        <Button type="submit" variant="dark" className="my-3">
          Valider
        </Button>
      </Form>
    </>
  );
};

export default CheckoutForm;
