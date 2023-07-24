import React from "react";
import { useEffect } from "react";

const grafik = ({ grafikTgl, grafikNilai }) => {
  useEffect(() => {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
            data: [66, 144, 146, 116, 107, 131, 43],
            label: "Applied",
            borderColor: "rgb(109, 253, 181)",
            backgroundColor: "rgb(109, 253, 181,0.5)",
            borderWidth: 2
        }]
      },
    });
  }, []);

  return (
    <div className=" col-12 mb-3">
      <div className="card">
        <canvas id="myChart"></canvas>
      </div>
    </div>
  );
};

export default grafik;
