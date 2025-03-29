import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/Landing/LandingPage.jsx";
import Login from "./services/Auth/Login.jsx";
import Register from "./services/Auth/Register.jsx";
import UserProfile from "./components/Patients/PProfile.jsx";
import DashboardM from "./components/Ministry/Dashboard.jsx";
import ShowProvider from "./components/Ministry/ShowProvider.jsx";
import AddProvider from "./components/Ministry/AddProvider.jsx";
import DashboardS from "./components/Providers/Dashboard.jsx";
import ShowPatients from "./components/Ministry/ShowPatinets.jsx";
import AddPatient from "./components/Ministry/AddPatient.jsx";
import ShowMedicines from "./components/Ministry/ShowMedicines.jsx";
import AddMedicine from "./components/Ministry/AddMedicine.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import ShowNotifications from "./components/Ministry/ShowNotifications.jsx";
import CreateNotification from "./components/Ministry/CreateNotification.jsx";
import ShowRequests from "./components/Ministry/ShowRequests.jsx";
import NotFound from "./components/Utilties/NotFound.jsx";
import ReqAddPatients from "./components/Providers/ReqAddPatient.jsx";
import PatientRequests from "./components/Ministry/PatientRequests.jsx";
import RequestDetails from "./components/Ministry/RequestDetails.jsx";
import ProviderPatients from "./components/Providers/ProviderPatients.jsx";
import ReqAddMed from "./components/Providers/ReqAddMed.jsx";
import MedRequestDetails from "./components/Ministry/MedRequestDetails.jsx";
import ProviderMedicines from "./components/Providers/ProviderMedicines.jsx";
import ChatPage from "./components/Ministry/Chat.jsx";
import GeneralAdvice from "./components/Patients/GeneralAdvice.jsx";
import Support from "./components/Patients/Support.jsx";
import MedicineBookings from "./components/Patients/MedicineBookings.jsx";
import FeaturesSection from "./components/Landing/FeaturesSection.jsx";

const RouterComponent = () => {
    return (
        <Routes>

            <Route path="/generalAdvice" element={<GeneralAdvice />} />
            <Route path="/support" element={<Support />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patients/request" element={<ReqAddPatients />} />
            <Route path="/med/request" element={<ReqAddMed />} />
            <Route path="/patients/pending" element={<PatientRequests/>}/>

            <Route path="/patient-requests/:id" element={<RequestDetails />} />
            <Route path="/med-requests/:id" element={<MedRequestDetails />} />

            <Route path={"/provider/patients"} element={<ProviderPatients/>}/>
                <Route path={"/provider/medicines"} element={<ProviderMedicines/>}/>
            <Route path="/chat" element={<ChatPage />}/>
<Route path="/showmybooking" element={<MedicineBookings/>}/>

            <Route path={"/admin-dashboard"} element={<AdminDashboard/>} />

            <Route
                path="/user-profile"
                 element={<UserProfile/>} />

            <Route
                path="/dashboardM"
               element={<DashboardM/>} />

            <Route
                path="/showprovider"
                 element={<ShowProvider/>} />

            <Route
                path="/addprovider"
                 element={<AddProvider/>} />

            <Route
                path="/showpatient"
              element={<ShowPatients/>} />

            <Route
                path="/addpatient"
                 element={<AddPatient/>} />

            <Route
                path="/showmedicines"
               element={<ShowMedicines/>} />

            <Route
                path="/addmedicien"
                element={<AddMedicine/>} />

            <Route
                path="/showotification"
                element={<ShowNotifications/>} />

            <Route
                path="/addnotification"
                element={<CreateNotification/>} />

            <Route
                path="/dashboardS" element={<DashboardS/>} />

                <Route path="/showrequests" element={<ShowRequests/>} />

                {/* صفحة 404 */}
                <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default RouterComponent;