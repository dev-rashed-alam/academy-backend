const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL)
    .then(() => {
      console.log("DB connection successful!");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  connectDB,
};
