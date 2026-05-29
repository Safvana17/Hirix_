import { Router } from "express";
import authRoutes from './authRoutes'
import adminRoutes from './adminRoutes'
import companyRoutes from './companyRoutes'
import candidateRoutes from './candidateRoutes'
import interviewRoutes from './interviewRoutes'

const router = Router();

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/company', companyRoutes)
router.use('/candidate', candidateRoutes)
router.use('/interview', interviewRoutes)

export default router;