import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  }
  app.get("/api/courses", findAllCourses);



  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    console.log("Original userId param:", userId);
    
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      console.log("Current user from session:", currentUser);
      
      if (!currentUser) {
        console.log("No current user in session - returning 401");
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
      console.log("Using userId from session:", userId);
    }
    
    const courses = dao.findCoursesForEnrolledUser(userId);
    console.log("Found courses:", courses);
    res.json(courses);
  };

  const enrollmentsDao = EnrollmentsDao(db);
  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  }

   const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  }
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.post("/api/users/current/courses", createCourse);

  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);


}