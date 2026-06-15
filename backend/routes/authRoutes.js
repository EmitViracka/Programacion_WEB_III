import express from 'express';
import { getCaptcha, registrar, login, logout, verificar } from '../controllers/authController.js';

const router = express.Router();

router.get('/captcha', getCaptcha);
router.post('/registro', registrar);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verificar', verificar);

export default router;