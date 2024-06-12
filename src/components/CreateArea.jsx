import React from "react";
import "../styles.css";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";

function CreateArea(props) {
  const [inputText, setInputText] = React.useState("");
  const [textAreaText, setTextAreaText] = React.useState("");
  const [currentState, setCurrentState] = React.useState(false);

  function inputTextChange(event) {
    setInputText(event.target.value);
  }

  function textAreaTextChange(event) {
    setTextAreaText(event.target.value);
  }

  function handleClick(event) {
    event.preventDefault();
    props.add(inputText, textAreaText);
    setInputText("");
    setTextAreaText("");
  }

  function changeState() {
    if (!currentState) {
      setCurrentState(!currentState);
    }
  }

  return (
    <form className="create-note" onSubmit={handleClick}>
      <input
        style={{ display: currentState ? null : "none" }}
        value={inputText}
        onChange={inputTextChange}
        placeholder="Title"
      ></input>
      <textarea
        onClick={changeState}
        value={textAreaText}
        onChange={textAreaTextChange}
        placeholder="Take a note..."
        rows={currentState ? 3 : 1}
      ></textarea>
      <Zoom in={currentState}>
        <Fab>
          <AddIcon />
        </Fab>
      </Zoom>
    </form>
  );
}

export default CreateArea;
