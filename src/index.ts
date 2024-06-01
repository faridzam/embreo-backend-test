import * as dotenv from 'dotenv';
import { server } from "./app";

dotenv.config({path: `.env.${process.env.NODE_ENV}`});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});