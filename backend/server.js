import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import { Sequelize } from 'sequelize';

dotenv.config();

const app = express();

app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

sequelize.sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => console.error('Failed to sync database:', err));
