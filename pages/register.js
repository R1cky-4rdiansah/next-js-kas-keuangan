import React from "react";
import { useState } from "react";
import axios from "axios";
import Router from "next/router";
import Swal from "sweetalert2";

const register = ({ loginPage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirm, setPasswordConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const [validation, setValidation] = useState({});

  const registerHandler = async (e) => {
    e.preventDefault();
    if (!(name && email && password && password_confirm)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!name) {
        setValidation((item) => ({ ...item, name: "Nama harus terisi" }));
      } else {
        delete validation.name;
      }
      if (!email) {
        setValidation((item) => ({ ...item, email: "Email harus terisi" }));
      } else {
        delete validation.email;
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
    } else {
      if (password != password_confirm) {
        setValidation((item) => ({
          ...item,
          error: "Password dan Konfirmasi Password tidak sesuai",
        }));
      } else {
        delete validation.error;
        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("password_confirmation", password_confirm);

        await axios
          .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/register`, formdata)
          .then(() => {
            Swal.fire({
              title: "Data tersimpan",
              text: "Selamat, anda telah berhasil register",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              Router.push("/login");
              loginPage();
            });
          })
          .catch((error) => {
            setValidation(error.response.data);
          });
      }
    }
  };

  return (
    <>
      <h4 className="fw-bold text-center" style={{ marginBottom: "50px" }}>
        REGISTER
      </h4>
      <form onSubmit={registerHandler}>
        <div className="row">
          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <input
                type="text"
                style={{ padding: "12px 12px" }}
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan Nama Lengkap"
              />
            </div>
            {validation.name && (
              <div className="alert alert-danger">{validation.name}</div>
            )}
          </div>
          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <input
                type="email"
                style={{ padding: "12px 12px" }}
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Alamat Email"
              />
            </div>
            {validation.email && (
              <div className="alert alert-danger">{validation.email}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <input
                type={showPass ? "text" : "password"}
                style={{ padding: "12px 12px" }}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Password"
              />
            </div>
            {validation.password && (
              <div className="alert alert-danger">{validation.password}</div>
            )}
          </div>
          <div className="col-md-12 mb-2">
            <div className="mb-3">
              <input
                type={showPass ? "text" : "password"}
                style={{ padding: "12px 12px" }}
                className="form-control"
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
          </div>
          {validation.error && (
            <div className="alert alert-danger">{validation.error}</div>
          )}
        </div>
        <div className="row">
          <div className="col-md-12 mb-2">
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
        <center>
          <button
            type="submit"
            className="btn btn-dark mt-4"
            style={{ width: "100%" }}
          >
            REGISTER
          </button>
        </center>
      </form>
    </>
  );
};

export default register;
