import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import AddPatient from "./views/addPatient";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <AddPatient /> },
      { path: "/add-patient", element: <AddPatient /> },
    ],
  },
]);

export default router;
