import React from 'react';
import ReactDOM from 'react-dom/client';
import Button from './button';

if (document.querySelector("body.sfdcBody, body.ApexCSIPage, #auraLoadingBox") || window.location.host.endsWith("visualforce.com")) {
  // We are in a Salesforce org
  chrome.runtime.sendMessage({message: "getSfHost", url: window.location.href}, sfHost => {
    if (sfHost) {
      const root = document.createElement("div")
      root.className = "container"
      document.body.appendChild(root)
      const rootDiv = ReactDOM.createRoot(root);
      rootDiv.render(
        <React.StrictMode>
          <Button sfHost={sfHost} inInspector={false}/>
        </React.StrictMode>
      );
    }
  });
}