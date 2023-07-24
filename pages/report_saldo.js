import Layout from "../components/layout";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { FaFileExcel, FaSearch, FaTrash } from "react-icons/fa";
import Cookies from "js-cookie";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { read, utils, writeFileXLSX } from "xlsx";
import { useState } from "react";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_saldo`
    );
    const data = await response.data.data;

    return {
      props: {
        data_kas: data,
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

const report_saldo = ({ data_kas }) => {
  const [allData, setAllData] = useState(data_kas);
  const [cari, setCari] = useState("");
  const [tanggal1, setTanggal1] = useState(new Date());
  const [tanggal2, setTanggal2] = useState(new Date());

  //Export Data
  const downloadExcel = () => {
    const data_exel = allData;

    for (let i = 0; i < data_exel.length; i++) {
      data_exel[i] = { nomor: i + 1, ...data_exel[i] };
      delete data_exel[i].id_kas;
      delete data_exel[i].gambar;
      delete data_exel[i].created_at;
      delete data_exel[i].updated_at;
    }

    const ws = utils.json_to_sheet(data_exel);
    /* create workbook and append worksheet */
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    /* export to XLSX */
    writeFileXLSX(wb, "data_saldo.xlsx");
  };

  //Cari data
  const handleCari = (e) => {
    setCari(e.target.value);
  };
  const cariData = (array) => {
    return array.filter(
      (el) =>
        el.tanggal.toLowerCase().includes(cari) ||
        el.pemasukkan.toString().toLowerCase().includes(cari) ||
        el.pengeluaran.toString().toLowerCase().includes(cari) ||
        el.saldo.toString().toLowerCase().includes(cari) ||
        el.deskripsi.toLowerCase().includes(cari)
    );
  };
  const newData = cariData(allData);

  //gambar
  const showImage = (data) => {
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
  };

  //Total Pemasukkan
  const totalPemasukkan = () => {
    const total_pemasukkan = data_kas.reduce((i, n) => {
      return i + n.pemasukkan;
    }, 0);

    return RupiahFormat(total_pemasukkan);
  };

  //Total pengeluaran
  const totalPengeluaran = () => {
    const total_pengeluaran = data_kas.reduce((i, n) => {
      return i + n.pengeluaran;
    }, 0);

    return RupiahFormat(total_pengeluaran);
  };

  //Total saldo
  const totalSaldo = () => {
    const total_saldo = data_kas.reduce((i, n) => {
      return i + n.saldo;
    }, 0);

    return RupiahFormat(total_saldo);
  };

  //footerFormat
  const footerVal = (
    <ColumnGroup>
      <Row>
        <Column colSpan={3} footer="Total" />
        <Column footer={totalPemasukkan} />
        <Column footer={totalPengeluaran} />
        <Column footer={totalSaldo} />
        <Column />
      </Row>
    </ColumnGroup>
  );

  //Rupiahs format
  const RupiahFormat = (value) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  };

  const Rupiahs1 = (data_kas) => {
    return RupiahFormat(data_kas.pemasukkan);
  };

  const Rupiahs2 = (data_kas) => {
    return RupiahFormat(data_kas.pengeluaran);
  };

  const Rupiahs3 = (data_kas) => {
    return RupiahFormat(data_kas.saldo);
  };

  const tgl_format = (value) => {
    const datetgl1 = ("0" + value.getDate()).slice(-2);
    const monthtgl1 = ("0" + (value.getMonth() + 1)).slice(-2);
    const yeartgl1 = value.getFullYear();

    return yeartgl1 + "-" + monthtgl1 + "-" + datetgl1;
  };

  const cari_report = async () => {
    const tgl1 = tgl_format(tanggal1);
    const tgl2 = tgl_format(tanggal2);

    const formdata = new FormData();
    formdata.append("tanggal1", tgl1);
    formdata.append("tanggal2", tgl2);

    const token = Cookies.get("token");

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_saldo`, formdata)
      .then((res) => {
        const data = res.data.data;
        setAllData(data);
      })
      .catch((Error) => {
        console.log(Error.response.data);
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
            <h3>Report Saldo Kas </h3>
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex justify-content-between align-items-center">
                    <Calendar
                      value={tanggal1}
                      style={{ width: "100%" }}
                      onChange={(e) => setTanggal1(e.value)}
                      dateFormat="yy-mm-dd"
                      maxDate={new Date()}
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
                    body={Rupiahs1}
                    header="Pemasukkan(Rp)"
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    body={Rupiahs2}
                    header="Pengeluaran(Rp)"
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    body={Rupiahs3}
                    header="Saldo(Rp)"
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    header="Bukti"
                    body={showImage}
                    style={{ width: "25%" }}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default report_saldo;
