Student page handoff bundle
===========================

Included files
- pages/StudentProfile.jsx
- components/StudentForm.jsx
- components/StudentCard.jsx
- constants/studentData.js

How to integrate into the main frontend
1) Copy the files:
   - Move pages/StudentProfile.jsx to src/pages/student/StudentProfile.jsx
   - Move components/StudentForm.jsx and components/StudentCard.jsx to src/components/student/
   - Move constants/studentData.js to src/constants/studentData.js

2) Wire the route (if not already in place):
   - In src/routes/AppRoutes.jsx add:
     import StudentProfile from '../pages/student/StudentProfile'
     ...
     <Route path="/student/profiles" element={<StudentProfile />} />
     (optionally also <Route path="/student" element={<StudentProfile />} />)

3) Expose it in the nav:
   - In src/constants/navData.js under "Student" children add:
     { title: "Student Profiles", link: "/student/profiles" }

4) Assets:
   - The demo images referenced use existing /demoPhoto/ images. Keep those or swap as needed.

5) Behavior notes:
   - Profiles persist to localStorage (key: ruet-cse-student-profiles-v1) so the page works without a backend.
   - Image uploads are kept in-browser only (data URLs) and are not sent to a server.

Relative imports in this bundle
- Breadcrumb/PageHeroBanner are referenced via ../../src/components/quickMenu/... because this bundle sits outside src. After moving into src, update imports to ../../components/quickMenu/... if needed, but if you place the files at the suggested locations in step 1, the original imports from the main branch will already match.

That should be all your lead needs to plug it in.
