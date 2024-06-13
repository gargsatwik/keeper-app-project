import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Note from "./Note.jsx";
import CreateArea from "./CreateArea.jsx";
import React from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const port = 5000;
async function App() {
  const noteList = await axios.get(`http://localhost:${port}/all-notes`);

  async function addNote(titleText, contentText) {
    const newNote = {
      _id: uuidv4(),
      title: titleText,
      content: contentText,
    };
    console.log(newNote);
    const responseCode = await axios.post(
      `http://localhost:${port}/new-note`,
      newNote
    );
    if (responseCode !== 200) {
      console.log("Error posting note");
    }
  }

  async function deleteNote(id) {
    const statusCode = await axios.post(
      `http://localhost:${port}/delete-note`,
      id
    );
    if (statusCode !== 200) {
      console.log("Failed to delete note");
    }
  }

  return (
    <div id="root">
      <Header />
      <CreateArea add={addNote} />
      {noteList.map((note, index) => {
        return (
          <Note
            key={index}
            id={note._id}
            title={note.title}
            content={note.content}
            delete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
