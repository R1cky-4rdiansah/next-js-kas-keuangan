import axios from "axios";
import Layout from "../components/layout";
import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import Cookies from "js-cookie";
import { FaExclamationTriangle } from "react-icons/fa";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  const id_user = ctx.req.cookies.id_user;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/getUser/${id_user}`
    );
    const level = await response.data.data.level;

    return {
      props: {
        level,
      },
    };
  }

  if (!token) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  }
}

const input_pemasukkan = ({ level }) => {
  const [tanggal, setTanggal] = useState(new Date());
  const [gambar, setGambar] = useState([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [pemasukkan, setPemasukkan] = useState(0);

  const [validation, setValidation] = useState({});

  const fileChange = (e) => {
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
  };

  //Format Tanggal
  const tgl_format = useCallback((value) => {
    const datetgl1 = ("0" + value.getDate()).slice(-2);
    const monthtgl1 = ("0" + (value.getMonth() + 1)).slice(-2);
    const yeartgl1 = value.getFullYear();

    return yeartgl1 + "-" + monthtgl1 + "-" + datetgl1;
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!(tanggal && deskripsi && pemasukkan) || gambar.length == 0) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!tanggal) {
        setValidation((item) => ({ ...item, tanggal: "Tanggal harus terisi" }));
      } else {
        delete validation.tanggal;
      }
      if (gambar.length == 0) {
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
      if (!pemasukkan) {
        setValidation((item) => ({
          ...item,
          pemasukkan: "Pemasukkan harus terisi",
        }));
      } else {
        delete validation.pemasukkan;
      }
    } else {
      setValidation({});
      const formdata = new FormData();

      const tgl = tgl_format(tanggal);

      const port = process.env.NEXT_PUBLIC_API_BACKEND;
      const getPort = port.split(":");

      if (getPort[2] == "5000") {
        //upload node js
        gambar.forEach((image) => {
          formdata.append("gambar", image);
        });
      } else if (getPort[2] == "9000") {
        //upload laravel
        gambar.forEach((image) => {
          formdata.append("gambar[]", image);
        });
      }
      formdata.append("tanggal", tgl);
      formdata.append("deskripsi", deskripsi);
      formdata.append("pemasukkan", pemasukkan);

      const token = Cookies.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/input_kas`, formdata)
        .then(() => {
          Swal.fire({
            title: "Data tersimpan",
            text: "Selamat, data anda telah terinput",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            setGambar([]);
            setDeskripsi("");
            setPemasukkan(0);
            setTanggal(new Date());
            const fileImage = document.getElementById("file-image");
            fileImage.value = null;
          });
        })
        .catch((Error) => {
          setValidation(Error.response.data);
          console.log(Error.message);
        });
    }
  };

  return (
    <Layout>
      {level == "admin" ? (
        <>
          <div
            className="container"
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
            <div className="row" style={{ width: "70%" }}>
              <div className="col-md-12">
                <h3>Input Pemasukkan Kas </h3>
                <div className="card border-0 rounded shadow-sm">
                  <div className="card-body">
                    <form onSubmit={upload}>
                      <div className="form-group mb-3">
                        <label className="font-bold block mb-2">Gambar</label>
                        <input
                          type="file"
                          className="form-control form-control-lg"
                          onChange={fileChange}
                          multiple
                          id="file-image"
                        />
                      </div>
                      {validation.gambar && (
                        <div className="alert alert-danger">
                          {validation.gambar}
                        </div>
                      )}

                      <div className="form-group mb-3 row">
                        <div className="col-4">
                          <label className="font-bold block mb-2">
                            Tanggal
                          </label>
                          <Calendar
                            value={tanggal}
                            style={{ width: "100%" }}
                            onChange={(e) => setTanggal(e.value)}
                            maxDate={new Date()}
                            dateFormat="dd-mm-yy"
                          />
                        </div>
                        <div className="col-8">
                          <label className="font-bold block mb-2">
                            Pemasukkan
                          </label>
                          <InputNumber
                            style={{ width: "100%" }}
                            value={pemasukkan}
                            onChange={(e) => setPemasukkan(e.value)}
                            placeholder="Masukkan Pemasukkan"
                          />
                        </div>
                        <div className="col-12 mt-3">
                          {validation.pemasukkan && (
                            <div className="alert alert-danger">
                              {validation.pemasukkan}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <label className="font-bold block mb-2">
                          Deskripsi
                        </label>
                        <InputTextarea
                          rows={6}
                          style={{ width: "100%" }}
                          placeholder="Masukkan Deskripsi"
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                        />
                      </div>
                      {validation.deskripsi && (
                        <div className="alert alert-danger">
                          {validation.deskripsi}
                        </div>
                      )}

                      <div className=" d-flex justify-content-end">
                        <button
                          className="btn btn-dark border-0 shadow-sm"
                          type="submit"
                        >
                          Simpan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/** Page Blocking */}
          <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="row" style={{ width: "70%" }}>
              <div className="col-md-12">
                <div className="card bg-dark rounded shadow-sm p-2">
                  <div className="card-body rounded text-center p-5 text-white">
                    <center>
                      <FaExclamationTriangle
                        fontSize={120}
                        className=" text-danger mb-3"
                      />
                    </center>
                    <h2>
                      Mohon Maaf, Anda tidak diijinkan untuk mengakses halaman
                      ini!
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default input_pemasukkan;
