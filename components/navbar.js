import Link from "next/link";
import Router from "next/router";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const navbar = () => {
  const [getToken, setToken] = useState("");

  useEffect(() => {
    setToken(Cookies.get("token"));
  });

  const logout = () => {
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    Swal.fire({
      title: "Apakah anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Keluar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/logout`)
          .then(() => {
            Cookies.remove("token");
            Router.push("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark fixed-top border-0 shadow-sm">
        <div className="container">
          <Link href="/" legacyBehavior>
            <a className="navbar-brand">Demo Produk Next JS</a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              {getToken && (
                <li className="nav-item">
                  <a
                    style={{ cursor: "pointer" }}
                    className="nav-link active"
                    aria-current="page"
                    onClick={() => logout()}
                  >
                    Logout
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default navbar;
