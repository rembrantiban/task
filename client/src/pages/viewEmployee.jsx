import React from 'react'
import {motion} from 'framer-motion'
import Header from '../components/common/header'
import ViewTable from '../components/Table/ViewTable'

const viewEmployee = () => {
  return (
        <div className="min-h-screen dark:bg-gray-900 ">
           <div className="relative z-10 flex flex-col">
        <Header title="Dashboard" Pages="View Employee" />
        </div>
       <motion.div className="max-w-7xl mx-auto py-8 px-4 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
       >
            <ViewTable />   
          </motion.div> 
    </div>
  )
}

export default viewEmployee