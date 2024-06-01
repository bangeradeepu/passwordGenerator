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
  const serverAPI = import.meta.env.VITE_API_LINK;

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


  const amount = 50000;
  const currency = "INR";
  const receiptId ="qwsaql";
  const openPayment = async() => {
    const response = await fetch (`${serverAPI}/order`,{
      method:"POST",
      body : JSON.stringify({
          amount,
          currency,
          receipt : receiptId,
      }),
      headers :{
          "Content-Type":"application/json",
      },
  });
  const order = await response.json();
  console.log(order);
  var options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "My Website", // Your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      
      config: {
          display: {
              blocks: {
                  banks: {
                      name: 'All payment methods',
                      instruments: [
                          {
                              method: 'upi'
                          },
                          {
                              method: 'card'
                          },
                          {
                              method: 'wallet'
                          },
                          {
                              method: 'netbanking'
                          }
                      ],
                  },
              },
              sequence: ['block.banks'],
              preferences: {
                  show_default_blocks: false,
              },
          },
      },
      
      handler: async function (response) {
          const body = {
              ...response,
          };
  
          const validateRes = await fetch(
              `${serverAPI}/order/validate`,
              {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: {
                      "Content-Type": "application/json",
                  },
              }
          );
          const jsonRes = await validateRes.json();
          console.log(jsonRes);
          console.log(jsonRes.orderId);
          if(jsonRes.msg === 'success'){
              console.log("Its success");
          }

      },
  
      prefill: {
          name: "Deepu", // Your customer's name
          email: "deepu@gmail.com",
          contact: "9000000000", // Provide the customer's phone number for better conversion rates
      },
      notes: {
          address: "Razorpay Corporate Office",
      },
      theme: {
          color: "#3399cc",
      },
  };
  
    
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
    });
    rzp1.open();
    e.preventDefault();
  }

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
        <Button variant='outlined' color="success" sx={{marginTop:5}} onClick={openPayment}>Make payment</Button>
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
