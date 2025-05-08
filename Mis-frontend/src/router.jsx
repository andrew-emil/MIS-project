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
import DeletePatient from "./views/deletePatient";
import DeleteHospital from "./views/deleteHospital";
import DeleteSurgery from "./views/deleteSurgery";
import DeleteDoctor from "./views/deleteDoctor";
import BatchUpdateOperations from "./views/batchOperation";
import AggregateOperations from "./views/aggregate";
import ArraySumCalculator from "./views/arraySum";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <AddPatient /> },
      { path: "/add-patient", element: <AddPatient /> },
      { path: "/update-patient", element: <UpdatePatient /> },
      { path: "/delete-patient", element: <DeletePatient /> },
      { path: "/add-doctor", element: <AddDoctor /> },
      { path: "/update-doctor", element: <UpdateDoctor /> },
      { path: "/delete-doctor", element: <DeleteDoctor /> },
      { path: "/add-hospital", element: <AddHospital /> },
      { path: "/update-hospital", element: <UpdateHospital /> },
      { path: "/delete-hospital", element: <DeleteHospital /> },
      { path: "/add-surgery", element: <AddSurgery /> },
      { path: "/update-surgery", element: <UpdateSurgery /> },
      { path: "/delete-surgery", element: <DeleteSurgery /> },

      { path: "/batch", element: <BatchUpdateOperations /> },
      { path: "/aggregate", element: <AggregateOperations /> },
      { path: "/array-sum", element: <ArraySumCalculator /> },
    ],
  },
]);

export default router;
