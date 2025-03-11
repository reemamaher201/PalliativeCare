import {Routes,Route} from "react-router-dom";
import LandingPage from "./components/Landing/LandingPage.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
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

const RouterComponent = ()=>{
    return(
        <Routes>
            {/*Amin*/}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/*Patients*/}
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/user-profile" element={<UserProfile/>}/>

            {/*Ministry*/}
            <Route path="/dashboardM" element={<DashboardM/>}/>
            <Route path="/showprovider" element={<ShowProvider />} />
            <Route path="/addprovider" element={<AddProvider/>}/>
            <Route path="/showpatient" element={<ShowPatients/>}/>
            <Route path="/addpatient" element={<AddPatient/>}/>
            <Route path="/showmedicines" element={<ShowMedicines/>}/>
            <Route path="/addmedicien" element={<AddMedicine/>}/>
                <Route path="/showotification" element={<ShowNotifications/>}/>
                <Route path="/addnotification" element={<CreateNotification/>}/>

            {/*Providers*/}
            <Route path="/dashboardS" element={<DashboardS/>}/>


        </Routes>
    );
};

export default RouterComponent;