const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./routes/routes");

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



