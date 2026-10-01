import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import envConfig from './src/config/env.config.js';

connectDB();

const PORT = envConfig.SERVER_PORT;

app.listen(PORT, (req, res) => {
    console.log(`Server running on port ${PORT}`);
});
