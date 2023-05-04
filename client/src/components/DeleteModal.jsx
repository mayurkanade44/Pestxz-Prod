import { useState } from "react";

const DeleteModal = ({ handleDelete, name, title }) => {
  const [open, setOpen] = useState(false);

  const deleteButton = () => {
    handleDelete();
    setOpen(!open);
  };

  return (
    <>
      {!open ? (
        <button className="btn btn-danger" onClick={() => setOpen(!open)}>
          Delete
        </button>
      ) : (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-danger">{`Delete ${title}`}</h4>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setOpen(!open)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to
                <b className="ms-1">
                  Delete {name} {title} ?
                  {(title === "Client" || title === "Company") && (
                    <p className="text-danger mb-0">
                      {`This will also delete the all the ${name} ${
                        title === "Client" ? "locations" : "users"
                      } and
                    related data.`}
                    </p>
                  )}
                </b>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-danger btn-lg pt-1"
                  onClick={deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DeleteModal;
