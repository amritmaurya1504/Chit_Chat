import * as React from 'react';
import axios from "axios";
import { useState, useEffect } from "react"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import { Link, useHistory } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "../App.css"
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import { MDBBtn } from 'mdb-react-ui-kit';
import { MDBTypography } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { setUserDetails, setChats } from "../redux/actions/index";

const url = "http://localhost:8000";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: 500,
  height: 500,
  bgcolor: 'background.paper',
  p: 2,
  px: 4,
  pb: 3,
};

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <a color="inherit" target="_blank" href="https://amritraj.live/">
        Amrit Raj
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function LoginPage() {



  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [gemail, setgEmail] = useState();
  const [gpassword, setgPassword] = useState();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  // const history = useHistory()
  useEffect(() => {
    document.title = "ChitChat | Login"

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
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
        `/api/user/login`,
        { email, password },
        config
      );

      // console.log(JSON.stringify(data));
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
      localStorage.setItem("userInfo", JSON.stringify(data.userLogin));
      localStorage.setItem("jwt", JSON.stringify(data.token));

      dispatch(setUserDetails(data.userLogin));
      setLoading(false);


      setTimeout(() => {
        history.push("/");
      }, 2000);
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
  };



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
            {/* <Typography component="h1" variant="h5"> */}
            <h1 className="display-6">Welcome to ChitChat  !</h1>
            <small className="mt-2 text-center" style={{
              // color: "#797c8c"
            }}>A Complete one to one and group Real-Time chatting application.</small>
            <small className="mt-2" style={{
              color: "#797c8c"
            }}>Sign in to continue to <strong>ChitChat</strong></small>
            {/* </Typography> */}
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                style={{
                  backgroundColor: "#385a64",
                }}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                {loading ? (<Box sx={{ display: 'flex' }}>
                  <CircularProgress color="inherit" />
                </Box>) :
                  'sign in'}
              </Button>
              <Button
                style={{
                  backgroundColor: "#ff4f5a",
                }}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mb: 2 }}
                onClick={(e) => {
                  e.preventDefault()
                  setgEmail("chitChat@gmail.com");
                  setgPassword("123456");
                  setOpen(true);

                }}
              >
                Get Guest User Credentials
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to="/change-password" style={{
                    cursor: "pointer",
                    color: "#1266f1",
                    textDecoration: "none"
                  }} variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link style={{
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "#1266f1"
                  }} to="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}

                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>

          <img className='image' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
          <h2 id="unstyled-modal-title" className='display-6' >Guest User Credentials</h2>
          <MDBTypography note noteColor='success'>
            <strong> <EmailIcon /> [Email] :</strong> {gemail}
          </MDBTypography>
          <br />
          <MDBTypography note noteColor='success'>
            <strong> <PasswordIcon /> [Password] :</strong> {gpassword}
          </MDBTypography>
          <br />
          <MDBBtn color='danger' onClick={handleClose}>Close</MDBBtn>


          <MDBTypography note noteColor='warning' className='mt-5'>
            <strong>note : </strong> Use this credentials for login, whithout register.
          </MDBTypography>

        </Box>
      </StyledModal>
    </ThemeProvider>
  );
}