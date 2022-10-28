import React, { useRef, useState } from "react";
import "./MainLayout.scss";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { MenuItem } from "@mui/material";

const searchCategories = [
  {
    value: "companies",
    label: "Companies",
  },
  {
    value: "people",
    label: "People",
  },
];
const limits = [10, 50, 100, 200];
function MainLayout() {
  const [textEntry, setTextEntry] = useState("");
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("RingStone");
  const [searchCategory, setSearchCategory] = useState("companies");
  const [limit, setLimit] = useState(100);
  const [location, setLocation] = useState("");
  const inputTextRef = useRef();
  const [isRunning, setIsRunning] = useState(false);

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
    <div className="mainlayoutWrapper">
      <div className="searchSectionContainer card">
        <div className="titleSection">Search terms</div>
        <div className="searchSection">
          {searchTerms.map((searchTerm, index) => (
            <TextField
              key={index}
              className="searchTerm"
              variant="outlined"
              fullWidth
              value={searchTerm}
              margin="normal"
              size="small"
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
            margin="normal"
            size="small"
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
      <div className="searchRow card">
        <TextField
          label="SearchKeyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
        />

        <TextField
          select
          label="Search category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          margin="normal"
          size="small"
        >
          {searchCategories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          margin="normal"
          size="small"
        >
          {limits.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          variant="outlined"
          margin="normal"
          size="small"
        />
        <Button
          disabled={
            isRunning || searchTerms.length === 0 || searchKeyword.length === 0
          }
          variant="contained"
        >
          Run!
        </Button>
      </div>
    </div>
  );
}

export default MainLayout;
