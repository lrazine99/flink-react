
import { Modal, Image } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import Button from "react-bootstrap/Button";

const ModalLegalAge = ({ show, handleClose, handleCloseLegal }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName="custom-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3 style={{ fontWeight: "bold" }} className="text-center">
            Vérification de l'âge{" "}
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <p>Pour acheter de l'alcool vous devez avoir 18 ans ou plus</p>
          <div className="d-grid gap-2 w-100 mt-4">
            <Button
              onClick={handleClose}
              style={{ backgroundColor: "#F8C9DF", borderColor: "#F8C9DF" }}
              size="lg"
            >
              J'ai moins de 18 ans
            </Button>

            <Button
              onClick={handleCloseLegal}
              style={{ backgroundColor: "#ef7ab0", borderColor: "#ef7ab0" }}
              size="lg"
            >
              J'ai plus de 18 ans
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalLegalAge;
