import React from 'react'
import TextField from '@mui/material/TextField';
import 'SearchSection.scss'

function SearchSection() {
  return (
    <div className='searchSectionContainer'>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div>
  )
}

export default SearchSection