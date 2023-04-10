import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import mapFlink from "../components/images/map.jpg";
import phone from "../components/images/phone.webp";
import logo from "../components/images/logo.svg";

const Home = () => {
  return (
    <main style={{ height: "100vh" }}>
      <div className="bg-primary" style={{ height: "15%" }}></div>
      <div classNam="" style={{ height: "85%", backgroundColor: "#ef7ab0" }}>
        <div className="h-100 d-flex justify-content-between  ">
          <div className="align-self-center m-4">
          <div className="border border-primary ">
              <img className="image-fluid w-100" src={logo} alt="map"></img>
            </div>
            <div className="border border-danger my-4 ">
              <Link to="/products">
                <Button>{`Acheter maintenant ->`}</Button>
              </Link>
            </div>
            
          </div>

          <div
            className="border border-primary  align-self-end"
            style={{ "max-height": "85vh" }}
          >
            <img
              className="image-fluid "
              style={{ height: "75vh" }}
              src={phone}
              alt="map"
            ></img>
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-between">
        <div className="m-5 w-25">
          <h2 className="font-weight-bold">Nous sommes là</h2>
          <p className="border-light bg-secondary rounded p-2">Paris</p>
          <p>
            Vous ne trouvez pas votre ville ? Inscrivez-vous maintenant pour
            etre prévenus quand Flink débarque chez vous
          </p>
        </div>
        <img className="image-fluid w-50" src={mapFlink} alt="map"></img>
      </div>
    </main>
  );
};
export default Home;
