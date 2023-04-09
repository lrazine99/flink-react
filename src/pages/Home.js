import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      Home
      <Link to="/products">
        <Button>product</Button>
      </Link>
    </div>
  );
};
export default Home;
