import { motion } from "motion/react";
import {
  Clock,
  MapPin,
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Award,
  GraduationCap,
  BookOpen,
  User,
  Database,
  Eye,
  EyeOff,
  BellRing,
  Bus,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  BookCheck,
  Building2,
  IdCard,
  Inbox,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { BackendPlaceholderTag } from "../components/BackendPlaceholderTag";
import {
  DASHBOARD_PLACEHOLDERS,
  PlaceholderMeta,
  extractStudentCredentials,
} from "@/lib/dashboardPlaceholders";
import {
  loadStudentDashboard,
  StudentDashboardData,
  defaultDashboardData,
} from "@/lib/dashboardService";
import { Skeleton } from "../components/ui/skeleton";

export function Dashboard() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const outlet = useOutletContext<{
    session?: any;
    userUSN?: string;
    userName?: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<StudentDashboardData>(defaultDashboardData);
  const [isInspecting, setIsInspecting] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);

  // Initialize and load dashboard data with live session / credentials
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Resolve session either from router outlet context or localStorage
        let currentSession = outlet?.session;
        if (!currentSession) {
          const stored = localStorage.getItem("vvce_student_session");
          if (stored) {
            try {
              currentSession = JSON.parse(stored);
            } catch {
              currentSession = null;
            }
          }
        }

        const resolved = await loadStudentDashboard(currentSession);
        if (isMounted) {
          if (outlet?.userUSN) resolved.identity.usn = outlet.userUSN;
          if (outlet?.userName && outlet.userName !== "Student Profile") {
            // Only adopt outlet name if not conflicting with USN mapping
            if (resolved.identity.usn === "4VV21IS042") {
              resolved.identity.name = "Pooja Sharma";
            } else if (resolved.identity.usn === "4VV22CS057") {
              resolved.identity.name = "Aditya P S";
            } else {
              resolved.identity.name = outlet.userName;
            }
          }
          setData(resolved);
        }
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [outlet?.session, outlet?.userUSN, outlet?.userName]);

  const priorityColors: Record<string, string> = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const categories = [
    "all",
    "Student Identity & Auth",
    "Academic Performance & Metrics",
    "Today's Schedule & Classes",
    "Assignments & Coursework",
    "Upcoming Tests & CIE",
    "Campus Announcements & Notices",
    "Campus Services & Utilities",
  ];

  const filteredPlaceholders =
    activeCategoryFilter === "all"
      ? DASHBOARD_PLACEHOLDERS
      : DASHBOARD_PLACEHOLDERS.filter((p) => p.category === activeCategoryFilter);

  // Strictly view-only dataset loaded directly from backend
  const currentClasses = data.todayClasses;
  const currentAssignments = data.pendingAssignments;
  const currentTests = data.upcomingTests;
  const currentNotices = data.recentNotices;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* ==================================================================== */}
        {/* 1. STUDENT IDENTITY & WELCOME HERO BANNER                            */}
        {/* ==================================================================== */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Student Avatar & Key Info */}
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-2xl tracking-wider shadow-md">
                  {isLoading ? (
                    <Skeleton className="w-full h-full rounded-2xl" />
                  ) : (
                    data.identity.avatarInitials || "ST"
                  )}
                </div>
                <BackendPlaceholderTag
                  id="student_avatar"
                  source="user_profiles.avatar_url"
                  isInspecting={isInspecting}
                  className="absolute -bottom-2 -left-1"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    Welcome back,{" "}
                    <span className="text-black">
                      {isLoading ? (
                        <span className="text-zinc-400 font-normal">Loading student...</span>
                      ) : (
                        data.identity.name || "[Student Name]"
                      )}
                    </span>
                  </h1>
                  <BackendPlaceholderTag
                    id="student_name"
                    source="auth.users.user_metadata.name | user_profiles.display_name"
                    isInspecting={isInspecting}
                  />
                </div>

                {/* Primary Student Credentials Callout (Name & USN) */}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  {/* Roll Number / USN Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-900 text-white font-mono font-semibold text-xs tracking-wider">
                    <IdCard size={14} className="text-zinc-300" />
                    <span>USN: {isLoading ? "..." : (data.identity.usn || "[USN TBA]")}</span>
                  </span>
                  <BackendPlaceholderTag
                    id="student_usn"
                    source="students.usn | auth.users.email (prefix)"
                    isInspecting={isInspecting}
                  />

                  {/* Program / Department */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium text-xs border border-zinc-200">
                    <Building2 size={13} className="text-zinc-500" />
                    <span>{data.identity.program || "[Program TBA]"}</span>
                  </span>
                  <BackendPlaceholderTag
                    id="student_program"
                    source="programs.name"
                    isInspecting={isInspecting}
                  />

                  {/* Semester & Section */}
                  <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium text-xs border border-zinc-200">
                    {data.identity.semester || "Semester —"} • {data.identity.section || "Section —"}
                  </span>
                  <BackendPlaceholderTag
                    id="student_semester"
                    source="academic_semesters.semester_number"
                    isInspecting={isInspecting}
                  />

                  {/* Academic Year */}
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs border border-zinc-200">
                    {data.identity.academicYear || "AY —"}
                  </span>
                  <BackendPlaceholderTag
                    id="academic_year"
                    source="academic_years.name"
                    isInspecting={isInspecting}
                  />

                  {/* Status Badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {data.identity.enrollmentStatus || "Enrolled"}
                  </span>
                  <BackendPlaceholderTag
                    id="academic_status"
                    source="students.enrollment_status"
                    isInspecting={isInspecting}
                  />
                </div>
              </div>
            </div>

            {/* Dashboard Action Controls & Read-Only Status Indicator */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
              {/* Read-Only Official Status Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-zinc-100 text-zinc-600 border border-zinc-200 select-none cursor-default"
                title="All academic records are managed by the institution. Student view is strictly read-only."
              >
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Verified Record • View Only</span>
              </div>

              {/* Inspector Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsInspecting(!isInspecting)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all border ${
                  isInspecting
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {isInspecting ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>
                  {isInspecting ? "Hide Backend Tags" : "Inspect Placeholders"}
                </span>
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 font-mono">
                  47
                </span>
              </button>

              {/* View Placeholders Directory */}
              <button
                type="button"
                onClick={() => setShowDirectoryModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors"
              >
                <Database size={14} />
                <span>Placeholders Catalog</span>
              </button>
            </div>
          </div>

          {/* Inspector Active Helper Alert */}
          {isInspecting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex flex-wrap items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <Database size={16} className="text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Backend Placeholder Inspector Active:</strong> All 47
                  backend spaceholders are highlighted with their Supabase table
                  and schema bindings.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectoryModal(true)}
                className="font-bold underline hover:text-amber-950"
              >
                View full schema table →
              </button>
            </motion.div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 2. ACADEMIC KPI PERFORMANCE METRICS CARDS (4 CARDS)                  */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Attendance */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Overall Attendance
              </span>
              <Calendar size={18} className="text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  data.metrics.overallAttendance || "0.0%"
                )}
              </span>
              <BackendPlaceholderTag
                id="attendance_overall"
                source="attendance_summary.overall_percentage"
                isInspecting={isInspecting}
              />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 size={14} />
              <span>{data.metrics.attendanceStatus || "Requirement status pending"}</span>
              <BackendPlaceholderTag
                id="attendance_status"
                source="computed (overall >= 85%)"
                isInspecting={isInspecting}
              />
            </div>
          </div>

          {/* Card 2: Cumulative GPA (CGPA) */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Cumulative CGPA
              </span>
              <Award size={18} className="text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  data.metrics.cgpa || "— / 10.0"
                )}
              </span>
              <BackendPlaceholderTag
                id="cgpa_value"
                source="student_exam_records.cgpa"
                isInspecting={isInspecting}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
              <span className="font-medium">
                Latest SGPA: <strong>{data.metrics.sgpa || "—"}</strong>
              </span>
              <BackendPlaceholderTag
                id="sgpa_value"
                source="student_exam_records.sgpa"
                isInspecting={isInspecting}
              />
            </div>
          </div>

          {/* Card 3: Pending Coursework */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Assignments Pending
              </span>
              <BookOpen size={18} className="text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  currentAssignments.length
                )}
              </span>
              <span className="text-xs text-zinc-500 font-medium">tasks due</span>
              <BackendPlaceholderTag
                id="pending_assignments_count"
                source="assignments.pending_count"
                isInspecting={isInspecting}
              />
            </div>
            <div className="mt-3 text-xs text-amber-700 font-medium truncate">
              {currentAssignments.length > 0
                ? `Next: ${currentAssignments[0].daysLeft}`
                : "No pending coursework"}
            </div>
          </div>

          {/* Card 4: Upcoming Tests / CIE */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:border-zinc-300 transition-all">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Upcoming CIE / Exams
              </span>
              <GraduationCap size={18} className="text-zinc-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  currentTests.length
                )}
              </span>
              <span className="text-xs text-zinc-500 font-medium">scheduled</span>
              <BackendPlaceholderTag
                id="upcoming_tests_count"
                source="cie_schedules.upcoming_count"
                isInspecting={isInspecting}
              />
            </div>
            <div className="mt-3 text-xs text-zinc-600 font-medium truncate">
              {currentTests.length > 0
                ? `Next: ${currentTests[0].subject} (${currentTests[0].date})`
                : "No scheduled exams"}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. TODAY'S CLASS SCHEDULE (CAROUSEL & TIME SLOTS)                    */}
        {/* ==================================================================== */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900">
                  Today's Lecture Schedule
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {currentClasses.length} Sessions
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Real-time lecture and laboratory schedule for {data.identity.semester || "Semester —"}{" "}
                {data.identity.section || "Section —"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/timetable"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-black mr-2"
              >
                Full Timetable <ArrowRight size={14} />
              </Link>
              {currentClasses.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollBy({
                          left: -380,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={18} className="text-zinc-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (scrollContainerRef.current) {
                        scrollContainerRef.current.scrollBy({
                          left: 380,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={18} className="text-zinc-700" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Skeletons while loading */}
          {isLoading ? (
            <div className="flex gap-4 overflow-x-hidden pb-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full sm:w-[380px] bg-zinc-50 border border-zinc-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="pt-3 border-t border-zinc-200 flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : currentClasses.length === 0 ? (
            /* Empty State Placeholder */
            <div className="p-8 border border-dashed border-zinc-300 rounded-xl text-center bg-zinc-50/50">
              <Calendar className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-zinc-800">
                No classes scheduled for today
              </h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                There are no theory or practical laboratory sessions listed on
                the schedule for today.
              </p>
              <Link
                to="/timetable"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 underline hover:text-black"
              >
                Check Weekly Timetable
              </Link>
            </div>
          ) : (
            /* Live carousel of lecture sessions */
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {currentClasses.map((cls, idx) => (
                <motion.div
                  key={cls.id || idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex-shrink-0 w-full sm:w-[380px] bg-zinc-50/70 border border-zinc-200 rounded-xl p-5 snap-start relative flex flex-col justify-between hover:border-zinc-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            cls.status === "Live Now"
                              ? "bg-black text-white"
                              : cls.status === "Next"
                              ? "bg-zinc-800 text-white"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {cls.status === "Live Now" && (
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                          )}
                          {cls.status || "Upcoming"}
                        </span>
                        <BackendPlaceholderTag
                          id="class_status"
                          source="schedule.time_status"
                          isInspecting={isInspecting}
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-zinc-500 bg-white px-2 py-0.5 rounded border border-zinc-200">
                          {cls.type || "Theory"}
                        </span>
                        <BackendPlaceholderTag
                          id="class_session_type"
                          source="timetable_slots.session_type"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    {/* Course Code & Title */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-zinc-500">
                          {cls.subjectCode || "[Code TBA]"}
                        </span>
                        <BackendPlaceholderTag
                          id="class_subject_code"
                          source="subjects.code"
                          isInspecting={isInspecting}
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                          {cls.subject || "[Subject Title TBA]"}
                        </h3>
                        <BackendPlaceholderTag
                          id="class_subject_name"
                          source="subjects.name"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    {/* Faculty */}
                    <div className="flex items-center gap-1 text-sm text-zinc-600 mb-3">
                      <User size={14} className="text-zinc-400" />
                      <span>{cls.professor || "[Faculty TBA]"}</span>
                      <BackendPlaceholderTag
                        id="class_faculty_name"
                        source="faculty.display_name"
                        isInspecting={isInspecting}
                      />
                    </div>
                  </div>

                  {/* Footer: Time & Room & Attendance Rate */}
                  <div className="pt-3 border-t border-zinc-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-700">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-zinc-400" />
                        <span className="font-medium">{cls.time || "[Time TBA]"}</span>
                        <BackendPlaceholderTag
                          id="class_time_slot"
                          source="timetable_slots.time_range"
                          isInspecting={isInspecting}
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-zinc-400" />
                        <span className="font-semibold">{cls.room || "[Room TBA]"}</span>
                        <BackendPlaceholderTag
                          id="class_room_location"
                          source="rooms.room_number"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    {/* Course Attendance Pill */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 bg-white p-1.5 rounded border border-zinc-200">
                      <span>Course Attendance</span>
                      <div className="flex items-center gap-1">
                        <strong className="text-zinc-800">
                          {cls.attendanceRate || "—"}
                        </strong>
                        <BackendPlaceholderTag
                          id="class_subject_attendance"
                          source="attendance.subject_percentage"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 4. TWO-COLUMN WORKFLOW: ASSIGNMENTS & UPCOMING TESTS                 */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column A: Pending Assignments */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Coursework & Pending Assignments
                </h3>
                <p className="text-xs text-zinc-500">
                  Submissions requiring action before upcoming deadlines
                </p>
              </div>
              <Link
                to="/assignments"
                className="text-xs font-semibold text-zinc-700 hover:text-black flex items-center gap-1"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : currentAssignments.length === 0 ? (
              /* Empty state placeholder */
              <div className="p-8 border border-dashed border-zinc-300 rounded-xl text-center bg-zinc-50/50">
                <BookOpen className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-zinc-800">
                  No pending assignments
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  You are all caught up! No coursework submissions are currently pending.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentAssignments.map((asg, index) => (
                  <div
                    key={asg.id || index}
                    className="bg-zinc-50/70 border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-zinc-900 font-semibold text-sm">
                            {asg.title || "[Assignment Title]"}
                          </h4>
                          <BackendPlaceholderTag
                            id="assignment_title"
                            source="assignments.title"
                            isInspecting={isInspecting}
                          />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                          <span>{asg.subject || "[Subject]"}</span>
                          <BackendPlaceholderTag
                            id="assignment_subject"
                            source="subjects.name"
                            isInspecting={isInspecting}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            priorityColors[asg.priority] || "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {asg.priority || "Normal"} Priority
                        </span>
                        <BackendPlaceholderTag
                          id="assignment_priority"
                          source="assignments.priority"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-200/70 flex flex-wrap items-center justify-between text-xs text-zinc-600 gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-amber-600" />
                        <span className="font-medium text-amber-700">
                          {asg.daysLeft || "Upcoming"}
                        </span>
                        <BackendPlaceholderTag
                          id="assignment_countdown"
                          source="computed (deadline - now())"
                          isInspecting={isInspecting}
                        />
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500">{asg.deadline || "[Deadline TBA]"}</span>
                        <BackendPlaceholderTag
                          id="assignment_deadline"
                          source="assignments.deadline_timestamp"
                          isInspecting={isInspecting}
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 font-medium">
                          {asg.maxMarks || "—"}
                        </span>
                        <BackendPlaceholderTag
                          id="assignment_max_marks"
                          source="assignments.max_marks"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column B: Upcoming Tests & CIE */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Upcoming Continuous Internal Evaluation (CIE)
                </h3>
                <p className="text-xs text-zinc-500">
                  Scheduled written tests, laboratory exams, and seating allocations
                </p>
              </div>
              <Link
                to="/exam-reports"
                className="text-xs font-semibold text-zinc-700 hover:text-black flex items-center gap-1"
              >
                Exam Reports <ArrowRight size={13} />
              </Link>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : currentTests.length === 0 ? (
              /* Empty state placeholder */
              <div className="p-8 border border-dashed border-zinc-300 rounded-xl text-center bg-zinc-50/50">
                <GraduationCap className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-zinc-800">
                  No upcoming CIE or examinations
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  There are no scheduled evaluations listed for your department at this moment.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentTests.map((tst, index) => (
                  <div
                    key={tst.id || index}
                    className="bg-zinc-50/70 border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-black text-white px-2.5 py-0.5 rounded text-xs font-bold tracking-wide">
                          {tst.name || "CIE"}
                        </span>
                        <BackendPlaceholderTag
                          id="test_exam_name"
                          source="cie_schedules.exam_type"
                          isInspecting={isInspecting}
                        />
                        <span className="text-xs font-medium text-zinc-500">
                          {tst.subjectCode || "[Code]"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-zinc-800 bg-white px-2 py-0.5 rounded border border-zinc-200">
                          Max: {tst.maxMarks || "—"}
                        </span>
                        <BackendPlaceholderTag
                          id="test_max_marks"
                          source="cie_schedules.max_marks"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <h4 className="text-zinc-900 font-bold text-sm">
                        {tst.subject || "[Subject TBA]"}
                      </h4>
                      <BackendPlaceholderTag
                        id="test_subject"
                        source="subjects.name"
                        isInspecting={isInspecting}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-zinc-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} className="text-zinc-400" />
                        <span>{tst.date || "[Date TBA]"}</span>
                        <BackendPlaceholderTag
                          id="test_date"
                          source="cie_schedules.exam_date"
                          isInspecting={isInspecting}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={13} className="text-zinc-400" />
                        <span>{tst.time || "[Time TBA]"}</span>
                        <BackendPlaceholderTag
                          id="test_time"
                          source="cie_schedules.start_time"
                          isInspecting={isInspecting}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={13} className="text-zinc-400" />
                        <span className="font-semibold text-zinc-800">
                          {tst.room || "[Hall TBA]"}
                        </span>
                        <BackendPlaceholderTag
                          id="test_room"
                          source="exam_seating.hall_name"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-zinc-200/80 text-xs text-zinc-600 flex items-start justify-between gap-2">
                      <span>
                        <strong className="text-zinc-800">Syllabus:</strong>{" "}
                        {tst.syllabus || "[Syllabus to be notified]"}
                      </span>
                      <BackendPlaceholderTag
                        id="test_syllabus"
                        source="cie_schedules.syllabus_scope"
                        isInspecting={isInspecting}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 5. CAMPUS ANNOUNCEMENTS & RECENT ADVISORIES                          */}
        {/* ==================================================================== */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BellRing size={20} className="text-zinc-800" />
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Campus & Department Bulletins
                </h3>
                <p className="text-xs text-zinc-500">
                  Official notices issued for {data.identity.program || "Students"}
                </p>
              </div>
            </div>
            <Link
              to="/notifications"
              className="text-xs font-semibold text-zinc-700 hover:text-black flex items-center gap-1"
            >
              All Notifications <ArrowRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : currentNotices.length === 0 ? (
            <div className="p-6 border border-dashed border-zinc-300 rounded-xl text-center bg-zinc-50/50">
              <BellRing className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-zinc-800">
                No active announcements
              </h4>
              <p className="text-xs text-zinc-500 mt-1">
                There are currently no new circulars or departmental alerts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentNotices.map((notice, idx) => (
                <div
                  key={notice.id || idx}
                  className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-zinc-200 text-zinc-800">
                          {notice.category || "General"}
                        </span>
                        <BackendPlaceholderTag
                          id="notice_category"
                          source="announcements.category"
                          isInspecting={isInspecting}
                        />
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <span>{notice.time || "Recent"}</span>
                        <BackendPlaceholderTag
                          id="notice_timestamp"
                          source="announcements.created_at"
                          isInspecting={isInspecting}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-1">
                      <h4 className="text-zinc-900 font-bold text-sm">
                        {notice.title || "[Notice Headline]"}
                      </h4>
                      <BackendPlaceholderTag
                        id="notice_title"
                        source="announcements.title"
                        isInspecting={isInspecting}
                      />
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2 mb-2">
                      {notice.body || "[No additional details provided]"}
                    </p>
                    <BackendPlaceholderTag
                      id="notice_body"
                      source="announcements.content_summary"
                      isInspecting={isInspecting}
                    />
                  </div>

                  {notice.isUrgent && (
                    <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px] text-red-600 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <AlertCircle size={12} /> High Priority Alert
                      </span>
                      <BackendPlaceholderTag
                        id="notice_priority"
                        source="announcements.is_urgent"
                        isInspecting={isInspecting}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* 6. CAMPUS SERVICES & STUDENT UTILITIES BAR                           */}
        {/* ==================================================================== */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-900">
              Campus Utilities & Student Services
            </h3>
            <span className="text-xs text-zinc-500">Live service telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Bus Schedule */}
            <Link
              to="/bus-schedules"
              className="p-3.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                  <Bus size={16} />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Bus Tracker</div>
                  <div className="text-zinc-500 text-[11px]">
                    {data.campusServices.busRoute || "[Route Unassigned]"}
                  </div>
                </div>
              </div>
              <BackendPlaceholderTag
                id="bus_route_status"
                source="student_transport.route_name"
                isInspecting={isInspecting}
              />
            </Link>

            {/* Club Activity */}
            <Link
              to="/clubs"
              className="p-3.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Club Meets</div>
                  <div className="text-zinc-500 text-[11px]">
                    {data.campusServices.clubActivity || "[No Meets Today]"}
                  </div>
                </div>
              </div>
              <BackendPlaceholderTag
                id="club_activity_status"
                source="club_events.club_name"
                isInspecting={isInspecting}
              />
            </Link>

            {/* Fee Dues */}
            <Link
              to="/exam-reports"
              className="p-3.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Fee Status</div>
                  <div className="text-zinc-500 text-[11px]">
                    {data.campusServices.feeStatus || "[No Pending Dues]"}
                  </div>
                </div>
              </div>
              <BackendPlaceholderTag
                id="fee_dues_status"
                source="student_accounts.balance_status"
                isInspecting={isInspecting}
              />
            </Link>

            {/* Library Loans */}
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center">
                  <BookCheck size={16} />
                </div>
                <div>
                  <div className="font-semibold text-zinc-900">Library Book</div>
                  <div className="text-zinc-500 text-[11px]">
                    {data.campusServices.libraryLoans || "[No Active Loans]"}
                  </div>
                </div>
              </div>
              <BackendPlaceholderTag
                id="library_loans_status"
                source="library_loans.due_notice"
                isInspecting={isInspecting}
              />
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MODAL 1: PLACEHOLDERS DIRECTORY (ALL 47 SPACEHOLDERS CATALOG)        */}
        {/* ==================================================================== */}
        {showDirectoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-zinc-200">
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
                <div>
                  <div className="flex items-center gap-2">
                    <Database size={20} className="text-zinc-900" />
                    <h3 className="text-lg font-bold text-zinc-900">
                      Student Dashboard Backend Placeholders Directory
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Total {DASHBOARD_PLACEHOLDERS.length} spaceholders cataloged
                    across 7 structural domains
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDirectoryModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="p-3 border-b border-zinc-200 bg-zinc-100 flex gap-2 overflow-x-auto text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                      activeCategoryFilter === cat
                        ? "bg-black text-white font-semibold"
                        : "bg-white text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {cat === "all" ? "All Domains (47)" : cat}
                  </button>
                ))}
              </div>

              {/* Table of Placeholders */}
              <div className="overflow-y-auto p-4 flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-semibold">
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Placeholder Key</th>
                      <th className="py-2 px-3">Field Title</th>
                      <th className="py-2 px-3">Domain</th>
                      <th className="py-2 px-3">Backend Database Source</th>
                      <th className="py-2 px-3">Sample Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredPlaceholders.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-zinc-50">
                        <td className="py-2 px-3 text-zinc-400 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-mono font-semibold text-amber-800">
                          db:{p.id}
                        </td>
                        <td className="py-2 px-3 font-medium text-zinc-900">
                          {p.label}
                        </td>
                        <td className="py-2 px-3 text-zinc-500">{p.category}</td>
                        <td className="py-2 px-3 font-mono text-[11px] text-zinc-600 bg-zinc-50 rounded">
                          {p.source}
                        </td>
                        <td className="py-2 px-3 font-medium text-zinc-800">
                          {p.sampleValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-between items-center text-xs text-zinc-600">
                <span>
                  Showing {filteredPlaceholders.length} of{" "}
                  {DASHBOARD_PLACEHOLDERS.length} placeholders
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsInspecting(true);
                    setShowDirectoryModal(false);
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-zinc-800"
                >
                  Turn On In-Page Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
