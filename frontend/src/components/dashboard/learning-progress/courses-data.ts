export interface Course {
  id: number;
  title: string;
  modulesCompleted: number;
  totalModules: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  overallGrade: string;
  gradeLabel: string;
}

export const courses: Course[] = [
  { id: 1,  title: "Tax Academy for Beginners",          modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 2,  title: "Transfers of Accounts",              modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 3,  title: "Tax Academy Introduction",           modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 4,  title: "New Business",                       modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 5,  title: "Health and Safety in the workplace", modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 6,  title: "Tax Academy Introduction Full",      modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 7,  title: "Tax Academy Introduction Full",      modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 8,  title: "Transfers of Accounts",              modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 9,  title: "Health and Safety in the workplace", modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 10, title: "Transfer Pricing",                   modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 11, title: "Tax Academy for Beginners",          modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 12, title: "Tax Accounting",                     modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
  { id: 13, title: "Transfers of Accounts",              modulesCompleted: 6, totalModules: 8, assignmentsSubmitted: 4, totalAssignments: 5, overallGrade: "84%", gradeLabel: "B+" },
];
