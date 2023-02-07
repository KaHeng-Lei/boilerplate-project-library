const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const db = mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("successfully connected to database");
    },
    (err) => {
      console.log("Connection failure: ", err);
    }
  );

module.export = db;
