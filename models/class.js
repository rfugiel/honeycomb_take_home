import { Schema, model } from 'mongoose';

const classSchema = new Schema({
    classId: {
        type: String,
        enum: ['A', 'B', 'C']
    },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' }
});


export default model('Class', classSchema);
