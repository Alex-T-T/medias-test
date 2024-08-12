import 'dotenv/config';
import app from './app/app'
import { sequelize } from './db/db.config';


const PORT = process.env.SERVER_PORT || 8008;

const startServer = () => {
    
    app.listen(PORT, async () => {


        try {
            await sequelize.authenticate();
            await sequelize.sync({ force: true });
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
        console.log(`server has started on PORT: ${PORT}`);
    });
};

startServer();
