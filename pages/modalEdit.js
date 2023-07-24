import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import Router from "next/router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";

const modalEdit = ({ item, page }) => {
  const [show, setShow] = useState(false);

  const modal = () => {
    setShow(!show);
    setJudul(item.judul);
    setDeskripsi(item.deskripsi);
    setHarga(item.harga);
  };

  const [judul, setJudul] = useState(item.judul);
  const [gambar, setGambar] = useState("");
  const [deskripsi, setDeskripsi] = useState(item.deskripsi);
  const [harga, setHarga] = useState(item.harga);

  const [validation, setValidation] = useState({});

  const fileChange = (e) => {
    const dataGambar = e.target.files[0];
    if (!dataGambar.type.match("image.*")) {
      setGambar("");
    }
    setGambar(dataGambar);
  };

  const upload = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("gambar", gambar);
    formdata.append("judul", judul);
    formdata.append("harga", harga);
    formdata.append("deskripsi", deskripsi);

    const tokenUpdate = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenUpdate}`;

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/update/${item.id}`,
        formdata
      )
      .then(() => {})
      .catch((Error) => {
        setValidation(Error.response.data);
      });

    await Swal.fire({
      title: "Data terupdate",
      text: "Selamat, data anda telah terupdate",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      setShow(false);
      Router.push(`/daftarProduk/${page}`);
    });
  };

  return (
    <div>
      <Button
        size="sm"
        variant="warning"
        style={{ color: "white", margin: "0 4px" }}
        onClick={modal}
      >
        <FaPen />
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={upload}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Gambar</label>
              <input
                type="file"
                className="form-control"
                onChange={fileChange}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Judul</label>
              <input
                className="form-control"
                type="text"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan Judul"
              />
            </div>
            {validation.judul && (
              <div className="alert alert-danger">{validation.judul}</div>
            )}
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Harga</label>
              <input
                className="form-control"
                type="number"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="Masukkan Harga"
              />
            </div>
            {validation.harga && (
              <div className="alert alert-danger">{validation.harga}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Deskripsi</label>
              <textarea
                className="form-control"
                rows={3}
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Masukkan Deskripsi"
              />
            </div>
            {validation.deskripsi && (
              <div className="alert alert-danger">{validation.deskripsi}</div>
            )}

            <div className=" d-flex justify-content-end">
              <button className="btn btn-dark border-0 shadow-sm" type="submit">
                Update
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default modalEdit;
