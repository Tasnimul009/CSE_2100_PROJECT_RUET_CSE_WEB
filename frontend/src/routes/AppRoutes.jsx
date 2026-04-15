import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

import Notice from '../pages/quickMenu/Notice'
import NewsEvents from '../pages/quickMenu/NewsEvents'
import Achievements from '../pages/quickMenu/Achievements'
import CampusLife from '../pages/quickMenu/CampusLife'
import MouCollaboration from '../pages/quickMenu/MouCollaboration'
import Programs from '../pages/quickMenu/Programs'
import Curriculum from '../pages/quickMenu/Curriculum'
import Syllabus from '../pages/quickMenu/Syllabus'
import AcademicCalendar from '../pages/quickMenu/AcademicCalendar'
import ClassRoutine from '../pages/quickMenu/ClassRoutine'
import ExamRoutine from '../pages/quickMenu/ExamRoutine'
import CtRoutine from '../pages/quickMenu/CtRoutine'
import AcademicItemView from '../pages/quickMenu/AcademicItemView'

import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminLogin from '../pages/admin/AdminLogin'
import ProtectedRoute from '../components/common/ProtectedRoute'

import StudentLogin from '../pages/student/StudentLogin'
import StudentProfile from '../pages/student/StudentProfile'
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentResults from '../pages/student/StudentResults'
import CR from '../pages/student/CR'
import Advisor from '../pages/student/Advisor'
import AdvisorBatch from '../pages/student/AdvisorBatch'
import RequireAuth from './RequireAuth'

import Dean from '../pages/faculty/Dean'
import HeadOfDept from '../pages/faculty/HeadOfDept'
import FacultyMembers from '../pages/faculty/FacultyMembers'
import OfficerStaff from '../pages/faculty/OfficerStaff'
import Classroom from '../pages/facilities/Classroom'
import Labs from '../pages/facilities/Labs'
import Library from '../pages/facilities/Library'
import SeminarRoom from '../pages/facilities/SeminarRoom'
import ICTInfrastructure from '../pages/facilities/ICTInfrastructure'
import ResearchAreas from '../pages/research/ResearchAreas'
import Publications from '../pages/research/Publications'
import Projects from '../pages/research/Projects'

import AboutCSE from '../pages/about/AboutCSE'
import MessageFromHead from '../pages/about/MessageFromHead'
import MissionVision from '../pages/about/MissionVision'
import History from '../pages/about/History'
import Achievement from '../pages/about/Achievement'
import Alumni from '../pages/alumni/Alumni'

// import Contact          from '../pages/Contact'

// import AboutCSE         from '../pages/about/AboutCSE'
// import MessageFromHead  from '../pages/about/MessageFromHead'
// import MissionVision    from '../pages/about/MissionVision'
// import History          from '../pages/about/History'
// import Achievement      from '../pages/about/Achievement'

// import Classroom        from '../pages/facilities/Classroom'
// import Labs             from '../pages/facilities/Labs'
// import Library          from '../pages/facilities/Library'
// import SeminarRoom      from '../pages/facilities/SeminarRoom'
// import ICTInfrastructure from '../pages/facilities/ICTInfrastructure'

// import Programs         from '../pages/academic/Programs'
// import Curriculum       from '../pages/academic/Curriculum'
// import Syllabus         from '../pages/academic/Syllabus'
// import AcademicCalendar from '../pages/academic/AcademicCalendar'
// import ClassRoutine     from '../pages/academic/ClassRoutine'
// import ExamRoutine      from '../pages/academic/ExamRoutine'

// import Dean             from '../pages/faculty/Dean'
// import HeadOfDept       from '../pages/faculty/HeadOfDept'
// import FacultyMembers   from '../pages/faculty/FacultyMembers'
// import OfficerStaff     from '../pages/faculty/OfficerStaff'

// import ResearchAreas    from '../pages/research/ResearchAreas'
// import Publications     from '../pages/research/Publications'
// import Projects         from '../pages/research/Projects'

// import Advisor          from '../pages/student/Advisor'
// import CR               from '../pages/student/CR'
// import Guidelines       from '../pages/student/Guidelines'
// import StudentLogin     from '../pages/student/StudentLogin'
// import Results          from '../pages/student/Results'

// ── Scroll to top on every route change ──────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// ── Routes ────────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={
        <>
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </>
      }>
        <Route path="/" element={<Home />} />

        <Route path="/notice" element={<Notice />} />
        <Route path="/news-events" element={<NewsEvents />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/campus-life" element={<CampusLife />} />
        <Route path="/quickMenu/mou-collaboration" element={<MouCollaboration />} />

        <Route path="/login" element={<StudentLogin />} />
        <Route path="/student/login" element={<StudentLogin />} />

        <Route
          path="/student"
          element={(
            <RequireAuth>
              <StudentDashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/student/dashboard"
          element={(
            <RequireAuth>
              <StudentDashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/student/profiles"
          element={(
            <RequireAuth>
              <StudentProfile />
            </RequireAuth>
          )}
        />
        <Route
          path="/student/results"
          element={(
            <RequireAuth>
              <StudentResults />
            </RequireAuth>
          )}
        />
        <Route path="/student/profile" element={<Navigate to="/student/profiles" replace />} />

        <Route path="/student/cr" element={<CR />} />
        <Route path="/student/advisor" element={<Advisor />} />
        <Route path="/student/advisor/:batch" element={<AdvisorBatch />} />

        <Route path="/faculty/dean" element={<Dean />} />
        <Route path="/faculty/head" element={<HeadOfDept />} />
        <Route path="/faculty/members" element={<FacultyMembers />} />
        <Route path="/faculty/staff" element={<OfficerStaff />} />

        {/* <Route path="/contact" element={<Contact />} /> */}

        <Route path="/about/cse" element={<AboutCSE />} />
        <Route path="/about/message-from-head" element={<MessageFromHead />} />
        <Route path="/about/mission-vision" element={<MissionVision />} />
        <Route path="/about/history" element={<History />} />
        <Route path="/about/achievement" element={<Achievement />} />
        <Route path="/alumni" element={<Alumni />} />

        <Route path="/facilities/classroom" element={<Classroom />} />
        <Route path="/facilities/labs" element={<Labs />} />
        <Route path="/facilities/library" element={<Library />} />
        <Route path="/facilities/seminar-room" element={<SeminarRoom />} />
        <Route path="/facilities/ict" element={<ICTInfrastructure />} />
        <Route path="/academic" element={<Navigate to="/academic/programs" replace />} />
        <Route path="/facilities/seminar" element={<Navigate to="/facilities/seminar-room" replace />} />

        {/* <Route path="/academic/programs"       element={<Programs />} /> */}
        {/* <Route path="/academic/curriculum"     element={<Curriculum />} /> */}
        {/* <Route path="/academic/syllabus"       element={<Syllabus />} /> */}
        {/* <Route path="/academic/calendar"       element={<AcademicCalendar />} /> */}
        {/* <Route path="/academic/class-routine"  element={<ClassRoutine />} /> */}
        {/* <Route path="/academic/exam-routine"   element={<ExamRoutine />} /> */}

        {/* <Route path="/faculty/dean"            element={<Dean />} /> */}
        {/* <Route path="/faculty/head"            element={<HeadOfDept />} /> */}
        {/* <Route path="/faculty/members"         element={<FacultyMembers />} /> */}
        {/* <Route path="/faculty/staff"           element={<OfficerStaff />} /> */}

        <Route path="/research/areas" element={<ResearchAreas />} />
        <Route path="/research/publications" element={<Publications />} />
        <Route path="/research/projects" element={<Projects />} />

        {/* <Route path="/student/advisor"         element={<Advisor />} /> */}
        {/* <Route path="/student/cr"              element={<CR />} /> */}
        {/* <Route path="/student/guidelines"      element={<Guidelines />} /> */}
        {/* <Route path="/student/login"           element={<StudentLogin />} /> */}
        {/* <Route path="/student/results"         element={<Results />} /> */}

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Academic section from Pratik's frontend */}
      <Route path="/programs" element={<Programs />} />
      <Route path="/curriculum" element={<Curriculum />} />
      <Route path="/syllabus" element={<Syllabus />} />
      <Route path="/academic-calendar" element={<AcademicCalendar />} />
      <Route path="/class-routine" element={<ClassRoutine />} />
      <Route path="/examination-routine" element={<ExamRoutine />} />
      <Route path="/ct-routine" element={<CtRoutine />} />
      <Route path="/academic/view/:resource/:itemId" element={<AcademicItemView />} />

      {/* Aliases for existing main navigation links */}
      <Route path="/academic/programs" element={<Programs />} />
      <Route path="/academic/curriculum" element={<Curriculum />} />
      <Route path="/academic/syllabus" element={<Syllabus />} />
      <Route path="/academic/calendar" element={<AcademicCalendar />} />
      <Route path="/academic/class-routine" element={<ClassRoutine />} />
      <Route path="/academic/exam-routine" element={<ExamRoutine />} />
      <Route path="/academic/ct-routine" element={<CtRoutine />} />

      {/* Admin section from Pratik's frontend */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={(
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )}
      />
      
    </Routes>
  )
}

export default AppRoutes


// import { Routes, Route, Outlet } from 'react-router-dom'

// // এখন শুধু এই দুটো page আছে
// import Home from '../pages/Home'
// import NotFound from '../pages/NotFound'
// import Header from '../components/layout/Header'
// import Footer from '../components/layout/Footer'

// // বাকি pages বানানোর পর একটা একটা করে uncomment করতে হবে :
// import Notice from '../pages/quickMenu/Notice'
// import NewsEvents from '../pages/quickMenu/NewsEvents'
// import Achievements from '../pages/quickMenu/Achievements'
// import CampusLife from '../pages/quickMenu/CampusLife'
// import MouCollaboration from '../pages/quickMenu/MouCollaboration'

// // import Contact          from '../pages/Contact'

// // import AboutCSE         from '../pages/about/AboutCSE'
// // import MessageFromHead  from '../pages/about/MessageFromHead'
// // import MissionVision    from '../pages/about/MissionVision'
// // import History          from '../pages/about/History'
// // import Achievement      from '../pages/about/Achievement'

// // import Classroom        from '../pages/facilities/Classroom'
// // import Labs             from '../pages/facilities/Labs'
// // import Library          from '../pages/facilities/Library'
// // import SeminarRoom      from '../pages/facilities/SeminarRoom'
// // import ICTInfrastructure from '../pages/facilities/ICTInfrastructure'

// // import Programs         from '../pages/academic/Programs'
// // import Curriculum       from '../pages/academic/Curriculum'
// // import Syllabus         from '../pages/academic/Syllabus'
// // import AcademicCalendar from '../pages/academic/AcademicCalendar'
// // import ClassRoutine     from '../pages/academic/ClassRoutine'
// // import ExamRoutine      from '../pages/academic/ExamRoutine'

// // import Dean             from '../pages/faculty/Dean'
// // import HeadOfDept       from '../pages/faculty/HeadOfDept'
// // import FacultyMembers   from '../pages/faculty/FacultyMembers'
// // import OfficerStaff     from '../pages/faculty/OfficerStaff'

// // import ResearchAreas    from '../pages/research/ResearchAreas'
// // import Publications     from '../pages/research/Publications'
// // import Projects         from '../pages/research/Projects'

// // import Advisor          from '../pages/student/Advisor'
// // import CR               from '../pages/student/CR'
// // import Guidelines       from '../pages/student/Guidelines'
// // import StudentLogin     from '../pages/student/StudentLogin'
// // import Results          from '../pages/student/Results'


// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route element={
//         <>
//           <Header />
//           <Outlet />
//           <Footer />
//         </>
//       }>
//         <Route path="/" element={<Home />} />

//         {/* বাকি routes — page বানানোর পর এগুলো ব্যাবহার করা যাবে */}

//         <Route path="/notice" element={<Notice />} />
//         <Route path="/news-events" element={<NewsEvents />} />
//         <Route path="/achievements" element={<Achievements />} />
//         <Route path="/campus-life" element={<CampusLife />} />
//         <Route path="/quickMenu/mou-collaboration" element={<MouCollaboration />} />


//         {/* <Route path="/contact" element={<Contact />} /> */}
//         {/* <Route path="/about/cse"               element={<AboutCSE />} /> */}
//         {/* <Route path="/about/message-from-head" element={<MessageFromHead />} /> */}
//         {/* <Route path="/about/mission-vision"    element={<MissionVision />} /> */}
//         {/* <Route path="/about/history"           element={<History />} /> */}
//         {/* <Route path="/about/achievement"       element={<Achievement />} /> */}

//         {/* <Route path="/facilities/classroom"    element={<Classroom />} /> */}
//         {/* <Route path="/facilities/labs"         element={<Labs />} /> */}
//         {/* <Route path="/facilities/library"      element={<Library />} /> */}
//         {/* <Route path="/facilities/seminar-room" element={<SeminarRoom />} /> */}
//         {/* <Route path="/facilities/ict"          element={<ICTInfrastructure />} /> */}

//         {/* <Route path="/academic/programs"       element={<Programs />} /> */}
//         {/* <Route path="/academic/curriculum"     element={<Curriculum />} /> */}
//         {/* <Route path="/academic/syllabus"       element={<Syllabus />} /> */}
//         {/* <Route path="/academic/calendar"       element={<AcademicCalendar />} /> */}
//         {/* <Route path="/academic/class-routine"  element={<ClassRoutine />} /> */}
//         {/* <Route path="/academic/exam-routine"   element={<ExamRoutine />} /> */}

//         {/* <Route path="/faculty/dean"            element={<Dean />} /> */}
//         {/* <Route path="/faculty/head"            element={<HeadOfDept />} /> */}
//         {/* <Route path="/faculty/members"         element={<FacultyMembers />} /> */}
//         {/* <Route path="/faculty/staff"           element={<OfficerStaff />} /> */}

//         {/* <Route path="/research/areas"          element={<ResearchAreas />} /> */}
//         {/* <Route path="/research/publications"   element={<Publications />} /> */}
//         {/* <Route path="/research/projects"       element={<Projects />} /> */}

//         {/* <Route path="/student/advisor"         element={<Advisor />} /> */}
//         {/* <Route path="/student/cr"              element={<CR />} /> */}
//         {/* <Route path="/student/guidelines"      element={<Guidelines />} /> */}
//         {/* <Route path="/student/login"           element={<StudentLogin />} /> */}
//         {/* <Route path="/student/results"         element={<Results />} /> */}

//       </Route>

//       {/* যেকোনো unknown URL → 404 */}
//       <Route path="*" element={<NotFound />} />

//     </Routes>
//   )
// }

// export default AppRoutes