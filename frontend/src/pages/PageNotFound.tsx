import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center">
      <div>
        <h1 className="text-[100px] text-black">404</h1>
        <h2 className="text-2xl text-black">Page not found</h2>

        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
