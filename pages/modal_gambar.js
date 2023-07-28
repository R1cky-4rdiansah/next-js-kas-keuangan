import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { FaEye, FaFileAlt, FaFileArchive, FaPen } from "react-icons/fa";
import { Carousel } from "primereact/carousel";
import Cookies from "js-cookie";

const modalGambar = ({ id_kas, page }) => {
  const [show, setShow] = useState(false);
  const [gambar, setGambar] = useState([]);

  const modal = () => {
    setShow(!show);
    getGambar();
  };

  const getGambar = async () => {
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/gambar/${id_kas}`
    );
    const data = await response.data.data;
    setGambar(data);
  };

  const productTemplate = (item) => {
    return (
      <div className="border-1 surface-border border-round m-2 text-center">
        <center>
          <a
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_API_BACKEND}/bukti_kas/${item.gambar}`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_BACKEND}/bukti_kas/${item.gambar}`}
              className="w-full shadow-2"
              style={{ height: "400px" }}
            />
          </a>
        </center>
      </div>
    );
  };

  return (
    <div>
      <Button
        size="sm"
        variant="info"
        style={{ color: "white", margin: "0 4px" }}
        onClick={modal}
      >
        <FaFileArchive />
      </Button>

      <Modal size="lg" show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Gambar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <Carousel
              value={gambar}
              numVisible={1}
              numScroll={1}
              orientation="vertical"
              className="custom-carousel"
              verticalViewPortHeight="420px"
              itemTemplate={productTemplate}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default modalGambar;
