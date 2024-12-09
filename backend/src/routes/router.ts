import { Router } from "express";
import {
  // changepassword,
  // addproduct,
  createuser,
  resendotp,
  verifyotp,
  // resetpassword,
  // deleteproduct,
  // getallproducts,
  // getproduct,
  loginuser,
  doctordetail,
  referpatient,
  mddoctors,
  odoctors,
  getreferredpatient,
  getnote,
  referreceived,
  totaldoctors,
  changepassword,
  deletepatient,
  updatepatient,
  getpatient,
  updatedoctor,
  addaddress,
  addstaff,
  deletestaff,
  getstaff,
  forgotpassword,
  getRooms,
  forgotverify,
  getappointmentlist,
  completedappointment,
  cancelledappointment,
  rescheduled,
  getaddress,
  csvdownload,
  getallnotification,
  checknotificationstatus,
  deleteaddress,
  // updateproduct,
  // getAencyDetails,
} from "../controller/usercontroller";
import { upload } from "../middleware/multer";
import { JWT } from "../middleware/token";
import { validateUser } from "../middleware/Validate";
const userRoutes = Router();

userRoutes.post("/", createuser);
userRoutes.post("/verifyotp", JWT, verifyotp);
userRoutes.put("/resendotp", JWT, resendotp);
userRoutes.post("/login", loginuser);
userRoutes.get("/doctordetail", JWT, doctordetail);
userRoutes.post(
  "/addpatient",
  upload.single("documentation"),
  JWT,
  referpatient
);
userRoutes.get("/referredpatient", JWT, getreferredpatient);
userRoutes.get("/mddoctors", mddoctors);
userRoutes.get("/oddoctors", odoctors);
userRoutes.get("/notes/:id", getnote);
userRoutes.get("/referrreceive", JWT, referreceived);
userRoutes.get("/totaldoctors", totaldoctors);
userRoutes.delete("/deletepatient/:id", deletepatient);
userRoutes.put("/updatepatient/:id", updatepatient);
userRoutes.get("/getpatient/:id", getpatient);

userRoutes.post("/changepassword", JWT, changepassword);
userRoutes.put(
  "/updatedoctor",
  upload.single("profilephoto"),
  JWT,
  updatedoctor
);
userRoutes.post("/addaddress", JWT, addaddress);
userRoutes.delete("/deletestaff/:id", deleteaddress);
userRoutes.post("/addstaff", JWT, addstaff);
userRoutes.get("/getstaff", JWT, getstaff);
userRoutes.delete("/deletestaff/:id", deletestaff);
userRoutes.post("/forgotpassword", forgotpassword);
userRoutes.get("/room-list", JWT, getRooms);
userRoutes.put("/forgotverify", JWT, forgotverify);
userRoutes.get("/appointmentlist", JWT, getappointmentlist);
userRoutes.put("/appointmentcompletetd/:id", completedappointment);
userRoutes.put("/appointmentcancelled/:id", cancelledappointment);
userRoutes.put("/appointments/reschedule/:id", rescheduled);
userRoutes.get("/getaddress", JWT, getaddress);
userRoutes.get("/staffcsv", JWT, csvdownload);
userRoutes.put("/getallnotification", JWT, getallnotification);
userRoutes.get("/checknotificationstatus", JWT, checknotificationstatus);

export default userRoutes;
