const express = require("express");



const auth = require("./routes/api/auth");
const app = express();

app.use("/auth", auth)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
