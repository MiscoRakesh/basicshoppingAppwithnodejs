const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandlers");
let cl = console.log.bind(console);
const app = express();
dbConnect();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/user", require("./routes/authRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/blog", require("./routes/blogRoutes"));
app.use("/api/category", require("./routes/prodCategoryRoute"));
app.use("/api/blogcategory", require("./routes/blogCategoryRoute"));
app.use("/api/brand", require("./routes/brandRoute"));
app.use("/api/coupon", require("./routes/couponRoute"));
app.use(errorHandler);

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server up & running on PORT ${PORT}`);
});
