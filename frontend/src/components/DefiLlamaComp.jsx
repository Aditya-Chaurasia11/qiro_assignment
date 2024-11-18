import axios from "axios";
import React, { useEffect, useState } from "react";

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
    const { Borrowed, Total, Staked } = payload[0].payload;
    const date = label;

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "white",
          padding: "10px",
          color: "black",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      >
        <p className="label">{`Date: ${date}`}</p>
        <p className="borrowed">{`Borrowed: $${(Borrowed / 1_000_000).toFixed(
          2
        )}M`}</p>
        <p className="total">{`Total TVL: $${(Total / 1_000_000).toFixed(
          2
        )}M`}</p>
        {Staked !== undefined && (
          <p className="staked">{`Staked: $${(Staked / 1_000_000).toFixed(
            2
          )}M`}</p>
        )}
      </div>
    );
  }

  return null;
};

const DefiLlamaComp = ({ protocol }) => {
  const [chartData, setChartData] = useState([]);
  const [tvl, setTVL] = useState("");
  const [tvlNotBorrow, setTVLNotBorrow] = useState("");
  const [tvlStaked, setTVLStaked] = useState("");

  const getTvl = async () => {
    try {
      // const options = {
      //   method: "POST",
      // };

      // const apiKey = "5qSI3LVnsVQFTBmuiUeq5dk01iNmv8nx";
      const query_id = 3114760;
      // const url = `https://api.dune.com/api/v1/query/${queryId}/execute?api_key=${apiKey}`;

      // fetch(url, options)
      //   .then((response) => response.json())
      //   .then((response) => console.log("response",response))
      //   .catch((err) => console.error(err));

      const options = {
        method: "POST",
        headers: { "X-DUNE-API-KEY": "5qSI3LVnsVQFTBmuiUeq5dk01iNmv8nx" },
      };

      fetch("https://api.dune.com/api/v1/query/3114760/execute", options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
    } catch (error) {
      console.error("Error fetching TVL:", error);
    }
  };

  useEffect(() => {
    getTvl();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://api.llama.fi/protocol/${protocol}`
      );

      const ethereumData = response.data.tvl || [];
      const borrowedData = response.data.chainTvls.borrowed?.tvl || [];
      const stakedData = response.data.chainTvls.staking?.tvl || [];

      console.log(stakedData);
      console.log(ethereumData);
      console.log(borrowedData);

      // Create maps for Borrowed and Staking data
      const borrowedDataMap = borrowedData.reduce((map, entry) => {
        const date = new Date(entry.date * 1000).toISOString().split("T")[0];
        map[date] = entry.totalLiquidityUSD;
        return map;
      }, {});

      const stakedDataMap = stakedData.reduce((map, entry) => {
        const date = new Date(entry.date * 1000).toISOString().split("T")[0];
        map[date] = entry.totalLiquidityUSD;
        return map;
      }, {});

      // Combine Ethereum, Borrowed, and Staking data into a unified format
      const processedData = ethereumData.map((entry) => {
        const date = new Date(entry.date * 1000).toISOString().split("T")[0];
        const ethereumTVL = entry?.totalLiquidityUSD || 0;
        const borrowedTVL = borrowedDataMap[date] || 0;
        const stakedTVL = stakedDataMap[date] || 0;

        return {
          date,
          Borrowed: borrowedTVL,
          Total: ethereumTVL,
          Staked: stakedTVL,
        };
      });

      // Set TVL values
      const latestData = processedData[processedData.length - 1];
      setTVL(latestData?.Total || 0);
      setTVLNotBorrow(latestData?.Borrowed || 0);
      setTVLStaked(latestData?.Staked || 0);

      // Update Chart Data
      setChartData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    protocol && getData();
  }, [protocol]);

  return (
    <div>
      <h1>Total TVL: ${(tvl / 1_000_000).toFixed(2)}M</h1>
      <h1>Total Borrowed: ${(tvlNotBorrow / 1_000_000).toFixed(2)}M</h1>
      {tvlStaked ? (
        <h1>Total Staked: ${(tvlStaked / 1_000_000).toFixed(2)}M</h1>
      ) : (
        ""
      )}
      <h1>
        Total TVL including all: $
        {((tvl + tvlNotBorrow + (tvlStaked || 0)) / 1_000_000).toFixed(2)}M
      </h1>

      <br />

      <h1>Total Value Locked (TVL), Borrowed, and Staked Amounts Over Time</h1>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => tick}
            interval="preserveEnd"
          />
          <YAxis
            tickFormatter={(tick) => `${(tick / 1_000_000).toFixed(2)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="Borrowed"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="Total"
            stackId="1"
            stroke="#ff7300"
            fill="#ff7300"
          />
          {chartData.some((data) => data.Staked !== undefined) && (
            <Area
              type="monotone"
              dataKey="Staked"
              stackId="2"
              stroke="#8884d8"
              fill="#8884d8"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DefiLlamaComp;
