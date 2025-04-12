const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // ou '*' pour tout autoriser
  credentials: true
}));