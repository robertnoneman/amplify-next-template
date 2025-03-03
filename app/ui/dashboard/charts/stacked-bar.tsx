"use client";


// import ReactApexChart from 'react-apexcharts';
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface MyComponentProps {
    labels: string[];
    series: {name: string; data: number[]}[];
    colors?: string[];
    height?: number;
    fontSize?: string;
}

export default function StackedBar({ labels, series, colors=["#E90507"], height=350, fontSize="22px" }: MyComponentProps) {
    series = series.map(s => ({ ...s, data: Array.isArray(s.data) ? s.data : [s.data] }));
    // series = series.map(s => ({ ...s, data: Array.isArray(s.data) ? s.data : [s.data] }));
    const [chartOptions, setChartOptions] = useState({ chart: {
        type: 'bar' as 'bar',
        height: height,
        stacked: true,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
    },
    series: series,
    plotOptions: {
        bar: {
            horizontal: false,
            dataLabels: {
                total: {
                    enabled: true,
                    offsetX: 0,
                    style: {
                        fontSize: '14px',
                        colors: ['#fff']
                    }
                }
            }
        },
    },
    stroke: {
        width: 1,
        colors: ['#fff']
    },
    title: {
        text: 'Dart Game Wins',
        style: {
            color: '#fff',
        },
        color: '#fff',
      },
      xaxis: {
        // categories: ["Baseball", "RobdayNightFootball", "Cricket", "301", "501", "701"],
        categories: labels,
        colors: ['#fff'],
        labels: {
          formatter: function (value: string): string {
            return value + " Wins"
          },
          colors: ['#fff'],
        },
        style: {
            colors: ['#fff'],
            },
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val: number): string {
            return val + " Wins"
          },

          style: {
              colors: ['#fff'],
          },
        },
        colors: ['#222'],
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top' as 'top',
        horizontalAlign: 'left' as 'left',
        offsetX: 40,
        labels: {
          colors: '#fff',
          useSeriesColors: false,
          style: {
            colors: '#fff',
          }
        },
      }
    });

    return (
        <ApexChart options={chartOptions} series={series} type="bar" height={height} />
    );
}