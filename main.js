/**
 * Name: Wen Qiu
 * Date: April 20, 2019
 * Section: CSE 154 AJ
 * This is the JavaScript to implement the UI for the LinkedIntList playground, accept
 * user input on size and data of the LinkedIntList, and a simplified Java code
 * editor that allows them to access the nodes and the data in the LinkedIntList.
 */
(function() {
  "use strict";
  const MAX_DATA_INPUT = 99;
  const MIN_DATA_INPUT = -99;
  const MAX_SIZE = 8;
  const MIN_SIZE = 0;
  const COMMAND_LENGTH = 5;

  window.addEventListener("load", init);

  /**
   * Initialization. Attach event listeners to all the elements
   */
  function init() {
    id("size-input").addEventListener("change", updateDataInputFields);
    let dataFields = qsa(".data");
    for(let i = 0; i < dataFields.length; i++) {
      dataFields[i].addEventListener("change", checkData);
    }
    id("submit").addEventListener("click", updatePlayground);
    id("next").addEventListener("click", appendNext);
    id("data").addEventListener("click", appendData);
    id("undo").addEventListener("click", undo);
    id("run").addEventListener("click", run);
    id("restart").addEventListener("click", reset);
  }

  /**
   * Helper method for getting element by id
   * @param {String} elementID - the id with which the target objects are attached to
   * @return {Element} the DOM element object with the specified id
   */
  function id(elementID) {
    return document.getElementById(elementID);
  }

  /**
   * Helper method for getting an array of elements by class
   * @param {String} selector - the selector used to select the target elements
   * @return {Element[]} An array of elements in the DOM with the given class
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Update the number of available data input fields dynamically based on
   * the size input from the user, shows alert if the size field is not an
   * integer between 0 and 8 and resets the size to 0
   */
  function updateDataInputFields() {
    let size = parseFloat(id("size-input").value);
    if(!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
      alert("Please enter an integer between 0 and 8 for size");
      id("size-input").value = 0;
    }
    let container = id("data-container");
    let max = container.children.length;
    let num = Math.min(parseInt(id("size-input").value), max);

    // Start with 1 to skip the "list" part of the code
    for(let i = 0; i < num + 1; i++) {
      container.children[i].classList.remove("hidden");
    }
    for(let i = num + 1; i < max; i++) {
      container.children[i].classList.add("hidden");
    }
  }

  /**
   * Checks whether the data input is valid, shows alert if the data input is
   * not an integer between -99 and 99 and resets the input to 0
   */
  function checkData() {
    let data = parseFloat(this.value);
    if(!Number.isInteger(data) || data < MIN_DATA_INPUT || data > MAX_DATA_INPUT) {
      alert("Please enter an integer between -99 and 99 for data");
      this.value = 0;
    }
  }

  /**
   * Updates the LinkedIntList visualization on the playground based on user
   * input of size and data, and hides the menu
   */
  function updatePlayground() {
    let data = id("data-container").children;
    let container = id("node-container");
    for(let i = 1; i < data.length; i++) {
      if(!data[i].classList.contains("hidden")) {
        let node = document.createElement("div");
        let p = document.createElement("p");
        p.textContent = parseInt(data[i].value);
        node.classList.add("nodes");
        node.appendChild(p);
        container.appendChild(node);
      }
    }
    toggleMenu(false);
  }

  /**
   * Resets the state of the playground and shows the menu
   */
  function reset() {
    toggleMenu(true);
    id("node-container").innerHTML = "";
    id("code-area").textContent = "list";
    id("output-string").textContent = "";
    toggleButtons(true);
  }

  /**
   * Append .next to the code in the code area
   */
  function appendNext() {
    id("code-area").textContent += ".next";
  }

  /**
   * Append .data to the code in the code area
   */
  function appendData() {
    id("code-area").textContent += ".data";
    toggleButtons(false);
  }

  /**
   * Undos the last modification to the code in the editor
   */
  function undo() {
    let undoResult = id("code-area").textContent;
    // Avoid deleting "list"
    if(undoResult.length > COMMAND_LENGTH) {
      // Remove the last command added from the code
      undoResult = undoResult.substring(0, undoResult.length - COMMAND_LENGTH);
      id("code-area").textContent = undoResult;
    }
    toggleButtons(true);
  }

  /**
   * Parses the code in the code area and displays output
   */
  function run() {
    removeShakes();
    // Trigger reflow to make the shake animation work properly
    void this.offsetWidth;
    let code = id("code-area").textContent.split(".");
    let nodes = id("node-container").children;
    let index = 0;
    let getVal = false;
    // Parse code
    for(let i = 1; i < code.length; i++) {
      if(code[i] === "next") {
        index++;
      } else if(code[i] === "data") {
        getVal = true;
      }
    }
    // Determine output
    let result = "";
    if(index === nodes.length && !getVal) {
      result = "null";
    } else if(nodes[index] === undefined) {
      result = "NullPointerException()";
    } else {
      nodes[index].classList.toggle("shake", true);
      if(getVal) {
        result = nodes[index].children[0].textContent;
      } else {
        result = "The node with value " + nodes[index].children[0].textContent;
      }
    }
    id("output-string").textContent = result;
  }

  /**
   * Toggles the .next and .data buttons
   * @param {boolean} enabled - true for enabling buttons, false for disabling buttons
   */
  function toggleButtons(enabled) {
    id("next").disabled = !enabled;
    id("data").disabled = !enabled;
  }

  /**
   * Toggles the menu view
   * @param {boolean} show - true for showing the menu, false for hiding the menu
   */
  function toggleMenu(show) {
    if(!show) {
      id("menu-view").classList.add("hide-menu-view");
      id("menu-view").classList.remove("show-menu-view");
    } else {
      id("menu-view").classList.remove("hide-menu-view");
      id("menu-view").classList.add("show-menu-view");
    }
  }

  /**
   * Removes the shake class from all elements
   */
  function removeShakes() {
    let shakes = qsa(".shake");
    for(let i = 0; i < shakes.length; i++) {
      shakes[i].classList.remove("shake");
    }
  }
})();
