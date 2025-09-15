import bgImage from "../../assets/bgImage.svg"

const Navbar = () => {
  return (
      <div className="min-w-screen h-[70vh] sm:h-[99vh] bg-cover bg-center bg-black"
            style={{backgroundImage:`url(${bgImage})`}}>
          <nav className="flex space justify-between pt-5 pl-8 pr-8">
            <div className="text-white">FloatChat</div>
            <div className=" hidden sm:flex text-white gap-8 pl-4 pr-4 pt-1 pb-1 rounded-2xl border-white border">
              <div className="cursor-pointer">FAQ</div>
              <div className="cursor-pointer">features</div>
              <div className="cursor-pointer">About Us</div>
            </div>
            <button className="bg-[#095268] font-semibold pl-4 pr-4 rounded-2xl cursor-pointer">SignIn</button>
          </nav>
          <h1 className="text-4xl sm:text-7xl font-bold mt-15 text-center">
            Dive into the ocean of data..
          </h1>
          <h2 className="font-extralight sm:text-xl mt-4 text-center">
            AI-powered insights from ARGO floats
          </h2>
          <div className="text-center mt-20">
              <button className="bg-[#095268] hover:bg-sky-700 font-semibold pl-6 pr-6 pt-2 pb-2 text-2xl rounded-2xl text-center cursor-pointer">Start Chatting</button>
          </div>
      </div>
  )
}

export default Navbar
