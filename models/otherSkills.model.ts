// portfolio/models/otherSkills.model.ts
import mongoose, { Document } from 'mongoose';

export interface IOtherSkill extends Document {
    name: string;
}

const OtherSkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.models.OtherSkill as mongoose.Model<IOtherSkill> ||
    mongoose.model<IOtherSkill>('OtherSkill', OtherSkillSchema);