import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {

  const size ={
    fontSize : '2.2rem',
    fontWeight : 'bold'
  }
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <h1 style={size}>SmoothGear</h1><br></br>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>SmoothGear – Simplifying your gear needs with innovative solutions and reliable services. Join us on our journey to deliver excellence every step of the way.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
            <li>Terms of services</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+91-2294846465</li>
            <li>smoothgear@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 @ SmoothGear.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
