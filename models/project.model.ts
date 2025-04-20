import mongoose, { Document } from 'mongoose';

// Interfaz para el documento de proyecto
export interface IProject extends Document {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  github: string;
  demo: string;
  category: 'fullstack' | 'backend';
  createdAt: Date;
}

const ProjectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: String,
  tags: [String],
  github: String,
  demo: String,
  category: { 
    type: String, 
    enum: ['fullstack', 'backend'], 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

export default mongoose.models.Project as mongoose.Model<IProject> || mongoose.model<IProject>('Project', ProjectSchema);