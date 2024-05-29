import React, { useState } from 'react'
import { BiLike ,BiDislike } from "react-icons/bi"


const Comment = ({name,uploaded,image,comment}) => {


        const [clickCount, setClickCount] = useState(0);
        const [click,setClick] = useState(0);
        
      
        // Function to handle button click
        const handleClick = () => {
          // Increment the click count
          setClickCount(prevCount => prevCount + 1);
        };

        const handleClickDislike = () => {
            // Increment the click count
            setClick(prevCount => prevCount + 1);
          };



  return (
    <div className='flex flex-row mb-3'>
      <img src={image} alt="profile" className='w-12 h-12 rounded-full mr-3' />
      <div>
        <div className='flex items-center '>
            <p className='text-sm font-medium pr-2'>{name}</p>
            <p className='text-xs text-yt-gray'>
                {/* {new Date(uploaded.toDate()).toString.slice(0,25)} */}
            </p>
        </div>
        <p className='text-base pt-2'>
            {comment}
        </p>
        <div className='flex py-3 justify-between w-36'>
            <div className='flex'>
                <BiLike size={24} onClick={handleClick} className='cursor-pointer'/>
                <p className='text-sm px-2 text-yt-gray'>{clickCount}</p>
            </div>
            <BiDislike size={23}  onClick={handleClickDislike} className='cursor-pointer'/>
            <p className='text-sm'> {click}  Reply</p>
        </div>
      </div>
    </div>
  )
}

export default Comment
