import { useState, useEffect } from "react";
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

// Custom Tooltip Component
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
          <strong>Time:</strong> {label}
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

function DuneComp() {
  const [chartData, setChartData] = useState([]);
  const [poolColors, setPoolColors] = useState({});
  const [tvl, setTvl] = useState("");
  const [comTVL, setComTVL] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/graph-centrifuge"
      );
      const rows = response?.data?.result?.rows;
      setTvl(rows[0]?.total_TVL);

      if (!rows || rows.length === 0) {
        console.warn("No data received from API");
        return;
      }

      // Generate unique colors for each pool
      const uniquePools = Array.from(new Set(rows.map((row) => row.pool_name)));
      const colors = {};
      uniquePools.forEach((pool, index) => {
        colors[pool] = `hsl(${(index * 360) / uniquePools.length}, 70%, 50%)`;
      });
      setPoolColors(colors);

      // Group data by time
      const groupedData = rows.reduce((acc, row) => {
        const poolName = row.pool_name || "Unknown";
        const time = row.time;
        const TVL = row.TVL || 0;

        if (!acc[time]) acc[time] = { time }; // Initialize time object if it doesn't exist
        acc[time][poolName] = TVL; // Add TVL data for the pool

        return acc;
      }, {});

      // Convert grouped data to array for Recharts
      const chartReadyData = Object.values(groupedData);

      // Make the data cumulative
      const cumulativeData = chartReadyData.map((entry) => {
        const cumulativeEntry = { ...entry };
        let cumulativeTVL = 0;

        // Calculate cumulative TVL for each pool
        uniquePools.forEach((pool) => {
          cumulativeTVL += cumulativeEntry[pool] || 0;
          cumulativeEntry[pool] = cumulativeTVL;
        });

        return cumulativeEntry;
      });

      setChartData(cumulativeData.reverse());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getTvl = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tvl-centrifuge");
      console.log(
        "response",
        response?.data.result.rows[0].cumulative_origination
      );
      setComTVL(response?.data.result.rows[0].cumulative_origination);
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
      <h1>Total TVL - ${(comTVL / 1_000_000).toFixed(2)}M</h1>

      <h1>Cumulative TVL Chart</h1>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {Object.keys(poolColors).map((pool) => (
            <Area
              key={pool}
              type="monotone"
              dataKey={pool}
              stroke={poolColors[pool]}
              fill={poolColors[pool]}
              stackId="1"
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DuneComp;
