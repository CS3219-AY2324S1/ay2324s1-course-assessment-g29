import { Box, Typography } from '@mui/material'

const LoginPageBanner = () => {
  return (
    <Box
      display='flex'
      flex={1}
      style={{
        background: 'linear-gradient(#1976d2, #8dc3f7)'
      }}
    >
      <Box
        display='flex'
        flex={1}
        flexDirection='column'
        style={{
          paddingLeft: '25%',
          paddingTop: '20%',
          paddingRight: '10%'
        }}
      >
        <Typography
          variant='h2'
          color='common.white'
          marginBottom='3rem'
          fontWeight='bold'
        >
          PeerPrep
        </Typography>
        <Typography
          variant='h5'
          color='common.white'
          marginBottom='15rem'
          fontWeight='bold'
        >
          a collaborative platform for you and your peers to ace
          your next technical interview! Choose from across 1000+
          different coding questions
        </Typography>
        <Typography
          display='block'
          variant='subtitle'
          color='common.white'
          marginBottom='1rem'
        >
          "PeerPrep provides a very realistic platform for coders to practice
          their technical interview skills." -Benedict
        </Typography>
        <Typography
          display='block'
          variant='subtitle'
          color='common.white'
          marginBottom='3rem'
        >
          "PeerPrep helped a bunch in helping me prepare for my interview! It
          has a comprehensive range of questions and features." -Dominic
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginPageBanner
