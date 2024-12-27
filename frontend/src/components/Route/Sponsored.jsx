import React from 'react'
import styles from '../../styles/styles'
const Sponsored = () => {
  return (
    <div className={`${styles.section}  sm:block bg-white px-5 mb-12 cursor-pointer rounded-x`} >
      <div className="flex justify-between w-full">
        
        <div className="flex items-start">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png"
            alt=""
            style={{ width: "150px", objectFit: "contain" }}
          />
        </div>
        <div className="flex items-start">
          <img
            src="https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            // src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_
            // %282015%29.svg/2560px-LG_logo_%282015%29.svg.png"
            src='data:image/png;base64,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'
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
          <img
            // src="https://www.vectorlogo.zone/logos/apple/apple-ar21.png"
            src='https://cdn.freebiesupply.com/images/thumbs/2x/apple-logo.png'
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div className="flex items-start">
        

          <img
            src="data:image/png;base64,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"
            style={{ width: "150px", objectFit: "contain" }}
            alt=""
          />
        </div>


      </div>
    </div>
  )
}

export default Sponsored