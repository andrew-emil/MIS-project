import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import AddPatient from "./views/addPatient";
import AddDoctor from "./views/addDoctor";
import AddHospital from "./views/addHospital";
import AddSurgery from "./views/addSurguries";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <AddPatient /> },
      { path: "/add-patient", element: <AddPatient /> },
      { path: "/add-doctor", element: <AddDoctor /> },
      { path: "/add-hospital", element: <AddHospital /> },
      { path: "/add-surgery", element: <AddSurgery /> },
    ],
  },
]);

export default router;
