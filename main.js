/**
 * Name: Wen Qiu
 * Date: April 20, 2019
 * Section: CSE 154 AJ
 * This is the JS to implement the UI for the LinkedIntList playground, accept
 * user input on size and data of the LinkedIntList, and a simplified Java code
 * editor that allows them to access the nodes and the data in the LinkedIntList.
 */
(function() {
  "use strict";

  window.addEventListener("load", init);

  function init() {
    id("size-input").addEventListener("change", updateDataInputFields);
    let dataFields = findClass("data");
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
   */
  function id(elementID) {
    return document.getElementById(elementID);
  }

  /**
   * Helper method for getting an array of elements by class
   * @param String classID - the class name with which the target objects are
   *                         attached to
   */
  function findClass(classID) {
    return document.getElementsByClassName(classID);
  }

  /**
   * Update the number of available data input fields dynamically based on
   * the size input from the user, shows alert if the size field is not an
   * integer between 0 and 8
   */
  function updateDataInputFields() {
    let size = parseFloat(id("size-input").value);
    if(!Number.isInteger(size) || size < 0 || size > 8) {
      alert("Please enter an integer between 0 and 8 for size");
      id("size-input").value = 0;
    }
    let container = id("data-container");
    let max = container.children.length;
    let num = Math.min(parseInt(id("size-input").value), max);

    for(let i = 0; i < num + 1; i++) {
      container.children[i].classList.remove("hidden");
    }
    for(let i = num + 1; i < max; i++) {
      container.children[i].classList.add("hidden");
    }
  }

  /**
   * Checks whether the data input is valid, shows alert if the data input is
   * not an integer between -99 and 99
   */
  function checkData() {
    let data = parseFloat(this.value);
    if(!Number.isInteger(data) || data < -99 || data > 99) {
      alert("Please enter an integer between -99 and 99 for data");
      this.value = 0;
    }
  }

  /**
   * Updates the LinkedIntList visualization on the playground based on user
   * input of size and data
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
   * Resets the state of the playground
   */
  function reset() {
    toggleMenu(true);
    id("node-container").innerHTML = "";
    id("code-area").textContent = "list";
    id("output").children[1].textContent = "";
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
    if(undoResult.length > 5) {
      undoResult = undoResult.substring(0, undoResult.length - 5);
      id("code-area").textContent = undoResult;
    }
    toggleButtons(true);
  }

  /**
   * Parses the code in the code area and displays output
   */
  function run() {
    removeShakes();
    void this.offsetWidth;
    let code = id("code-area").textContent.split(".");
    let nodes = id("node-container").children;
    let output = id("output");
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
    output.children[1].textContent = result;
  }

  /**
   * Toggles the .next and .data buttons
   * @param boolean enabled - true for enabling buttons, false for disabling buttons
   */
  function toggleButtons(enabled) {
    id("next").disabled = !enabled;
    id("data").disabled = !enabled;
  }

  /**
   * Toggles the menu view
   * @param boolean show - true for showing the menu, false for hiding the menu
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
    let shakes = document.querySelectorAll(".shake");
    for(let i = 0; i < shakes.length; i++) {
      shakes[i].classList.remove("shake");
    }
  }
})();
