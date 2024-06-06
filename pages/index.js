import Layout from "../components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "chart.js";
import { useCallback } from "react";

export async function getServerSideProps(ctx) {
  const token = ctx.req.cookies.token;
  const userAgent = ctx.req.headers["user-agent"];
  const tesView = userAgent.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  );

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

const idPage = ({
  data_saldo,
  data_pemasukkan,
  data_pengeluaran,
  data_grafik_nilai,
  data_tgl_grafik,
  data_grafik_pemasukkan,
  data_grafik_pengeluaran,
  tesView,
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
          boxWidth: 20,
          fontColor: "black",
        },
      },
      maintainAspectRatio: false,
    };

    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: tesView ? "horizontalBar" :  "bar",
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

  // if (tesView) {
  //   return (
  //     <Layout>
  //       <div
  //         className="container-fluid"
  //         style={{ paddingTop: "10px", paddingBottom: "10px" }}
  //       >
  //         <div className="row" style={{ width: "100%" }}>
  //           <div className=" col-lg-4 col-12 mb-3">
  //             <div className="card" style={{ borderLeft: "4px solid #1cc88a" }}>
  //               <div
  //                 className="card-body d-flex flex-column justify-content-center p-4"
  //                 style={{ height: "120px" }}
  //               >
  //                 <h6 className="card-title text-muted">Saldo</h6>
  //                 <h4 className="card-title fw-bold">
  //                   {RupiahFormat(data_saldo)}
  //                 </h4>
  //                 <p className="card-text">{now}</p>
  //               </div>
  //             </div>
  //           </div>
  //           <div className=" col-lg-4 col-12 mb-3">
  //             <div className="card" style={{ borderLeft: "4px solid #46bed0" }}>
  //               <div
  //                 className="card-body d-flex flex-column justify-content-center p-4"
  //                 style={{ height: "120px" }}
  //               >
  //                 <h6 className="card-title text-muted">Pemasukkan</h6>
  //                 <h4 className="card-title fw-bold">
  //                   {RupiahFormat(parseInt(data_pemasukkan))}
  //                 </h4>
  //                 <p className="card-text">Total Pemasukkan terakhir ini</p>
  //               </div>
  //             </div>
  //           </div>
  //           <div className=" col-lg-4 col-12 mb-3">
  //             <div className="card" style={{ borderLeft: "4px solid #f6c23e" }}>
  //               <div
  //                 className="card-body d-flex flex-column justify-content-center p-4"
  //                 style={{ height: "120px" }}
  //               >
  //                 <h6 className="card-title text-muted">Pengeluaran</h6>
  //                 <h4 className="card-title fw-bold">
  //                   {RupiahFormat(parseInt(data_pengeluaran))}
  //                 </h4>
  //                 <p className="card-text">Total Pengeluaran terakhir ini</p>
  //               </div>
  //             </div>
  //           </div>
  //           <div className=" col-12 mb-3">
  //             <div className="card">
  //               <canvas id="myChart"></canvas>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }
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
          <div className=" col-12 mb-3">
            <div className={`w-full ${tesView ? "h-[600px]" : "h-[700px]" }  m-1 bg-white rounded`}>
              <canvas id="myChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default idPage;
