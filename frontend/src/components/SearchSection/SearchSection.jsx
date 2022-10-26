import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "./SearchSection.scss";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useRef } from "react";

function SearchSection() {
  const [textEntry, setTextEntry] = useState("");
  const [searchTerms, setSearchTerms] = useState([]);

  const inputTextRef = useRef();

  const handleAddSearchTerm = (text) => {
    inputTextRef?.current?.focus();
    setSearchTerms((data) => [...data, text]);
    setTextEntry("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && textEntry !== "") {
      handleAddSearchTerm(textEntry);
    }
  };

  const handleRemoveSearchTerm = (index) => {
    setSearchTerms((data) => data.filter((_, i) => i !== index));
  };

  return (
    <div className="searchSectionContainer">
      <div className="searchSection">
        {searchTerms.map((searchTerm, index) => (
          <TextField
            key={index}
            className="searchTerm"
            variant="outlined"
            fullWidth
            value={searchTerm}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  color="error"
                  onClick={() => handleRemoveSearchTerm(index)}
                >
                  <DeleteIcon />
                </IconButton>
              ),
            }}
          />
        ))}
      </div>

      <div className="addSearchTermSection">
        <TextField
          value={textEntry}
          onChange={(e) => setTextEntry(e.target.value)}
          className="addSearchTerm"
          variant="outlined"
          fullWidth
          autoFocus
          label="Add Search Term"
          inputRef={inputTextRef}
          onKeyPress={handleKeyPress}
        />

        <IconButton
          color="primary"
          disabled={textEntry.length === 0}
          onClick={() => handleAddSearchTerm(textEntry)}
        >
          <PlaylistAddIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
}

export default SearchSection;
