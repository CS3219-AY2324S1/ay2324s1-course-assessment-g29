import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  selectLoginstatus,
  selectDisplayname,
  selectEmail,
  selectIdToken,
  selectUserid,
  setChangeDeactivateAccountAlert,
  resetUserStore
} from '../redux/UserSlice'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import { Dialog, DialogActions } from '@mui/material'
import DialogContent from '@mui/material/DialogContent'
import { setShowError, setErrorMessage, resetErrorStore } from '../redux/ErrorSlice.js'
import DeactivateAccountDialog from './DeactivateAccountAlert'
import { resetEditorStore } from '../redux/EditorSlice'
import { resetMatchingStore } from '../redux/MatchingSlice'

const pages = []

function Navbar () {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const loginStatus = useSelector(selectLoginstatus)
  const displayName = useSelector(selectDisplayname)
  const email = useSelector(selectEmail)
  const userId = useSelector(selectUserid)
  const idToken = useSelector(selectIdToken)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isPasswordResetDialogOpen, setIsPasswordResetDialogOpen] =
    useState(false)

  const handleLogout = (event) => {
    dispatch(resetUserStore())
    dispatch(resetEditorStore())
    dispatch(resetMatchingStore())
    dispatch(resetErrorStore())
    setAnchorElUser(null)
    navigate('/')
  }

  const handleResetPassword = (event) => {
    console.log(email)
    axios
      .post('http://localhost:3001/user/resetPassword', { email })
      .then((response) => {
        setIsPasswordResetDialogOpen(true)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }

  const handleDeactivateAccount = (event) => {
    dispatch(setChangeDeactivateAccountAlert(true))
  }

  const acceptDeactivateAccount = (event) => {
    const config = {
      headers: { Authorization: `Bearer ${idToken}` }
    }

    axios
      .delete(`http://localhost:3001/user/deregister/${userId}`, config)
      .then((response) => {
        handleLogout()
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }

  const denyDeactivateAccount = () => {
    console.log('Canceled deactivating account')
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <div>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant='h6'
              noWrap
              component='a'
              href='/home'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              PeerPrep
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant='h5'
              noWrap
              component='a'
              href='/home'
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              PeerPrep
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            {loginStatus && (
              <>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title='Open settings'>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={displayName}
                        src='/static/images/avatar/2.jpg'
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id='menu-appbar'
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem key='account' onClick={handleResetPassword}>
                      <Typography textAlign='center'>Reset Password</Typography>
                    </MenuItem>
                    <MenuItem key='deactivate' onClick={handleDeactivateAccount}>
                      <Typography textAlign='center'>Deactivate Account</Typography>
                    </MenuItem>
                    <MenuItem key='logout' onClick={handleLogout}>
                      <Typography textAlign='center'>Logout</Typography>
                    </MenuItem>
                  </Menu>
                  <Dialog
                    open={isPasswordResetDialogOpen}
                    onClose={() => setIsPasswordResetDialogOpen(false)}
                  >
                    <DialogContent>
                      <Typography variant='body1'>
                        We have sent an email to {email} for you to reset your
                        password. Do contact us for further enquiry should you
                        still have issues with resetting your password.
                      </Typography>
                    </DialogContent>

                    <DialogActions>
                      <Button onClick={() => setIsPasswordResetDialogOpen(false)}>
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <DeactivateAccountDialog
        denyChange={denyDeactivateAccount}
        agreeChange={acceptDeactivateAccount}
      />
    </div>
  )
}
export default Navbar
