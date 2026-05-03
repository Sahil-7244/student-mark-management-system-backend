import db from "../config/prismaDb";
import { AppError } from "../utils/errorHandler";

export const addMarksService = async (
  studentId:number,
  SubjectMarksData: {
    studentId: number;
    subjectId: number;
    obtainedMarks: number | null;
    totalMarks: number;
  }[],
) => {
  const existingStudent = await db.students.findUnique({
    where: {
      id: studentId,
    },
  });
  if (!existingStudent) {
    throw new AppError(404, "Student not found");
  }

  const existingSubjectIds = await db.subjects.findMany({
    where: {
        id: { in: SubjectMarksData.map((mark) => mark.subjectId) },
    }
});
  const existingSubjectIdSet = new Set(existingSubjectIds.map((subject:any) => subject.id));
  const nonExistingSubjectIds = SubjectMarksData
    .map((mark) => mark.subjectId)
    .filter((subjectId) => !existingSubjectIdSet.has(subjectId));
  if (nonExistingSubjectIds.length > 0) {
    throw new AppError(404, "some Subjects not found");
  }

  const existingMarks = await db.marks.findMany({
    where: {
      OR: SubjectMarksData.map((mark) => ({
        studentId: mark.studentId,
        subjectId: mark.subjectId,
      })),
    },
  });
  if (existingMarks.length > 0) {
    throw new AppError(
      409,
      "Marks for one or more subjects already exist for this student",
    );
  }

  await db.marks.createMany({
    data: SubjectMarksData,
  });

  const getMarks = await db.marks.findMany({
    where: {
      OR: SubjectMarksData.map((mark) => ({
        studentId: mark.studentId,
        subjectId: mark.subjectId,
      })),
    },
    select: {
        id: true,
        obtainedMarks: true,
        totalMarks: true,
        subject: {
            select: {
                id: true,
                name: true
            }
        }
    }
  })
  return getMarks;
};


export const getMarksService = async (studentId: number) => {
    const existingStudent = await db.students.findUnique({
        where: {
            id: studentId,
        },
    });
    if (!existingStudent) {
        throw new AppError(404, "Student not found");
    }
    const marks = await db.marks.findMany({
        where: {
            studentId: studentId
        },
    });
    return marks;
}

export const updateMarksService = async (marksId: number, obtainedMarks: number | null, totalMarks: number) => {
    const existingMarks = await db.marks.findUnique({
        where: {
            id: marksId,
        },
    });
    if (!existingMarks) {
        throw new AppError(404, "Marks not found");
    }
    const marks = await db.marks.update({
        where: {
            id: marksId,
        },
        data: {
            obtainedMarks: (!obtainedMarks && obtainedMarks !== 0) ? null : obtainedMarks,
            totalMarks: totalMarks,
        },
        select:{
            id: true,
            obtainedMarks: true,
            totalMarks: true,
            subject: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return marks;
}

export const deleteMarksService = async (marksId: number) => {
    const existingMarks = await db.marks.findUnique({
        where: {
            id: marksId,
        },
    });
    if (!existingMarks) {
        throw new AppError(404, "Marks not found");
    }

    const marks = await db.marks.delete({
        where: {
            id: marksId,
        },
    });

    return marks;
}