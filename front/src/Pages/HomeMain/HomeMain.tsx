import React from 'react'
import NavBar from '../../nav/Navbar'
const HomeMain = () => {
  const buttons = [
    { path: '/signUp', label: 'הרשמה' },
    { path: '/login', label: 'התחברות' }
  ];
  return (
    <div>
    <NavBar buttons={buttons} />
    <h1>ברוך הבא!</h1>
    <p>אנא התחבר או הרשם כדי להמשיך.</p>
  </div>
  )
}

export default HomeMain