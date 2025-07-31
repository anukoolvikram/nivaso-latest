import express from 'express'
import authRoutes from './src/api/auth/auth.routes.js';
import federationRoutes from './src/api/federation/federation.routes.js'
import societyRoutes from './src/api/society/society.routes.js'
import residentRoutes from './src/api/resident/resident.routes.js'
import blogRoutes from './src/api/blog/blog.routes.js'
import complaintRoutes from './src/api/complaint/complaint.routes.js'
import noticeRoutes from './src/api/notice/notice.routes.js'
import documentRoutes from './src/api/document/document.routes.js'
import cors from 'cors'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/federation', federationRoutes);
app.use('/api/v1/society', societyRoutes);
app.use('/api/v1/resident', residentRoutes);
app.use('/api/v1/blog', blogRoutes);
app.use('/api/v1/complaint', complaintRoutes);
app.use('/api/v1/notice', noticeRoutes);
app.use('/api/v1/document', documentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
