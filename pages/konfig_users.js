import Layout from "../components/layout";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FaPen, FaTrash, FaUser } from "react-icons/fa";
import Cookies from "js-cookie";
import { useState } from "react";
import Swal from "sweetalert2";
import Tambah_users from "./tambah_user";
import Modal_user from "./modal_user";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  const id_user = ctx.req.cookies.id_user;
  const userAgent = ctx.req.headers["user-agent"];
  const tesView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/users`
    );
    const response_level = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/getUser/${id_user}`
    );
    const level = await response_level.data.data.level;
    const nama = await response_level.data.data.name;
    const username = await response_level.data.data.username;
    const email = await response_level.data.data.email;
    const data = await response.data.data;
    return {
      props: {
        data_users: data,
        level,
        nama,
        username,
        email,
        id_user,
        tesView,
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

const konfig_users = ({
  data_users,
  level,
  nama,
  username,
  email,
  id_user,
  tesView,
}) => {
  const [allData, setAllData] = useState(data_users);
  const [cari, setCari] = useState("");

  const [namaUser, setNama] = useState(nama);
  const [usernameUser, setUsername] = useState(username);
  const [emailUser, setEmail] = useState(email);
  const [levelUser, setLevelUser] = useState(level);

  const handleCari = (e) => {
    setCari(e.target.value);
  };
  const cariData = (array) => {
    return array.filter(
      (el) =>
        (el.name.toLowerCase().includes(cari) ||
          el.username.toLowerCase().includes(cari) ||
          el.email.toLowerCase().includes(cari) ||
          el.level.toLowerCase().includes(cari)) &&
        el.id != id_user
    );
  };
  const newData = cariData(allData);

  //Edit
  const showEdit = (data) => {
    return (
      <div className="d-flex justify-content-around align-items-center">
        <Modal_user item={data} setAllData={setAllData} />
        <button
          className="btn btn-sm btn-danger border-0 shadow-sm"
          onClick={() => hapusUser(data.id)}
        >
          <FaTrash />
        </button>
      </div>
    );
  };

  const showContent = (e) => {
    const content = e.currentTarget;
    const nextDiv = content.children[1];
    if (!nextDiv.classList.contains("show-content")) {
      nextDiv.hidden = false;
      nextDiv.classList.add("show-content");
    } else {
      nextDiv.hidden = true;
      nextDiv.classList.remove("show-content");
    }
  };

  //Update User
  const updateUser = async (e) => {
    e.preventDefault();

    if (!(namaUser && username && email && level)) {
      Swal.fire({
        title: "Data Belum Lengkap",
        text: "Mohon untuk mengisi semua data",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    } else {
      const formdata = new FormData();
      formdata.append("nama", namaUser);
      formdata.append("username", usernameUser);
      formdata.append("email", emailUser);
      formdata.append("level", levelUser);

      const tokenSimpan = Cookies.get("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${tokenSimpan}`;

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BACKEND}/api/update_users/${id_user}`,
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
                .get(
                  `${process.env.NEXT_PUBLIC_API_BACKEND}/api/getUser/${id_user}`
                )
                .then((res) => {
                  setNama(res.data.data.name);
                  setEmail(res.data.data.email);
                  setLevelUser(res.data.data.level);
                  setUsername(res.data.data.username);
                });
            })
            .catch((error) => {
              alert(error);
            });
        })
        .catch((Error) => {
          alert(Error);
        });
    }
  };

  //Hapus Data Users
  const hapusUser = async (id) => {
    const tokenHapus = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenHapus}`;

    await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Anda yakin ingin menghapus data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/delete_users/${id}`)
          .then(() => {
            Swal.fire({
              title: "Data Terhapus",
              text: "Selamat, data anda telah terhapus",
              icon: "success",
              showConfirmButton: false,
              timer: 2000,
            }).then(async () => {
              const token = Cookies.get("token");
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${token}`;
              await axios
                .get(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/users`)
                .then((res) => {
                  const data = res.data.data;
                  setAllData(data);
                });
            });
          });
      }
    });
  };

  if (tesView) {
    return (
      <Layout>
        <div
          className="container-fluid min-h-screen"
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <div className="row">
            <div className="col-12 mb-3">
              <h3>Konfigurasi Users </h3>
              <div className="card border-0 shadow-sm rounded-3 mb-3">
                <div className="card-body">
                  <form onSubmit={updateUser} className="row d-flex">
                    <div className=" col-lg-4 col-6 lg:block hidden">
                      <div className=" d-flex justify-content-center align-items-center">
                        <FaUser
                          id="user-logo"
                          className=" text-slate-700"
                          style={{
                            fontSize: "200px",
                            padding: "10px",
                            border: "2px solid #e2e8f0",
                            borderRadius: "5px",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                    <div className=" col-lg-4 col-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Nama</label>
                        <InputText
                          style={{ width: "100%" }}
                          value={namaUser}
                          onChange={(e) => setNama(e.target.value)}
                          placeholder="Masukkan nama"
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Username</label>
                        <InputText
                          style={{ width: "100%" }}
                          value={usernameUser}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Masukkan Username"
                        />
                      </div>
                    </div>
                    <div className=" col-lg-4 col-6">
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <InputText
                          style={{ width: "100%" }}
                          value={emailUser}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Masukkan Email"
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label className="form-label fw-bold">Level</label>
                        <select
                          disabled
                          className="form-select form-select-lg"
                          aria-label="Default select example"
                          defaultValue={levelUser}
                          onChange={(e) => setLevelUser(e.target.value)}
                        >
                          <option value="">Pilih Level</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-warning text-white ms-auto d-flex align-items-center"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    {level == "admin" && (
                      <Tambah_users setAllData={setAllData} />
                    )}
                    <form className="d-flex">
                      <InputText
                        type="search"
                        placeholder="Cari..."
                        onChange={handleCari}
                        style={{ width: "120px" }}
                      />
                    </form>
                  </div>
                  <div className="w-full mt-3 flex flex-col gap-2">
                    {newData.map((val, i) => (
                      <>
                        <div
                          key={i}
                          className="w-full bg-blue-50 rounded-md p-2 relative"
                        >
                          <div className="flex justify-between items-center gap-1">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold m-0">
                                {val.name}
                              </p>
                              <p className="text-gray-500 text-xs m-0">
                                {val.username}
                              </p>
                              <p className="text-gray-500 text-xs m-0">
                                {val.level}
                              </p>
                            </div>
                            <div className="d-flex flex-column gap-1 justify-between items-center">
                              <Modal_user
                                item={newData[i]}
                                setAllData={setAllData}
                              />
                              <button
                                className="btn btn-sm btn-danger border-0 shadow-sm"
                                onClick={() => hapusUser(val.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="container-fluid min-h-screen"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div className="row">
          <div className="col-12 mb-3">
            <h3>Konfigurasi Users </h3>
            <div className="card border-0 shadow-sm rounded-3 mb-3">
              <div className="card-body">
                <form onSubmit={updateUser} className="row d-flex">
                  <div className=" col-lg-4 col-6 lg:block hidden">
                    <div className=" d-flex justify-content-center align-items-center">
                      <FaUser
                        id="user-logo"
                        className=" text-slate-700"
                        style={{
                          fontSize: "200px",
                          padding: "10px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "5px",
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                  <div className=" col-lg-4 col-6">
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">Nama</label>
                      <InputText
                        style={{ width: "100%" }}
                        value={namaUser}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="Masukkan nama"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">Username</label>
                      <InputText
                        style={{ width: "100%" }}
                        value={usernameUser}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan Username"
                      />
                    </div>
                  </div>
                  <div className=" col-lg-4 col-6">
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">Email</label>
                      <InputText
                        style={{ width: "100%" }}
                        value={emailUser}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan Email"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label fw-bold">Level</label>
                      <select
                        disabled
                        className="form-select form-select-lg"
                        aria-label="Default select example"
                        defaultValue={levelUser}
                        onChange={(e) => setLevelUser(e.target.value)}
                      >
                        <option value="">Pilih Level</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-warning text-white ms-auto d-flex align-items-center"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  {level == "admin" && <Tambah_users setAllData={setAllData} />}
                  <form className="d-flex">
                    <InputText
                      type="search"
                      placeholder="Cari..."
                      onChange={handleCari}
                      style={{ width: "120px" }}
                    />
                  </form>
                </div>
                <DataTable
                  className=" mt-3"
                  value={newData}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                  let-i="rowIndex"
                >
                  <Column
                    header="No"
                    style={{ width: "10%" }}
                    body={(data, options) => options.rowIndex + 1}
                  ></Column>
                  <Column
                    field="name"
                    header="Nama"
                    style={{ width: "15%" }}
                  ></Column>
                  <Column
                    field="username"
                    header="Username"
                    style={{ width: "15%" }}
                  ></Column>
                  <Column
                    field="email"
                    header="Email"
                    style={{ width: "15%" }}
                  ></Column>
                  <Column
                    field="level"
                    header="Level"
                    style={{ width: "15%" }}
                  ></Column>
                  {levelUser == "admin" && (
                    <Column
                      header="Aksi"
                      body={showEdit}
                      style={{ width: "10%" }}
                    />
                  )}
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default konfig_users;
