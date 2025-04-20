import mongoose, { Document, Model } from 'mongoose';

// Interfaces para los subdocumentos
interface IHero {
  title: string;
  subtitle: string;
  description: string;
  profileImage: string;
}

interface IAbout {
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
}

interface IContact {
  email: string;
  phone: string;
  location: string;
}

interface IService {
  title: string;
  description: string;
  icon: string;
}

// Interfaz para el documento principal
export interface IContent extends Document {
  hero: IHero;
  about: IAbout;
  services: IService[];
  contact: IContact;
}

const ContentSchema = new mongoose.Schema({
  hero: {
    title: String,
    subtitle: String,
    description: String,
    profileImage: String
  },
  about: {
    paragraph1: String,
    paragraph2: String,
    paragraph3: String
  },
  services: [{
    title: String,
    description: String,
    icon: String
  }],
  contact: {
    email: String,
    phone: String,
    location: String
  }
}, { 
  timestamps: true 
});

export default mongoose.models.Content as Model<IContent> || mongoose.model<IContent>('Content', ContentSchema);