import express from "express";
import { addStudent, deleteStudent, editStudent, getSingleStudent, getStudentResult, getStudents } from "../controllers/studentController";
import { addSubject, deleteSubject, editSubject, getSubjects } from "../controllers/subjectController";
import { addMarks, deleteMarks, getMarks, updateMarks } from "../controllers/marksControll";

const router = express.Router();

// Student routes
router.get("/result", getStudentResult);
router.get("/singleStudent/:studentId", getSingleStudent);
router.get("/students", getStudents);
router.post("/students", addStudent);
router.put("/students/:studentId", editStudent);
router.delete("/students/:studentId", deleteStudent);

// Subject routes
router.get("/subjects", getSubjects);
router.post("/subjects", addSubject);
router.put("/subjects/:subjectId", editSubject);
router.delete("/subjects/:subjectId", deleteSubject);

// Marks routes
router.post("/marks", addMarks);
router.get("/marks/:studentId", getMarks);
router.put("/marks/:marksId", updateMarks);
router.delete("/marks/:marksId", deleteMarks);

export { router };
