import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useCallback } from "react";

const modal_edit_pengeluaran = ({ item, setAllData }) => {
  const [show, setShow] = useState(false);

  const [pengeluaran, setPengeluaran] = useState(item.pengeluaran);
  const [gambar, setGambar] = useState("");
  const [deskripsi, setDeskripsi] = useState(item.deskripsi);

  const modal = useCallback(() => {
    setShow(!show);
    setPengeluaran(item.pengeluaran);
    setDeskripsi(item.deskripsi);
  }, [show, pengeluaran, deskripsi]);

  const [validation, setValidation] = useState({});

  const fileChange = useCallback((e) => {
    const dataGambar = e.target.files[0];
    if (!dataGambar.type.match("image.*")) {
      setGambar("");
    }
    setGambar(dataGambar);
  }, [gambar]);

  const upload = async (e) => {
    e.preventDefault();

    if (!(pengeluaran && deskripsi)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!pengeluaran) {
        setValidation((item) => ({
          ...item,
          pengeluaran: "Pengeluaran harus terisi",
        }));
      } else {
        delete validation.pengeluaran;
      }
      if (!deskripsi) {
        setValidation((item) => ({
          ...item,
          deskripsi: "Deskripsi harus terisi",
        }));
      } else {
        delete validation.deskripsi;
      }
    } else {
      setValidation({});
      const formdata = new FormData();
      formdata.append("gambar", gambar);
      formdata.append("pengeluaran", pengeluaran);
      formdata.append("deskripsi", deskripsi);

      const tokenSimpan = Cookies.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenSimpan}`;

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/update_kas/${item.id_kas}`,
          formdata
        )
        .then(() => {
          Swal.fire({
            title: "Data terupdate",
            text: "Selamat, data anda telah terupdate",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          })
            .then(async () => {
              const token = Cookies.get("token");

              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${token}`;
              await axios
                .post(
                  `${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_pengeluaran`,
                  formdata
                )
                .then((res) => {
                  const data = res.data.data;
                  setAllData(data);
                })
                .catch((Error) => {
                  console.log(Error.response.data);
                });
              setShow(false);
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((Error) => {
          setValidation(Error.response.data);
          console.log(Error.message);
        });
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="warning"
        className="text-white"
        onClick={modal}
      >
        <FaPen />
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengeluaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={upload}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Gambar</label>
              <input
                type="file"
                className="form-control form-control-lg"
                onChange={fileChange}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Pengeluaran</label>
              <InputNumber
                style={{ width: "100%" }}
                value={pengeluaran}
                onChange={(e) => setPengeluaran(e.value)}
                placeholder="Masukkan Pengeluaran"
              />
            </div>
            {validation.pengeluaran && (
              <div className="alert alert-danger">{validation.pengeluaran}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Deskripsi</label>
              <InputTextarea
                rows={6}
                style={{ width: "100%" }}
                placeholder="Masukkan Deskripsi"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
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

export default modal_edit_pengeluaran;
