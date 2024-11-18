import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "5px",
          padding: "10px",
          color: "black",
        }}
      >
        <p>
          <strong>Date:</strong> {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ${(entry.value / 1_000_000).toFixed(2)}M
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function DuneMapleComp() {
  const [chartData, setChartData] = useState([]);
  const [tvlData, setTvlData] = useState({});
  const [tvl, setTvl] = useState("");

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://qiro-assignment-backend.onrender.com/graph-mapple"
      );
      const rows = response?.data?.result?.rows || [];

      if (rows.length === 0) {
        console.warn("No data received from API");
        return;
      }

      console.log("API Data:", rows);

      const uniquePools = Array.from(new Set(rows.map((row) => row.pool_name)));

      const groupedData = {};

      uniquePools.forEach((poolName) => {
        const filteredRows = rows.filter((row) => row.pool_name === poolName);

        filteredRows.forEach((row) => {
          const date = row.date.split(" ")[0]; 
          if (!groupedData[date]) groupedData[date] = { date };
          groupedData[date][poolName] = row.tvl || 0;
        });
      });

      const chartReadyData = Object.values(groupedData).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setChartData(chartReadyData);

      const tvlByPool = uniquePools.reduce((acc, pool) => {
        const latestRow = rows.filter((row) => row.pool_name === pool).pop();
        acc[pool] = latestRow?.tvl || 0;
        return acc;
      }, {});

      setTvlData(tvlByPool);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  const getTvl = async () => {
    try {
      const response = await axios.get(
        "https://qiro-assignment-backend.onrender.com/tvl-mapple"
      );
      console.log(response?.data.result.rows[0].total_tvl);
      setTvl(response?.data.result.rows[0].total_tvl);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTvl();
  }, []);

  return (
    <div>
      <br />
      <h1>Total TVL - ${(tvl / 1_000_000).toFixed(2)}M</h1>

      <h1>TVL for All Pools</h1>
      <br />
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {Object.keys(tvlData).map((pool, index) => (
            <Area
              key={pool}
              type="monotone"
              dataKey={pool}
              stroke={`hsl(${
                (index * 360) / Object.keys(tvlData).length
              }, 70%, 50%)`}
              fill={`hsl(${
                (index * 360) / Object.keys(tvlData).length
              }, 70%, 50%)`}
              stackId="1"
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DuneMapleComp;
