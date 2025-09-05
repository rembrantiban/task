import React from 'react'
import Navbar from '../components/Home/Navbar'
import Background from '../assets/background.jpg'
const Home = () => {
  return (
    <div className="w-screen h-[100vh] flex item flex-col ">
      <img
        src={Background}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover grayscale-50 blur-[5px] z-[-2] border-b-2 border-t-gray-900"
      />
      <Navbar />
      <div className="flex flex-col justify-center items-center h-full w-full z-10">
        <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4
         text-gray-50 sm:text-center pt-3 pr-3 pl-3">SFC-G Staff Task Management System</h1>
        <p className="text-sm sm:text-lg pr-3 pl-3 max-w-3xl text-white mb-10">
          is a streamlined web-based system designed to help organizations efficiently 
          assign tasks, manage staff, and track performance — all in one centralized platform.
        </p>
            
      </div>
    </div>
  )
}

export default Home;