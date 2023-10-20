import { Spinner } from "react-bootstrap";

const loader = () => {
  return (
    <div className="spiner-screen">
      <Spinner animation="grow" size="lg" variant="dark" />
    </div>
  );
};

export default loader;
