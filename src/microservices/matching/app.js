const express = require('express');
const app = express();
const port = process.env.PORT || 3000;;

app.get('/', (req, res) => res.send('Hello World!'));

const matchingServiceRouter = require('./routes/matching');

app.use('/match', matchingServiceRouter);

app.listen(port, () => console.log(`Express app running on port ${port}!`));