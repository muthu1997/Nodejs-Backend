import { Router } from 'express';
import { getAdminDetails, signin, forgotPassword, forgotPasswordTokenVerification, resetPassword, regeneratetoken, logout } from './controller';

const router = new Router();

router.get('/getalladmin',getAdminDetails);

router.post('/adminLogin', signin);

router.post('/forgotPassword', forgotPassword);

router.get('/forgotPasswordVerifytToken', forgotPasswordTokenVerification);

router.put('/resetPassword/', resetPassword);

router.get('/regenerateToken', regeneratetoken);

router.get('/logout', logout);

export default router;