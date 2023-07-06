import React, { useEffect } from 'react'
import AOS from 'aos'

import 'aos/dist/aos.css'
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom'
import { useSession } from './contexts/SessionContext'
import { SpinnerLoader } from './components/shared/SpinnerLoader'
import { Header } from './components/main/Header'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ProtectedRoute } from './components/shared/ProtectedRoutes'
import { Browse } from './pages/Browse'
import { PageNotFound } from './pages/PageNotFound'
import { Login } from './pages/Login'
import { AuthHeader } from './components/main/AuthHeader'
import { LandingHeader } from './components/main/LandingHeader'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Footer } from './components/main/Footer'
import { Item } from './pages/Item'
import { SignUp } from './pages/SignUp'
import { SignUpVerify } from './pages/SignUpVerify'
import { Stripe } from './pages/Stripe'
import { SetlistNFT } from './pages/SetlistNFT'
// dashboard pages
import { Dashboard } from './pages/Dashboard'
import { Mint } from './pages/Mints'
import { NftManage } from './pages/NftManage'
import { ViewAddress } from './pages/ViewAddress'

export const App = () => {
  const { pathname } = useLocation()
  const [{ auth, loading }] = useSession()

  useEffect(() => {
    AOS.init({
      duration: 500
    })
  }, [])

  const handleScroll = () => {
    AOS.refresh({
      duration: 500
    });
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <>
      {loading && <SpinnerLoader />}
      {!loading && (
        <>
          <ToastContainer />
          {pathname === '/login' || pathname === '/' || pathname === '/forgot-password' || pathname.includes("resetPassword") || pathname === '/signup' || pathname === '/signup-verify'
            ? <AuthHeader />
            : pathname.includes('/landing/')
              ? <LandingHeader />
              : <Header pathname={pathname} />
          }
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={auth ? <Navigate to='/' /> : <Login />} />
            <Route path='/signup' element={auth ? <Navigate to='/' /> : <SignUp />} />
            <Route path='/browse' element={<Browse />} />
            <Route path='/setListNFT' element={<SetlistNFT />} />
            <Route path='/viewAddress' element={<ViewAddress/>}/>
            <Route path='/u/dashboard' element={<ProtectedRoute children={<Dashboard />} />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/signup-verify' element={auth ? <Navigate to='/' /> : <SignUpVerify />} />
            <Route path='/ResetPassword' element={<ResetPassword />} />
            <Route path='/nftmanage' element={<NftManage />} />
            <Route path='/u/mint' element={<ProtectedRoute children={<Mint />} />} />
            <Route path='*' element={<PageNotFound />} />
            <Route path='/item/:id' element={<Item />}></Route>
            <Route path='/stripe' element={<Stripe />} />
          </Routes>

          {pathname === '/' || pathname === '/signup' || pathname.includes("resetPassword") || pathname === '/forgot-password' || pathname.includes('/landing/')
            ? null
            : <Footer />
          }
        </>
      )}
    </>
  )
}
