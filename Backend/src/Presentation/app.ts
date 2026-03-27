import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import pinoHttp from 'pino-http';
import { connectDB } from '../Infrastructure/config/mongo.config';
import routes from './http/routes/index'
import { logger } from '../utils/logging/loger';
import { errorHandler } from './http/middlewares/errorHandler';


const app = express();

app.use(
    pinoHttp({logger})
)

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static('uploads'))

connectDB().catch((err) => {
    logger.error({err}, 'Database connection failed')
    process.exit(1)
});

// logger.info(`production: ${process.env.NODE_ENV}`)
app.get('/test', (req, res) => {
    req.log.info("Test route hit")
    res.status(200).json({status: "OK"});
});
app.use('/api', routes)
app.use(errorHandler)

export default app;