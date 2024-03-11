import express from 'express';
import routes from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './lib/swagger.json' assert { type: 'json' };; 
const app = express();
// Assign different ports for server and testing
const port = process.env.NODE_ENV === 'test' ? process.env.TEST_PORT || 3001 : process.env.PORT || 3000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
