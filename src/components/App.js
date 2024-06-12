import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import React from "react";

function App() {
  const [noteList, changeNoteList] = React.useState([]);

  function addNote(titleText, contentText) {
    const newNote = {
      title: titleText,
      content: contentText,
    };
    changeNoteList([...noteList, newNote]);
  }

  function deleteNote(id) {
    changeNoteList((prevList) => {
      return prevList.filter((note, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div id="root">
      <Header />
      <CreateArea add={addNote} />
      {noteList.map((note, index) => {
        return (
          <Note
            key={index}
            id={index}
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
