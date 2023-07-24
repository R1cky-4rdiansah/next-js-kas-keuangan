import axios from "axios";
import Layout from "../components/layout";
import Router from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";

const simpan = () => {
  const [judul, setJudul] = useState("");
  const [gambar, setGambar] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");

  const [validation, setValidation] = useState({});

  const fileChange = (e) => {
    const image = e.target.files[0];

    if (!image.type.match("image.*")) {
      setGambar("salah");
    }

    setGambar(image);
  };

  const upload = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("gambar", gambar);
    formdata.append("judul", judul);
    formdata.append("deskripsi", deskripsi);
    formdata.append("harga", harga);

    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/simpan`, formdata)
      .then(() => {
        Swal.fire({
          title: "Data tersimpan",
          text: "Selamat, data anda telah tersimpan",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          Router.push("/");
        });
      })
      .catch((Error) => {
        setValidation(Error.response.data);
      });
  };

  return (
    <Layout>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="row" style={{ width: "80%" }}>
          <div className="col-md-12">
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">
                <form onSubmit={upload}>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Gambar</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={fileChange}
                    />
                  </div>
                  {validation.gambar && (
                    <div className="alert alert-danger">
                      {validation.gambar}
                    </div>
                  )}

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
                      rows={6}
                      value={deskripsi}
                      onChange={(e) => setDeskripsi(e.target.value)}
                      placeholder="Masukkan Deskripsi"
                    />
                  </div>
                  {validation.deskripsi && (
                    <div className="alert alert-danger">
                      {validation.deskripsi}
                    </div>
                  )}

                  <button
                    className="btn btn-dark border-0 shadow-sm"
                    type="submit"
                  >
                    Simpan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default simpan;
