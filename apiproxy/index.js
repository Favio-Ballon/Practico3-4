const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const bodyParser = require("body-parser");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Credentials",
    ],
  })
);

const onProxyReq = async function (proxyReq, req, res) {
  if (!req.cookies) {
    console.log("cookies:" + req);
    console.log("cookies:" + req.cookies);
    console.error("No cookies found in the request");
    return;
  }
  const token = req.cookies.access;
  console.log("Token found: " + token);
  if (token) {
    proxyReq.setHeader("Authorization", "Bearer " + token);
  }
};

const apiProxy = createProxyMiddleware({
  target: "http://127.0.0.1:8000/libreria/",
  changeOrigin: true,
  pathRewrite: (path, req) => {
    return path.replace("/webproxy", "");
  },
  on: {
    proxyReq: onProxyReq,
  },
});
const port = 3000;

app.use(cookieParser());
app.use("/webproxy", apiProxy);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./routes/auth.routes")(app);

app.listen(port, () => {
  console.log(`Proxy server is running at http://localhost:${port}`);
});
