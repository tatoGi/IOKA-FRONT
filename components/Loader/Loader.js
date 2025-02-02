import React from 'react'
import { PuffLoader } from 'react-spinners' 


const Loader = () => {
  return (
     <div className='loader-data'>
        <PuffLoader size={70} color="#049878" /> 
     </div>
  )
}

export default Loader