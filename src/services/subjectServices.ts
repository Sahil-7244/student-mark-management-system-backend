import db from "../config/prismaDb";
import { AppError } from "../utils/errorHandler";

export const getSubjectsService = async (classNo: number) => {
  const subjects = await db.subjects.findMany({
    where: {
      class: classNo,
      isDelete: false,
    },
  });
  return subjects;
};

export const addSubjectService = async (
  SubjectsData: { name: string; class: number }[],
) => {
  const existingSubject = await db.subjects.findMany({
    where: {
      OR: SubjectsData.map((subject) => ({
        name: subject.name,
        class: subject.class,
      })),
    },
  });

  if (existingSubject.length > 0) {
    throw new AppError(409, "Subject already exists");
  }

  await db.subjects.createMany({
    data: SubjectsData,
  });

  const getsubjects = await db.subjects.findMany({
  where: {
    OR: SubjectsData.map((subject) => ({
      name: subject.name,
      class: subject.class,
    })),
  },
});
  return getsubjects;
};

export const editSubjectService = async (SubjectId: number, name: string) => {
  const existingSubject = await db.subjects.findUnique({
    where: {
      id: SubjectId,
    },
  });

  if (!existingSubject) {
    throw new AppError(404, "Subject not found");
  }

  const duplicateSubject = await db.subjects.findFirst({
    where: {
        id:{ not: SubjectId },
        name: name.trim(),
        class: existingSubject?.class,
    },
  });

  if (duplicateSubject) {
    throw new AppError(409, "SubjectName already exists in same class");
  }

  const subject = await db.subjects.update({
    where: {
      id: existingSubject?.id,
    },
    data: {
      name: name.trim(),
    },
  });
  return subject;
};

export const deleteSubjectService = async (SubjectId: number) => {
  const existingSubject = await db.subjects.findUnique({
    where: {
      id: SubjectId,
    },
  });

  if (!existingSubject) {
    throw new AppError(404, "Subject not found");
  }

  const subject = await db.subjects.update({
    where: {
      id: existingSubject?.id,
    },
    data: {
      isDelete: true,
    },
  });
  return subject;
};
