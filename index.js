const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const path = require("path");
const app = express();
const upload = multer({ dest: "uploads/" });
const sequelize = require("./db");
const fs = require("fs");
const User = require("./models/user");

// Connect to the database and synchronize models
sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Failed to sync database:", err));

app.post("/compare-faces", upload.array("images", 2), (req, res) => {
  if (req.files.length !== 2) {
    return res.status(400).send("Please upload exactly two images.");
  }

  const imagePaths = req.files.map((file) => path.join(__dirname, file.path));
  const scriptPath = path.join(__dirname, "compare_faces.py");

  execFile("python", [scriptPath, ...imagePaths], (error, stdout, stderr) => {
    if (error) {
      console.error("Error running script:", stderr);
      return res.status(500).send("Error executing Python script.");
    }

    const areSamePerson = stdout.includes("It's the same person.");

    res.send({
      message: "Comparison result",
      areSamePerson: areSamePerson,
      details: stdout,
    });
  });
});

app.post("/register-face", upload.single("image"), async (req, res) => {
  if (!req.file || !req.body.name || !req.body.age) {
    return res
      .status(400)
      .send("Please upload an image and include name and age.");
  }

  const { name, age } = req.body;
  const imagePath = path.join(__dirname, req.file.path);
  const scriptPath = path.join(__dirname, "facial_descriptor.py");

  execFile("python", [scriptPath, imagePath], async (error, stdout, stderr) => {
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Error deleting the file:", err);
    });

    if (error) {
      console.error("Error running script:", stderr);
      return res.status(500).send("Error executing Python script.");
    }

    console.log(stdout);

    const matches = stdout.match(/\[\s*((?:-?\d+\.\d+\s*)+)\]/);
    if (!matches || matches.length < 2) {
      return res.status(500).send("Failed to parse face descriptor.");
    }

    const faceDescriptor = matches[1].trim().split(/\s+/).map(parseFloat);

    try {
      const user = await User.create({
        name,
        age: parseInt(age, 10),
        faceEncoding: faceDescriptor,
      });

      console.log("User created:", user.toJSON());
      res.send({
        message: "User registered successfully",
        userDetails: user,
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      res.status(500).send("Failed to register user in the database.");
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
