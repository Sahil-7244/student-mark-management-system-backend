import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/errorHandler";
import { sendSuccessResponse } from "../utils/responseHelper";
import { addMarksService, deleteMarksService, getMarksService, updateMarksService } from "../services/marksServices";

export const addMarks = asyncHandler(async (req: Request, res: Response) => {
    const { studentId, subjectMarksData } = req.body;

    if (!studentId || subjectMarksData.length === 0 || subjectMarksData.some((mark: { subjectId: number; obtainedMarks: number | null | undefined; totalMarks: number; }) => !mark.subjectId || mark.totalMarks === undefined || mark.totalMarks === null)) {
      throw new AppError(400, "All fields are required");
    }

    const SubjectMarksData = subjectMarksData.map((mark:{ subjectId: number; obtainedMarks: number | null; totalMarks: number; }) => ({
            studentId,
            subjectId: mark.subjectId,
            obtainedMarks: mark.obtainedMarks || null,
            totalMarks: mark.totalMarks
        }));
    const marks = await addMarksService(studentId, SubjectMarksData);

    sendSuccessResponse(res, 200, "Marks added successfully", marks);
});

export const getMarks = asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const StudentId = Number(studentId);
    if (!StudentId) {
      throw new AppError(404, "studentId not Found");
    }
    const marks = await getMarksService(StudentId);

    sendSuccessResponse(res, 200, "Marks fetched successfully", marks);
});

export const updateMarks = asyncHandler(async (req: Request, res: Response) => {
    const { marksId } = req.params;
    const { obtainedMarks, totalMarks } = req.body;

    const MarksId = Number(marksId);
    if (!MarksId) {
        throw new AppError(404, "marksId not Found");
    }
    
    if ( totalMarks === undefined || totalMarks === null) {
      throw new AppError(400, "total marks are required");
    }
    
    const marks = await updateMarksService(MarksId, obtainedMarks, totalMarks);

    sendSuccessResponse(res, 200, "Marks updated successfully", marks);
});

export const deleteMarks = asyncHandler(async (req: Request, res: Response) => {
    const { marksId } = req.params;

    const MarksId = Number(marksId);
    if (!MarksId) {
        throw new AppError(404, "marksId not Found");
    }

    const marks = await deleteMarksService(MarksId);

    sendSuccessResponse(res, 200, "Marks deleted successfully", marks);
});