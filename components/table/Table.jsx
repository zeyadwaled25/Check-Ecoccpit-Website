import "./Table.css";

function Table({ userData }) {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Ensure certificates array exists
  const certificates = userData?.certificates || [];

  return (
    <div className="table">
      <div className="top-data d-flex justify-content-between">
        <div>
          <p>Exporter(出口商): <span>{userData?.companyName} {userData?.address}</span></p>
        </div>
        <div>
          <p>Invoice No.(发票号): <span>{userData?.invoiceNo}</span></p>
        </div>
      </div>
      <div className="country">
        <p>Country of Destination(目的国): <span>{userData?.country}</span></p>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-hover text-center" style={{tableLayout: "fixed", minWidth: "600px"}}>
          <thead>
            <tr>
              <th>H.S.Code(税则号)</th>
              <th>Authorized by(签证人名称)</th>
              <th>数/重量</th>
              <th>Issue Date(签署日期)</th>
            </tr>
          </thead>
          <tbody>
            {certificates.length > 0 ? (
              certificates.map((certificate, index) => (
                <tr key={index}>
                  <td>{certificate?.hsCode || "-"}</td>
                  <td>{certificate?.authorizedBy || "-"}</td>
                  <td>{certificate?.weight ? `${certificate.weight} KGS(千克)` : "-"}</td>
                  <td>{certificate?.issueDate ? formatDate(certificate.issueDate) : "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No certificate data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;