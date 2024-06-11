import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../notes";

function renderNote(data) {
  return <Note key={data.key} title={data.title} content={data.content} />;
}

function App() {
  return (
    <div id="root">
      <Header />
      {notes.map(renderNote)}
      <Footer />
    </div>
  );
}

export default App;
