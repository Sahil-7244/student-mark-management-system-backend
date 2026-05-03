import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccessResponse } from "../utils/responseHelper";
import { AppError } from "../utils/errorHandler";
import { addStudentService, deleteStudentService, editStudentService, getSingleStudentService, getStudentResultService, getStudentsService } from "../services/studentService";

export const getStudentResult = asyncHandler(async (req: Request, res: Response) => {
    const classNo = Number(req.query.class);
    const rollNo = Number(req.query.rollNo);

    if(!classNo || !rollNo) {
       throw new AppError(400, "All fields are required");
    }

    const result = await getStudentResultService(classNo, rollNo);

    sendSuccessResponse(res, 200, "Student's result fetched successfully", result);
});

export const getSingleStudent = asyncHandler(async (req: Request, res: Response) => {
    const studentId = Number(req.params.studentId);

    if(!studentId) {
       throw new AppError(400, "Student Id is required");
    }

    const result = await getSingleStudentService(studentId);

    sendSuccessResponse(res, 200, "Single student fetched successfully", result);
});

export const getStudents = asyncHandler(async (req: Request, res: Response) => {
    const classNo = Number(req.query.class);

    if(!classNo) {
       throw new AppError(400, "Valid class is required");
    }

    const students = await getStudentsService(classNo);

    sendSuccessResponse(res, 200, "Students fetched successfully", students);
});

export const addStudent = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, age, classNo } = req.body;
    if(!firstName.trim() || !lastName.trim() || !age || !classNo) {
       throw new AppError(400, "All fields are required");
    }

    const student = await addStudentService(firstName, lastName, age, classNo);

    sendSuccessResponse(res, 200, "Student added successfully", student);
});

export const editStudent = asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const StudentId = Number(studentId);
    if(!StudentId) {
       throw new AppError(404, "studentId not Found");
    }
    const { firstName, lastName, age } = req.body;

    if(!firstName.trim() || !lastName.trim() || !age ) {
       throw new AppError(400, "All fields are required");
    }

    const student = await editStudentService(StudentId, firstName, lastName, age);

    sendSuccessResponse(res, 200, "Student edited successfully", student);
});

export const deleteStudent = asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;

    const StudentId = Number(studentId);
    if(!StudentId) {
       throw new AppError(404, "studentId not Found");
    }

    const student = await deleteStudentService(StudentId);

    sendSuccessResponse(res, 200, "Student deleted successfully", student);
});

