/* eslint-disable jsx-a11y/no-access-key */
import React, { useRef, useEffect, MouseEvent } from 'react';
import { showStdPageDetails } from './inspect-inline';

import ReactDOM from 'react-dom/client';
//import './Button.css';

/*interface InitButtonProps {
  sfHost: string;
  inInspector: boolean;
}*/
//const InitButton: React.FC<InitButtonProps> = ({ sfHost, inInspector }) => {
function Button (input: {sfHost: string, inInspector : boolean}) {
  let rootClass = '';//insext-active when active
  const wrapperRef = useRef<any>(null);
  const iframeRef = useRef<any>(null);
  //const [show, setShow] = useState(false);
  let popupSrc = chrome.runtime.getURL("popup.html");
  const sfHost = input.sfHost;
  const inInspector = input.inInspector;
  
  window.addEventListener("message", e => {
    if (e.source != iframeRef.current.contentWindow) {
      return;
    }
    if (e.data.insextInitRequest && iframeRef.current.contentWindow != null) {
      iframeRef.current.contentWindow.postMessage({
        insextInitResponse: true,
        sfHost,
        inDevConsole: !!document.querySelector("body.ApexCSIPage"),
        inLightning: !!document.querySelector("#auraLoadingBox"),
        inInspector,
      }, "*");
    }
    if (e.data.insextLoaded) {
      openPopup();
    }
    if (e.data.insextClosePopup) {
      closePopup();
    }
    if (e.data.insextShowStdPageDetails) {
      showStdPageDetails(e.data.insextData, e.data.insextAllFieldSetupLinks);
    }
    if (e.data.insextShowApiName) {
      document.querySelectorAll("record_flexipage-record-field > div, records-record-layout-item > div, div .forcePageBlockItemView").forEach(field => {
        let label = field.querySelector("span");
        if (field instanceof HTMLElement && label instanceof HTMLElement && field.dataset.targetSelectionName && label.querySelector("mark") == null){
          label.innerText = label.innerText + " ";
          const fieldApiName = document.createElement("mark");
          fieldApiName.className = "field-api-name";
          fieldApiName.style.cursor = "copy";
          fieldApiName.innerText = field.dataset.targetSelectionName.split(".")[2];
          label.appendChild(fieldApiName);
          document.addEventListener("click", copy);
        }
      });
    }
  });


  function copy(e: Event){
    if (e.target == null || !(e.target instanceof HTMLElement))
        return;
    navigator.clipboard.writeText(e.target.innerText);
  }

  function openPopup() {
    let activeContentElem = document.querySelector("div.windowViewMode-normal.active, section.oneConsoleTab div.windowViewMode-maximized.active.lafPageHost");
    let isFieldsPresent = activeContentElem ? !!activeContentElem.querySelector("record_flexipage-record-field > div, records-record-layout-item > div, div .forcePageBlockItemView") : false;
    if (iframeRef.current != null && iframeRef.current instanceof HTMLIFrameElement && iframeRef.current.contentWindow != null){
      iframeRef.current.contentWindow.postMessage({insextUpdateRecordId: true,
            locationHref: window.location.href,
            isFieldsPresent
          }, "*");
    }
    //useEffect(() => {
      // These event listeners are only enabled when the popup is active to avoid interfering with Salesforce when not using the inspector
      //function outsidePopupClick(e : Event) {
        // Close the popup when clicking outside it
      //  if (wrapperRef.current instanceof Node && e.target instanceof Node && !wrapperRef.current.contains(e.target)) {
      //    closePopup();
      //  }
      //}
      rootClass = "insext-active";
      //window.addEventListener("click", outsidePopupClick);
      iframeRef.current.focus();
    //},[wrapperRef, iframeRef]);
  }
  function closePopup() {
    rootClass = '';
    //window.removeEventListener("click", outsidePopupClick);
    iframeRef.current?.blur();
  }
  
  function handleBtnClick(e : MouseEvent<HTMLDivElement, any>) {
    //TODO remove listerner
    //e.target?.removeEventListener("click", handleBtnClick);
    if (rootClass != "insext-active") {
      openPopup();
    } else {
      closePopup();
    }
  }

  addFlowScrollability();

  function addFlowScrollability() {
    const currentUrl = window.location.href;
    // Check the current URL for the string "builder_platform_interaction"
    if (currentUrl.includes("builder_platform_interaction")) {
      //add marging for the popup arrow to prevent overlap with standard close button in flow builder (Winter 24)
      //temporary workaround, will be removed in next release when the popupArrow position will be updatable by users
      const popupArrow = document.querySelector("#insext");
      if (popupArrow && popupArrow instanceof HTMLElement){
        popupArrow.style.marginTop = "50px";
      }
      // Create a new checkbox element
      const headerFlow = document.querySelector("builder_platform_interaction-container-common");
      const overflowCheckbox = document.createElement("input");
      overflowCheckbox.type = "checkbox";
      overflowCheckbox.id = "overflow-checkbox";
      const checkboxState = localStorage.getItem("scrollOnFlowBuilder");
      // Check local storage for the checkbox state
      checkboxState ? overflowCheckbox.checked = JSON.parse(checkboxState) : overflowCheckbox.checked = true;
      // Create a new label element for the checkbox
      const overflowLabel = document.createElement("label");
      overflowLabel.textContent = "Enable flow scrollability";
      overflowLabel.htmlFor = "overflow-checkbox";
      if (currentUrl.includes("sandbox")){
        overflowCheckbox.className = "checkboxScrollSandbox";
        overflowLabel.className = "labelCheckboxScrollSandbox";
      } else {
        overflowCheckbox.className = "checkboxScrollProd";
        overflowLabel.className = "labeCheckboxScrollProd";
      }
      // Get a reference to the <head> element
      const head = document.head;
      // Create a new <style> element
      const style = document.createElement("style");
      // Set the initial text content of the <style> element
      style.textContent = ".canvas {overflow : auto!important ; }";
      // Append the <style> element to the <head> element
      head.appendChild(style);
      // Append the checkbox and label elements to the body of the document
      if (headerFlow){
          headerFlow.appendChild(overflowCheckbox);
          headerFlow.appendChild(overflowLabel);
      }
      // Set the overflow property to "auto"
      overflowCheckbox.checked ? style.textContent = ".canvas {overflow : auto!important ; }" : style.textContent = ".canvas {overflow : hidden!important ; }";
      // Listen for changes to the checkbox state
      overflowCheckbox.addEventListener("change", function() {
        // Check if the checkbox is currently checked
        // Save the checkbox state to local storage
        localStorage.setItem("scrollOnFlowBuilder", JSON.stringify(this.checked));
        // Set the overflow property to "auto"
        this.checked ? style.textContent = ".canvas {overflow : auto!important ; }" : style.textContent = ".canvas {overflow : hidden!important ; }";
      });
    }
  }

  return (
  <div id="insext" ref={wrapperRef} className={rootClass} onBlur={closePopup}>
    <div onClick={handleBtnClick} className="insext-btn" tabIndex={0} accessKey="i" title = "Show Salesforce details (Alt+I / Shift+Alt+I)">
      <img alt="Launch" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAPCAYAAADd/14OAAAA40lEQVQoz2P4//8/AzpWzGj6L59U/V8urgxMg/g4FUn6J/+X9E38LxWc8V8htR67IpCkuGfMfxCQjSpENRFFkXvk/1+/foGxQloDSD0DVkVfvnyBY7hCdEVv3rxBwXCFIIdKh2WDFT1+/BgDo1qd2fL/1q1bWDFcoW5xz3/Xppn/oycu/X/x4kUMDFeoWdD136R8wn+f9rlgxSdOnEDBKFajK96/fz8coyjEpnj79u1gjKEQXXFE/+L/Gzdu/G9WMfG/am4HZlzDFAf3LPwfOWEJWBPIwwzYUg9MsXXNFDAN4gMAmASShdkS4AcAAAAASUVORK5CYII="></img>
    </div>
    <iframe ref={iframeRef} className = "insext-popup" src={popupSrc}/>
  </div>);



}

export default Button;