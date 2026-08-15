import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import User from '../models/UserSchema.js';

dotenv.config();

// TO RUN: npm run seed -- --name="John Doe" --email="admin@test.com" --password="admin"


// Define the CLI flags
const argv = yargs(hideBin(process.argv))
  .option('name', { alias: 'n', type: 'string', demandOption: true, describe: 'Full Name' })
  .option('email', { alias: 'u', type: 'string', demandOption: true, describe: 'Username/Email' })
  .option('password', { alias: 'p', type: 'string', demandOption: true, describe: 'Password' })
  .argv;

const initAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if user exists
    const existing = await User.findOne({ email: argv.email });
    if (existing) {
      console.log('User already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(argv.password, 10);

    await User.create({
      name: argv.name,
      email: argv.email,
      password: hashedPassword,
      role: 'EVIDENCE_MANAGER'
    });

    console.log(`EVIDENCE_MANAGER created successfully!`);
    console.log(`Name: ${argv.name}`);
    console.log(`Email: ${argv.email}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

initAdmin();
