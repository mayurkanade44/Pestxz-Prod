const ServProdTable = ({ type, data, openEdit }) => {
  return (
    <table className="table table-striped table-bordered border-primary mt-3">
      <thead>
        <tr>
          <th style={{ width: 300 }} className="text-center">
            {type} Name
          </th>
          <th className="text-center">{type} Options</th>
          <th style={{ width: 100 }} className="text-center">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <td>{item.serviceName || item.productName}</td>
            <td>{item.serviceOption.join(", ")}</td>
            <td className="text-center">
              <button
                className="btn edit-btn btn-sm me-2"
                onClick={() => openEdit(item)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ServProdTable;
