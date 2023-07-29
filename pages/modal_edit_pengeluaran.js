import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FaPen, FaTrash } from "react-icons/fa";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useCallback } from "react";
import { Carousel } from "primereact/carousel";

const modal_edit_pengeluaran = ({ item, setAllData }) => {
  const [show, setShow] = useState(false);

  const [pengeluaran, setPengeluaran] = useState(item.pengeluaran);
  const [gambar, setGambar] = useState([]);
  const [deskripsi, setDeskripsi] = useState(item.deskripsi);
  const [gambarAwal, setGambarAwal] = useState([]);

  const modal = useCallback(() => {
    setShow(!show);
    setPengeluaran(item.pengeluaran);
    setDeskripsi(item.deskripsi);
    getGambar();
  }, [show, pengeluaran, deskripsi]);

  const [validation, setValidation] = useState({});

  const getGambar = async () => {
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/gambar/${item.id_kas}`)
      .then((res) => {
        const data = res.data.data;
        setGambarAwal(data);
      });
  };

  const hapusGambar = async (idGambar) => {
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda yakin ingin menghapus gambar ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/hapus_gambar/${idGambar}`
          )
          .then(() => {
            Swal.fire({
              title: "Data Terhapus",
              text: "Selamat, data anda telah terhapus",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            }).then(async () => {
              getGambar();
            });
          });
      }
    });
  };

  const productTemplate = (item) => {
    return (
      <div className="m-2 text-center">
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
        <div className=" mt-2 d-flex justify-content-center align-content-center">
          <button
            onClick={() => hapusGambar(item.id)}
            className=" btn btn-danger"
            disabled={gambarAwal.length == 1 ? true : false}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

  const fileChange = useCallback(
    (e) => {
      setGambar([]);
      const image = Array.from(e.target.files);

      image.reverse().forEach((file, i) => {
        if (file.type.match("image.*")) {
          setGambar((item) => [...item, file]);
        } else {
          Swal.fire({
            title: `Gambar ke ${i + 1} bukan tipe image*`,
            text: "Mohon untuk mengisi file dengan gambar",
            icon: "error",
            showConfirmButton: false,
            timer: 3000,
          });
          setGambar([]);
          e.target.value = null;
        }
      });
    },
    [gambar]
  );

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

      // //upload node js
      // gambar.forEach((image) => {
      //   formdata.append("gambar", image);
      // });

      //upload laravel
      gambar.forEach((image) => {
        formdata.append("gambar[]", image);
      });

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

      <Modal show={show} size="lg" onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengeluaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="card">
            <Carousel
              value={gambarAwal}
              numVisible={1}
              numScroll={1}
              orientation="vertical"
              className="custom-carousel"
              verticalViewPortHeight="450px"
              itemTemplate={productTemplate}
            />
          </div>
          <form onSubmit={upload}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Gambar</label>
              <input
                type="file"
                className="form-control form-control-lg"
                onChange={fileChange}
                multiple
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
