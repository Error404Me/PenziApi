import express from 'express';
import {
    activateService,
    registerUser,
    registerDetails,
    registerSelfDescription,
    handleMatchingRequest,
    handleSubsequentDetails,
    handleUserConfirmation
} from '../Controllers/smsContoller.js';

const router = express.Router();

// Service activation route
router.post('/activate', activateService);

// User registration route
router.post('/register', registerUser);

// Details registration route
router.post('/details', registerDetails);

// Self-description registration route
router.post('/myself', registerSelfDescription);

// Matching request route
router.post('/match', handleMatchingRequest);

// Subsequent details route
router.post('/next', handleSubsequentDetails);

// User confirmation route
router.post('/confirm', handleUserConfirmation);

export default (app) => {
    app.use('/api/sms', router);
};
