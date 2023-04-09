import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { ReactComponent as Logo } from "./images/logo.svg";
import ProductRenderLine from "./ProductRenderLine";
import { errorToast, formatNumberEur } from "./Utils";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";

const Header = ({ counters, setCounter, setHub }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [basket, setBasket] = useState([]);
  const navigate = useNavigate();
  const typeaheadRef = useRef(null);
  let { total, ...totalProductCart } = counters;
  totalProductCart = Object.keys(totalProductCart);

  useEffect(() => {
    if (totalProductCart.length) {
      const fetchProducts = async () => {
        try {
          const {
            data: { message },
          } = await axios.post(`http://localhost:3001/products`, {
            product_skus: totalProductCart,
          });

          setBasket(message);
        } catch (error) {
          errorToast();
        }
      };

      fetchProducts();
    }
    // eslint-disable-next-line
  }, [counters]);

  const handleCloseDropdown = () => {
    if (typeaheadRef.current) {
      typeaheadRef.current.blur();
    }
  };

  const handleSearch = async (query) => {
    if (query.length < 3) {
      return false;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.get(
        `http://localhost:3001/products/search?q=${query}`
      );

      setOptions(() => {
        if (data.message.results.length > 5) {
          const seeAll = { ...data.message.results[0] };

          seeAll._id = "seeAll";

          return [...data.message.results.slice(0, 5), seeAll];
        } else {
          return data.message.results;
        }
      });

      setIsLoading(false);
    } catch (error) {
      errorToast();
    }
  };

  const handleKeyDown = (event) => {
    console.log(event.target.value);
    if (event.keyCode === 13) {
      navigate(`/search?q=${event.target.value}`);
      handleCloseDropdown();
    }
  };

  const renderMenuItemChildren = (option, props, index) => {
    return option._id !== "seeAll" ? (
      <>
        <ProductRenderLine
          setHub={setHub}
          counters={counters}
          setCounter={setCounter}
          product={option}
        ></ProductRenderLine>
        <hr className="my-0" />
      </>
    ) : (
      <p
        className="text-center text-decoration-none text-dark"
        onClick={() => {
          navigate(`/search?q=${props.text}`);
        }}
      >
        {"Voir tous les résultats >"}{" "}
      </p>
    );
  };

  const shouldRenderTypeaheadCart = (pageToKeep) =>
    !["search", "cart", "checkout", "backoffice", "product"]
      .filter((element) => element !== pageToKeep)
      .some(
        (path) =>
          window.location.href.includes(path) &&
          !window.location.href.includes("products")
      );

  return (
    <Navbar
      collapseOnSelect
      className="border-bottom"
      bg="white"
      expand="md"
      sticky="top"
    >
      <Container fluid>
        <Navbar.Brand>
          <Link to="/">
            <Logo fill="#ef7ab0" stroke="#ef7ab0" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 d-flex justify-content-center"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {shouldRenderTypeaheadCart() && (
              <AsyncTypeahead
                id="my-async-typeahead"
                ref={typeaheadRef}
                labelKey="name"
                isLoading={isLoading}
                onSearch={handleSearch}
                onKeyDown={handleKeyDown}
                options={options}
                placeholder="Recherche..."
                style={{ width: "400px" }}
                maxHeight={"500px"}
                renderMenuItemChildren={renderMenuItemChildren}
              />
            )}

            {window.location.href.includes("search") && (
              <Form className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Recherche..."
                  className="me-2"
                  onKeyDown={handleKeyDown}
                />
              </Form>
            )}
          </Nav>
          <Nav className="me-auto my-2 my-lg-0 d-flex justify-content-center">
            {totalProductCart.length && shouldRenderTypeaheadCart("search") ? (
              <NavDropdown
                className="rounded py-1 px-2"
                title={<span>{formatNumberEur(counters.total)}</span>}
                id="nav-dropdown"
                style={{ backgroundColor: "#ef7ab0", borderColor: "#ef7ab0" }}
              >
                <NavDropdown.Item eventKey="4.1" className="text-center">
                  <div className="text-center">
                    Panier{" "}
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/cart`);
                      }}
                    >
                      Agrandir
                    </span>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Divider />

                {basket.map((product) => {
                  return (
                    <div
                      style={{
                        width: "300px",
                      }}
                      key={product._id}
                    >
                      <NavDropdown.Item eventKey="4.2">
                        <ProductRenderLine
                          setHub={setHub}
                          counters={counters}
                          setCounter={setCounter}
                          product={product}
                        ></ProductRenderLine>
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </div>
                  );
                })}

                <NavDropdown.Item eventKey="4.4">
                  <Link to="/checkout">
                    <Button
                      style={{
                        backgroundColor: "#ef7ab0",
                        borderColor: "#ef7ab0",
                      }}
                    >
                      Caisse {formatNumberEur(counters.total)}
                    </Button>
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              ""
            )}
          </Nav>
          <Nav>
            <Nav.Link>
              <Button variant="secondary btn-lg" size="lg">
                Admin
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
