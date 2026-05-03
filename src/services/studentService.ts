import db from "../config/prismaDb";
import { AppError } from "../utils/errorHandler";

export const getStudentResultService = async (classNo: number, rollNo: number) => {
    const students = await db.students.findUnique({
        where: {
            roleNo_class: {
                roleNo: rollNo,
                class: classNo
            }
        },
        include: {
            allMarks: {
                select: {
                    id: true,
                    obtainedMarks: true,
                    totalMarks: true,
                    subject: {
                        select:{
                            id:true,
                            name: true
                        }
                    }
                }
            }
        }
    });
    if(!students) {
        throw new AppError(404, "Student not found");
    }
    const returnStudentsWithAvg={
        ...students,
        percentage: ((students?.allMarks.reduce((acc:any, mark:any) => acc +( mark.obtainedMarks || 0), 0) / students?.allMarks.reduce((acc:any, mark:any) => acc + mark.totalMarks, 0))*100).toFixed(2)
    }
    return returnStudentsWithAvg;
}


export const getSingleStudentService = async (studentId: number) => {
    const students = await db.students.findUnique({
        where: {
            id: studentId
        },
        include: {
            allMarks: {
                select: {
                    id: true,
                    obtainedMarks: true,
                    totalMarks: true,
                    subject: {
                        select:{
                            id:true,
                            name: true
                        }
                    }
                }
            }
        }
    });
    if(!students) {
        throw new AppError(404, "Student not found");
    }
    return students;
}

export const getStudentsService = async (classNo: number) => {
    const students = await db.students.findMany({
        where: {
            class: classNo,
            isDelete: false
        },
        orderBy: {
            roleNo: "asc"
        }
    });
    return students;
}

export const addStudentService = async (
    firstName: string, 
    lastName: string, 
    age: number, 
    classNo: number
) => {
    const lastStudent = await db.students.findFirst({
        where: {
                class: classNo
            },
        orderBy: {
            roleNo: "desc"
        },
        take: 1
    });

    const roleNoIncrement = lastStudent?.roleNo ? lastStudent?.roleNo + 1 : 1;

    const student = await db.students.create({
        data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            roleNo: roleNoIncrement,
            age,
            class: classNo,
        }
    });
    return student;
}
export const editStudentService = async (
    StudentId: number,
    firstName: string, 
    lastName: string, 
    age: number, 
) => {
    const existingStudent = await db.students.findUnique({
        where: {
            id: StudentId
        }});

    if (!existingStudent) {
        throw new AppError(404, "Student not found");
    }

    const student = await db.students.update({
        where: {
            id: existingStudent?.id
        },
        data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            age,
        }
    });
    return student;
}

export const deleteStudentService = async (
    StudentId: number
) => {
    const existingStudent = await db.students.findUnique({
        where: {
            id: StudentId
        }});

    if (!existingStudent) {
        throw new AppError(404, "Student not found");
    }

    const student = await db.students.update({
        where: {
            id: existingStudent?.id
        },
        data: {
            isDelete: true
        }
    });
    return student;
}



