import React from 'react';

function Background() {
  return (
    <div className="background-wrapper">
      <div className="main">
        <svg width="168" height="158" viewBox="0 0 168 158" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="pizza">
            <rect width="168" height="158" fill="none"></rect>
            <g id="slice6">
              <g id="slice">
                <mask id="path-1-inside-1_7_2" fill="white">
                  <path d="M110 34.8997C118.513 39.4198 125.582 45.921 130.497 53.75C135.412 61.579 138 70.4598 138 79.5L82 79.5L110 34.8997Z"></path>
                </mask>
                <path d="M110 34.8997C118.513 39.4198 125.582 45.921 130.497 53.75C135.412 61.579 138 70.4598 138 79.5L82 79.5L110 34.8997Z" fill="#FDDBA9" stroke="#EE9758" strokeWidth="2" mask="url(#path-1-inside-1_7_2)"></path>
              </g>
              <g id="pepperoni">
                <circle cx="114" cy="63" r="6" fill="#F12424"></circle>
              </g>
            </g>
            {/* Add more pizza slices similarly - abbreviated for brevity */}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default Background;
