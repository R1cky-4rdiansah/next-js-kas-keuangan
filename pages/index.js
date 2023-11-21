import Layout from "../components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "chart.js";
import { useCallback } from "react";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BACKEND}/api/kas`
    );
    const data = await response.data.data;
    const data_saldo = await response.data.data_saldo.saldo;
    var data_pemasukkan = await response.data.data_pemasukkan[0].jml_pemasukkan;
    var data_pengeluaran = await response.data.data_pengeluaran[0]
      .jml_pengeluaran;
    const data_tgl_grafik = await response.data.data_tgl_grafik.reverse();
    const data_grafik_nilai = await response.data.data_grafik_nilai.reverse();
    const data_grafik_pemasukkan =
      await response.data.data_grafik_pemasukkan.reverse();
    const data_grafik_pengeluaran =
      await response.data.data_grafik_pengeluaran.reverse();

    if (!data_pemasukkan) {
      data_pemasukkan = 0;
    }

    if (!data_pengeluaran) {
      data_pengeluaran = 0;
    }

    return {
      props: {
        data_kas: data,
        data_saldo,
        data_pemasukkan,
        data_pengeluaran,
        data_grafik_nilai,
        data_tgl_grafik,
        data_grafik_pemasukkan,
        data_grafik_pengeluaran,
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

const idPage = ({
  data_saldo,
  data_pemasukkan,
  data_pengeluaran,
  data_grafik_nilai,
  data_tgl_grafik,
  data_grafik_pemasukkan,
  data_grafik_pengeluaran,
}) => {
  const [now, setNow] = useState("");

  useEffect(() => {
    filterIndo();

    var dataFirst = {
      label: "Saldo Kas",
      data: data_grafik_nilai,
      lineTension: 0,
      fill: false,
      borderColor: "#1cc88a",
      backgroundColor: "#1cc88a",
    };

    var dataSecond = {
      label: "Pemasukkan Kas",
      data: data_grafik_pemasukkan,
      lineTension: 0,
      fill: false,
      borderColor: "#46bed0",
      backgroundColor: "#46bed0",
    };

    var dataThird = {
      label: "Pengeluaran Kas",
      data: data_grafik_pengeluaran,
      lineTension: 0,
      fill: false,
      borderColor: "#f6c23e",
      backgroundColor: "#f6c23e",
    };

    var speedData = {
      labels: data_tgl_grafik,
      datasets: [dataFirst, dataSecond, dataThird],
    };

    var chartOptions = {
      legend: {
        display: true,
        position: "top",
        labels: {
          boxWidth: 80,
          fontColor: "black",
        },        
      },
      maintainAspectRatio: false
    };

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: speedData,
      options: chartOptions,      
    });
  }, []);

  const filterIndo = useCallback(() => {
    const tanggal = new Date().getDate();
    const xhari = new Date().getDay();
    const xbulan = new Date().getMonth();
    const xtahun = new Date().getYear();

    const hari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    var hariIni = hari[xhari];
    var bulanIni = bulan[xbulan];
    var tahunIni = xtahun < 1000 ? xtahun + 1900 : xtahun;

    setNow(hariIni + ", " + tanggal + " " + bulanIni + " " + tahunIni);
  }, [now]);

  //Rupiahs format pemasukkan
  const RupiahFormat = useCallback((value) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }, []);

  return (
    <Layout>
      <div
        className="container-fluid"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div className="row" style={{ width: "100%" }}>
          <div className=" col-lg-4 col-12 mb-3">
            <div className="card" style={{ borderLeft: "4px solid #1cc88a" }}>
              <div
                className="card-body d-flex flex-column justify-content-center p-4"
                style={{ height: "120px" }}
              >
                <h6 className="card-title text-muted">Saldo</h6>
                <h4 className="card-title fw-bold">
                  {RupiahFormat(data_saldo)}
                </h4>
                <p className="card-text">{now}</p>
              </div>
            </div>
          </div>
          <div className=" col-lg-4 col-12 mb-3">
            <div className="card" style={{ borderLeft: "4px solid #46bed0" }}>
              <div
                className="card-body d-flex flex-column justify-content-center p-4"
                style={{ height: "120px" }}
              >
                <h6 className="card-title text-muted">Pemasukkan</h6>
                <h4 className="card-title fw-bold">
                  {RupiahFormat(parseInt(data_pemasukkan))}
                </h4>
                <p className="card-text">Total Pemasukkan terakhir ini</p>
              </div>
            </div>
          </div>
          <div className=" col-lg-4 col-12 mb-3">
            <div className="card" style={{ borderLeft: "4px solid #f6c23e" }}>
              <div
                className="card-body d-flex flex-column justify-content-center p-4"
                style={{ height: "120px" }}
              >
                <h6 className="card-title text-muted">Pengeluaran</h6>
                <h4 className="card-title fw-bold">
                  {RupiahFormat(parseInt(data_pengeluaran))}
                </h4>
                <p className="card-text">Total Pengeluaran terakhir ini</p>
              </div>
            </div>
          </div>
          {/* <div className="col-12 mb-3">
            <div className="card border-0 shadow-sm rounded-3">
              <div className="card-body"> */}
          {/* <Link href="/simpan">
                              <button className="btn btn-dark border-0 shadow-sm mb-3">TAMBAH</button>
                          </Link> */}
          {/* <ModalSimpan data={data_kas} /> */}
          {/* <DataTable
                  className=" mt-3"
                  value={data_kas}
                  tableStyle={{ minWidth: "50rem" }}
                  let-i="rowIndex"
                >
                  <Column
                    header="No"
                    style={{ width: "10%" }}
                    body={(data, options) => options.rowIndex + 1}
                  ></Column>
                  <Column
                    field="tanggal"
                    header="Tanggal"
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="deskripsi"
                    header="Deskripsi"
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    body={Rupiahs1}
                    header="Pemasukkan(Rp)"
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    body={Rupiahs2}
                    header="Pengeluaran(Rp)"
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    body={Rupiahs3}
                    header="Saldo(Rp)"
                    style={{ width: "20%" }}
                  ></Column> */}
          {/* <Column header="Gambar" body={showImage} ></Column> */}
          {/* </DataTable> */}
          {/* <table className="table table-hover mb-0 mt-3">
                              <thead>
                                  <tr className=" text-center align-middle table-dark">
                                      <th>No</th>
                                      <th scope="col">Gambar</th>
                                      <th scope="col">Judul</th>
                                      <th scope="col">Harga</th>
                                      <th scope="col">Deskripsi</th>
                                      <th scope="col">Aksi</th>
                                  </tr>
                              </thead>
                              <tbody>
                              { data_kas.map((item, i) => (
                                  <tr key={ i }>
                                      <td className="text-center">{ i+1 }</td>
                                      <td className="text-center">
                                        <a href={`${process.env.NEXT_PUBLIC_API_BACKEND}/produk/${item.gambar}`} target="_blank">
                                            <img src={`${process.env.NEXT_PUBLIC_API_BACKEND}/produk/${item.gambar}`} width="150" className="rounded-3"/>    
                                        </a>                                          
                                      </td>
                                      <td>{ item.judul }</td>
                                      <td>{ USDollar.format(item.harga) }</td>
                                      <td>{ item.deskripsi }</td>
                                      <td className="text-center">
                                        <div className=" d-flex justify-content-around align-items-center">
                                        <ModalEdit item={item} />

                                        <button className="btn btn-sm btn-danger border-0 shadow-sm mb-3">Hapus</button>
                                        <Button style={{margin: '0 4px'}} size="sm" onClick={() => hapusProduk(item.id)} variant="danger">
                                          Hapus
                                        </Button>
                                        </div>
                                        <Link href={`/detail/${item.id}`}>
                                            <button className="btn text-white btn-sm btn-warning border-0 shadow-sm mb-3 me-3">Edit</button>
                                        </Link>
                                      </td>
                                  </tr>
                              )) }
                              </tbody>
                          </table>   */}
          {/* </div>
            </div>
          </div> */}
          <div className=" col-12 mb-3">
            <div
              className="card"
            >
              <canvas id="myChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default idPage;
