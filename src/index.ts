import { connectDB } from './mongodb/connection'
import server from './server';
//import app from './server'

connectDB();

server.listen(3000, () => {
    //console.log('Server is running on port 3000')
})