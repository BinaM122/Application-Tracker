import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../auth/firebase'
// Import a standard Google icon from MUI instead of the missing custom one
import GoogleIcon from '@mui/icons-material/Google' 

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: { maxWidth: '420px' },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(2),
  backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
}))

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <SignInContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography component="h1" variant="h4">
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back. Sign in to manage your job applications.
          </Typography>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={loading}
            startIcon={<GoogleIcon />}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <Typography sx={{ textAlign: 'center' }} variant="body2">
            Don't have an account?{' '}
            <Link href="/signup">Sign up</Link>
          </Typography>
        </Card>
      </SignInContainer>
    </React.Fragment>
  )
}