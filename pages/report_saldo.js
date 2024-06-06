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
import { useCallback, useState } from "react";
import ModalGambar from "../pages/modal_gambar.js";
import { Spinner } from "react-bootstrap";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  const userAgent = ctx.req.headers["user-agent"];
  const tesView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/report_saldo`
    );
    const data = await response.data.data;

    return {
      props: {
        data_kas: data,
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

const report_saldo = ({ data_kas, tesView }) => {
  const [allData, setAllData] = useState(data_kas);
  const [cari, setCari] = useState("");
  const [tanggal1, setTanggal1] = useState(new Date());
  const [tanggal2, setTanggal2] = useState(new Date());
  const [load, setLoad] = useState(false);

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
  const showImage = useCallback((data) => {
    return (
      <>
        <ModalGambar id_kas={data.id_kas} />
      </>
    );
  });

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
        {/* <Column footer={totalSaldo} /> */}
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
    setLoad(true);
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
        setLoad(false);
        setAllData(data);
      })
      .catch((Error) => {
        setLoad(false);
        console.log(Error.response.data);
      });
  };

  const showContent = (e) => {
    const content = e.currentTarget;
    const nextDiv = content.children[2];
    if (!nextDiv.classList.contains("show-content")) {
      nextDiv.hidden = false;
      nextDiv.classList.add("show-content");
    } else {
      nextDiv.hidden = true;
      nextDiv.classList.remove("show-content");
    }
  };

  if (tesView) {
    return (
      <Layout>
        <div
          className="container-fluid min-h-screen"
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <h3>Report Saldo </h3>
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body">
              <div className="d-lg-flex d-block justify-content-between align-items-center">
                <div className="d-flex py-1 gap-2 align-items-center">
                  <Calendar
                    value={tanggal1}
                    maxDate={new Date()}
                    onChange={(e) => setTanggal1(e.value)}
                    dateFormat="yy-mm-dd"
                    className="flex-1"
                  />
                  <Calendar
                    value={tanggal2}
                    minDate={tanggal1}
                    onChange={(e) => setTanggal2(e.value)}
                    dateFormat="yy-mm-dd"
                    className="flex-1"
                  />{" "}
                  <button
                    className=" rounded p-3 bg-slate-200 hover:bg-slate-100"
                    onClick={cari_report}
                  >
                    {load == false ? (
                      <FaSearch className="text-dark" />
                    ) : (
                      <Spinner
                        variant="dark"
                        animation="border"
                        role="status"
                        size="sm"
                        as="span"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    )}
                  </button>
                </div>
                <div className="d-flex py-1 justify-content-between gap-2">
                  <InputText
                    type="search"
                    placeholder="Cari..."
                    onChange={handleCari}
                    className="w-full"
                  />
                  <button
                    className=" rounded p-3 bg-green-400 hover:bg-green-300"
                    onClick={downloadExcel}
                  >
                    <FaFileExcel className="text-white" />
                  </button>
                </div>
              </div>
              <div className="w-full mt-3 flex flex-col gap-2">
                {newData.map((val, i) => (
                  <>
                    <div
                      key={i}
                      className="w-full bg-blue-50 rounded-md p-2 relative flex flex-col gap-1"
                      type="button"
                      onClick={(e) => showContent(e)}
                    >
                      <div className="flex justify-between items-center gap-1">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            {val.tanggal}
                          </span>
                          <p className="text-sm font-semibold m-0">
                            {val.deskripsi}
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <p className="text-md font-semibold m-0">
                            {RupiahFormat(
                              val.pemasukkan == 0
                                ? val.pengeluaran
                                : val.pemasukkan
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs m-0">
                          {val.pemasukkan == 0 ? "Pengeluaran" : "Pemasukkan"}
                        </p>
                        <p className="text-xs m-0">
                          Saldo : {RupiahFormat(val.saldo)}
                        </p>
                      </div>
                      <div
                        id={`konten_${val.id_kas}`}
                        className="position-absolute left-0 top-0 right-0 bottom-0"
                        hidden
                      >
                        <div className="d-flex w-full h-full gap-2 bg-blue-50 justify-center items-center z-10">
                          <ModalGambar id_kas={val.id_kas} />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
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
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-body">
            <div className="d-lg-flex d-block justify-content-between align-items-center">
              <div className="d-flex py-1 align-items-center">
                <div>
                  <Calendar
                    value={tanggal1}
                    style={{ width: "120px" }}
                    onChange={(e) => setTanggal1(e.value)}
                    dateFormat="yy-mm-dd"
                    maxDate={new Date()}
                  />
                  <span className="mx-2"> s/d </span>
                  <Calendar
                    value={tanggal2}
                    minDate={tanggal1}
                    style={{ width: "120px" }}
                    onChange={(e) => setTanggal2(e.value)}
                    dateFormat="yy-mm-dd"
                    className="mr-3"
                  />{" "}
                </div>
                <button
                  className=" rounded p-3 bg-slate-200 hover:bg-slate-100"
                  onClick={cari_report}
                >
                  {load == false ? (
                    <FaSearch className="text-dark" />
                  ) : (
                    <Spinner
                      variant="dark"
                      animation="border"
                      role="status"
                      size="sm"
                      as="span"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </button>
              </div>
              <div id="cari2" className="d-flex py-1 justify-content-between">
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
                style={{ width: "15%" }}
              ></Column>
              <Column
                body={Rupiahs2}
                header="Pengeluaran(Rp)"
                style={{ width: "15%" }}
              ></Column>
              <Column
                body={Rupiahs3}
                header="Saldo(Rp)"
                style={{ width: "15%" }}
              ></Column>
              <Column
                header="Bukti"
                body={showImage}
                style={{ width: "15%" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default report_saldo;
