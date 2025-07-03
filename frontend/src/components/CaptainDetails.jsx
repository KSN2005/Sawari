import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-start gap-3">
            <img className="h-10 w-10 rounded-full object-cover" src="data:image/jpeg;base64,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" alt="" />
            <h4 className=" text-lg font-medium">Harsh patel</h4>
          </div>
          <div>
            <h4 className="text-xl font-semibold">€295.20</h4>
            <p className="text-sm  text-gray-600">Earned</p>
          </div>
        </div>
        <div className="flex p-3 mt-8 bg-gray-200 rounded-xl justify-center gap-5 items-start">
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin  ri-timer-2-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin  ri-speed-up-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
          <div className="text-center">
            <i className="text-3xl mb-2 font-thin  ri-cash-line"></i>
            <h5 className="text-lg font-medium">10.2</h5>
            <p className="text-sm text-gray-600">Hours Online</p>
          </div>
        </div>
    </div>
  )
}

export default CaptainDetails