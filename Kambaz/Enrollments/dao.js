import { v4 as uuidv4 } from "uuid";
export default function EnrollmentsDao(db) {
  
  function findAllEnrollments() {
    return db.enrollments;
  }

  function findEnrollmentsForUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((enrollment) => enrollment.user === userId);
  }

  function enrollUserInCourse(userId, courseId) {
    const { enrollments } = db;
    // Check if already enrolled
    const existing = enrollments.find(
      (e) => e.user === userId && e.course === courseId
    );
    if (existing) {
      return existing;
    }
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    enrollments.push(newEnrollment);
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    const index = enrollments.findIndex(
      (e) => e.user === userId && e.course === courseId
    );
    if (index !== -1) {
      const removed = enrollments.splice(index, 1)[0];
      return removed;
    }
    return null;
  }

  return { 
    findAllEnrollments,
    findEnrollmentsForUser,
    enrollUserInCourse,
    unenrollUserFromCourse
  };
}
