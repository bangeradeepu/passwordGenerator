import React, { useState, useEffect } from 'react';
import {
  Container,
  Checkbox,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const App = () => {
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeAlphabets, setIncludeAlphabets] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordHistory, setPasswordHistory] = useState([]);


  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const storedPasswords = JSON.parse(localStorage.getItem('passwordHistory')) || [];
    setPasswordHistory(storedPasswords);
  }, []);

  const generatePassword = () => {
    const numbers = '0123456789';
    const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = '';
    if (includeNumbers) characters += numbers;
    if (includeAlphabets) characters += alphabets;
    if (includeSpecialChars) characters += specialChars;

    if (characters.length === 0) {
      alert('Please select at least one option!');
      return;
    }

    let generatedPassword = '';
    for (let i = 0; i < 12; i++) {
      generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setPassword(generatedPassword);
    updatePasswordHistory(generatedPassword);
  };

  const updatePasswordHistory = (newPassword) => {
    const newHistory = [newPassword, ...passwordHistory].slice(0, 5);
    setPasswordHistory(newHistory);
    localStorage.setItem('passwordHistory', JSON.stringify(newHistory));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Password copied to clipboard!');
  };
  useEffect(() => {
    // Check if Geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Password Generator</Typography>
      <div>
        <FormControlLabel
          control={<Checkbox color='success' checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />}
          label="Include Numbers"
        />
        <br />
        <FormControlLabel
          control={<Checkbox color='success' checked={includeAlphabets} onChange={(e) => setIncludeAlphabets(e.target.checked)} />}
          label="Include Alphabets"
        />
        <br />
        <FormControlLabel
          control={<Checkbox color='success' checked={includeSpecialChars} onChange={(e) => setIncludeSpecialChars(e.target.checked)} />}
          label="Include Special Characters"
        />
      </div>
      <Button sx={{ marginTop: 2,borderRadius:50 }} variant="contained" color="success" onClick={generatePassword}>
        Generate Password
      </Button>
      {password && (
        <div>
          <TextField
          sx={{marginTop:5}}
            label="Generated Password"
            value={password}
            color='success'
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => copyToClipboard(password)}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            margin="normal"
          />
        </div>
      )}
      
      {passwordHistory.length > 0 && (
        <>
          <Typography sx={{ marginTop: 4 }} variant="h6" gutterBottom>
            Last 5 Passwords
          </Typography>
          <List>
            {passwordHistory.map((pwd, index) => (
              <ListItem key={index}>
                <ListItemText primary={pwd} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="copy" onClick={() => copyToClipboard(pwd)}>
                    <ContentCopyIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}
       <div>
     <Stack sx={{marginTop:5}}>
     {latitude && longitude ? (
        <Typography>
          Latitude: {latitude}, Longitude: {longitude}

        </Typography>
      ) : (
        <Typography>Location Loading...</Typography>
      )}
     </Stack>
    </div>
    </Container>
  );
};

export default App;
