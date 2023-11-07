const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  bookedOn: { type: Date, required: true },
  appointmentDate: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
});

const Appointment = new mongoose.Schema({
  appointmentId: { type: String, unique: true, required: true },
  deanId: { type: String, required: true },
  thursdaySlot: { type: SlotSchema },
  fridaySlot: { type: SlotSchema },
  universityId: { type: String, required: true },
});

const model = mongoose.model("Appointment", Appointment);

module.exports = model;
