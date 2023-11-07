const UserModel = require("../model/user");
const Appointment = require("../model/appointment");
const uuid = require("uuid");

function getUpcomingThursdayAndFriday() {
  var currentDate = new Date();
  var currentDayOfWeek = currentDate.getDay();
  var daysUntilThursday = 4 - currentDayOfWeek;
  if (daysUntilThursday <= 0) {
    daysUntilThursday += 7;
  }
  var daysUntilFriday = 5 - currentDayOfWeek;
  if (daysUntilFriday <= 0) {
    daysUntilFriday += 7;
  }
  var upcomingThursday = new Date();
  upcomingThursday.setDate(currentDate.getDate() + daysUntilThursday);
  upcomingThursday.setHours(10, 0, 0, 0);

  var upcomingFriday = new Date();
  upcomingFriday.setDate(currentDate.getDate() + daysUntilFriday);
  upcomingFriday.setHours(10, 0, 0, 0);

  return { upcomingThursday, upcomingFriday };
}

const getEndTime = (upcomingDateTime) => {
  var endTime = new Date(upcomingDateTime);
  endTime.setHours(endTime.getHours() + 1);
  return endTime;
};

function getLastSaturday() {
  let currentDate = new Date();
  let currentDayOfWeek = currentDate.getDay();
  let daysUntilLastSaturday = currentDayOfWeek + 1;
  let lastSaturday = new Date();
  lastSaturday.setDate(currentDate.getDate() - daysUntilLastSaturday);
  lastSaturday.setHours(0, 0, 0, 0);

  return lastSaturday;
}

const meetDeanStudent = async (req, res) => {
  let appointmentId = uuid.v4().substring(0, 8).toUpperCase();
  const bookedOn = new Date();
  const { deanId, appointmentDay } = req.body;

  const dean = await UserModel.findOne({
    userId: deanId,
    universityId: req.user.universityId,
    role: "dean",
  });
  if (!dean) {
    return res.json({
      status: "Error",
      error: "Dean not find",
    });
  }
  const thursdayAppointment = await Appointment.findOne({
    "thursdaySlot.studentId": req.user.userId,
    $or: [
      { "thursdaySlot.appointmentDate": { $gt: getLastSaturday() } },
      { "fridaySlot.appointmentDate": { $gt: getLastSaturday() } },
    ],
  });
  if (thursdayAppointment) {
    return res.json({
      status: "Error",
      error: "student can not book appoiment twice",
    });
  } else {
    const fridayAppointment = await Appointment.findOne({
      "fridaySlot.studentId": req.user.userId,
      $or: [
        { "thursdaySlot.appointmentDate": { $gt: getLastSaturday() } },
        { "fridaySlot.appointmentDate": { $gt: getLastSaturday() } },
      ],
    });
    if (fridayAppointment) {
      return res.json({
        status: "Error",
        error: "student can not book appoiment twice",
      });
    }
  }

  if (appointmentDay === "thursday") {
    var sessionDate = getUpcomingThursdayAndFriday().upcomingThursday;
  } else if (appointmentDay === "friday") {
    var sessionDate = getUpcomingThursdayAndFriday().upcomingFriday;
  } else {
    console.log("appointmentDay not find in req body thursday or friday");
    return res.json({
      status: "Error",
      error: "appointmentDay not find in req body thursday or friday",
    });
  }

  try {
    const findDean = await Appointment.findOne({
      deanId,
      $or: [
        { "thursdaySlot.appointmentDate": { $gt: getLastSaturday() } },
        { "fridaySlot.appointmentDate": { $gt: getLastSaturday() } },
      ],
    });
    if (
      findDean?.thursdaySlot?.appointmentDate &&
      findDean?.fridaySlot?.appointmentDate
    ) {
      return res.json({
        status: "Appointment slots full!",
        error: "",
      });
    } else if (
      findDean?.thursdaySlot?.appointmentDate &&
      appointmentDay === "thursday"
    ) {
      return res.json({
        status: "Appointment slots thursday has already booked!",
        error: "",
      });
    } else if (
      findDean?.fridaySlot?.appointmentDate &&
      appointmentDay === "friday"
    ) {
      return res.json({
        status: "Appointment slots friday has already booked!",
        error: "",
      });
    } else if (
      findDean?.thursdaySlot?.appointmentDate &&
      appointmentDay === "friday"
    ) {
      findDean.fridaySlot = {
        bookedOn,
        studentId: req.user.userId,
        appointmentDate: sessionDate,
        startTime: sessionDate,
        endTime: getEndTime(sessionDate),
      };
      await findDean.save();
      return res.json({
        status: "Appointment friday slot successfully booked !",
        error: "",
      });
    } else if (
      findDean?.fridaySlot?.appointmentDate &&
      appointmentDay === "thursday"
    ) {
      findDean.thursdaySlot = {
        bookedOn,
        studentId: req.user.userId,
        appointmentDate: sessionDate,
        startTime: sessionDate,
        endTime: getEndTime(sessionDate),
      };
      await findDean.save();
      return res.json({
        status: "Appointment thursday slot successfully booked!",
        error: "",
      });
    } else if (!findDean) {
      const appointment = await Appointment.create({
        appointmentId,
        deanId,
        universityId: req.user.universityId,
        ...(appointmentDay === "thursday"
          ? {
              thursdaySlot: {
                bookedOn,
                studentId: req.user.userId,
                appointmentDate: sessionDate,
                startTime: sessionDate,
                endTime: getEndTime(sessionDate),
              },
            }
          : {
              fridaySlot: {
                bookedOn,
                studentId: req.user.userId,
                appointmentDate: sessionDate,
                startTime: sessionDate,
                endTime: getEndTime(sessionDate),
              },
            }),
      });

      if (!appointment) {
        return res.json({
          status: "Error",
          error: "Appoiment not schedule",
        });
      } else {
        return res.json({
          status: "Appointment Scheduled",
          error: "",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      status: "Error",
      error: "student can not book appoiment twice",
    });
  }
};

const deanAppoinment = async (req, res) => {
  userId = req.user.userId;
  const currentDate = new Date();
  try {
    const deanAppoinmentDetails = await Appointment.findOne({
      deanId: userId,
      $or: [
        { "thursdaySlot.appointmentDate": { $gt: getLastSaturday() } },
        { "fridaySlot.appointmentDate": { $gt: getLastSaturday() } },
      ],
    });
    if (deanAppoinmentDetails) {
      if (
        deanAppoinmentDetails?.thursdaySlot &&
        !deanAppoinmentDetails?.fridaySlot &&
        deanAppoinmentDetails?.thursdaySlot.appointmentDate < currentDate
      ) {
        return res.json({
          status: "there is no appoiment schedule",
          error: "",
        });
      }
      if (
        deanAppoinmentDetails?.thursdaySlot &&
        deanAppoinmentDetails?.fridaySlot &&
        deanAppoinmentDetails?.thursdaySlot.appointmentDate < currentDate
      ) {
        return res.json({
          _id: deanAppoinmentDetails._id,
          appointmentId: deanAppoinmentDetails.appointmentId,
          deanId: deanAppoinmentDetails.deanId,
          fridaySlot: {
            bookedOn: deanAppoinmentDetails.fridaySlot.bookedOn,
            studentId: deanAppoinmentDetails.fridaySlot.studentId,
            appointmentDate: deanAppoinmentDetails.fridaySlot.appointmentDate,
            startTime: deanAppoinmentDetails.fridaySlot.startTime,
            endTime: deanAppoinmentDetails.fridaySlot.endTime,
            _id: deanAppoinmentDetails.fridaySlot._id,
          },
          universityId: deanAppoinmentDetails.universityId,
        });
      } else {
        return res.json(deanAppoinmentDetails);
      }
    } else {
      res.json({ status: "there is no appoiment schedule", error: "" });
    }
  } catch (e) {
    console.log(e);
  }
};

const studentAppoinment = async (req, res) => {
  userId = req.user.userId;
  try {
    const studentAppoinmentDetails = await Appointment.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { "thursdaySlot.appointmentDate": { $gt: getLastSaturday() } },
                { "thursdaySlot.studentId": userId },
              ],
            },
            {
              $and: [
                { "fridaySlot.appointmentDate": { $gt: getLastSaturday() } },
                { "fridaySlot.studentId": userId },
              ],
            },
          ],
        },
      },
      {
        $addFields: {
          bookedSlot: {
            $cond: [
              { $eq: ["$thursdaySlot.studentId", userId] },
              "$thursdaySlot",
              "$fridaySlot",
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          appointmentId: 1,
          deanId: 1,
          universityId: 1,
          bookedSlot: 1,
        },
      },
    ]);
    if (studentAppoinmentDetails) {
      return res.json(studentAppoinmentDetails);
    } else {
      res.json({ status: "Error", error: "there is no appoiment schedule" });
    }
  } catch (e) {
    console.log(e);
  }
};

const freeSession = async (req, res) => {
  user = req.user;
  try {
    const deans = await UserModel.find({
      role: "dean",
      universityId: user.universityId,
    });
    const bookedDean = await Appointment.find({
      universityId: user.universityId,
      $or: [
        { "thursdaySlot.appointmentDate": { $gt: getLastSaturday() } },
        { "fridaySlot.appointmentDate": { $gt: getLastSaturday() } },
      ],
    });
    const freeDeans = deans.filter((item) => {
      return !bookedDean.some((subItem) => subItem.deanId === item.userId && subItem.thursdaySlot && subItem.fridaySlot);
    });
    return res.json({
      status: "Ok",
      freeDeans: freeDeans.map((item) => item.userId),
    });
  } catch (e) {
    return res.json({ status: "error", error: "dean error" });
  }
};

module.exports = {
  meetDeanStudent,
  deanAppoinment,
  studentAppoinment,
  freeSession,
};
