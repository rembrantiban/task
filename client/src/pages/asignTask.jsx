import React from 'react'
import Header from '../components/common/header';
import { motion } from 'framer-motion'
import FormTask from '../components/Task/formTask.jsx'

const asignTask = () => {
  return (
   <div className="min-h-screen dark:bg-gray-900 ">
      <div className="relative z-10 flex flex-col">
        <Header title="Dashboard" Pages="Asign Task" />
       <motion.div className='flex justify-center items-center sm:p-6'
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
       >
        <FormTask/>
          </motion.div> 
      </div>
    </div>
  )
}

export default asignTask