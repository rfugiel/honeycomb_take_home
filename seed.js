import Student from './models/student.js'; 
import Teacher from './models/teacher.js'; 
import Class from './models/class.js';

import db from './dbConfig.js'; 

db.once('open', async () => {
    try {
        await db.dropDatabase();

        const teacher1 = new Teacher(
            { teacherId: 'T001', firstName: 'Steven', lastName: 'Socrates' },
        );

        const teacher2 = new Teacher(
            { teacherId: 'T002', firstName: 'Peter', lastName: 'Plato' },
        );

        const teacher3 = new Teacher(
            { teacherId: 'T003', firstName: 'Arthur', lastName: 'Aristotle' },
        );

        const classA = new Class({ classId: 'A', teacher: teacher1 });
        const classB = new Class({ classId: 'B', teacher: teacher2 });
        const classC = new Class({ classId: 'C', teacher: teacher3 });

        const students = [
            new Student({
                studentId: 'S001',
                firstName: 'Allen',
                lastName: 'Adams',
                class: classA,
                exams: [
                    { courseName: 'Math', score: 85, examType: 'midterm', examDate: '03/26/2023', examId: 'E001' },
                    { courseName: 'Math', score: 92, examType: 'final', examDate: '06/05/2023', examId: 'E002' },
                    { courseName: 'Physics', score: 92, examType: 'midterm', examDate: '03/25/2023', examId: 'E003' },
                    { courseName: 'Physics', score: 92, examType: 'final', examDate: '06/05/2023', examId: 'E004' },
                ]
            }),

            new Student({
                studentId: 'S002',
                firstName: 'Bart',
                lastName: 'Bernstein',
                class: classB,
                exams: [
                    { courseName: 'Math', score: 80, examType: 'midterm', examDate: '03/26/2023', examId: 'E001' },
                    { courseName: 'Math', score: 90, examType: 'final', examDate: '06/05/2023', examId: 'E002' },
                    { courseName: 'Physics', score: 70, examType: 'midterm', examDate: '03/25/2023', examId: 'E003' },
                    { courseName: 'Physics', score: 80, examType: 'final', examDate: '06/05/2023', examId: 'E004' },
                ]
            }),

            new Student({
                studentId: 'S003',
                firstName: 'Charlie',
                lastName: 'Chaplin',
                class: classA,
                exams: [
                    { courseName: 'Math', score: 60, examType: 'midterm', examDate: '03/26/2023', examId: 'E001' },
                    { courseName: 'Math', score: 70, examType: 'final', examDate: '06/05/2023', examId: 'E002' },
                    { courseName: 'Physics', score: 90, examType: 'midterm', examDate: '03/25/2023', examId: 'E003' },
                    { courseName: 'Physics', score: 100, examType: 'final', examDate: '06/05/2023', examId: 'E004' },
                ]
            })
        ]

          await Promise.all([
            teacher1.save(),
            teacher2.save(),
            teacher3.save(),
            classA.save(),
            classB.save(),
            classC.save(),
            ...students.map(student => student.save())
        ]);

        console.log('Test data inserted successfully');
    } catch (error) {
        console.error('Error inserting test data:', error);
    } finally {
        db.close();
    }
});

