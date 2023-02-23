import cors from "cors";

export default cors({
    allowedHeaders: [
        "Allow-Control-Allow-Origin",
        "Access-Control-Allow-Origin",
        "Content-Type",
        "Authorization",
    ],
    credentials: true,
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
});
