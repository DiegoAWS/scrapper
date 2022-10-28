import React, { useRef, useState } from "react";
import "./MainLayout.scss";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CircularProgress from "@mui/material/CircularProgress";
import { MenuItem } from "@mui/material";
import RingStoneLogo from "../assets/ringStoneLogo.svg"

import { sendSearchRequest } from "../services/axios";


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

  const handleSearch = async () => {
    setIsRunning(true);
    const response =await  sendSearchRequest({
      searchTerms,
      searchKeyword,
      searchCategory,
      limit,
      location,
    });
    console.log({ response });
  };

  return (
    <div className="mainlayoutWrapper">
      <div className="navBar card">
        <img src={RingStoneLogo} width={"50px"} alt="RingStone Logo" />
        <div className="title">RingStone Scrapping Tool</div>
      </div>
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
            disabled={isRunning}
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
          disabled={isRunning}
          margin="normal"
          size="small"
        />

        <TextField
          select
          label="Search category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          disabled={isRunning}
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
          disabled={isRunning}
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
          disabled={isRunning}
        />
        <Button
          disabled={
            isRunning || searchTerms.length === 0 || searchKeyword.length === 0
          }
          onClick={handleSearch}
          variant="contained"
        >
          {isRunning ? <CircularProgress size={20} /> : " Run!"}
        </Button>
      </div>
    </div>
  );
}

export default MainLayout;
