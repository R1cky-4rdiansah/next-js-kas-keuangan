import Layout from "../components/layout";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { FaFileExcel, FaSearch, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import Modal_edit_pengeluaran from "./modal_edit_pengeluaran";
import Swal from "sweetalert2";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { read, utils, writeFileXLSX } from "xlsx";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  const id_user = ctx.req.cookies.id_user;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_pengeluaran`
    );
    const response_level = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/getUser/${id_user}`
    );
    const data = await response.data.data;
    const level = await response_level.data.data.level;
    return {
      props: {
        data_kas: data,
        level,
      },
    };
  }

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        level,
      },
    };
  }
}

const report_pengeluaran = ({ data_kas, level }) => {
  const [allData, setAllData] = useState(data_kas);
  const [cari, setCari] = useState("");
  const [tanggal1, setTanggal1] = useState(new Date());
  const [tanggal2, setTanggal2] = useState(new Date());

  const handleCari = useCallback(
    (e) => {
      setCari(e.target.value);
    },
    [cari]
  );
  const cariData = useCallback((array) => {
    return array.filter(
      (el) =>
        el.tanggal.toLowerCase().includes(cari) ||
        el.pemasukkan.toString().toLowerCase().includes(cari) ||
        el.pengeluaran.toString().toLowerCase().includes(cari) ||
        el.saldo.toString().toLowerCase().includes(cari) ||
        el.deskripsi.toLowerCase().includes(cari)
    );
  }, []);
  const newData = cariData(allData);

  //Export Data
  const downloadExcel = () => {
    const data_exel = allData;

    for (let i = 0; i < data_exel.length; i++) {
      data_exel[i] = { nomor: i + 1, ...data_exel[i] };
      delete data_exel[i].id_kas;
      delete data_exel[i].saldo;
      delete data_exel[i].pemasukkan;
      delete data_exel[i].created_at;
      delete data_exel[i].updated_at;
    }

    const ws = utils.json_to_sheet(data_exel);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    /* export to XLSX */
    writeFileXLSX(wb, "data_pengeluaran.xlsx");
  };

  //gambar
  const showImage = useCallback((data) => {
    return (
      <div>
        <a
          href={`${process.env.NEXT_PUBLIC_API_BACKEND}/bukti_kas/${data.gambar}`}
          target="_blank"
        >
          <img
            src={`${process.env.NEXT_PUBLIC_API_BACKEND}/bukti_kas/${data.gambar}`}
            width="150"
            className="rounded-3"
          />
        </a>
      </div>
    );
  }, []);

  //Edit
  const showEdit = useCallback((data) => {
    return (
      <div className="d-flex justify-content-around align-items-center">
        <Modal_edit_pengeluaran setAllData={setAllData} item={data} />
        <button
          className="btn btn-sm btn-danger border-0 shadow-sm"
          onClick={() => hapusProduk(data.id_kas)}
        >
          <FaTrash />
        </button>
      </div>
    );
  }, []);

  //Total Pengeluaran
  const totalPengeluaran = useCallback(() => {
    const total_pengeluaran = allData.reduce((i, n) => {
      return i + n.pengeluaran;
    }, 0);

    return RupiahFormat(total_pengeluaran);
  }, []);

  //footerFormat
  const footerVal = (
    <ColumnGroup>
      <Row>
        <Column colSpan={3} footer="Total" />
        <Column colSpan={3} footer={totalPengeluaran} />
      </Row>
    </ColumnGroup>
  );

  //Rupiahs format
  const RupiahFormat = useCallback((value) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }, []);

  const Rupiahs2 = useCallback((newData) => {
    return RupiahFormat(newData.pengeluaran);
  }, []);

  const tgl_format = useCallback((value) => {
    const datetgl1 = ("0" + value.getDate()).slice(-2);
    const monthtgl1 = ("0" + (value.getMonth() + 1)).slice(-2);
    const yeartgl1 = value.getFullYear();

    return yeartgl1 + "-" + monthtgl1 + "-" + datetgl1;
  }, []);

  //Cari Report
  const cari_report = async () => {
    const tgl1 = tgl_format(tanggal1);
    const tgl2 = tgl_format(tanggal2);

    const formdata = new FormData();
    formdata.append("tanggal1", tgl1);
    formdata.append("tanggal2", tgl2);

    const token = Cookies.get("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_pengeluaran`,
        formdata
      )
      .then((res) => {
        const data = res.data.data;
        setAllData(data);
      })
      .catch((Error) => {
        console.log(Error.response.data);
      });
  };

  //Hapus Produk
  const hapusProduk = async (idProduk) => {
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
          .post(
            `${process.env.NEXT_PUBLIC_API_BACKEND}/api/hapus_kas/${idProduk}`
          )
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
                .post(
                  `${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_pengeluaran`
                )
                .then((res) => {
                  const data = res.data.data;
                  setAllData(data);
                })
                .catch((Error) => {
                  console.log(Error.response.data);
                });
            });
          });
      }
    });
  };

  return (
    <Layout>
      <div
        className="container"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div className="row" style={{ width: "100%" }}>
          <div className="col-md-12 mb-3">
            <h3>Report Pengeluaran Kas </h3>
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex justify-content-between align-items-center">
                    <Calendar
                      value={tanggal1}
                      style={{ width: "100%" }}
                      onChange={(e) => setTanggal1(e.value)}
                      dateFormat="yy-mm-dd"
                    />
                    <span className="mx-2"> s/d </span>
                    <Calendar
                      value={tanggal2}
                      minDate={tanggal1}
                      style={{ width: "100%" }}
                      onChange={(e) => setTanggal2(e.value)}
                      dateFormat="yy-mm-dd"
                      className="mr-3"
                    />
                    <button
                      className=" rounded p-3 bg-slate-200 hover:bg-slate-100"
                      onClick={cari_report}
                    >
                      <FaSearch className="text-dark" />
                    </button>
                  </div>
                  <div className="d-flex">
                    <button
                      className=" rounded p-3 bg-green-400 hover:bg-green-300 mr-3"
                      onClick={downloadExcel}
                    >
                      <FaFileExcel className="text-white" />
                    </button>
                    <InputText
                      type="search"
                      placeholder="Cari..."
                      onChange={handleCari}
                    />
                  </div>
                </div>
                <DataTable
                  className=" mt-3"
                  value={newData}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                  let-i="rowIndex"
                  footerColumnGroup={footerVal}
                >
                  <Column
                    header="No"
                    style={{ width: "10%" }}
                    body={(data, options) => options.rowIndex + 1}
                  ></Column>
                  <Column
                    field="tanggal"
                    header="Tanggal"
                    style={{ width: "15%" }}
                  ></Column>
                  <Column
                    field="deskripsi"
                    header="Deskripsi"
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    body={Rupiahs2}
                    header="Pengeluaran(Rp)"
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    header="Bukti"
                    body={showImage}
                    style={{ width: "20%" }}
                  ></Column>
                  {level == "admin" && (
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

export default report_pengeluaran;
