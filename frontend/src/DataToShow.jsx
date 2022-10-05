import React from "react";

const DataToShow = ({ fetchstate }) => {
  console.log(fetchstate);
  if (fetchstate.state === "loading") {
    return <p className="text-center">Loading...</p>;
  }
  if (fetchstate.state === "error") {
    return <p className="text-red-500 text-center">{fetchstate.error.msg}</p>;
  }
  if (fetchstate.data) {
    const shortend_url = fetchstate.data.shortend_url;
    return (
      <div className="text-center">
        <a href={shortend_url} target="_blank">
          {shortend_url}
        </a>
      </div>
    );
  }
  return <div>DataToShow</div>;
};

export default DataToShow;
