import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    actual: Number,
    present: Number,
    absent: Number,
    staff_id: String,
    staff_name: String,
  }, { _id: false });
   
  const SemesterSchema = new mongoose.Schema({
    total_actual: Number,
    total_present: Number,
    total_absent: Number,
    subjects: { type: Map, of: SubjectSchema },
  }, { _id: false });
  
  const ProgramSchema = new mongoose.Schema({
    total_actual: Number,
    total_present: Number,
    total_absent: Number,
    semesters: { type: Map, of: SemesterSchema },
  }, { _id: false });
  
  const SchoolSchema = new mongoose.Schema({
    total_actual: Number,
    total_present: Number,
    total_absent: Number,
    programs: { type: Map, of: ProgramSchema },
  }, { _id: false });
  
  const AttendanceSchema = new mongoose.Schema({
    date: { type: String, required: true }, // Format: DD-MM-YYYY
    schools: { type: Map, of: SchoolSchema },
  }, { timestamps: true });
  

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
export default Attendance;
