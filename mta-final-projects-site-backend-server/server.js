const { google } = require('googleapis');
const UserDB = require('./DB/entities/user.entity');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require("./Routers/users/users.router");
const uploadRouter = require('./Routers/upload_csv');

const app = express();
const port = process.env.PORT || 3001; // Set the port for the server to listen on

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the user routes
app.use(userRouter);

// Use the upload router
app.use('/upload', uploadRouter);

// Create a new JWT client to authenticate with the Google Sheets API
const jwtClient = new google.auth.JWT({
  email: 'roy-sagi@mta-final-projects-site.iam.gserviceaccount.com',
  key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCm92/JxQyUqXkp\nM469hzUhXylQwCQzBFjdd0ddhAAaIN8a9oLoMXQZA0BXYKGXu5OPPkNtJxRAA2Rf\nEvJ4PtfiYmueBIngMfuVxXHZnTg15Tz1kkHcl/Hd48iZcrOJKy+cHAHiDRyJb+oz\nlDMRXtIfEwVgVOb9a1WhdqWcRYFWxWUIE9sy2JjAZmR2s3SGYujU92MjV6Eny8BG\nCZ+c1OgAcgRzdg6IfwhpB38zH7MjPj9bRmNVBF1PcPPj0LL4gnQhSL3PFmgyvzMA\nrXNG51nmlZpKaFpevXz7AWPA5sNlGyIxQKA4W4sPMFUc1x0rIIKeAXjdy1gc0zZm\nQNWDE3inAgMBAAECggEADZSA6lXomNhstMX787zHiX6GWCPVZ4DdaXkfvAkJQrBh\nweOpVt4ocmn24orgs2KotQHiog7uCrbVg+LnbcUbi5vNsDCJgxhA1wTg80r76dMX\nV8uDJ9oD7IEJk9F/rZLU1uTZ3ygjctpAOXaLhy70w112Sa63viAfLhH9+yCvTTG0\nF8M1sXT6si7UtR+0Rrl4mpb48sLvA1mAX89DWN9H6CiToFjltqu0/rbF4jOcad0E\nQbl/afT7kTxiO3kyLPjCu5hqt++Gawz2ax965NtVXOPGenu21IcXYQIAXuecEV5L\nkGEl8c3qHk8Hfly6eO7PK9zOy/geiyPQk38vZcPPgQKBgQDTcCgcIRj1ThYKdXt0\nXQPtHTFqnODue3PQTiLRBoAwzYNc7KyBfiu9cvbHKxUFXn4Ve7kMiMOsbiYYU6tv\nHFiXqb3wrkGVfVtQqufV71mmjgl37eFBH2SJ83NYdk8ErrKzjoaSPH+zgqF7y70n\nfrcU58+VrT2l2/cF2juiTWTSlwKBgQDKJ+FDqsRRiNUI3IuTgVks7rKNSRKGkkTu\nozNONzpIa1mDjvIj01p0iCdR+fwRhA6/i6veGtfhuNZaFzkqNLLO7PWnkulD7Vxv\nzCvo+h8iGnFO5fhW5tkgcENTXUQwn2U8ovYmH8oOhNtpmSFfjyZ0nUyKDcHxkYvn\nMhaBFQYccQKBgB8cUpqI+C4n9jBFxwuBIDHEaOACA0qz2X+d75uH9Fa59ok2vc8z\n7GWsw8jcevRWSgEJOlowyXHWpz5PGVt49UQjkrIWQcooLsZ4zzH4TN2n6pa95rX5\nU4bEzoUGq2vJ9Ltczko4IqYcI3yeps9n4rJtxWqFmhuMeRVgXgPslVgzAoGBAJ/v\n0U8B6fQ/95vdMShwa6ca6nTRXTDOxG6w+8Rj+V6WX+mvzG7/pk8P8VvwFbed7TUq\nQb2lKytQW3ZHbViw/M6ttuTvXFH7luh0dkEKslr+5KpxU3sdhKcfaoSoA20cjrHc\nlDYxbGD0R8tR9Y9u6BPW51lJ7Sk7553wiNFzWrRhAoGATapxXiX24gmwWa/GCB1M\nTG68TpdXT1mn41O8XLIBjRcW30moliv0NtSkqbai4C+NRf/eFPPSvAjed4gs6/PR\n9JYU+dq9sOTUGNCJAVESvQvFGA71pB7MJn2emIWY8lE/sXoGJzsAbBlsJHRuVtC+\numgMJq0lYoW8aQ0iaqLlusw=\n-----END PRIVATE KEY-----\n',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Start and init the server
app.listen(port, async () => {
  await UserDB.init();
  console.log(`Server is running on port ${port}`);
});