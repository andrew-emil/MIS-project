import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./components/GuestLayout";
import AddPatient from "./views/addPatient";
import AddDoctor from "./views/addDoctor";
import AddHospital from "./views/addHospital";
import AddSurgery from "./views/addSurguries";
import UpdateDoctor from "./views/updateDoctor";
import UpdatePatient from "./views/updatePatient";
import UpdateHospital from "./views/updateHospital";
import UpdateSurgery from "./views/updateSurgery";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <AddPatient /> },
      { path: "/add-patient", element: <AddPatient /> },
      { path: "/update-patient", element: <UpdatePatient /> },
      { path: "/add-doctor", element: <AddDoctor /> },
      { path: "/update-doctor", element: <UpdateDoctor /> },
      { path: "/add-hospital", element: <AddHospital /> },
      { path: "/update-hospital", element: <UpdateHospital /> },
      { path: "/add-surgery", element: <AddSurgery /> },
      { path: "/update-surgery", element: <UpdateSurgery /> },
    ],
  },
]);

export default router;
