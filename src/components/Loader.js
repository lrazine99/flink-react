import { ColorRing } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-100 d-flex justify-content-center align-items-center" style={{"height" : "85vh"}}>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#ef7ab0", "#ef7ab0", "#ef7ab0", "#ef7ab0", "#ef7ab0"]}
      />
    </div>
  );
};

export default Loader;
