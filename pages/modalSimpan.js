import React from "react";
import axios from "axios";
import Router from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Cookies from "js-cookie";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const modalSimpan = () => {
  const [show, setShow] = useState(false);
  const [judul, setJudul] = useState("");
  const [gambar, setGambar] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");

  const [validation, setValidation] = useState({});

  const modal = () => {
    setShow(!show);
    setValidation({});
  };

  const fileChange = (e) => {
    const image = e.target.files[0];

    if (!image.type.match("image.*")) {
      Swal.fire({
        title: "Tipe Gambar",
        text: "Mohon untuk mengisi data dengan format gambar",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      setGambar("");
      e.target.value = "";
    }

    setGambar(image);
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!(judul && gambar && deskripsi && harga)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!judul) {
        setValidation((item) => ({ ...item, judul: "Judul harus terisi" }));
      } else {
        delete validation.judul;
      }
      if (!gambar) {
        setValidation((item) => ({ ...item, gambar: "Gambar harus terisi" }));
      } else {
        delete validation.gambar;
      }
      if (!deskripsi) {
        setValidation((item) => ({
          ...item,
          deskripsi: "Deskripsi harus terisi",
        }));
      } else {
        delete validation.deskripsi;
      }
      if (!harga) {
        setValidation((item) => ({ ...item, harga: "Harga harus terisi" }));
      } else {
        delete validation.harga;
      }
    } else {
      setValidation({});
      const formdata = new FormData();
      formdata.append("gambar", gambar);
      formdata.append("judul", judul);
      formdata.append("deskripsi", deskripsi);
      formdata.append("harga", harga);

      const tokenSimpan = Cookies.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenSimpan}`;

      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/input_kas`, formdata)
        .then(() => {})
        .catch((Error) => {
          setValidation(Error.response.data);
        });

      await Swal.fire({
        title: "Data tersimpan",
        text: "Selamat, data anda telah tersimpan",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      })
        .then(() => {
          Router.push("/input_pemasukkkan");
          setShow(false);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <div>
      <Button variant="dark" style={{ color: "white" }} onClick={modal}>
        Tambah
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={upload}>
            <div className="form-group mb-3">
              <label className="font-bold block mb-2">Gambar</label>
              <input
                type="file"
                className="form-control form-control-lg"
                onChange={fileChange}
              />
            </div>
            {validation.gambar && (
              <div className="alert alert-danger">{validation.gambar}</div>
            )}

            <div className="form-group mb-3">
              <label className="font-bold block mb-2">Judul</label>
              {/* <input className="form-control" type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan Judul" /> */}
              <InputText
                style={{ width: "100%" }}
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Masukkan Judul"
              />
            </div>
            {validation.judul && (
              <div className="alert alert-danger">{validation.judul}</div>
            )}
            <div className="form-group mb-3">
              <label className="font-bold block mb-2">Harga</label>
              {/* <input className="form-control" type="number" value={harga} onChange={(e) => setHarga(e.target.value)} placeholder="Masukkan Harga" /> */}
              <InputNumber
                style={{ width: "100%" }}
                value={harga}
                onChange={(e) => setHarga(e.value)}
                placeholder="Masukkan Harga"
              />
            </div>
            {validation.harga && (
              <div className="alert alert-danger">{validation.harga}</div>
            )}

            <div className="form-group mb-3">
              <label className="font-bold block mb-2">Deskripsi</label>
              {/* <textarea className="form-control" rows={6} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Masukkan Deskripsi" /> */}
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
                Simpan
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default modalSimpan;
