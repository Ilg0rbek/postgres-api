import { Router } from 'express'
import emlpoyRouter from './empoyer'
import jobRouter from './jobs'

const router = Router()

router.use('/jobs', jobRouter)
router.use('/employer', emlpoyRouter)

export default router
