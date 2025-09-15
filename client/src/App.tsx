import Navbar from './Components/landing page/Navbar'
import Mainfeatures from './Components/landing page/Features'
import Mode from './Components/landing page/Mode'
import Features from './Components/landing page/Features'
import Faq from './Components/landing page/Faq'
import DevTeam from './Components/landing page/Team'
import Footer from './Components/landing page/Footer'

import './App.css'

function App() {
  return (
    <>
      <div className="main">
        <div className='mb-15'><Features/></div>
        <Navbar/>
        <Mainfeatures/>
        <Mode/>
        <Faq/>
        <DevTeam/>
        <Footer/>

      </div>
    </>
  )
}

export default App
