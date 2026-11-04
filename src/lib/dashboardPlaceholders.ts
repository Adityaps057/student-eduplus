/**
 * VVCE LMS - Student Dashboard Backend Placeholders & Data Models
 * Total Backend Placeholders Found: 47 across 7 Domains
 */

export interface PlaceholderMeta {
  id: string;
  label: string;
  category:
    | "Student Identity & Auth"
    | "Academic Performance & Metrics"
    | "Today's Schedule & Classes"
    | "Assignments & Coursework"
    | "Upcoming Tests & CIE"
    | "Campus Announcements & Notices"
    | "Campus Services & Utilities";
  source: string; // Database table & column or Supabase RPC
  description: string;
  sampleValue: string;
}

export const DASHBOARD_PLACEHOLDERS: PlaceholderMeta[] = [
  // Domain 1: Student Identity & Auth (9 Placeholders)
  {
    id: "student_name",
    label: "Student Display Name",
    category: "Student Identity & Auth",
    source: "auth.users.raw_user_meta_data->>'name' | public.user_profiles.display_name",
    description: "The full name of the logged-in student displayed on greeting and identity badge.",
    sampleValue: "Aditya P S",
  },
  {
    id: "student_usn",
    label: "University Seat Number (USN) / Roll No",
    category: "Student Identity & Auth",
    source: "auth.users.email (prefix) | public.students.usn",
    description: "The unique college roll number / USN of the student (e.g. 4VV22CS057).",
    sampleValue: "4VV22CS057",
  },
  {
    id: "student_email",
    label: "Official College Email",
    category: "Student Identity & Auth",
    source: "auth.users.email",
    description: "Institutional email address under @vvce.ac.in domain.",
    sampleValue: "4vv22cs057@vvce.ac.in",
  },
  {
    id: "student_program",
    label: "Degree Program / Branch",
    category: "Student Identity & Auth",
    source: "public.programs.name | public.students.program_name",
    description: "Department branch and degree program enrolled (e.g., Computer Science & Engineering).",
    sampleValue: "B.E. Computer Science & Engineering",
  },
  {
    id: "student_semester",
    label: "Current Academic Semester",
    category: "Student Identity & Auth",
    source: "public.academic_semesters.semester_number | public.students.current_semester",
    description: "Current enrolled semester of the student.",
    sampleValue: "Semester 5",
  },
  {
    id: "student_section",
    label: "Assigned Section / Batch",
    category: "Student Identity & Auth",
    source: "public.sections.name | public.students.section_name",
    description: "Division or section assigned to the student cohort.",
    sampleValue: "Section A",
  },
  {
    id: "academic_year",
    label: "Current Academic Year & Term",
    category: "Student Identity & Auth",
    source: "public.academic_years.name",
    description: "Active academic calendar year and term.",
    sampleValue: "2026-2027 (Odd Semester)",
  },
  {
    id: "academic_status",
    label: "Enrollment Status",
    category: "Student Identity & Auth",
    source: "public.students.enrollment_status",
    description: "Current status of enrollment (Active, Regular, Provisional).",
    sampleValue: "Active Regular",
  },
  {
    id: "student_avatar",
    label: "Student Avatar / Profile Photo",
    category: "Student Identity & Auth",
    source: "public.user_profiles.avatar_url | initials generator",
    description: "Profile photo URL or fallback initials generator.",
    sampleValue: "AP",
  },

  // Domain 2: Academic Performance & Metrics (7 Placeholders)
  {
    id: "attendance_overall",
    label: "Overall Attendance Percentage",
    category: "Academic Performance & Metrics",
    source: "public.attendance_summary.overall_percentage | aggregate(public.attendance)",
    description: "Aggregated overall attendance percentage across all enrolled subjects.",
    sampleValue: "92.4%",
  },
  {
    id: "attendance_status",
    label: "Attendance Compliance Label",
    category: "Academic Performance & Metrics",
    source: "computed (attendance_overall >= 85% ? 'Safe' : 'Shortage Warning')",
    description: "Indicator showing whether attendance satisfies the 85% mandatory threshold.",
    sampleValue: "Above 85% requirement",
  },
  {
    id: "cgpa_value",
    label: "Cumulative Grade Point Average (CGPA)",
    category: "Academic Performance & Metrics",
    source: "public.student_exam_records.cgpa",
    description: "Cumulative GPA calculated across all completed semesters.",
    sampleValue: "8.72 / 10.0",
  },
  {
    id: "sgpa_value",
    label: "Semester Grade Point Average (SGPA)",
    category: "Academic Performance & Metrics",
    source: "public.student_exam_records.sgpa (latest semester)",
    description: "GPA achieved in the most recently completed semester.",
    sampleValue: "8.90",
  },
  {
    id: "credits_progress",
    label: "Credits Earned vs Required",
    category: "Academic Performance & Metrics",
    source: "public.student_credits.earned || ' / ' || public.programs.required_credits",
    description: "Completed course credits out of total degree requirements.",
    sampleValue: "104 / 160 Credits",
  },
  {
    id: "pending_assignments_count",
    label: "Pending Assignments Count",
    category: "Academic Performance & Metrics",
    source: "count(public.assignments WHERE status = 'pending')",
    description: "Total number of assignments awaiting submission.",
    sampleValue: "3 Due",
  },
  {
    id: "upcoming_tests_count",
    label: "Upcoming Internal Tests (CIE) Count",
    category: "Academic Performance & Metrics",
    source: "count(public.cie_schedules WHERE exam_date >= CURRENT_DATE)",
    description: "Total number of scheduled CIE or laboratory assessments.",
    sampleValue: "2 Scheduled",
  },

  // Domain 3: Today's Schedule & Classes (8 Placeholders)
  {
    id: "class_status",
    label: "Lecture Status Indicator",
    category: "Today's Schedule & Classes",
    source: "computed from schedule.start_time & schedule.end_time ('Live Now' | 'Next' | 'Upcoming')",
    description: "Real-time class status relative to current system time.",
    sampleValue: "Live Now",
  },
  {
    id: "class_subject_code",
    label: "Course / Subject Code",
    category: "Today's Schedule & Classes",
    source: "public.subjects.code",
    description: "VTU / autonomous subject code (e.g. BCS501).",
    sampleValue: "BCS501",
  },
  {
    id: "class_subject_name",
    label: "Course / Subject Name",
    category: "Today's Schedule & Classes",
    source: "public.subjects.name",
    description: "Official title of the subject course.",
    sampleValue: "Data Structures & Algorithms",
  },
  {
    id: "class_faculty_name",
    label: "Faculty / Instructor Name",
    category: "Today's Schedule & Classes",
    source: "public.faculty.display_name",
    description: "Name of professor or assistant professor conducting the class.",
    sampleValue: "Dr. Ramesh Kumar",
  },
  {
    id: "class_time_slot",
    label: "Class Time Slot",
    category: "Today's Schedule & Classes",
    source: "public.timetable_slots.start_time || ' - ' || public.timetable_slots.end_time",
    description: "Scheduled start and finish times for the lecture.",
    sampleValue: "09:00 AM - 10:00 AM",
  },
  {
    id: "class_room_location",
    label: "Classroom / Laboratory Hall",
    category: "Today's Schedule & Classes",
    source: "public.rooms.room_number || ' (' || public.rooms.block || ')'",
    description: "Physical room, lab, or auditorium where class is held.",
    sampleValue: "Lab 204 (CSE Block)",
  },
  {
    id: "class_session_type",
    label: "Session Type",
    category: "Today's Schedule & Classes",
    source: "public.timetable_slots.session_type ('Theory' | 'Lab' | 'Tutorial')",
    description: "Pedagogical category of the class session.",
    sampleValue: "Lab Practical",
  },
  {
    id: "class_subject_attendance",
    label: "Subject Attendance Rate",
    category: "Today's Schedule & Classes",
    source: "public.attendance.subject_percentage",
    description: "Subject-specific attendance percentage and classes attended tally.",
    sampleValue: "94% (32/34 attended)",
  },

  // Domain 4: Assignments & Coursework (7 Placeholders)
  {
    id: "assignment_title",
    label: "Assignment Title",
    category: "Assignments & Coursework",
    source: "public.assignments.title",
    description: "Title of coursework assignment or project task.",
    sampleValue: "Binary Search Tree Implementation",
  },
  {
    id: "assignment_subject",
    label: "Assignment Subject Name",
    category: "Assignments & Coursework",
    source: "public.subjects.name",
    description: "Subject under which assignment was issued.",
    sampleValue: "Data Structures & Algorithms",
  },
  {
    id: "assignment_deadline",
    label: "Assignment Submission Deadline",
    category: "Assignments & Coursework",
    source: "public.assignments.deadline_timestamp",
    description: "Due date and time formatted for student reference.",
    sampleValue: "Nov 03, 2026 - 11:59 PM",
  },
  {
    id: "assignment_countdown",
    label: "Days Left / Deadline Countdown",
    category: "Assignments & Coursework",
    source: "computed (assignments.deadline_timestamp - now())",
    description: "Human-readable time remaining for submission.",
    sampleValue: "Due in 2 days",
  },
  {
    id: "assignment_priority",
    label: "Assignment Priority Level",
    category: "Assignments & Coursework",
    source: "public.assignments.priority ('High' | 'Medium' | 'Low')",
    description: "Weightage urgency or teacher-flagged priority tag.",
    sampleValue: "High",
  },
  {
    id: "assignment_status",
    label: "Submission Status",
    category: "Assignments & Coursework",
    source: "public.assignment_submissions.status ('pending' | 'submitted' | 'graded')",
    description: "Current submission lifecycle status of the student.",
    sampleValue: "Pending Submission",
  },
  {
    id: "assignment_max_marks",
    label: "Assignment Maximum Marks",
    category: "Assignments & Coursework",
    source: "public.assignments.max_marks",
    description: "Maximum score and CIE contribution points.",
    sampleValue: "20 Marks",
  },

  // Domain 5: Upcoming Tests & CIE (7 Placeholders)
  {
    id: "test_exam_name",
    label: "Exam / Assessment Name",
    category: "Upcoming Tests & CIE",
    source: "public.cie_schedules.exam_type (e.g. 'CIE 2', 'Lab Exam', 'SEE')",
    description: "Evaluation title and test series milestone.",
    sampleValue: "CIE 2 (Continuous Internal Evaluation)",
  },
  {
    id: "test_subject",
    label: "Examination Subject & Code",
    category: "Upcoming Tests & CIE",
    source: "public.subjects.name || ' (' || public.subjects.code || ')'",
    description: "Course tested in this examination slot.",
    sampleValue: "Web Technologies (BCS515B)",
  },
  {
    id: "test_date",
    label: "Scheduled Exam Date",
    category: "Upcoming Tests & CIE",
    source: "public.cie_schedules.exam_date",
    description: "Calendar date on which test is conducted.",
    sampleValue: "Nov 08, 2026",
  },
  {
    id: "test_time",
    label: "Exam Time Slot & Duration",
    category: "Upcoming Tests & CIE",
    source: "public.cie_schedules.start_time || ' - ' || public.cie_schedules.end_time",
    description: "Examination session time window.",
    sampleValue: "10:00 AM - 11:30 AM",
  },
  {
    id: "test_room",
    label: "Allocated Exam Hall & Desk",
    category: "Upcoming Tests & CIE",
    source: "public.exam_seating.hall_name || ' (Desk #' || public.exam_seating.desk_no || ')'",
    description: "Assigned seating desk and test hall location.",
    sampleValue: "Hall 301 (Desk #24)",
  },
  {
    id: "test_syllabus",
    label: "Syllabus / Modules Covered",
    category: "Upcoming Tests & CIE",
    source: "public.cie_schedules.syllabus_scope",
    description: "Curriculum modules or topics included in test scope.",
    sampleValue: "Modules 3 & 4 (DOM Manipulation, State & Routing)",
  },
  {
    id: "test_max_marks",
    label: "Total Exam Marks",
    category: "Upcoming Tests & CIE",
    source: "public.cie_schedules.max_marks",
    description: "Maximum evaluative marks for the test.",
    sampleValue: "50 Marks",
  },

  // Domain 6: Campus Announcements & Notices (5 Placeholders)
  {
    id: "notice_title",
    label: "Notice / Announcement Headline",
    category: "Campus Announcements & Notices",
    source: "public.announcements.title",
    description: "Headline of the official department or college announcement.",
    sampleValue: "CIE-2 Schedule & Timetable Released",
  },
  {
    id: "notice_category",
    label: "Notice Category Badge",
    category: "Campus Announcements & Notices",
    source: "public.announcements.category ('Exam' | 'Academic' | 'Transport' | 'Club')",
    description: "Organizational tag classifying the announcement.",
    sampleValue: "Exam",
  },
  {
    id: "notice_timestamp",
    label: "Notice Publishing Date/Time",
    category: "Campus Announcements & Notices",
    source: "public.announcements.created_at",
    description: "When the announcement was published to students.",
    sampleValue: "1 hour ago",
  },
  {
    id: "notice_body",
    label: "Notice Summary Content",
    category: "Campus Announcements & Notices",
    source: "public.announcements.content_summary",
    description: "Brief preview or instructions for the student body.",
    sampleValue: "End-semester and CIE-2 exam schedules for Nov 2026 have been published.",
  },
  {
    id: "notice_priority",
    label: "Notice Urgency Flag",
    category: "Campus Announcements & Notices",
    source: "public.announcements.is_urgent",
    description: "High priority flag indicating urgent student attention needed.",
    sampleValue: "Important",
  },

  // Domain 7: Campus Services & Utilities (4 Placeholders)
  {
    id: "bus_route_status",
    label: "Bus Route Status & Tracker",
    category: "Campus Services & Utilities",
    source: "public.student_transport.route_name || ' - ' || public.bus_logs.current_status",
    description: "Current status of student's designated college bus route.",
    sampleValue: "Bus #04 (Vijayanagar - On Time)",
  },
  {
    id: "club_activity_status",
    label: "Enrolled Club Activity & Meeting",
    category: "Campus Services & Utilities",
    source: "public.club_events.club_name || ' (' || public.club_events.title || ')'",
    description: "Upcoming meeting or workshop for clubs the student belongs to.",
    sampleValue: "CodeSync (Weekly Meet @ 4:00 PM)",
  },
  {
    id: "fee_dues_status",
    label: "Tuition / Exam Fee Dues Status",
    category: "Campus Services & Utilities",
    source: "public.student_accounts.balance_status",
    description: "Financial clearance status for current academic semester.",
    sampleValue: "Odd Sem Tuition Paid - No Dues",
  },
  {
    id: "library_loans_status",
    label: "Library Book Loan Return Due",
    category: "Campus Services & Utilities",
    source: "public.library_loans.due_notice",
    description: "Notice of borrowed books and impending due dates.",
    sampleValue: "1 Book Due in 3 days (Algorithms by Cormen)",
  },
];

/**
 * Extracts and sanitizes student identification from auth session or storage.
 * Calls out user name and roll number / USN dynamically.
 */
export function extractStudentCredentials(session: any) {
  const user = session?.user;
  const rawEmail = (user?.email || "").trim().toLowerCase();
  
  // Extract USN: If email is "4vv22cs057@vvce.ac.in", USN is "4VV22CS057"
  let usn = "4VV22CS057";
  if (rawEmail.includes("@")) {
    const prefix = rawEmail.split("@")[0];
    if (prefix) {
      usn = prefix.toUpperCase();
    }
  } else if (user?.user_metadata?.usn) {
    usn = String(user.user_metadata.usn).toUpperCase();
  }

  // Extract Name: Check user_metadata.name, full_name, display_name or fallback to USN
  let name = user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    "";

  // If name is missing or mismatched from old cached session, resolve correctly
  if (!name || name === "Student Profile" || (name === "Aditya P S" && usn === "4VV21IS042")) {
    if (usn === "4VV21IS042") {
      name = "Pooja Sharma";
    } else if (usn === "4VV22CS057") {
      name = "Aditya P S";
    } else if (usn.startsWith("4VV")) {
      name = `Student (${usn})`;
    } else {
      name = "Aditya P S";
    }
  }

  // Determine Branch from USN code (e.g. CS -> Computer Science, IS -> Information Science)
  let program = "B.E. Computer Science & Engineering";
  let section = "Section A";
  if (usn.includes("IS")) {
    program = "B.E. Information Science & Engineering";
    section = "Section B";
  } else if (usn.includes("EC")) {
    program = "B.E. Electronics & Communication";
    section = "Section C";
  } else if (usn.includes("ME")) {
    program = "B.E. Mechanical Engineering";
    section = "Section A";
  } else if (usn.includes("AI") || usn.includes("AD")) {
    program = "B.E. Artificial Intelligence & Data Science";
    section = "Section A";
  }

  return {
    name,
    usn,
    email: rawEmail || `${usn.toLowerCase()}@vvce.ac.in`,
    program,
    semester: "Semester 5",
    section,
    academicYear: "2026-2027 (Odd Sem)",
    enrollmentStatus: "Active Regular",
    avatarInitials: name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ST",
  };
}
