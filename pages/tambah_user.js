import { Modal } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FaPlus } from "react-icons/fa";
import { InputText } from "primereact/inputtext";

const tambah_users = ({ setAllData }) => {
  const [show, setShow] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");

  const modal = () => {
    setShow(!show);
  };

  const [validation, setValidation] = useState({});

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!(nama && username && email && password && password_confirm && level)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!nama) {
        setValidation((item) => ({ ...item, nama: "Nama harus terisi" }));
      } else {
        delete validation.nama;
      }
      if (!email) {
        setValidation((item) => ({ ...item, email: "Email harus terisi" }));
      } else {
        delete validation.email;
      }
      if (!username) {
        setValidation((item) => ({
          ...item,
          username: "Username harus terisi",
        }));
      } else {
        delete validation.username;
      }
      if (!password) {
        setValidation((item) => ({
          ...item,
          password: "Password harus terisi",
        }));
      } else {
        delete validation.password;
      }
      if (!password_confirm) {
        setValidation((item) => ({
          ...item,
          password_confirm: "Konfirmasi password harus terisi",
        }));
      } else {
        delete validation.password_confirm;
      }
      if (password != password_confirm) {
        setValidation((item) => ({
          ...item,
          error: "Password dan Konfirmasi Password tidak sesuai",
        }));
      } else {
        delete validation.error;
      }
      if (!level) {
        setValidation((item) => ({
          ...item,
          level: "Level harus dipilih",
        }));
      } else {
        delete validation.level;
      }
    } else {
      setValidation({});
      if (password != password_confirm) {
        setValidation((item) => ({
          ...item,
          error: "Password dan Konfirmasi Password tidak sesuai",
        }));
      } else {
        delete validation.error;
        const formdata = new FormData();
        formdata.append("name", nama);
        formdata.append("email", email);
        formdata.append("username", username);
        formdata.append("password", password);
        formdata.append("level", level);
        formdata.append("password_confirmation", password_confirm);

        const tokenSimpan = Cookies.get("token");
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokenSimpan}`;

        await axios
          .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/register`, formdata)
          .then(() => {
            Swal.fire({
              title: "Data tersimpan",
              text: "Selamat, data anda telah tersimpan",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            })
              .then(async () => {
                const token = Cookies.get("token");
                axios.defaults.headers.common[
                  "Authorization"
                ] = `Bearer ${token}`;
                const response = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_BACKEND}/api/users`
                );
                const data = await response.data.data;
                setAllData(data);
                setShow(false);
              })
              .catch((error) => {
                alert(error);
              });
          })
          .catch((Error) => {
            setValidation(Error.response.data);
          });
      }
    }
  };

  return (
    <div>
      <button
        className=" rounded p-3 bg-slate-200 hover:bg-slate-100 text-dark d-flex align-items-center"
        onClick={modal}
      >
        Tambah <FaPlus className="text-dark ml-3" />
      </button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={upload}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Nama</label>
              <InputText
                style={{ width: "100%" }}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama"
              />
            </div>
            {validation.nama && (
              <div className="alert alert-danger">{validation.nama}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Username</label>
              <InputText
                style={{ width: "100%" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Username"
              />
            </div>
            {validation.username && (
              <div className="alert alert-danger">{validation.username}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Email</label>
              <InputText
                type="email"
                style={{ width: "100%" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email"
              />
            </div>
            {validation.email && (
              <div className="alert alert-danger">{validation.email}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Password</label>
              <InputText
                type={showPass ? "text" : "password"}
                style={{ width: "100%" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
              />
            </div>
            {validation.password && (
              <div className="alert alert-danger">{validation.password}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Konfirmasi Password</label>
              <InputText
                type={showPass ? "text" : "password"}
                style={{ width: "100%" }}
                value={password_confirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Masukkan Konfirmasi Password"
              />
            </div>
            {validation.password_confirm && (
              <div className="alert alert-danger">
                {validation.password_confirm}
              </div>
            )}
            {validation.error && (
              <div className="alert alert-danger">{validation.error}</div>
            )}

            <div className="form-group mb-3">
              <label className="form-label fw-bold">Level</label>
              <select
                className="form-select form-select-lg"
                aria-label="Default select example"
                defaultValue={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="" disabled>
                  Pilih Level
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            {validation.level && (
              <div className="alert alert-danger">{validation.level}</div>
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
                  <label className="form-check-label">Tampilkan Password</label>
                </div>
              </div>
            </div>

            <div className=" d-flex justify-content-end">
              <button className="btn btn-dark border-0 shadow-sm" type="submit">
                Save
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default tambah_users;
