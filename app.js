import express, { json } from 'express';

import Student from './models/student.js';
import Teacher from './models/teacher.js';
import Class from './models/class.js';
import './dbConfig.js';


const app = express();
app.use(json());

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.get('/student/:studentId', async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId })
                                     .populate({
                                         path: 'class',
                                         populate: {
                                             path: 'teacher',
                                             model: 'Teacher'
                                         }
                                     });
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.json(student);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/teacher/:teacherId', async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ teacherId: req.params.teacherId });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const classes = await Class.find({ teacher: teacher._id });
        if (!classes) {
            return res.status(404).json({ message: "Classes for the teacher not found" });
        }

        const studentResults = await Student.find({ class: { $in: classes.map(c => c._id) } });
        res.json(studentResults);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/teacher/:teacherId/averages', async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ teacherId: req.params.teacherId });
        if (!teacher) {
            return res.status(404).send('Teacher not found');
        }

        const classes = await Class.find({ teacher: teacher._id });
        if (classes.length === 0) {
            return res.status(404).send('Classes for the teacher not found');
        }

        const averages = await Student.aggregate([
            { $match: { class: { $in: classes.map(c => c._id) } } },
            { $unwind: "$exams" },
            {
                $group: {
                    _id: { studentId: "$studentId", courseName: "$exams.courseName" },
                    averageScore: { $avg: "$exams.score" }
                }
            },
            {
                $project: {
                    _id: false,
                    studentId: "$_id.studentId",
                    courseName: "$_id.courseName",
                    averageScore: true
                }
            }
        ]);

        res.json(averages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/class/averages', async (req, res) => {
    try {
        const averages = await Student.aggregate([
            { $unwind: "$exams" },

            { 
                $lookup: {
                    from: "classes",  
                    localField: "class",
                    foreignField: "_id",
                    as: "classDetails"
                }
            },
            { $unwind: "$classDetails" }, 

            { 
                $group: {
                    _id: { className: "$classDetails.name", courseName: "$exams.courseName" },
                    averageScore: { $avg: "$exams.score" }
                }
            },

            { 
                $project: {
                    _id: 0,
                    className: "$_id.className",
                    courseName: "$_id.courseName",
                    averageScore: "$averageScore"  
                }
            }
        ]);

        res.json(averages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/student/:studentId/exam/:examId', async (req, res) => {
    const { studentId, examId } = req.params;
    const { newScore } = req.body;

    try {
        const result = await Student.updateOne(
            { studentId: studentId, "exams.examId": examId },
            { $set: { "exams.$.score": newScore } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Student or exam not found or no update made.');
        }

        res.send('Exam score updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating exam score: ' + error.message);
    }
});

app.patch('/update-class-for-students', async (req, res) => {
    const { studentIds, newClassId } = req.body;

    try {
        const classExists =  await Class.findOne({ classId: newClassId });
        if (!classExists) {
            return res.status(404).send('Class not found.');
        }

        const result = await Student.updateMany(
            { studentId: { $in: studentIds } },
            { $set: { class: classExists._id } } 
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('No students updated.');
        }

        res.send(`${result.modifiedCount} students have been moved to the new class.`);
    } catch (error) {
        res.status(500).send('Error updating students: ' + error.message);
    }
});