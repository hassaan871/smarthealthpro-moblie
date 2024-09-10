const moment = require("moment");

// Function to extract patient info from appointments
const extractPatientInfo = (appointments) => {
  return appointments
    .filter(
      (appointment) => appointment.appointmentStatus.toLowerCase() === "tbd"
    )
    .map((appointment) => {
      const bookedOn = moment(appointment.bookedOn);
      return {
        id: appointment._id,
        priority: appointment.priority,
        booking_time: bookedOn.format("hh:mm A"),
        booking_day: bookedOn.format("dddd").toLowerCase(),
        doctorId: appointment.doctor.id,
        originalAppointment: appointment,
      };
    });
};

// Function to generate time slots for a given day based on doctor ID
const generateTimeSlots = (doctorId, day) => {
  const doctor = getDoctorById(doctorId);
  const office_hours = doctor.office_hours;
  const office_hour_range = office_hours[day.toLowerCase()];

  if (!office_hour_range || office_hour_range.toLowerCase() === "closed")
    return [];

  const [start, end] = office_hour_range.split(" - ");
  let start_time = moment(start, "hh:mm A");
  const end_time = moment(end, "hh:mm A");
  const slots = [];

  while (start_time.isBefore(end_time)) {
    const slot_start = start_time.format("hh:mm A");
    start_time.add(30, "minutes");
    const slot_end = start_time.format("hh:mm A");
    slots.push({ start: slot_start, end: slot_end });
  }

  return slots;
};

// Function to sort patients by priority, booking day, and time
const sortPatients = (patients) => {
  const day_order = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return patients.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    if (a.booking_day !== b.booking_day)
      return day_order[a.booking_day] - day_order[b.booking_day];
    return moment(a.booking_time, "hh:mm A").diff(
      moment(b.booking_time, "hh:mm A")
    );
  });
};

// Function to assign time slots to sorted patients
const assignTimeSlots = (patients) => {
  const assigned_appointments = [];
  const waiting = [];

  // Get tomorrow's date and day name
  const tomorrow = moment().add(1, "day");
  const tomorrowDay = tomorrow.format("dddd").toLowerCase();
  const tomorrowDate = tomorrow.format("YYYY-MM-DD");

  // Only process if there are patients and we have a doctor
  if (patients.length > 0) {
    const doctorId = patients[0].doctorId;
    const time_slots = generateTimeSlots(doctorId, tomorrowDay);

    for (const slot of time_slots) {
      if (patients.length === 0) break;
      const patient = patients.shift();
      assigned_appointments.push({
        patient: patient,
        assigned_slot: slot,
        assigned_day: tomorrowDay,
        assigned_date: tomorrowDate,
      });
    }

    // Add remaining patients to waiting list
    waiting.push(...patients);
  }

  return {
    assigned: assigned_appointments,
    waiting: waiting,
  };
};

app.post("/schedule-appointments", async (req, res) => {
  const appointments = await Appointment.find();

  // Extract patient info from appointments
  const patients = extractPatientInfo(appointments);

  // Sort patients by the defined priority and booking time rules
  const sorted_patients = sortPatients(patients);

  // Assign time slots to sorted patients
  const { assigned, waiting } = assignTimeSlots(sorted_patients);

  // Prepare the response
  const response = {
    message: "Appointments scheduled successfully",
    scheduled: {},
    waiting: waiting.map((p) => ({
      id: p.id,
      appointment: p.originalAppointment,
    })),
  };

  const tomorrowDay = moment().add(1, "day").format("dddd").toLowerCase();

  if (assigned.length > 0) {
    response.scheduled[tomorrowDay] = assigned.map((appointment) => ({
      id: appointment.patient.id,
      assigned_slot: `${appointment.assigned_slot.start} - ${appointment.assigned_slot.end}`,
      assigned_day: appointment.assigned_day,
      assigned_date: appointment.assigned_date,
      appointment: {
        ...appointment.patient.originalAppointment,
        date: appointment.assigned_date,
        time: `${appointment.assigned_slot.start} - ${appointment.assigned_slot.end}`,
        appointmentStatus: "scheduled",
      },
    }));
  }

  res.status(200).json(response);
});
