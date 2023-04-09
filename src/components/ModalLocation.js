import { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Modal } from "react-bootstrap";
import axios from "axios";
import riders from "./images/riders_portrait.jpg";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { errorToast } from "./Utils";
import Cookies from "js-cookie";

const ModalLocation = ({ show, handleClose, setHub }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const handleSearch = async (query) => {
    if (query.length < 3) {
      return false;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get(
        `http://localhost:3001/location/result?q=${query}`
      );
      setOptions(
        [...data.message.slice(0, 3)].map((element) => {
          return {
            id: element.coordinates,
            name: element.subtitle,
          };
        })
      );

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      errorToast();
    }
  };

  const handleLocationSelection = async ([event]) => {
    try {
      if (event?.id?.latitude && event?.id?.longitude) {
        const { data } = await axios.get(
          `http://localhost:3001/location/hub?latitude=${event?.id?.latitude}&longitude=${event?.id?.longitude}`
        );

        if (!data.message.time) {
          errorToast("Livraison impossible");
          Cookies.remove("validLocation");
          setHub({});
        } else {
          Cookies.set(
            "validLocation",
            JSON.stringify({ ...data.message, adress: event.name })
          );
          setHub({ ...data.message, adress: event.name });
          handleClose();
        }
      }
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="custom-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3 style={{ fontWeight: "bold" }}>
            Pour commencer, vérifions votre adresse
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body onClick={(event) => event.stopPropagation()}>
        <div className="d-flex justify-content-around">
          <img src={riders} className="riders" alt="riders"></img>
          <div className="px-2">
            <p>
              Veuillez ajouter votre adresse exacte pour voir les produits qui
              peuvent vous êtres livrés en 10 minutes
            </p>
            <AsyncTypeahead
              id="my-async-typeahead"
              labelKey="name"
              isLoading={isLoading}
              onSearch={handleSearch}
              options={options}
              placeholder="Rue et numéro de domicile"
              style={{ width: "300px" }}
              maxHeight={"500px"}
              onChange={handleLocationSelection}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalLocation;
