import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import { connectDB } from '../Infrastructure/config/mongo.config';
import routes from './http/routes/index'
import { logger } from '../utils/logging/loger';
import { errorHandler } from './http/middlewares/errorHandler';


const app = express();

app.use((req, res, next) => {
    logger.info(`incoming request ${req.method} from ${req.url}`)
    next()
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

connectDB().catch((err) => {
    logger.error('Database connection failed', err)
    process.exit(1)
});

app.get('/test', (req, res) => {
    logger.info('I am from app.ts')
    res.status(200).json({status: "OK"});
});
app.use('/api', routes)
app.use(errorHandler)

export default app;