import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./contactInfo.css";
import DuneComp from "./DuneComp";
import DuneMapleComp from "./DuneMapleComp";
import DefiLlamaComp from "./DefiLlamaComp";

function ContactInfo() {
  const location = useLocation();
  const [protocol, setProtocol] = useState(null);

  // Fetch data from location.state
  useEffect(() => {
    if (location.state && location.state.protocol) {
      setProtocol(location.state.protocol);
    }
  }, [location.state]);

  return (
    <div className="contactInfo_container">
      <h2 className="contactInfo_heading">Contact Info</h2>
      <div className="contactInfo_body">
        {protocol ? (
          <>
            <p>
              <strong>Name:</strong> {protocol.name}
            </p>
            <p>
              <strong>Data Source:</strong> {protocol.source}
            </p>
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
      <div className="protocol_data">
        {protocol?.source === "Defillama" ? (
          <DefiLlamaComp protocol={protocol?.name} />
        ) : protocol?.name === "Centrifuge" ? (
          <DuneComp />
        ) : (
          <DuneMapleComp />
        )}
      </div>
    </div>
  );
}

export default ContactInfo;
