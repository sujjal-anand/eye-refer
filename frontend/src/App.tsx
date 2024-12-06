import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Forgotpassword from "./components/Changepassword";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Changepassword from "./components/Changepassword";
import Otpverification from "./components/Otpverification";
import ODdashboard from "./components/ODdashboard";
import ReferPatientForm from "./components/Referpatient";
import Mddoctors from "./components/Mddoctors";
import Notes from "./components/Notes";

import Apps from "./components/App";
import MDdashboard from "./components/MDdashboard";
import Doctors from "./components/Totaldoctors";
import Patients from "./components/Patients";
import UpdatePatientForm from "./components/Updatepatient";
import Viewpatient from "./components/Viewpatient";
import Addappointment from "./components/Addappointment";
import Chat from "./components/Chat";
import Profile from "./components/Profile";
import Staff from "./components/Staff";
import ForgotPasswordForm from "./components/Forgotpassword";
import AppointmentList from "./components/appointmentlist";
import Patientsreceived from "./components/patientreceive";
import Updateappointment from "./components/Updateappointment";
// import Chathistory from "./components/Chathistory";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          {/* <Route path="/changepassword" element={<Changepassword />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/verification" element={<Otpverification />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/forgotpassword" element={<ForgotPasswordForm />} />

          <Route path="/app" element={<Apps />}>
            <Route path="chat" element={<Chat />} />
            <Route path="patientreceived" element={<Patientsreceived />} />
            <Route
              path="appointmentreschedule/:id"
              element={<Updateappointment />}
            />

            <Route path="staff" element={<Staff />} />
            <Route path="appointmentlist" element={<AppointmentList />} />

            <Route path="patients" element={<Patients />} />
            <Route path="profile" element={<Profile />} />
            <Route path="od" element={<ODdashboard />} />
            <Route path="addreferpatient" element={<ReferPatientForm />} />
            <Route path="mddoctors" element={<Mddoctors />} />
            <Route path="note/:id" element={<Notes />} />
            <Route path="md" element={<MDdashboard />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="changepassword" element={<Changepassword />} />
            <Route path="updatepatient/:id" element={<UpdatePatientForm />} />
            <Route path="viewpatient/:id" element={<Viewpatient />} />
            <Route path="addappointment" element={<Addappointment />} />
            {/* <Route path="chathistory" element={<Chathistory />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Login/> */}
      {/* <Resetpassword/> */}
      {/* <Forgotpassword/> */}
    </div>
  );
}

export default App;
