require("dotenv").config();

const exp = require("constants");
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3010;

app.use(cors());

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const inputRoutes = require("./routes/ncm");
app.use("/ncm", inputRoutes);

const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

// const authRoutes = require("./routes/auth");
// app.use("/auth", authRoutes);

const todoRoutes = require("./routes/todo");
app.use("/todo", todoRoutes);

const csrRoutes = require("./routes/csr");
app.use("/csr", csrRoutes);

const correctiveRoutes = require("./routes/corrective");
app.use("/corrective", correctiveRoutes);

const sysdocsRoutes = require("./routes/sysdocs");
app.use("/sysdocs", sysdocsRoutes);

const requestsRoutes = require("./routes/requests");
app.use("/requests", requestsRoutes);

const dcrhistoryRoutes = require("./routes/dcrhistory");
app.use("/dcrhistory", dcrhistoryRoutes);

const docsavailRoutes = require("./routes/docsavail");
app.use("/docsavail", docsavailRoutes);

app.listen(port, async() => {
  // console.log(`Example app listening at http://localhost:${port}`);
});
