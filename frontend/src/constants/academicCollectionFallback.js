const todayIso = new Date().toISOString();

const academicCollectionFallback = {
  '/programs': [
    {
      _id: 'program-1',
      title: 'BSc in Computer Science and Engineering',
      description: 'Four-year undergraduate degree with core software, systems and AI-focused course progression.',
      category: 'Undergraduate',
      semester: '8 Semesters',
      fileUrl: '/academic-docs/bsc-program-overview.txt',
      createdAt: todayIso,
    },
    {
      _id: 'program-2',
      title: 'MSc in Computer Science and Engineering',
      description: 'Advanced postgraduate track with thesis and specialization-focused elective clusters.',
      category: 'Postgraduate',
      semester: 'Thesis/Research',
      fileUrl: '/academic-docs/msc-program-overview.txt',
      createdAt: todayIso,
    },
  ],
  '/curriculums': [
    {
      _id: 'curriculum-1',
      title: 'Level 1 Term 1 Curriculum',
      description: 'Foundation courses, lab structure and semester-level academic planning overview.',
      category: 'Curriculum',
      semester: 'L1 T1',
      fileUrl: '/academic-docs/curriculum-l1t1.txt',
      createdAt: todayIso,
    },
    {
      _id: 'curriculum-2',
      title: 'Level 2 Term 1 Curriculum',
      description: 'Intermediate-level systems and core theory distribution with laboratory mapping.',
      category: 'Curriculum',
      semester: 'L2 T1',
      fileUrl: '/academic-docs/curriculum-l1t1.txt',
      createdAt: todayIso,
    },
  ],
  '/syllabi': [
    {
      _id: 'syllabus-1',
      title: 'Thermodynamics Syllabus (Sample Copy)',
      description: 'Detailed module-wise outline and evaluation breakdown for semester execution.',
      category: 'Syllabus',
      semester: 'L2 T1',
      fileUrl: '/academic-docs/syllabus-thermodynamics.txt',
      createdAt: todayIso,
    },
    {
      _id: 'syllabus-2',
      title: 'Data Structures Syllabus (Sample Copy)',
      description: 'Course outcomes, weekly topics and assessment policy for continuous evaluation.',
      category: 'Syllabus',
      semester: 'L1 T2',
      fileUrl: '/academic-docs/syllabus-thermodynamics.txt',
      createdAt: todayIso,
    },
  ],
  '/calendars': [
    {
      _id: 'calendar-1',
      title: 'Academic Calendar 2026',
      description: 'Semester start/end dates, recess timeline, examination windows and publication schedule.',
      category: 'Calendar',
      fileUrl: '/academic-docs/academic-calendar-2026.txt',
      createdAt: todayIso,
    },
  ],
  '/routines': [
    {
      _id: 'routine-1',
      title: 'Class Routine - Level 1 Term 1',
      description: 'Weekly classroom schedule with section timing and slot arrangement.',
      category: 'Routine',
      type: 'class',
      semester: 'L1 T1',
      session: '2025-26',
      fileUrl: '/academic-docs/class-routine-l1t1.txt',
      createdAt: todayIso,
    },
    {
      _id: 'routine-2',
      title: 'Midterm Examination Routine',
      description: 'Official midterm routine covering department core theory and lab assessment windows.',
      category: 'Routine',
      type: 'exam',
      semester: 'L2 T1',
      session: '2025-26',
      fileUrl: '/academic-docs/exam-routine-midterm.txt',
      createdAt: todayIso,
    },
    {
      _id: 'routine-3',
      title: 'CT Routine - Section A',
      description: 'Continuous test timetable for section-wise internal assessment activities.',
      category: 'Routine',
      type: 'ct',
      semester: 'L1 T1',
      session: '2025-26',
      fileUrl: '/academic-docs/ct-routine-section-a.txt',
      createdAt: todayIso,
    },
  ],
};

export const getAcademicFallbackItems = (endpoint, params = {}) => {
  const items = academicCollectionFallback[endpoint] || [];

  if (endpoint === '/routines' && params?.type) {
    return items.filter((item) => item.type === params.type);
  }

  return items;
};

export default academicCollectionFallback;
