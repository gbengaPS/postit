import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router';

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/', express.static(path.join(__dirname, '../client/bundled')));
app.use('/doc', express.static(path.join(__dirname, '../doc')));
app.use('/api', router);

app.get('/doc', (req, res) => {
  res.sendFile(path.join(__dirname, '../doc', 'index.html'));
});

app.get('/*', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'URL does not exist on this server' });
});

export default app;
