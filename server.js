// Dependencies
var express = require("express");
var fs = require("fs");
var app = express();
var PORT = process.env.PORT||8080;
var path = require("path");
// var mainDir = path.join(__dirname, "/public");
app.use(express.static("public"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic route that sends the user first to the AJAX Page
app.get("/notes", function (req, res) {
  res.sendFile(path.resolve("./public", "notes.html"));
});

app.get("/api/notes", function (req, res) {
  res.sendFile(path.resolve("./db", "db.json"));
});

app.get("*", function (req, res) {
  res.sendFile(path.resolve("./public", "index.html"));
});

// save a new note
app.post("/api/notes", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  let uniqueId = savedNotes.length.toString();
  newNote.id = uniqueId;
  savedNotes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(newNote);
});

app.delete("/api/notes/:id", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  console.log(savedNotes);
  let noteId = req.params.id;
  savedNotes.splice(noteId, 1);
  let newId = 0;
  savedNotes.forEach((element) => {
    element.id = newId;
    newId++;
  });
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
