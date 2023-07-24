import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { FaPen } from "react-icons/fa";
import { InputText } from "primereact/inputtext";
import { useCallback } from "react";

const modal_user = ({ item, setAllData }) => {
  const [show, setShow] = useState(false);

  const [nama, setNama] = useState(item.nama);
  const [username, setUsername] = useState(item.username);
  const [email, setEmail] = useState(item.email);
  const [level, setLevel] = useState(item.level);

  const modal = useCallback(() => {
    setShow(!show);
    setUsername(item.username);
    setEmail(item.email);
    setNama(item.name);
    setLevel(item.level);
  }, [show, username, email, nama, level]);

  const [validation, setValidation] = useState({});

  const upload = async (e) => {
    e.preventDefault();

    if (!(nama && username && email && level)) {
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
    } else {
      setValidation({});
      const formdata = new FormData();
      formdata.append("nama", nama);
      formdata.append("username", username);
      formdata.append("email", email);
      formdata.append("level", level);

      const tokenSimpan = Cookies.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenSimpan}`;

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/update_users/${item.id}`,
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
                .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/users`)
                .then((res) => {
                  setShow(false);
                  const data = res.data.data;
                  setAllData(data);
                });
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((Error) => {
          setValidation(Error.response.data);
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
          <Modal.Title>Update User</Modal.Title>
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

export default modal_user;
