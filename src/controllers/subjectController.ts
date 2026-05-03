import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccessResponse } from "../utils/responseHelper";
import { AppError } from "../utils/errorHandler";
import { addSubjectService, deleteSubjectService, editSubjectService, getSubjectsService } from "../services/subjectServices";

export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const classNo = Number(req.query.class);

  if (!classNo) {
    throw new AppError(400, "Valid class is required");
  }

  const subjects = await getSubjectsService(classNo);

  sendSuccessResponse(res, 200, "Subjects fetched successfully", subjects);
});


export const addSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subjectsdata, classNo } = req.body;

  if (subjectsdata.length === 0 || subjectsdata.some((subject: string) => subject.trim() === "") || !classNo) {
    throw new AppError(400, "All fields are required");
  }

  const SubjectsData = subjectsdata.map((subject: string) => {
    return {
      name: subject.trim(),
      class: classNo,
    };
  });

  const subjects = await addSubjectService(SubjectsData);

  sendSuccessResponse(res, 200, "Subjects added successfully", subjects);
});

export const editSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subjectId } = req.params;
  const SubjectId = Number(subjectId);
  if (!SubjectId) {
    throw new AppError(404, "subjectId not Found");
  }
  const { name } = req.body;
  if (!name.trim()) {
    throw new AppError(400, "Subject name is required");
  }

  const subject = await editSubjectService(
    SubjectId,
    name
  );

  sendSuccessResponse(res, 200, "Subject edited successfully", subject);
});


export const deleteSubject = asyncHandler(
  async (req: Request, res: Response) => {
    const { subjectId } = req.params;

    const SubjectId = Number(subjectId);
    if (!SubjectId) {
      throw new AppError(404, "subjectId not Found");
    }

    const subject = await deleteSubjectService(SubjectId);

    sendSuccessResponse(res, 200, "Subject deleted successfully", subject);
  },
);
