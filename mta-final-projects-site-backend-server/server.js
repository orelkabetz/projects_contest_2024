const { google } = require('googleapis');

// Create a new JWT client to authenticate with the Google Sheets API
const jwtClient = new google.auth.JWT({
  email: 'roy-sagi@mta-final-projects-site.iam.gserviceaccount.com',
  key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm92/JxQyUqXkp\nM469hzUhXylQwCQzBFjdd0ddhAAaIN8a9oLoMXQZA0BXYKGXu5OPPkNtJxRAA2Rf\nEvJ4PtfiYmueBIngMfuVxXHZnTg15Tz1kkHcl/Hd48iZcrOJKy+cHAHiDRyJb+oz\nlDMRXtIfEwVgVOb9a1WhdqWcRYFWxWUIE9sy2JjAZmR2s3SGYujU92MjV6Eny8BG\nCZ+c1OgAcgRzdg6IfwhpB38zH7MjPj9bRmNVBF1PcPPj0LL4gnQhSL3PFmgyvzMA\nrXNG51nmlZpKaFpevXz7AWPA5sNlGyIxQKA4W4sPMFUc1x0rIIKeAXjdy1gc0zZm\nQNWDE3inAgMBAAECggEADZSA6lXomNhstMX787zHiX6GWCPVZ4DdaXkfvAkJQrBh\nweOpVt4ocmn24orgs2KotQHiog7uCrbVg+LnbcUbi5vNsDCJgxhA1wTg80r76dMX\nV8uDJ9oD7IEJk9F/rZLU1uTZ3ygjctpAOXaLhy70w112Sa63viAfLhH9+yCvTTG0\nF8M1sXT6si7UtR+0Rrl4mpb48sLvA1mAX89DWN9H6CiToFjltqu0/rbF4jOcad0E\nQbl/afT7kTxiO3kyLPjCu5hqt++Gawz2ax965NtVXOPGenu21IcXYQIAXuecEV5L\nkGEl8c3qHk8Hfly6eO7PK9zOy/geiyPQk38vZcPPgQKBgQDTcCgcIRj1ThYKdXt0\nXQPtHTFqnODue3PQTiLRBoAwzYNc7KyBfiu9cvbHKxUFXn4Ve7kMiMOsbiYYU6tv\nHFiXqb3wrkGVfVtQqufV71mmjgl37eFBH2SJ83NYdk8ErrKzjoaSPH+zgqF7y70n\nfrcU58+VrT2l2/cF2juiTWTSlwKBgQDKJ+FDqsRRiNUI3IuTgVks7rKNSRKGkkTu\nozNONzpIa1mDjvIj01p0iCdR+fwRhA6/i6veGtfhuNZaFzkqNLLO7PWnkulD7Vxv\nzCvo+h8iGnFO5fhW5tkgcENTXUQwn2U8ovYmH8oOhNtpmSFfjyZ0nUyKDcHxkYvn\nMhaBFQYccQKBgB8cUpqI+C4n9jBFxwuBIDHEaOACA0qz2X+d75uH9Fa59ok2vc8z\n7GWsw8jcevRWSgEJOlowyXHWpz5PGVt49UQjkrIWQcooLsZ4zzH4TN2n6pa95rX5\nU4bEzoUGq2vJ9Ltczko4IqYcI3yeps9n4rJtxWqFmhuMeRVgXgPslVgzAoGBAJ/v\n0U8B6fQ/95vdMShwa6ca6nTRXTDOxG6w+8Rj+V6WX+mvzG7/pk8P8VvwFbed7TUq\nQb2lKytQW3ZHbViw/M6ttuTvXFH7luh0dkEKslr+5KpxU3sdhKcfaoSoA20cjrHc\nlDYxbGD0R8tR9Y9u6BPW51lJ7Sk7553wiNFzWrRhAoGATapxXiX24gmwWa/GCB1M\nTG68TpdXT1mn41O8XLIBjRcW30moliv0NtSkqbai4C+NRf/eFPPSvAjed4gs6/PR\n9JYU+dq9sOTUGNCJAVESvQvFGA71pB7MJn2emIWY8lE/sXoGJzsAbBlsJHRuVtC+\numgMJq0lYoW8aQ0iaqLlusw=\n-----END PRIVATE KEY-----\n',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const checkLoginDetails = async (userID,password) => {
  try {
    // Authenticate the JWT client
    await jwtClient.authorize();

    // Create a Sheets instance
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });

 
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1TZbtfPkdn22lfmX94jHNgGigkOq1eTEwUHWJSLjGZD0',
      range: 'A1:B', // Include first row and columns A and B
    });
    
    const values = response.data.values;
    const columnNames = values[0]; // Names from the first row
    const users = values.slice(1); // Data rows excluding the first row
    found_user = false;
    for (const user of users) {
      
      const [sheetUsername, sheetPassword] = user;
      if (sheetUsername === userID && sheetPassword === password) {
        
        found_user = true; // Username and password found
        break;
      }
      if (sheetUsername === userID ) {
        found_only_id = true; // Username and password found
        break;
      }
      
    }

    if (found_user) {
      console.log('ID and password found');
    }
    else {
      console.log('user not found');
    }
  } catch (error) {
    console.error('Error reading data from Google Sheets:', error);
  }
};


const checkIfUserExist = async (userID) => {
  try {
    // Authenticate the JWT client
    await jwtClient.authorize();

    // Create a Sheets instance
    const sheets = google.sheets({ version: 'v4', auth: jwtClient });

 
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1TZbtfPkdn22lfmX94jHNgGigkOq1eTEwUHWJSLjGZD0',
      range: 'A1:B', // Include first row and columns A and B
    });
    
    const values = response.data.values;
    const columnNames = values[0]; // Names from the first row
    const users = values.slice(1); // Data rows excluding the first row

    found_user = false;
    for (const user of users) {
      const [sheetUsername] = user;
      if (sheetUsername === userID) {
        found_user = true; // Username and password found
        break;
      }
    }

    if (found_user) {
      console.log('user already exist');
      return true;
    }
     else  {
      console.log('user does not exist can proceed with making a user');
      return false;
    }
  } catch (error) {
    console.error('Error reading data from Google Sheets:', error);
  }
};



async function addNewUserToSheet(userID, password) {
  try {
    if(await checkIfUserExist(userID)) {
    console.log("aaaaa");

      return Error('user already exist')
    };
  // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
     keyFile: './mta-final-projects-site-dc9ca4fb543d.json',
     scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();

    // Create a Google Sheets instance
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Specify the spreadsheet ID
    const spreadsheetId = '1TZbtfPkdn22lfmX94jHNgGigkOq1eTEwUHWJSLjGZD0';

    // Prepare the new user's data
    const newUserRow = [userID, password];
    
    // Append the new user's data to the Google Sheets document
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'A:B', // Range where you want to append the new data
      valueInputOption: 'RAW',
      requestBody: {
        values: [newUserRow],
      },
    });

    console.log('New user added successfully');
    return true;
  } catch (error) {
    console.error('Error adding new user:', error);
    return false;
  }
}




const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 


const app = express();
const port = process.env.PORT || 3001; // Set the port for the server to listen on
// Enable CORS for all requests This lets you run both tests server + front and communicate
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Routes
app.post('/login', (req, res) => {
  // Handle login request
  const { userID, password } = req.body;

  checkLoginDetails(userID,password);
  // Call your login logic here
  // For example, you can call a function from your Login module
  //const loginResult = Login.login(username, password); // Assuming your login logic returns a result
  res.json("aaaa");
});

app.post('/register', (req, res) => {
  // Handle register request
  const { userID, password } = req.body;

  addNewUserToSheet(userID,password);
  // Call your register logic here
  // For example, you can call a function from your Login module
  //const registerResult = Login.register(username, password); // Assuming your register logic returns a result
  res.json("aaaa");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
