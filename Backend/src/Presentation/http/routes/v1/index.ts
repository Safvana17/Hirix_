import { Router } from "express";
import authRoutes from './authRoutes'
import adminRoutes from './adminRoutes'
import companyRoutes from './companyRoutes'

const router = Router();

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/company', companyRoutes)

export default router;