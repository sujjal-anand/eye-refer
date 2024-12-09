import bcrypt from "bcrypt";
import temp_doctors from "../models/temp_doctors";
import jwt from "jsonwebtoken";
import { transporter } from "../middleware/mailer";
import doctors from "../models/Doctors";
import Patients from "../models/Patients";
import { Op, where } from "sequelize";
import Addresses from "../models/adresses";
import Staff from "../models/staff";
const CsvParser = require("json2csv").Parser;
import Room from "../models/Room";
import { Parser } from "json2csv";
import Notification from "../models/Notification";
const JWT_SECRET = "123";

export const createuser = async (req: any, res: any) => {
  try {
    const { id, firstname, lastname, email, password, doctortype } = req.body;

    const existingUser = await doctors.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const generateRandomSixDigitNumber = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const otp = generateRandomSixDigitNumber();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await temp_doctors.create({
      id,
      firstname,
      lastname,
      doctortype,
      email,
      password: hashedPassword,
      otp,
    });

    const token = jwt.sign(
      {
        firstname,
        lastname,
        doctortype,
        email,
        password: hashedPassword,
        otp,
      },
      JWT_SECRET,
      {
        expiresIn: "1800s",
      }
    );

    const sendEmail = async (to: string, subject: string, html: string) => {
      const mailOptions = {
        from: "sujjalanand9877@gmail.com",
        to,
        subject,
        html,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };
    // console.log(token);
    await sendEmail(
      email,
      "Welcome to Our Service",
      `
  <html>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Welcome</h1>
        <p style="color: #555;">Thank you for signing up. Here are your login details:</p>
        <ul style="list-style: none; padding: 0;">
        <li>otp is ${otp}</li>
        </ul>
        <p style="color: #555;">We are glad to have you with us!</p>
        <p style="color: #333;">Best regards,<br>Shopeasy</p>
      </div>
    </body>
  </html>
  `
    );
    // console.log(token);
    return res.status(201).json({ user, token });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

export const verifyotp = async (req: any, res: any) => {
  try {
    // console.log("<><><><><><><", req.user);
    const { otp } = req.body;
    const email = req.user.email;
    // console.log(req.user.firstname);
    const tempDoctor = await temp_doctors.findOne({ where: { email } });
    // console.log(tempDoctor);
    if (!tempDoctor) {
      return res.status(404).json({ message: "User not found" });
    }

    if (otp === tempDoctor.otp) {
      await doctors.create({
        firstname: tempDoctor.firstname,
        lastname: tempDoctor.lastname,
        doctortype: tempDoctor.doctortype,
        email: tempDoctor.email,
        password: tempDoctor.password,
      });

      await temp_doctors.destroy({ where: { email } });

      return res.status(201).json({ message: "Registration successful" });
    }

    return res.status(400).json({ message: "Invalid OTP" });
  } catch (error) {
    console.error("Error in verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//resendotp
export const resendotp = async (req: any, res: any) => {
  try {
    const email = req.user.email;

    const generateRandomSixDigitNumber = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const otp = generateRandomSixDigitNumber();

    const response = await temp_doctors.update(
      { otp: otp },
      {
        where: { email },
      }
    );

    res.json(response).status(200);

    const sendEmail = async (to: string, subject: string, html: string) => {
      const mailOptions = {
        from: "sujjalanand9877@gmail.com",
        to,
        subject,
        html,
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    };

    await sendEmail(
      email,
      "Welcome to Our Service",
      `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333;">Welcome</h1>
    <p style="color: #555;">Thank you for signing up. Here are your login details:</p>
    <ul style="list-style: none; padding: 0;">
    <li>otp is ${otp}</li>
    </ul>
    <p style="color: #555;">We are glad to have you with us!</p>
    <p style="color: #333;">Best regards,<br>Shopeasy</p>
  </div>
</body>
</html>
`
    );
  } catch (error) {
    console.log("<<<<<<<<<<<<<<<<<", error);
  }
};

export const loginuser = async (req: any, res: any): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await doctors.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "wrong credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        doctortype: user.doctortype,
      },
      JWT_SECRET
    );

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        doctortype: user.doctortype,
      },
      token,
    });
    // console.log(token);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const doctordetail = async (req: any, res: any) => {
  try {
    const email = req.user.email;
    // console.log("<<<<<<<", email);

    const doctor = await doctors.findOne({ where: { email } });

    res.status(200).json({ doctor });
  } catch (error) {
    console.log(error);
  }
};

//refering a patient
export const referpatient = async (req: any, res: any) => {
  try {
    const referredby = req.user.id;
    // console.log("<<<<<<<<<<", referredby);
    const {
      id,
      dob,
      email,
      phone_no,
      firstname,
      lastname,
      gender,
      disease_name,
      laterality,
      return_to_care,
      timing,
      md_name,
      location,
      insurance_company_name,
      insurance_plan,
      notes,
      referredto,
    } = req.body;
    const documentation = req.file;
    // console.log("<<<<<<<<to", referredto);
    const name = await doctors.findOne({
      where: { id: referredto },
      attributes: ["firstname", "lastname"],
    });
    const referredtoname = `${name?.firstname} ${name?.lastname}`;
    // console.log("referredtoname", referredtoname);
    const response = await Patients.create({
      id,
      dob,
      email,
      phone_no,
      firstname,
      lastname,
      gender,
      disease_name,
      laterality,
      return_to_care,
      timing,
      md_name: "asdasda",
      location,
      insurance_company_name,
      insurance_plan,
      documentation: documentation ? documentation.path : null,
      notes,
      referredby: referredby,
      referredto,
      referredtoname,
    });
    res.status(200).json(response);
  } catch (error: any) {
    console.log(error);
  }
};

//list of all md doctors

export const mddoctors = async (req: any, res: any) => {
  try {
    const doctortype = "MD";
    const response = await doctors.findAndCountAll({
      where: { doctortype: doctortype },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

//list of all od doctors
export const odoctors = async (req: any, res: any) => {
  try {
    const doctortype = "OD";

    const response = await doctors.findAll({
      where: { doctortype: doctortype },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

//getreferred patient
export const getreferredpatient = async (req: any, res: any) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 2; // Default limit of 3 patients per page
    const offset = (page - 1) * limit;
    const id = req.user.id;
    const referredcount = await Patients.count({
      where: {
        referredby: id,
        Status: "Completed",
      },
    });

    // console.log(search);
    const response = await Patients.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { firstname: { [Op.like]: `%${search}%` } },
              { lastname: { [Op.like]: `%${search}%` } },
            ],
          },
          {
            [Op.or]: [{ referredby: id }],
          },
        ],
      },
      limit,
      offset,
    });
    // console.log(",", response.rows);

    res.status(200).json({
      count: response.count,
      rows: response.rows,
      totalPages: Math.ceil(response.count / limit),
      currentPage: page,
      refercompleted: referredcount,
    });
  } catch (error) {
    console.error("Error fetching referred patients:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//getnote
export const getnote = async (req: any, res: any) => {
  const { id } = req.params;
  // console.log("<<<<<<<<<<<<", id);
  const response = await Patients.findByPk(id, { attributes: ["notes"] });

  res.status(200).json(response);
};

//refer received
export const referreceived = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    console.log(id);

    const response = await Patients.findAndCountAll({
      where: { referredto: id },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

//totaldoctors

export const totaldoctors = async (req: any, res: any) => {
  try {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default limit of 3 doctors per page

    const offset = (page - 1) * limit;

    // Fetch doctors with pagination
    const response = await doctors.findAndCountAll({
      where: {
        [Op.or]: [
          { firstname: { [Op.like]: `%${search}%` } },
          { lastname: { [Op.like]: `%${search}%` } },
        ],
      },
      limit,
      offset,
    });

    // Response with total count and rows
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changepassword = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    const { oldpassword, newpassword } = req.body;
    const response: any = await doctors.findOne({ where: { id: id } });
    const passcompare = await bcrypt.compare(oldpassword, response.password);
    if (passcompare) {
      const hashedpassword = await bcrypt.hash(newpassword, 10);
      // console.log(hashedpassword);
      const success = await response.update({ password: hashedpassword });
      res.status(200).json(success);
    } else {
      console.log("wrong password");
    }
  } catch (error) {
    console.log(error);
  }
};

export const deletepatient = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const response = await Patients.destroy({ where: { id } });
    const message = "patient deleted successfully";
    res.json({ response, message }).status(200);
  } catch (error) {
    console.log(error);
  }
};

export const updatepatient = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log("<<<", id);
    const user = await Patients.findOne({ where: { id } });
    const response = await user?.update(req?.body);
    res.json(response).status(200);
  } catch (error) {
    console.log(error);
  }
};

export const getpatient = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const response = await Patients.findOne({ where: { id } });
    res.json(response).status(200);
  } catch (error) {
    console.log(error);
  }
};

export const updatedoctor = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    const { gender, phoneno } = req.body;
    const profilephoto = req.file;
    // console.log("////////////////", profilephoto);

    const user = await doctors.findOne({ where: { id } });
    const response = await user?.update({
      gender,
      phoneno,
      profilephoto: profilephoto ? profilephoto.path : null,
    });
    res.json(response).status(200);
  } catch (error: any) {
    console.log(error);
  }
};

export const addaddress = async (req: any, res: any) => {
  const id = req.user.id;
  const {
    addresstitle,
    officenumber,
    faxno,
    street,
    city,
    state,
    country,
    zip,
  } = req.body;
  const response = await Addresses.create({
    addresstitle,
    officenumber,
    faxno,
    street,
    city,
    state,
    country,
    zip,
    doctorid: id,
  });
  res.status(200).json(response);
};

export const getaddress = async (req: any, res: any) => {
  try {
    const id = req.user.id;

    // Fetching addresses for the doctor
    const response = await Addresses.findAll({
      where: { doctorid: id },
    });

    if (response.length === 0) {
      return res.status(404).json({ message: "No addresses found" });
    }

    // Returning the list of addresses
    res.json(response);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//add a staff
export const addstaff = async (req: any, res: any) => {
  const id = req.user.id;
  const { firstname, lastname, email, gender, phoneno } = req.body;
  const response = await Staff.create({
    firstname,
    lastname,
    email,
    gender,
    phoneno,
    doctorid: id,
  });
  res.json(response).status(200);
};

//delete staff
export const deletestaff = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const response = await Staff.destroy({ where: { id } });
    res.json(response).status(200);
  } catch (error) {
    console.log(error);
  }
};

//getstaff
export const getstaff = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    const response = await Staff.findAll({ where: { doctorid: id } });
    res.json(response).status(200);
  } catch (error) {
    console.log(error);
  }
};

//forgot pass
export const forgotpassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const user = await doctors.findOne({ where: { email } });
    if (user) {
      const generateRandomSixDigitNumber = () => {
        return Math.floor(100000 + Math.random() * 900000);
      };

      const otp = generateRandomSixDigitNumber();

      await user.update({ tempotp: otp });

      const sendEmail = async (to: string, subject: string, html: string) => {
        const mailOptions = {
          from: "sujjalanand9877@gmail.com",
          to,
          subject,
          html,
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log("Email sent: " + info.response);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      };

      await sendEmail(
        email,
        "Welcome to Our Service",
        `
<html>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4;">
<div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
  <h1 style="color: #333;">Welcome</h1>
  <p style="color: #555;">Thank you for signing up. Here are your login details:</p>
  <ul style="list-style: none; padding: 0;">
  <li>otp is ${otp}</li>
  </ul>
  <p style="color: #555;">We are glad to have you with us!</p>
  <p style="color: #333;">Best regards,<br>Shopeasy</p>
</div>
</body>
</html>
`
      );

      setTimeout(async () => {
        await doctors.update({ tempotp: null }, { where: { email } });
        // console.log(`OTP removed for ${email}`);
      }, 1800000);

      const token = jwt.sign(
        {
          email,
          otp,
        },
        JWT_SECRET,
        {
          expiresIn: "1800s",
        }
      );
      res.status(200).json({ token });
    } else {
      res.status(404).send("user not found");
    }
  } catch (error) {
    console.log(error);
  }
};

export const getRooms = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    // console.log(id);

    const user = await doctors.findOne({ where: { id } });
    // console.log("<<<<<<", user);

    if (user) {
      const rooms = await Room.findAll({
        where: {
          [Op.or]: [{ user_id_1: user.id }, { user_id_2: user.id }],
        },
        include: [
          {
            model: doctors,
            as: "doc1", // Matches alias
          },
          {
            model: doctors,
            as: "doc2", // Matches alias
          },
          {
            model: Patients,
            as: "patient", // Matches alias
          },
        ],
      });

      res.status(200).json({ room: rooms, user: user });
    } else {
      res.status(404).json({ message: "You're not authorized" });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotverify = async (req: any, res: any) => {
  try {
    const id = req.user.email;
    // console.log("id", id); // For debugging purposes
    const { otp, password } = req.body;

    const user = await doctors.findOne({ where: { email: id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (otp !== user.tempotp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and reset OTP
    await user.update({
      password: hashedPassword,
      tempotp: null,
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Error during password reset:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getappointmentlist = async (req: any, res: any) => {
  try {
    const id = req?.user.id;

    console.log("idddddddddddd", id);
    const response = await Patients.findAll({
      where: {
        referredTO: id,
        Status: "pending",
      },
    });
    console.log(response);
    res.status(200).json(response);
  } catch (error: any) {
    console.error("Error fetching appointment list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const completedappointment = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await Patients.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await user.update({ Status: "Completed" });

    res
      .status(200)
      .json({ message: "Appointment status updated to Completed", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment status", error });
  }
};

export const cancelledappointment = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await Patients.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await user.update({ Status: "cancelled" });

    res
      .status(200)
      .json({ message: "Appointment status updated to cancelled", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating appointment status", error });
  }
};

export const rescheduled = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const { date, appointmenttype } = req.body;

    const user = await Patients.findOne({ where: { id } });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (appointmenttype === "Surgery") {
      await user.update({
        appointmenttype: appointmenttype,
        surgerydate: date,
        appointmentdate: date,
        consulatationdate: null,
      });
    } else if (appointmenttype === "Consultation") {
      await user.update({
        appointmenttype: appointmenttype,
        consulatationdate: date,
        appointmentdate: date,
        surgerydate: null,
      });
    } else {
      return res.status(400).json({ message: "Invalid appointment type" });
    }

    res
      .status(200)
      .json({ message: "Appointment rescheduled successfully", user });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const csvdownload = async (req: any, res: any) => {
  try {
    const id = req?.user?.id;

    // Fetch the staff records associated with the doctor id
    const stafflist = await Staff.findAll({
      where: { doctorid: id },
      raw: true,
    });

    if (stafflist.length === 0) {
      return res.status(404).json({ message: "No staff records found." });
    }

    // Create an instance of the Parser to convert JSON to CSV
    const csvParser = new Parser();
    const csvData = csvParser.parse(stafflist); // Convert the stafflist to CSV format

    // Set the headers to download the CSV file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=stafflist.csv");

    // Send the CSV data as the response
    res.status(200).send(csvData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const getallnotification = async (req: any, res: any) => {
  try {
    const id = req?.user?.id;

    // Fetch notifications where room_id matches and seen is 'No'
    const notifications = await Notification.findAll({
      where: { room_id: id },
    });

    if (notifications.length > 0) {
      // Update all notifications to set seen as 'Yes'
      await Notification.update(
        { seen: "Yes" },
        { where: { room_id: id, seen: "No" } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Notifications updated successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checknotificationstatus = async (req: any, res: any) => {
  try {
    const id = req?.user?.id;

    // Count notifications with seen = 'No'
    const unseenCount = await Notification.count({
      where: { room_id: id, seen: "No" },
    });

    const status = unseenCount > 0 ? "red" : "green";
    const message =
      unseenCount > 0
        ? "You have unread notifications."
        : "All notifications are seen.";

    res.status(200).json({
      status,
      message,
      unreadCount: unseenCount, // Add unread count to the response
    });
  } catch (error) {
    console.error("Error checking notification status:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
export const deleteaddress = async (req: any, res: any) => {
  const id = req.params;
};
