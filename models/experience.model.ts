import mongoose, { Document } from 'mongoose';

// Interfaz para el documento de experiencia
export interface IExperience extends Document {
  position: string;
  company: string;
  period: string;
  description: string;
  skills?: string[];
  companyLogo?: string;
  location?: string;
  achievements?: string[];
  url?: string;
}

const ExperienceSchema = new mongoose.Schema({
  position: { 
    type: String, 
    required: true 
  },
  company: { 
    type: String, 
    required: true 
  },
  period: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  skills: [String],
  companyLogo: String,
  location: String,
  achievements: [String],
  url: String
}, { 
  timestamps: true 
});

export default mongoose.models.Experience as mongoose.Model<IExperience> || 
  mongoose.model<IExperience>('Experience', ExperienceSchema);