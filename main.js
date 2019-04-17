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

  window.onload = function() {
    $("size-input").addEventListener("change", updateDataInputFields);
    let dataFields = document.getElementsByClassName("data");
    for(let i = 0; i < dataFields.length; i++) {
      dataFields[i].addEventListener("change", checkData);
    }
    $("submit").addEventListener("click", updatePlayground);
    $("next").addEventListener("click", appendNext);
    $("data").addEventListener("click", appendData);
    $("undo").addEventListener("click", undo);
    $("run").addEventListener("click", run);
    $("restart").addEventListener("click", reset);
  };

  /**
   * Short hand for geeting element by id
   * TODO: change the name of the function to id()
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Update the number of available data input fields dynamically based on
   * the size input from the user
   */
  function updateDataInputFields() {
    let size = parseFloat($("size-input").value);
    if(!Number.isInteger(size) || size < 0 || size > 8) {
      alert("Please enter an integer between 0 and 8 for size");
      $("size-input").value = 0;
    }
    let container = $("data-container");
    let max = container.children.length;
    let num = Math.min(parseInt($("size-input").value), max);

    for(let i = 0; i < num + 1; i++) {
      container.children[i].classList.remove("hidden");
    }
    for(let i = num + 1; i < max; i++) {
      container.children[i].classList.add("hidden");
    }
  }

  /**
   * Checks whether the data input is valid
   */
  function checkData() {
    let dataFields = document.getElementsByClassName("data");
    for(let i = 0; i < dataFields.length; i++) {
      let data = parseFloat(dataFields[i].value);
      if(!Number.isInteger(data) || data < -99 || data > 99) {
        alert("Please enter an integer between -99 and 99 for data");
        dataFields[i].value = 0;
      }
    }
  }

  /**
   * Updates the LinkedIntList visualization on the playground based on user
   * input of size and data
   */
  function updatePlayground() {
    let data = $("data-container").children;
    let container = $("node-container");
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
     $("node-container").innerHTML = "";
     $("code-area").textContent = "list";
     $("output").children[1].textContent = "";
     toggleButtons(true);
  }

  /**
   * Append .next to the code in the editor
   */
  function appendNext() {
    $("code-area").textContent += ".next";
  }

  /**
   * Append .data to the code in the editor
   */
  function appendData() {
    $("code-area").textContent += ".data";
    toggleButtons(false);
  }

  /**
   * Undos the last modification to the code in the editor
   */
  function undo() {
    let undoResult = $("code-area").textContent;
    if(undoResult.length > 5) {
      undoResult = undoResult.substring(0, undoResult.length - 5);
      $("code-area").textContent = undoResult;
    }
    toggleButtons(true);
  }

  /**
   * Parses the code and displays output
   */
  function run() {
    let code = $("code-area").textContent.split(".");
    let nodes = $("node-container").children;
    let output = $("output");
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
    } else if(getVal) {
      result = nodes[index].children[0].textContent;
    } else {
      result = "The node with value " + nodes[index].children[0].textContent;
    }
    output.children[1].textContent = result;
  }

  /**
   * Toggles the .next and .data buttons
   * @param boolean enabled - true for enabling buttons, false for disabling buttons
   */
  function toggleButtons(enabled) {
    $("next").disabled = !enabled;
    $("data").disabled = !enabled;
  }

  function toggleMenu(show) {
    if(!show) {
      $("menu-view").classList.add("hide-menu-view");
      $("menu-view").classList.remove("show-menu-view");
    } else {
      $("menu-view").classList.remove("hide-menu-view");
      $("menu-view").classList.add("show-menu-view");
    }
  }

})();
