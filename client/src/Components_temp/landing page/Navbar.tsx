import bgImage from "../../assets/bgImage.svg"

const Navbar = () => {
  return (
      <div className="w-screen h-screen bg-cover bg-center bg-black"
            style={{backgroundImage:`url(${bgImage})`}}>
          <nav className="flex space justify-between pt-3 ml-8 mr-8">
            <div className="text-white">FloatChat</div>
            <div className="text-white flex gap-8 pl-4 pr-4 pt-1 pb-1 rounded-2xl border-white border">
              <div>FAQ</div>
              <div>features</div>
              <div>About Us</div>
            </div>
            <button className="bg-[#095268] text-[#FFFFFF] pl-4 pr-4 rounded-2xl">SignIn</button>
          </nav>

      </div>
  )
}



export default Navbar
