import React from 'react'
import "./MainLayout.scss";
import SearchSection from '../../components/SearchSection/SearchSection'
import { Button } from "@mui/material";

function MainLayout() {
  return (
    <div className="mainlayoutWrapper">
      <SearchSection />
      <div className="searchRow card">
        <Button variant="contained">Run!</Button>
      </div>
    </div>
  );
}

export default MainLayout