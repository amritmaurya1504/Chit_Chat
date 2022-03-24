import * as React from 'react';
import { useState, useEffect } from "react"
import axios from "axios"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../App.css"
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const url = "http://localhost:8000";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://amritraj.live/">
        Amrit Raj
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function ForgotPass() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailPres, setEmailPres] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "ChitChat | Forgot Password"

  }, [])

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!password) {
      toast.warning('Please Fill all the fields!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.put(
        `/api/user/change-password`,
        { email, password },
        config
      );
      toast.success(data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      // console.log(JSON.stringify(data));
      setLoading(false);
      setEmailPres(true)

    } catch (error) {
      toast.error("Invalid Credentials!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      setLoading(false);
    }

  }

  const findEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.warning('Please Fill all the fields!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/user/find-email`,
        { email },
        config
      );

      // console.log(JSON.stringify(data));
      setLoading(false);
      setEmailPres(true)

    } catch (error) {
      toast.error("Invalid Credentials!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      setLoading(false);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://res.cloudinary.com/amritrajmaurya/image/upload/v1647770611/2992779_kvpxjp.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}> */}
            <img className='image' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
            {/* </Avatar> */}
            <Typography component="h1" variant="h5">
              Change Password
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Enter Your Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {emailPres && <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Enter New Password"
                type="password"
                id="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />}



              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              {!emailPres && (<Button
                style={{
                  backgroundColor: "#385a64",
                }}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={findEmail}
              >
                Next
              </Button>)}
              {emailPres && (<Button
                style={{
                  backgroundColor: "#385a64",
                }}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={changePassword}
              >
                {loading ? (<Box sx={{ display: 'flex' }}>
                  <CircularProgress color="inherit" />
                </Box>) :
                  "Change Password"}
              </Button>)}
              <Grid container>
                {/* <Grid item xs>
                <Link style={{
                    cursor: "pointer",
                    textDecoration: "none"
                  }} to="/login" variant="body2">
                    {"Sign In"}

                  </Link>
                </Grid> */}

                <Grid item>
                  <Link style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color : "#1266f1"
                  }} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}

                  </Link>
                  <br />
                  <br />
                  <Link style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color : "#1266f1"
                  }} to="/login" variant="body2">
                    {"Already have an account? Sign In"}

                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}