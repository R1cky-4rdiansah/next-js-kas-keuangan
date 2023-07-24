import React from "react";
import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import Router from "next/router";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import RegisterForm from "./register";
import homeWal from "../public/malamwoi.jpg";

const login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginBtn, setLoginBtn] = useState(true);

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const loginPage = () => {
    setLoginBtn(true);
  };

  const loginRegister = () => {
    setLoginBtn(false);
  };

  const [validation, setValidation] = useState({});
  const [salahAkun, setSalahAkun] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!(username && password)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
      if (!password) {
        setValidation((item) => ({
          ...item,
          password: "Password harus terisi",
        }));
      } else {
        delete validation.password;
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
      formdata.append("username", username);
      formdata.append("password", password);

      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/login`, formdata)
        .then(async (res) => {
          const namaLogin = await res.data.data.name;
          Cookies.set("token", res.data.token);
          Cookies.set("id_user", res.data.data.id);
          Swal.fire({
            title: "Selamat Datang",
            text: `Hai, ${namaLogin}`,
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            Router.push("/");
          });
        })
        .catch((error) => {
          setSalahAkun(error.response.data.message);
          console.log(error.response.data.message);
        });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${homeWal.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>Wellcome Next js</title>
      </Head>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="row justify-content-center w-100">
          <div className="col-md-6 position-relative">
            {/* {
                        loginBtn == true ? (
                            <button style={{ position: 'absolute', right: '4%', top: '3%', zIndex: 999 }} onClick={loginRegister} className="btn btn-light">REGISTER</button> 
                        ) : (
                            <button style={{ position: 'absolute', right: '4%', top: '2%', zIndex: 999 }} onClick={loginPage} className="btn btn-light">LOGIN</button> 
                        )
                    } */}
            <div className="card border-0 rounded shadow-sm p-5">
              <div className="card-body position-relative">
                {loginBtn == true ? (
                  <>
                    <h4
                      className="fw-bold text-center"
                      style={{ marginBottom: "50px" }}
                    >
                      LOGIN
                    </h4>
                    <form onSubmit={loginHandler}>
                      <div className="row">
                        <div className="col-md-12 mb-2">
                          <div className="mb-3">
                            <input
                              autoComplete="on"
                              type="text"
                              style={{ padding: "12px 12px" }}
                              className="form-control"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Masukkan Username"
                            />
                          </div>
                          {validation.username && (
                            <div className="alert alert-danger">
                              {validation.username}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12 mb-2">
                          <div className="mb-3">
                            <input
                              autoComplete="on"
                              type={showPass ? "text" : "password"}
                              style={{ padding: "12px 12px" }}
                              className="form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Masukkan Password"
                            />
                          </div>
                          {validation.password && (
                            <div className="alert alert-danger">
                              {validation.password}
                            </div>
                          )}
                        </div>
                      </div>
                      {salahAkun && (
                        <div className="alert alert-danger">{salahAkun}</div>
                      )}
                      <div className="row">
                        <div className="col-md-12 mb-2">
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
                      <div className="row mt-4">
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-dark"
                            style={{ width: "100%" }}
                          >
                            LOGIN
                          </button>
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <RegisterForm loginPage={loginPage} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
