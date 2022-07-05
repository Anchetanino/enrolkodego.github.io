const express = require('express');
const app = express();
const port = 3001;
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.set('view engine', 'hbs');
app.use('/kodego', require('./routes/kodego'))
app.use('/', require('./routes/kodegoRoutes'))


app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
})