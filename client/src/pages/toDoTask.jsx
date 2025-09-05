import React from 'react'
import Header from '../components/common/staffHeader'
import ToDoTable from "../components/Table/toDoTable.jsx"
import { motion } from 'framer-motion'

const toDoTask = () => {
  return (
     <div className="min-h-screen  dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="relative z-10 flex flex-col ">
        <Header title="Dashboard" />
      </div>
      <motion.main 
      initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      className="max-w-7xl mx-auto py-8 px-4 lg:px-8">
       <ToDoTable/>
      </motion.main>   
      </div>
  )
}

export default toDoTask