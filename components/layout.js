import Link from "next/link.js";
import {
  FaFolderMinus,
  FaFolderOpen,
  FaFolderPlus,
  FaHome,
  FaKey,
  FaMinus,
  FaPlus,
  FaPowerOff,
  FaUser,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import Router from "next/router.js";
import Head from "next/head.js";
import { usePathname } from "next/navigation";

const layout = ({ children }) => {
  const pathname = usePathname();

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
            Cookies.remove("id_user");
            Router.push("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <div className=" w-full h-full flex flex-col bg-slate-200">
      <Head>
        <title>Project Next JS</title>
      </Head>
      <header className="bg-slate-950 top-0 h-14 flex justify-center items-center font-semibold uppercase text-white">
        Project Next JS
      </header>
      <div className="flex flex-row">
        <aside
          className="bg-slate-50 w-20 lg:w-60"
          style={{
            zIndex: "10",
            marginTop: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <nav style={{ padding: "8px", position: "relative" }}>
            <div
              className="bg-salte-200"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "200px",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
              }}
            >
              <FaUser
                className=" text-slate-700"
                style={{ fontSize: "100px" }}
              />
            </div>
            <ul className="m-0 px-0 py-2">
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/" legacyBehavior>
                  <a
                    className={
                      pathname != "/"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaHome
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Home
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <span
                  className=" d-flex text-slate-500 align-items-center"
                  style={{ fontSize: "12px" }}
                >
                  Input{" "}
                </span>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/input_pemasukkan" legacyBehavior>
                  <a
                    className={
                      pathname != "/input_pemasukkan"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaPlus
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Pemasukkan
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/input_pengeluaran" legacyBehavior>
                  <a
                    className={
                      pathname != "/input_pengeluaran"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaMinus
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Pengeluaran
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <span
                  className=" d-flex text-slate-500 align-items-center"
                  style={{ fontSize: "12px" }}
                >
                  Report{" "}
                </span>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/report_saldo" legacyBehavior>
                  <a
                    className={
                      pathname != "/report_saldo"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaFolderOpen
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Saldo
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/report_pemasukkan" legacyBehavior>
                  <a
                    className={
                      pathname != "/report_pemasukkan"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaFolderPlus
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Pemasukkan
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/report_pengeluaran" legacyBehavior>
                  <a
                    className={
                      pathname != "/report_pengeluaran"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaFolderMinus
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Pengeluaran
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <span
                  className=" d-flex text-slate-500 align-items-center"
                  style={{ fontSize: "12px" }}
                >
                  Konfigurasi{" "}
                </span>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/konfig_users" legacyBehavior>
                  <a
                    className={
                      pathname != "/konfig_users"
                        ? `flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700`
                        : "flex align-items-center p-2 rounded hover:bg-slate-200 cursor-pointer no-underline text-slate-700 bg-slate-200"
                    }
                  >
                    <FaUser
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      User
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <Link href="/ganti_password" legacyBehavior>
                  <a className="flex align-items-center p-2 rounded cursor-pointer no-underline text-slate-700 bg-warning">
                    <FaKey
                      className="text-slate-700 mr-2"
                      style={{ fontSize: "12px" }}
                    />
                    <span
                      className=" text-slate-700"
                      style={{ fontSize: "16px" }}
                    >
                      Ganti Password
                    </span>
                  </a>
                </Link>
              </li>
              <li
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "6px",
                }}
              >
                <a
                  className={`flex align-items-center p-2 rounded bg-red-700 cursor-pointer no-underline text-white`}
                  onClick={() => logout()}
                >
                  <FaPowerOff
                    className=" text-white mr-2"
                    style={{ fontSize: "12px" }}
                  />
                  <span
                    className=" text-slate-100"
                    style={{ fontSize: "16px" }}
                  >
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default layout;
