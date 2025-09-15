import Features from './components/landing page/Features'
import Faq from './components/landing page/Faq'
import DevTeam from './components/landing page/Team'
import Footer from './components/landing page/Footer'



import './App.css'
function App() {

  return (
    <>
      <div className="main">
        <div className='mb-15'><Features/></div>
        <Faq/>
        <DevTeam/>
        <Footer/>

      </div>
      
    </>
  )
}

export default App
