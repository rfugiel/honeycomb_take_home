import { Schema, model } from 'mongoose';

const examSchema = new Schema({
    courseName: String,
    score: Number,
    examType: {
        type: String,
        enum: ['midterm', 'final']
    },
    examDate: Date,
    examId: { type: String, unique: true }
});

const studentSchema = new Schema({
    studentId: { type: String, unique: true },
    firstName: String,
    lastName: String,
    class: { type: Schema.Types.ObjectId, ref: 'Class' },
    exams: [examSchema]
});

export default model('Student', studentSchema);
