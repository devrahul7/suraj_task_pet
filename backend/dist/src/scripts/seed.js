"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const hash_1 = require("../utils/hash");
const user_model_1 = __importDefault(require("../models/user.model"));
const pet_model_1 = __importDefault(require("../models/pet.model"));
const user_type_1 = require("../types/user.type");
/**
 * Seeds sample users and pets for local development/testing.
 *
 * This does NOT touch the admin account — run `seed-admin.ts` separately  to seed the credential npx ts-node src/scripts/seed.ts
 * for that. This script only inserts regular users + sample pets, and
 * skips anything that already exists (matched by email / pet name).
 */
const sampleUsers = [
    {
        fullName: 'Suraj Rana',
        username: 'surajrana',
        email: 'surajrana.0899@gmail.com',
        password: 'Password@123',
        role: user_type_1.UserRole.USER,
        preferences: {
            petType: ['DOG'],
            size: ['MEDIUM', 'LARGE'],
            activityLevel: 'HIGH',
            hasChildren: true,
        },
    },
    {
        fullName: 'Sahil Rana',
        username: 'sahilrana',
        email: 'sahil@example.com',
        password: 'Password@123',
        role: user_type_1.UserRole.USER,
        preferences: {
            petType: ['CAT'],
            size: ['SMALL', 'MEDIUM'],
            activityLevel: 'LOW',
            hasChildren: false,
        },
    },
];
const samplePets = [
    {
        name: 'Max',
        species: 'DOG',
        breed: 'Golden Retriever',
        age: 3,
        size: 'LARGE',
        gender: 'MALE',
        description: 'Friendly and energetic, loves to play fetch.',
        healthStatus: 'Healthy',
        vaccinated: true,
        neutered: true,
        temperament: ['friendly', 'playful'],
        activityLevel: 'HIGH',
        goodWithKids: true,
        goodWithPets: true,
        images: [],
        status: 'AVAILABLE',
        adoptionFee: 250,
        location: 'New York',
    },
    {
        name: 'Bella',
        species: 'CAT',
        breed: 'Persian',
        age: 2,
        size: 'MEDIUM',
        gender: 'FEMALE',
        description: 'Calm and affectionate, enjoys quiet spaces.',
        healthStatus: 'Excellent',
        vaccinated: true,
        neutered: true,
        temperament: ['calm', 'affectionate'],
        activityLevel: 'LOW',
        goodWithKids: true,
        goodWithPets: true,
        images: [],
        status: 'AVAILABLE',
        adoptionFee: 200,
        location: 'Brooklyn',
    },
    {
        name: 'Rocky',
        species: 'DOG',
        breed: 'German Shepherd',
        age: 4,
        size: 'LARGE',
        gender: 'MALE',
        description: 'Loyal and protective, well-trained.',
        healthStatus: 'Healthy',
        vaccinated: true,
        neutered: true,
        temperament: ['loyal', 'protective'],
        activityLevel: 'HIGH',
        goodWithKids: true,
        goodWithPets: false,
        images: [],
        status: 'AVAILABLE',
        adoptionFee: 300,
        location: 'Queens',
    },
    {
        name: 'Luna',
        species: 'CAT',
        breed: 'Siamese',
        age: 1,
        size: 'SMALL',
        gender: 'FEMALE',
        description: 'Playful kitten, very curious and vocal.',
        healthStatus: 'Healthy',
        vaccinated: true,
        neutered: false,
        temperament: ['playful', 'curious'],
        activityLevel: 'MEDIUM',
        goodWithKids: true,
        goodWithPets: true,
        images: [],
        status: 'AVAILABLE',
        adoptionFee: 150,
        location: 'Manhattan',
    },
];
async function seedUsers() {
    for (const userData of sampleUsers) {
        const existing = await user_model_1.default.findOne({ email: userData.email.toLowerCase() });
        if (existing) {
            console.log(`User "${userData.email}" already exists, skipping.`);
            continue;
        }
        const hashedPassword = await hash_1.HashUtil.hash(userData.password);
        await user_model_1.default.create({
            ...userData,
            email: userData.email.toLowerCase(),
            password: hashedPassword,
            emailVerified: true,
        });
        console.log(`Created user: ${userData.email} / ${userData.password}`);
    }
}
async function seedPets() {
    for (const petData of samplePets) {
        const existing = await pet_model_1.default.findOne({ name: petData.name, breed: petData.breed });
        if (existing) {
            console.log(`Pet "${petData.name}" already exists, skipping.`);
            continue;
        }
        await pet_model_1.default.create(petData);
        console.log(`Created pet: ${petData.name} (${petData.breed})`);
    }
}
async function seed() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/adoption';
    await mongoose_1.default.connect(mongoUri);
    console.log('Connected to database.');
    await seedUsers();
    await seedPets();
    console.log('\n=== Sample Credentials ===');
    sampleUsers.forEach((u) => console.log(`${u.email} / ${u.password}`));
    console.log('===========================\n');
    await mongoose_1.default.disconnect();
    console.log('Done.');
}
seed().catch((error) => {
    console.error('Failed to seed database:', error.message);
    process.exit(1);
});
