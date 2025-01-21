"use client";


// import ReactApexChart from 'react-apexcharts';
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';


interface MyComponentProps {
    labels: string[];
    series: number[];
    colors?: string[];
    height?: number;
    fontSize?: string;
}

export default function RadialBar({ labels, series, colors=["#E90507"], height=350, fontSize="22px" }: MyComponentProps) {
    // const [isLoaded, setIsLoaded] = useState(false);
    const [chartOptions, setChartOptions] = useState({ chart: {
        type: 'radialBar' as 'radialBar',
      },
      series: series,
      offsetY: -20,
        sparkline: {
          enabled: true
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
              background: "#e7e7e7",
              strokeWidth: '97%',
              margin: 5, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: 2,
                left: 0,
                color: '#444',
                opacity: 1,
                blur: 2
              }
            },
            dataLabels: {
              name: {
                show: true,
                offsetY: 25,
                color: '#fff',
                fontFamily: "__Roboto_1e0c0b",
                fontSize: fontSize
              },
              style: {colors: ["#fff"], fill: "#fff"},
              value: {
                offsetY: -25,
                fontSize: fontSize,
                color: "#fff",
                fill: "#fff",
                fontFamily: "__Roboto_1e0c0b",
                formatter: function (val: number): string{
                  return val + "";
                }
              }
            }
          }
        },
        grid: {
          padding: {
            top: -10
          }
        },
        fill: {
          colors: colors,
          type: 'gradient',
          gradient: {
            shade: 'light',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 53, 91]
          },
        },
        labels: labels,
    });
    // useEffect(() => {
    //     // Your effect code here
    //     // setIsLoaded((typeof window !== 'undefined'));
    //     // console.log("isLoaded", isLoaded);
    // }, []);

  return (
    <div>
      <ApexChart
        options={chartOptions}
        series={chartOptions.series}
        type="radialBar"
        height={height}
      />
    </div>
  );
};