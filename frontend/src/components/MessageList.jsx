import React, { useEffect, useState } from "react";
import axios from "axios";
import "./messageList.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [protocols, setProtocols] = useState([]);

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
    // Define the async function to fetch data for each protocol
    const fetchData = async () => {
      try {
        const protocolData = [];

        // Loop through each protocol
        for (const protocol of proptocolsData) {
          let response;

          // Conditional API request based on the protocol source
          if (protocol.source === "Defillama") {
            response = await axios.get(
              `https://api.llama.fi/protocol/${protocol.name}`
            );
          } else if (protocol.source === "Dune" && protocol.name === "Maple") {
            response = await axios.get(
              `http://localhost:5000/tvl-mapple` // Example URL for Dune API
            );
          } else if (
            protocol.source === "Dune" &&
            protocol.name === "Centrifuge"
          ) {
            response = await axios.get(
              `http://localhost:5000/graph-centrifuge` // Example URL for Dune API
            );

            // console.log(response.data.result.rows[0].total_TVL);
          }

          // After fetching the data, push it to the protocolData array
          protocolData.push({
            name: protocol.name,
            source: protocol.source,
            data: response?.data,
          });
        }

        // Once all data has been fetched, update the state
        setProtocols(protocolData); // Update the state with fetched data after all are collected
      } catch (error) {
        console.error("Error fetching protocol data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="messageList_container">
      <h2 className="messageList_heading">Messages Sent</h2>
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
                <TableCell align="center">Source</TableCell>
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
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {" "}
                    $
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
                        ).toFixed(2) + "M"}
                  </TableCell>
                  <TableCell align="center" scope="row">
                    {row?.source}
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
