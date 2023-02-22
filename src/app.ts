/* External dependencies */
import express from 'express';
import rateLimit from 'express-rate-limit';
import userAgent from 'express-useragent';
import cloudflare from 'cloudflare-express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();

app.use(userAgent.express());
app.use(cloudflare.restore());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 1500
    })
)

export default app;
