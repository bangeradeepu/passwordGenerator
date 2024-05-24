import React, { useState, useEffect } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const App = () => {

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];




  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeAlphabets, setIncludeAlphabets] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState([]);

  useEffect(() => {
    const storedPasswords =
      JSON.parse(localStorage.getItem("passwordHistory")) || [];
    setPasswordHistory(storedPasswords);
  }, []);

  const generatePassword = () => {
    const numbers = "0123456789";
    const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    let characters = "";
    if (includeNumbers) characters += numbers;
    if (includeAlphabets) characters += alphabets;
    if (includeSpecialChars) characters += specialChars;

    if (characters.length === 0) {
      alert("Please select at least one option!");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < 12; i++) {
      generatedPassword += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setPassword(generatedPassword);
    updatePasswordHistory(generatedPassword);
  };

  const updatePasswordHistory = (newPassword) => {
    const newHistory = [newPassword, ...passwordHistory].slice(0, 5);
    setPasswordHistory(newHistory);
    localStorage.setItem("passwordHistory", JSON.stringify(newHistory));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  return (
    <div>
      <Typography variant="h4" component="h4">
        Password Generator
      </Typography>
      <div>
        <FormGroup style={{ marginTop: 10 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
            }
            label="Include Numbers"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeAlphabets}
                onChange={(e) => setIncludeAlphabets(e.target.checked)}
              />
            }
            label="Include Alphabets"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSpecialChars}
                onChange={(e) => setIncludeSpecialChars(e.target.checked)}
              />
            }
            label="Include Special Characters"
          />
        </FormGroup>
      </div>
      <Button
        sx={{ marginTop: 2 }}
        variant="outlined"
        onClick={generatePassword}
      >
        Generate Password
      </Button>
      {password && (
        <div>
          <p>Generated Password: {password}</p>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        </div>
      )}
      <Typography sx={{marginTop:5}} variant="h5" component="h5">
        Password Generator
      </Typography>
      <ul>
      <List>
        {passwordHistory.map((pwd, index) => (
          <ListItem key={index}>
            <ListItemText primary={pwd} />
          </ListItem>
        ))}
      </List>
      
      </ul>
    </div>
  );
};

export default App;
