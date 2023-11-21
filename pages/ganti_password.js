import axios from "axios";
import Layout from "../components/layout";
import { useState } from "react";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import Cookies from "js-cookie";
import { useEffect } from "react";

const ganti_password = () => {

  const [new_password, setNewPassword] = useState("");
  const [id_user, setIdUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const getIdUser = Cookies.get("id_user");

  const showPassword = () => {
    setShowPass(!showPass);
  };

  useEffect(() => {
    setIdUser(getIdUser);
  }, []);

  const [validation, setValidation] = useState({});

  const upload = async (e) => {
    e.preventDefault();
    if (!(new_password && password)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!new_password) {
        setValidation((item) => ({
          ...item,
          new_password: "Password baru harus terisi",
        }));
      } else {
        delete validation.new_password;
      }
      if (!password) {
        setValidation((item) => ({
          ...item,
          password: "Password harus terisi",
        }));
      } else {
        delete validation.password;
      }
    } else {
      setValidation({});
      const formdata = new FormData();
      formdata.append("id_user", id_user);
      formdata.append("password", password);
      formdata.append("new_password", new_password);

      const token = Cookies.get("token");

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/ganti_password`,
          formdata
        )
        .then(() => {
          Swal.fire({
            title: "Data tersimpan",
            text: "Selamat, password anda telah terupdate",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            setNewPassword('');
            setPassword('')
          });
        })
        .catch((Error) => {
          Swal.fire({
            title: "Gagal",
            text: `Mohon Maaf, ${Error.response.data.message}`,
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
          })
        });
    }
  };

  return (
    <Layout>
      <div
        className="container-fluid"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div className="row">
          <div className=" col-lg-8 col-12">
            <h3> Reset Password </h3>
            <div className="card border-0 rounded shadow-sm">
              <div className="card-body">
                <form onSubmit={upload}>
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Password Lama</label>
                    <InputText
                      type={showPass ? "text" : "password"}
                      style={{ width: "100%" }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan Password Lama"
                    />
                  </div>
                  {validation.password && (
                    <div className="alert alert-danger">
                      {validation.password}
                    </div>
                  )}
                  <div className="form-group mb-3">
                    <label className="form-label fw-bold">Password Baru</label>
                    <InputText
                      type={showPass ? "text" : "password"}
                      style={{ width: "100%" }}
                      value={new_password}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan Password Baru"
                    />
                  </div>
                  {validation.new_password && (
                    <div className="alert alert-danger">
                      {validation.new_password}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-12 mb-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onClick={() => showPassword()}
                          id="flexCheckDefault"
                        />
                        <label className="form-check-label">
                          Tampilkan Password
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className=" d-flex justify-content-end">
                    <button
                      className="btn btn-dark border-0 shadow-sm"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ganti_password;
