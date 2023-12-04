import { Schema, model } from 'mongoose';

const teacherSchema = new Schema({
    teacherId: { type: String, unique: true },
    firstName: String,
    lastName: String
});


export default model('Teacher', teacherSchema);
