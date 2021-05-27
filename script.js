let allCosts = [];
let indexEdit = -1;
let dbClick = -1;
let costSeller = "";
let costPrice = "";
let today = new Date();
let day = `0${today.getDate()}`.slice(-2);
let month = `0${today.getMonth() + 1}`.slice(-2);
let dat = `${today.getFullYear()}-${month}-${day}`;
const mainBlock = document.getElementById("content-page");

window.onload = newInputs = async () => {
  inputSeller = document.getElementById("inputSeller");
  inputCost = document.getElementById("inputCost");
  addButton = document.getElementById("addButton");
  inputSeller.addEventListener("change", inputSellerChange);
  inputCost.addEventListener("change", inputCostChange);
  addButton.addEventListener("click", onClickButton);
  inputSeller.addEventListener("keyup", addenter);
  inputCost.addEventListener("keyup", addenter);
  const resp = await fetch("http://localhost:8000/allCosts", { method: "GET" });
  const result = await resp.json();
  allCosts = result.data;
  render();
};

// Add data in cost
inputSellerChange = (event) => {
  costSeller = event.target.value;
};

// Add data in cost
inputCostChange = (event) => {
  costPrice = event.target.value;
};

// Remove Function
removeElement = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deleteCost?_id=${allCosts[index]._id}`,
    {
      method: "DELETE",
    }
  );
  let result = await resp.json();
  allCosts = result.data;
  render();
};

// Edit Function
editElement = (index) => {
  dbClick = 4;
  indexEdit = index;
  render();
};

// Cancel Function
cancelElement = () => {
  indexEdit = -1;
  render();
};

// Add cost on button
onClickButton = async () => {
  if (!costSeller.trim() || !costPrice) return;
  if (costPrice.trim().length > 14) {
    alert("Слишком большое число! Откуда у вас столько денег???");
    return;
  }
  const resp = await fetch("http://localhost:8000/createCost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      seller: costSeller,
      price: costPrice,
      date: dat,
    }),
  });
  let result = await resp.json();
  allCosts = result.data;
  costSeller = "";
  costPrice = "";
  inputSeller.value = "";
  inputCost.value = "";
  render();
};

// Done Function
doneElement = async (index, sellers, prices, dates) => {
  if (String(prices).length > 14) {
    alert("Слишком большое число! Откуда у вас столько денег???");
    return;
  }
  allCosts[index].seller = sellers;
  allCosts[index].price = prices;
  allCosts[index].date = dates;
  indexEdit = -1;
  dbClick = -1;
  const { _id, seller, price, date } = allCosts[index];
  const resp = await fetch("http://localhost:8000/updateCost", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ _id, seller, price, date }),
  });
  let result = await resp.json();
  allCosts = result.data;
  render();
};

///// Cancel on Esc Function
cancelEsc = (event) => {
  if (event.key === "Escape") {
    cancelElement();
  }
};

///// Add task on Enter
addenter = (event) => {
  if (event.key == "Enter") {
    onClickButton();
  }
};

///// dbClick function

dbClickfunk = (index, value) => {
  indexEdit = index;
  dbClick = value;
  render();
};

///// Render
render = () => {
  ///// Remove dublicate elements
  while (mainBlock.firstChild) mainBlock.removeChild(mainBlock.firstChild);

  // Add count
  const summ = document.createElement("p");
  summ.className = "summ";
  summ.type = "text";
  const testreducecoll = allCosts.reduce((a, b) => a + b.price, 0);
  summ.innerText = `Итого:${testreducecoll} р.`;
  mainBlock.appendChild(summ);

  allCosts.forEach((item, index) => {
    ///// Add container div
    const container = document.createElement("div");
    container.className = "task-container";
    mainBlock.appendChild(container);

    ///// Add icon div
    const containerIcon = document.createElement("div");
    containerIcon.className = "containerIcon";

    /////Add Edit image button
    const editButton = document.createElement("img");
    editButton.src = "img/edit.png";
    editButton.className = "icons";

    ///// Add Remove image button
    const removeButton = document.createElement("img");
    removeButton.src = "img/remove.png";
    removeButton.className = "icons";

    ///// Add Cancel image button
    const cancelButton = document.createElement("img");
    cancelButton.src = "img/cancel.png";
    cancelButton.className = "icons";

    ///// Add Done image button
    const doneButton = document.createElement("img");
    doneButton.src = "img/done.png";
    doneButton.className = "icons";

    ///// Add input block
    const editInputSeller = document.createElement("input");
    editInputSeller.type = "text";
    editInputSeller.className = "editInputSeller";
    editInputSeller.value = item.seller;

    const editInputPrice = document.createElement("input");
    editInputPrice.type = "number";
    editInputPrice.className = "editInputPrice";
    editInputPrice.value = item.price;

    const editInputDate = document.createElement("input");
    editInputDate.type = "date";
    editInputDate.className = "editInputDate";
    editInputDate.value = item.date;

    editInputSeller.onkeydown = (e) => {
      if (e.key === "Enter") {
        doneElement(
          index,
          editInputSeller.value,
          editInputPrice.value,
          editInputDate.value
        );
      }
    };

    editInputPrice.onkeydown = (e) => {
      if (e.key === "Enter") {
        doneElement(
          index,
          editInputSeller.value,
          editInputPrice.value,
          editInputDate.value
        );
      }
    };

    editInputDate.onkeydown = (e) => {
      if (e.key === "Enter") {
        doneElement(
          index,
          editInputSeller.value,
          editInputPrice.value,
          editInputDate.value
        );
      }
    };

    ///// Add text block
    const textSeller = document.createElement("p");
    textSeller.className = "textSeller";
    textSeller.type = "text";
    textSeller.innerText = `${index + 1})Магазин "${item.seller}"`;
    textSeller.ondblclick = () => dbClickfunk(index, 1);

    const textData = document.createElement("p");
    textData.className = "textData";
    textData.type = "text";
    textData.innerText = item.date;
    textData.ondblclick = () => dbClickfunk(index, 2);

    const textPrice = document.createElement("p");
    textPrice.className = "textCost";
    textPrice.type = "text";
    textPrice.innerText = `${item.price} р.`;
    textPrice.ondblclick = () => dbClickfunk(index, 3);

    ///// Done click
    doneButton.onclick = () =>
      doneElement(
        index,
        editInputSeller.value,
        editInputPrice.value,
        editInputDate.value
      );
    ///// Edit click
    editButton.onclick = () => editElement(index);

    ///// Remove clic
    removeButton.onclick = () => removeElement(index);

    ///// Cancel click
    cancelButton.onclick = () => cancelElement();
    editInputSeller.addEventListener("keyup", cancelEsc);
    editInputPrice.addEventListener("keyup", cancelEsc);

    ///// Add Task text block
    if (indexEdit === index) {
      switch (dbClick) {
        case 1:
          container.appendChild(editInputSeller);
          container.appendChild(textData);
          container.appendChild(textPrice);
          container.appendChild(containerIcon);

          ///// Add edit
          containerIcon.appendChild(cancelButton);

          ///// Add remove
          containerIcon.appendChild(doneButton);
          break;
        case 2:
          container.appendChild(textSeller);
          container.appendChild(editInputDate);
          container.appendChild(textPrice);
          container.appendChild(containerIcon);

          ///// Add edit
          containerIcon.appendChild(cancelButton);

          ///// Add remove
          containerIcon.appendChild(doneButton);
          break;
        case 3:
          container.appendChild(textSeller);
          container.appendChild(textData);
          container.appendChild(editInputPrice);
          container.appendChild(containerIcon);

          ///// Add edit
          containerIcon.appendChild(cancelButton);

          ///// Add remove
          containerIcon.appendChild(doneButton);
          break;
        case 4:
          container.appendChild(editInputSeller);
          container.appendChild(editInputDate);
          container.appendChild(editInputPrice);
          container.appendChild(containerIcon);
          ///// Add cancel
          containerIcon.appendChild(cancelButton);

          ///// Add done
          containerIcon.appendChild(doneButton);
          break;
        default:
          container.appendChild(textSeller);
          container.appendChild(textData);
          container.appendChild(textPrice);
          container.appendChild(containerIcon);

          ///// Add edit
          containerIcon.appendChild(editButton);

          ///// Add remove
          containerIcon.appendChild(removeButton);
          break;
      }
    } else {
      container.appendChild(textSeller);
      container.appendChild(textData);
      container.appendChild(textPrice);
      container.appendChild(containerIcon);

      ///// Add edit
      containerIcon.appendChild(editButton);

      ///// Add remove
      containerIcon.appendChild(removeButton);
    }
  });
};
