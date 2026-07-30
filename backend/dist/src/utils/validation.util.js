"use strict";
// import { body, param, query } from 'express-validator';
Object.defineProperty(exports, "__esModule", { value: true });
// export const userValidation = {
//   register: [
//     body('name').trim().notEmpty().withMessage('Name is required'),
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
//   ],
//   login: [
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password').notEmpty().withMessage('Password is required'),
//   ],
//   updateProfile: [
//     body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
//     body('phone').optional().trim(),
//     body('address').optional().trim(),
//   ],
// };
// export const petValidation = {
//   create: [
//     body('name').trim().notEmpty().withMessage('Pet name is required'),
//     body('species').isIn(['dog', 'cat', 'bird', 'rabbit', 'other']).withMessage('Invalid species'),
//     body('breed').trim().notEmpty().withMessage('Breed is required'),
//     body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
//     body('size').isIn(['small', 'medium', 'large']).withMessage('Invalid size'),
//     body('gender').isIn(['male', 'female']).withMessage('Invalid gender'),
//     body('color').trim().notEmpty().withMessage('Color is required'),
//     body('description').trim().notEmpty().withMessage('Description is required'),
//     body('healthStatus').trim().notEmpty().withMessage('Health status is required'),
//     body('vaccinated').isBoolean().withMessage('Vaccinated must be boolean'),
//     body('neutered').isBoolean().withMessage('Neutered must be boolean'),
//     body('activityLevel').isIn(['low', 'medium', 'high']).withMessage('Invalid activity level'),
//     body('goodWithKids').isBoolean().withMessage('Good with kids must be boolean'),
//     body('goodWithPets').isBoolean().withMessage('Good with pets must be boolean'),
//     body('adoptionFee').isFloat({ min: 0 }).withMessage('Adoption fee must be a positive number'),
//     body('location').trim().notEmpty().withMessage('Location is required'),
//   ],
//   update: [
//     body('name').optional().trim().notEmpty(),
//     body('description').optional().trim().notEmpty(),
//     body('status').optional().isIn(['available', 'pending', 'adopted']),
//   ],
// };
// export const adoptionValidation = {
//   create: [
//     body('petId').notEmpty().withMessage('Pet ID is required'),
//     body('applicationData.livingSpace').isIn(['apartment', 'house', 'farm']).withMessage('Invalid living space'),
//     body('applicationData.hasYard').isBoolean().withMessage('Has yard must be boolean'),
//     body('applicationData.householdMembers').isInt({ min: 1 }).withMessage('Household members must be at least 1'),
//     body('applicationData.hasChildren').isBoolean().withMessage('Has children must be boolean'),
//     body('applicationData.hasOtherPets').isBoolean().withMessage('Has other pets must be boolean'),
//     body('applicationData.experience').isIn(['none', 'beginner', 'intermediate', 'expert']).withMessage('Invalid experience level'),
//     body('applicationData.workSchedule').trim().notEmpty().withMessage('Work schedule is required'),
//     body('applicationData.reasonForAdoption').trim().notEmpty().withMessage('Reason for adoption is required'),
//   ],
//   updateStatus: [
//     body('status').isIn(['pending', 'approved', 'rejected', 'completed', 'cancelled']).withMessage('Invalid status'),
//   ],
// };
// export const idValidation = [
//   param('id').isMongoId().withMessage('Invalid ID format'),
// ];
// export const paginationValidation = [
//   query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
//   query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
// ];
