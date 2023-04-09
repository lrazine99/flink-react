import Accordion from "react-bootstrap/Accordion";
import { HashLink as Link } from "react-router-hash-link";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import ModalLocation from "./ModalLocation";
import { useNavigate } from "react-router-dom";

const SideNav = ({
  pageSearch,
  setCategoriesDisplay,
  categories,
  hub,
  setHub,
  defaultActivated,
}) => {
  const [showModalLocation, setShowModalLocation] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sticky-side-nav m-2">
      <div className="mt-4">
        <Card border="white" className="shadow" body>
          <div>
            {hub.time ? (
              <div
                className="d-flex justify-content-center  align-items-center pointerHover"
                onClick={() => setShowModalLocation(true)}
              >
                <div className="text-white bg-dark rounded m-2 px-2">
                  {hub.time} min{" "}
                </div>
                <div className="corePink">{hub.adress}</div>
              </div>
            ) : (
              <span
                className="corePink pointerHover"
                onClick={() => setShowModalLocation(true)}
              >
                Add delivery adress
              </span>
            )}
          </div>
        </Card>
      </div>

      <div className="m-2">
        <p className="text-uppercase">navigation</p>
        <div className="p-2">
          <p
            className="pointerHover"
            onClick={() => {
              if (!pageSearch) {
                setCategoriesDisplay([]);
              } else {
                navigate("/products");
              }
            }}
          >
            Accueil
          </p>
        </div>
      </div>
      <div className="m-2">
        <p className="text-uppercase">catégories</p>
      </div>
      <Accordion defaultActiveKey={defaultActivated ? defaultActivated : null}>
        {categories
          .filter((element) => !element?.is_special && !element?.parent_id)
          .sort((a, b) => a.rank - b.rank)
          .map((item, key) => {
            return (
              <Accordion.Item eventKey={key} key={item._id}>
                <Accordion.Header
                  className="user-select-none"
                  onClick={() => {
                    const childrenCategories = categories.filter(
                      (element) => element?.parent_id === item._id
                    );

                    if (!pageSearch) {
                      setCategoriesDisplay(childrenCategories);
                    } else {
                      navigate("/products", {
                        state: {
                          parentCategories: categories,
                          childrenCategories,
                          categoryKey: key,
                        },
                      });
                    }
                  }}
                >
                  {item.name}
                </Accordion.Header>
                <Accordion.Body>
                  {categories
                    .filter(
                      (element) =>
                        !element?.is_special && element?.parent_id === item._id
                    )
                    .sort((a, b) => a.rank - b.rank)
                    .map((item, categoryKey) => {
                      return (
                        <Link
                          to={`/products#${categoryKey}`}
                          key={categoryKey}
                          className="text-decoration-none text-dark"
                        >
                          <div key={item._id}>
                            <p
                              className="ml-2 user-select-none pointerHover"
                              id={item._sku}
                            >
                              {item.name}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
      </Accordion>
      <ModalLocation
        show={showModalLocation}
        setHub={setHub}
        handleClose={() => setShowModalLocation(false)}
      />
    </div>
  );
};

export default SideNav;
