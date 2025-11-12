import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
 const dao = UsersDao(db);
  
  const createUser = (req, res) => { 
    const user = req.body;
    const newUser = dao.createUser(user);
    res.json(newUser);
  };

  const deleteUser = (req, res) => { 
    const userId = req.params.userId;
    dao.deleteUser(userId);
    res.sendStatus(200);
  };

  const findAllUsers = (req, res) => { 
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => { 
    const userId = req.params.userId;
    const user = dao.findUserById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };

  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const { enrollments } = db;
    
    // Find all enrollments for this course
    const courseEnrollments = enrollments.filter(
      (enrollment) => enrollment.course === courseId
    );
    
    // Get the user IDs
    const userIds = courseEnrollments.map((enrollment) => enrollment.user);
    
    // Find all users with those IDs
    const users = dao.findAllUsers().filter((user) => userIds.includes(user._id));
    res.json(users);
  };

   const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);

   };
  const signup = (req, res) => { 
     const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(
        { message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);

  };
  const signin = (req, res) => { 
     const { username, password } = req.body;
    console.log("Signin attempt for username:", username);
    
    const currentUser = dao.findUserByCredentials(username, password);
    console.log("Found user:", currentUser);
    
    if (!currentUser) {
      console.log("Invalid credentials");
      res.status(401).json({ message: "Unable to login. Try again later." });
      return;
    }
    
    req.session["currentUser"] = currentUser;
    console.log("Session after setting currentUser:", req.session);
    res.json(currentUser);
  };
  const signout = (req, res) => {
   req.session.destroy();
    res.sendStatus(200);
  };


  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
