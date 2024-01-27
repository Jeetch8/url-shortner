import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { routes } from "@/utils/routes";

const App = () => {
  const router = createBrowserRouter(routes);

  return (
    <div className="">
      <RouterProvider router={router}></RouterProvider>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </div>
  );
};

export default App;
