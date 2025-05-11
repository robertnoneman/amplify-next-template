"use client";


// import ReactApexChart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Roboto } from 'next/font/google';
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const roboto = Roboto({
  variable: '--font-primary',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100']
});

interface MyComponentProps {
  labels: string[];
  series: number[];
  colors?: string[];
  height?: number;
  width?: number;
  fontSize?: string;
  percentageFormatter?: boolean;
}

export default function RadarChart({ labels, series, colors=["#E90507"], height=350, width=300, fontSize="22px", percentageFormatter=false }: MyComponentProps) {
  const [chartOptions, setChartOptions] = useState({
    // chart: {
    //   type: 'radar' as 'radar',
    //   height: height,
    //   width: width,
    // },
    // series: series,
    series: [{
      name: 'Rob O',
      data: [4, 3, 2, 10, 7, 1],
    }, {
      name: 'Rob N',
      data: [2, 2, 5, 6, 6, 4],
    }],
    options: {
      chart: {
        height: 350,
        type: 'radar' as "radar",
        dropShadow: {
          enabled: true,
          blur: 1,
          left: 1,
          top: 1
        }
      },
      title: {
        text: 'Wins by game type',
        style: {
          fontSize: '14px',
          fontFamily: roboto.style.fontFamily,
          color: "#eeeeee",
        }
      },
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.3
      },
      markers: {
        size: 0
      },
      yaxis: {
        stepSize: 2
      },
      xaxis: {
        categories: ['301', 'Cricket', '701', 'Baseball', '501', 'RNF'],
        labels: {
          show: true,
          style: {
            colors: ["#eeeeee", "#eeeeee", "#eeeeee", "#eeeeee", "#eeeeee", "#eeeeee"],
            fontSize: "11px",
            fontFamily: roboto.style.fontFamily,
          }
        }
      },
      legend: {
        fonstSize: '14px',
        fontFamily: roboto.style.fontFamily,
        labels: {
          colors: ["#eeeeee", "#eeeeee"],
          fontSize: "11px",
          fontFamily: roboto.style.fontFamily,
        }
      }
    }
  });

  return (
    <div className="radar-chart">
      <ApexChart 
        options={chartOptions.options} 
        series={chartOptions.series} 
        type="radar" 
        height={height} 
        width={width} />
    </div>
  );
}

