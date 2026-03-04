import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const dropEmailIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('members');
    
    // Check if index exists
    const indexes = await collection.indexes();
    const emailIndex = indexes.find(idx => idx.name === 'email_1');
    
    if (emailIndex) {
      await collection.dropIndex('email_1');
      console.log('Successfully dropped unique email index (email_1)');
    } else {
      console.log('Email index not found, maybe it was named differently or already dropped.');
      console.log('Current indexes:', indexes.map(idx => idx.name).join(', '));
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error dropping index:', err);
    process.exit(1);
  }
};

dropEmailIndex();
