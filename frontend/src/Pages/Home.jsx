import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function ContactList() {
  const navigate = useNavigate();

  const proptocolsData = [
    { name: "Centrifuge", source: "Dune" },
    { name: "Goldfinch", source: "Defillama" },
    { name: "Maple", source: "Dune" },
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
    { name: "Syrup.fi", source: "Defillama" },
  ];

  const handleNavigateClick = async (protocol) => {
    navigate(`/protocol/${protocol?.name}`, { state: { protocol } });
  };

  return (
    <div className="contactList_container">
      <div className="contactList_header">
        <h2 className="contactList_heading">Protocols List</h2>
      </div>
      <ul>
        <div className="contactList_list_container">
          {proptocolsData.map((pro, index) => (
            <div
              className="contactList_list"
              key={index}
              onClick={() => handleNavigateClick(pro)}
            >
              {pro?.name}
            </div>
          ))}
        </div>
      </ul>
    </div>
  );
}

export default ContactList;
