import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TVLList.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
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

function MessageList() {
  const [protocolRWA, setProtocolRWA] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [protocols, setProtocols] = useState([]);

  const protocolNames = [
    "Figure",
    "Maple",
    "Centrifuge",
    "Goldfinch",
    "TrueFi",
    "Curve",
    "Credix",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://qiro-assignment-backend.onrender.com/rwa-data`);

        const results =
          response?.data.pageProps.privateCreditActiveLoansTimeSeries.results;

        if (results) {
          setProtocolRWA(results);

          const mergedData = {};
          results.forEach((protocol) => {
            protocol.points.forEach(([date, tvl]) => {
              if (!mergedData[date]) {
                mergedData[date] = { date };
                protocolNames.forEach((name) => {
                  mergedData[date][name] = 0;
                });
              }
              mergedData[date][protocol.group.name] = tvl;
            });
          });

          const allDates = Object.keys(mergedData);
          allDates.forEach((date) => {
            protocolNames.forEach((name) => {
              if (mergedData[date][name] === undefined) {
                mergedData[date][name] = 0;
              }
            });
          });

          const formattedData = Object.values(mergedData).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          console.log("formattedData", formattedData);

          setChartData(formattedData);
        } else {
          console.warn("No results found in API response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;
  };

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

  const proptocolsData = [
    { name: "Centrifuge", source: "Defillama" },
    { name: "Goldfinch", source: "Defillama" },
    { name: "Maple", source: "Defillama" },
    { name: "TrueFi", source: "Defillama" },
    { name: "Atlendis", source: "Defillama" },
    { name: "Clearpool", source: "Defillama" },
    { name: "Florence Finance", source: "Defillama" },
    // { name: "Huma Finance (EVM)", source: "Defillama" },
    // { name: "Huma Finance (Solana)", source: "Defillama" },
    { name: "Credix", source: "Defillama" },
    // { name: "Jia", source: "Defillama" },
    { name: "Wildcat Protocol", source: "Defillama" },
    { name: "Union Protocol", source: "Defillama" },
    { name: "Untangled", source: "Defillama" },
    { name: "ALTA Finance", source: "Defillama" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const protocolData = [];
        for (const protocol of proptocolsData) {
          let response;

          if (protocol.source === "Defillama") {
            response = await axios.get(
              `https://api.llama.fi/protocol/${protocol?.name}`
            );
            console.log(response);

            protocolData.push({
              name: protocol.name,
              source: protocol.source,
              data: response.data,
            });
          }
          // else if (protocol.source === "Dune" && protocol.name === "Maple") {
          //   response = await axios.get(
          //     " http://localhost:5000/tvl-mapple" // Example URL for Dune API
          //   );
          // } else if (
          //   protocol.source === "Dune" &&
          //   protocol.name === "Centrifuge"
          // ) {
          //   response = await axios.get(
          //     "http://localhost:5000/graph-centrifuge" // Example URL for Dune API
          //   );

          //   // console.log(""response.data.result.rows[0].total_TVL);
          // }

          // After fetching the data, push it to the protocolData array
        }

        // Once all data has been fetched, update the state

        setProtocols(protocolData);
        console.log("proptocolsData", protocolData);
      } catch (error) {
        console.error("Error fetching protocol data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="messageList_container">
      <h2 className="messageList_heading">Protocol TVL</h2>

      <br />
      <h2 className="messageList_subheading">Source RWA</h2>

      <div className="messageList_body">
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 510,
            boxShadow: "none",
            border: "1px solid #69757d",
            backgroundColor: "gray",
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              color: "white",
              "& .MuiTableCell-root": {
                color: "white",
                backgroundColor: "#0a2b3c",
              },
              "& .MuiTableRow-root": { color: "#6c757d" },
            }}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Protocol</TableCell>
                <TableCell align="center">Latest TVL</TableCell>
                {/* <TableCell align="center">Source</TableCell>
                <TableCell align="center">Link</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {protocolRWA?.map((row, index) => (
                <TableRow key={index} align="center">
                  <TableCell align="center">
                    {row?.group.name || "Unknown"}
                  </TableCell>
                  <TableCell align="center">
                    {row?.points.length > 0
                      ? `$${(
                          row.points[row.points.length - 1][1] / 1_000_000
                        ).toFixed(2)}M`
                      : "N/A"}
                  </TableCell>
                  {/* <TableCell align="center">
                    {row?.source || "Unknown"}
                  </TableCell>
                  <TableCell align="center">
                    {row?.data?.url ? (
                      <a
                        href={row.data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "white" }}
                      >
                        Click Here
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br />
        <h2 className="chart_body">Protocols TVL Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {chartData.length > 0 &&
              Object.keys(chartData[0])
                .filter((key) => key !== "date")
                .map((protocol) => {
                  const color = generateRandomColor(); // Generate a random color once

                  return (
                    <Area
                      key={protocol}
                      type="monotone"
                      dataKey={protocol}
                      stroke={color}
                      fill={color}
                      strokeWidth={2}
                      fillOpacity={0.4}
                    />
                  );
                })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <br />
      <h2 className="messageList_subheading2">Source Defillama</h2>

      <div className="messageList_body">
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 510,
            boxShadow: "none",
            border: "1px solid #69757d",
            backgroundColor: "gray",
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              color: "white",
              "& .MuiTableCell-root": {
                color: "white",
                backgroundColor: "#0a2b3c",
              },
              "& .MuiTableRow-root": {
                color: "#6c757d",
              },
              "& .MuiTableHead-root": {
                color: "#6c757d",
              },
              "& .MuiTableBody-root": {
                color: "#6c757d",
              },
            }}
            stickyHeader
            aria-label="sticky table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Protocol</TableCell>
                <TableCell align="center">TVL</TableCell>
                <TableCell align="center">Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {protocols?.map((row, index) => (
                <TableRow
                  key={index}
                  align="center"
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="center" component="th" scope="row">
                    <div className="protocol_heading">
                      <img className="protocol_img" src={row?.data.logo}></img>
                      <p>{row?.name}</p>
                    </div>
                    {/* <p>{row?.group.name}</p> */}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    $
                    {row?.data.tvl[row?.data.tvl?.length - 1]?.totalLiquidityUSD
                      ? (
                          row?.data.tvl[row?.data.tvl.length - 1]
                            ?.totalLiquidityUSD / 1_000_000
                        ).toFixed(2) + "M"
                      : "N/A"}
                    {/* {(
                      row?.points[row?.points.length - 1][1] / 1_000_000
                    ).toFixed(2) + "M"}{" "}
                    {row?.source === "Defillama"
                      ? row?.data.tvl[row?.data.tvl?.length - 1]
                          ?.totalLiquidityUSD
                        ? (
                            row?.data.tvl[row?.data.tvl.length - 1]
                              ?.totalLiquidityUSD / 1_000_000
                          ).toFixed(2) + "M"
                        : "N/A"
                      : row?.name === "Maple"
                      ? (
                          row?.data.result.rows[0].total_tvl / 1_000_000
                        ).toFixed(2) + "M"
                      : (
                          row?.data.result.rows[0].total_TVL / 1_000_000
                        ).toFixed(2) + "M"} */}
                  </TableCell>

                  <TableCell align="center" scope="row">
                    <a
                      href={row?.data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {"Click Here"}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default MessageList;
