import { supabase } from "./supabase";
import { extractStudentCredentials } from "./dashboardPlaceholders";

export interface ClassScheduleItem {
  id: string | number;
  time: string;
  subject: string;
  subjectCode: string;
  professor: string;
  room: string;
  type: "Lab" | "Theory" | "Tutorial";
  status: "Live Now" | "Next" | "Upcoming" | "Completed";
  attendanceRate: string;
}

export interface AssignmentItem {
  id: string | number;
  title: string;
  subject: string;
  subjectCode: string;
  deadline: string;
  daysLeft: string;
  priority: "High" | "Medium" | "Low";
  status: "pending" | "submitted" | "graded";
  maxMarks: string;
}

export interface UpcomingTestItem {
  id: string | number;
  name: string;
  subject: string;
  subjectCode: string;
  date: string;
  time: string;
  room: string;
  syllabus: string;
  maxMarks: string;
}

export interface NoticeItem {
  id: string | number;
  title: string;
  category: "Exam" | "Academic" | "Transport" | "Club" | "General";
  time: string;
  body: string;
  isUrgent?: boolean;
}

export interface StudentDashboardData {
  identity: ReturnType<typeof extractStudentCredentials>;
  metrics: {
    overallAttendance: string;
    attendanceStatus: string;
    cgpa: string;
    sgpa: string;
    creditsEarned: string;
    pendingAssignmentsCount: number;
    upcomingTestsCount: number;
  };
  todayClasses: ClassScheduleItem[];
  pendingAssignments: AssignmentItem[];
  upcomingTests: UpcomingTestItem[];
  recentNotices: NoticeItem[];
  campusServices: {
    busRoute: string;
    clubActivity: string;
    feeStatus: string;
    libraryLoans: string;
  };
}

export const defaultDashboardData: StudentDashboardData = {
  identity: {
    name: "Aditya P S",
    usn: "4VV22CS057",
    email: "4vv22cs057@vvce.ac.in",
    program: "B.E. Computer Science & Engineering",
    semester: "Semester 5",
    section: "Section A",
    academicYear: "2026-2027 (Odd Sem)",
    enrollmentStatus: "Active Regular",
    avatarInitials: "AP",
  },
  metrics: {
    overallAttendance: "92.4%",
    attendanceStatus: "Above 85% requirement",
    cgpa: "8.72 / 10.0",
    sgpa: "8.90",
    creditsEarned: "104 / 160 Credits",
    pendingAssignmentsCount: 3,
    upcomingTestsCount: 2,
  },
  todayClasses: [
    {
      id: "cls-1",
      time: "9:00 AM - 10:00 AM",
      subject: "Data Structures & Algorithms",
      subjectCode: "BCS501",
      professor: "Dr. Ramesh Kumar",
      room: "Lab 204",
      type: "Lab",
      status: "Live Now",
      attendanceRate: "94% (32/34 attended)",
    },
    {
      id: "cls-2",
      time: "10:15 AM - 11:15 AM",
      subject: "Database Management Systems",
      subjectCode: "BCS502",
      professor: "Prof. Anjali Sharma",
      room: "Room 301",
      type: "Theory",
      status: "Next",
      attendanceRate: "91% (30/33 attended)",
    },
    {
      id: "cls-3",
      time: "11:30 AM - 12:30 PM",
      subject: "Operating Systems",
      subjectCode: "BCS503",
      professor: "Dr. Vikram Patel",
      room: "Room 104",
      type: "Theory",
      status: "Upcoming",
      attendanceRate: "88% (29/33 attended)",
    },
    {
      id: "cls-4",
      time: "1:30 PM - 3:30 PM",
      subject: "Computer Networks Lab",
      subjectCode: "BCS504",
      professor: "Prof. Suresh Naik",
      room: "Network Lab 302",
      type: "Lab",
      status: "Upcoming",
      attendanceRate: "96% (16/17 attended)",
    },
  ],
  pendingAssignments: [
    {
      id: "asg-1",
      title: "Binary Search Tree Implementation",
      subject: "Data Structures & Algorithms",
      subjectCode: "BCS501",
      deadline: "Nov 03, 2026 - 11:59 PM",
      daysLeft: "Due in 2 days",
      priority: "High",
      status: "pending",
      maxMarks: "20 Marks (CIE)",
    },
    {
      id: "asg-2",
      title: "ER Diagram Design & Relational Schema",
      subject: "Database Management Systems",
      subjectCode: "BCS502",
      deadline: "Nov 06, 2026 - 05:00 PM",
      daysLeft: "Due in 5 days",
      priority: "Medium",
      status: "pending",
      maxMarks: "15 Marks",
    },
    {
      id: "asg-3",
      title: "CPU Process Scheduling Algorithms Report",
      subject: "Operating Systems",
      subjectCode: "BCS503",
      deadline: "Nov 09, 2026 - 11:59 PM",
      daysLeft: "Due in 1 week",
      priority: "Low",
      status: "pending",
      maxMarks: "10 Marks",
    },
  ],
  upcomingTests: [
    {
      id: "tst-1",
      name: "CIE 2",
      subject: "Web Technologies",
      subjectCode: "BCS515B",
      date: "Nov 08, 2026",
      time: "10:00 AM - 11:30 AM",
      room: "Hall 301 (Desk #24)",
      syllabus: "Modules 3 & 4 (DOM APIs, React Architecture & Hooks)",
      maxMarks: "50 Marks",
    },
    {
      id: "tst-2",
      name: "CIE 2",
      subject: "Computer Networks",
      subjectCode: "BCS504",
      date: "Nov 12, 2026",
      time: "2:00 PM - 3:30 PM",
      room: "Seminar Hall B (Desk #12)",
      syllabus: "Modules 1-3 (Physical Layer, Data Link & Network Layer)",
      maxMarks: "50 Marks",
    },
  ],
  recentNotices: [
    {
      id: "notif-1",
      title: "CIE-2 Schedule & Timetable Released",
      category: "Exam",
      time: "1 hour ago",
      body: "Continuous Internal Evaluation 2 timetable for 5th semester CSE has been officially published.",
      isUrgent: true,
    },
    {
      id: "notif-2",
      title: "CodeSync Club Hackathon Registration Open",
      category: "Club",
      time: "3 hours ago",
      body: "Register your teams for HackVVCE 2026 before November 10th. Cash prizes and internship awards.",
      isUrgent: false,
    },
    {
      id: "notif-3",
      title: "Bus Route #04 Evening Schedule Notice",
      category: "Transport",
      time: "Yesterday",
      body: "Bus #04 departure from campus gate 2 will operate on normal schedule at 5:15 PM.",
      isUrgent: false,
    },
  ],
  campusServices: {
    busRoute: "Bus #04 (Route: Vijayanagar - On Time)",
    clubActivity: "CodeSync (Weekly Meet Today @ 4:00 PM)",
    feeStatus: "Odd Sem Tuition Paid - No Dues",
    libraryLoans: "1 Book Due in 3 days (Introduction to Algorithms)",
  },
};

/**
 * Loads student dashboard data asynchronously, querying Supabase backend
 * tables if populated, with graceful offline fallback.
 */
export async function loadStudentDashboard(
  activeSession: any
): Promise<StudentDashboardData> {
  // 1. Resolve student identity from active login session
  const identity = extractStudentCredentials(activeSession);

  // 2. Prepare base dataset starting with fallback defaults
  const data: StudentDashboardData = {
    ...defaultDashboardData,
    identity,
  };

  try {
    const studentUSN = identity.usn;

    // A. Query Student Record from Supabase
    const { data: studentRecord } = await supabase
      .from("students")
      .select("*")
      .ilike("usn", studentUSN)
      .maybeSingle();

    if (studentRecord) {
      data.identity.name = studentRecord.full_name || data.identity.name;
      data.identity.usn = studentRecord.usn || data.identity.usn;
      data.identity.program = studentRecord.program_name || data.identity.program;
      data.identity.semester = studentRecord.semester || data.identity.semester;
      data.identity.section = studentRecord.section_name || data.identity.section;
      data.identity.academicYear = studentRecord.academic_year || data.identity.academicYear;
      data.identity.enrollmentStatus = studentRecord.enrollment_status || data.identity.enrollmentStatus;
      data.identity.avatarInitials = (studentRecord.full_name || data.identity.name)
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || data.identity.avatarInitials;
    } else if (studentUSN.toUpperCase() === "4VV21IS042") {
      data.identity.name = "Pooja Sharma";
      data.identity.usn = "4VV21IS042";
      data.identity.program = "B.E. Information Science & Engineering";
      data.identity.semester = "Semester 5";
      data.identity.section = "Section B";
      data.identity.avatarInitials = "PS";
    }

    // B. Query Student Metrics (Attendance, CGPA, SGPA)
    const { data: metricsRecord } = await supabase
      .from("student_metrics")
      .select("*")
      .ilike("student_usn", studentUSN)
      .maybeSingle();

    if (metricsRecord) {
      data.metrics.overallAttendance = `${metricsRecord.overall_attendance}%`;
      data.metrics.attendanceStatus = metricsRecord.attendance_status;
      data.metrics.cgpa = `${metricsRecord.cgpa} / 10.0`;
      data.metrics.sgpa = `${metricsRecord.sgpa}`;
      data.metrics.creditsEarned = metricsRecord.credits_earned;
    } else if (studentUSN.toUpperCase() === "4VV21IS042") {
      data.metrics.overallAttendance = "88.5%";
      data.metrics.attendanceStatus = "Above 85% requirement";
      data.metrics.cgpa = "8.54 / 10.0";
      data.metrics.sgpa = "8.60";
      data.metrics.creditsEarned = "100 / 160 Credits";
    }

    // C. Query Today's Classes
    const targetSection = data.identity.section || "Section A";
    const { data: scheduleRecords } = await supabase
      .from("class_schedules")
      .select("*")
      .eq("section_name", targetSection)
      .order("sort_order", { ascending: true });

    if (scheduleRecords && scheduleRecords.length > 0) {
      data.todayClasses = scheduleRecords.map((r) => ({
        id: r.id,
        time: r.time_slot,
        subject: r.subject,
        subjectCode: r.subject_code,
        professor: r.professor,
        room: r.room,
        type: r.session_type,
        status: r.status,
        attendanceRate: r.attendance_rate,
      }));
    }

    // D. Query Pending Assignments
    const { data: assignmentRecords } = await supabase
      .from("student_assignments")
      .select("*")
      .eq("section_name", targetSection)
      .order("deadline", { ascending: true });

    if (assignmentRecords && assignmentRecords.length > 0) {
      data.pendingAssignments = assignmentRecords.map((r) => {
        const deadlineDate = new Date(r.deadline);
        const daysDiff = Math.ceil(
          (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const countdown =
          daysDiff <= 0
            ? "Due today"
            : daysDiff === 1
            ? "Due tomorrow"
            : `Due in ${daysDiff} days`;

        return {
          id: r.id,
          title: r.title,
          subject: r.subject,
          subjectCode: r.subject_code,
          deadline: deadlineDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          daysLeft: countdown,
          priority: r.priority,
          status: r.status,
          maxMarks: r.max_marks,
        };
      });
      data.metrics.pendingAssignmentsCount = data.pendingAssignments.length;
    }

    // E. Query Upcoming CIE Tests
    const { data: testRecords } = await supabase
      .from("student_cie_tests")
      .select("*")
      .eq("section_name", targetSection)
      .order("exam_date", { ascending: true });

    if (testRecords && testRecords.length > 0) {
      data.upcomingTests = testRecords.map((r) => ({
        id: r.id,
        name: r.name,
        subject: r.subject,
        subjectCode: r.subject_code,
        date: new Date(r.exam_date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: r.time_slot,
        room: r.room,
        syllabus: r.syllabus,
        maxMarks: r.max_marks,
      }));
      data.metrics.upcomingTestsCount = data.upcomingTests.length;
    }

    // F. Query Campus Announcements
    const { data: announcementRecords } = await supabase
      .from("campus_announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (announcementRecords && announcementRecords.length > 0) {
      data.recentNotices = announcementRecords.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        time: new Date(r.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        body: r.body,
        isUrgent: r.is_urgent,
      }));
    }

    // G. Query Campus Services
    const { data: servicesRecord } = await supabase
      .from("campus_services")
      .select("*")
      .eq("student_usn", studentUSN)
      .maybeSingle();

    if (servicesRecord) {
      data.campusServices = {
        busRoute: servicesRecord.bus_route,
        clubActivity: servicesRecord.club_activity,
        feeStatus: servicesRecord.fee_status,
        libraryLoans: servicesRecord.library_loans,
      };
    }
  } catch (err) {
    // Graceful offline fallback
    console.warn("Supabase fetch fallback:", err);
  }

  return data;
}
