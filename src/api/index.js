import { Router } from 'express';
import Admins from './admin';

const router = new Router();

router.use('/admin', Admins);

export default router