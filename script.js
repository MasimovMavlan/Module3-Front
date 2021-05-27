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
  inputSeller.addEventListener("change", (e) => (costSeller = e.target.value));
  inputCost.addEventListener("change", (e) => (costPrice = e.target.value));
  addButton.addEventListener("click", onClickButton);
  inputSeller.addEventListener("keyup", addenter);
  inputCost.addEventListener("keyup", addenter);
  const resp = await fetch("http://localhost:8000/allCosts", { method: "GET" });
  const result = await resp.json();
  allCosts = result.data;
  render();
};

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

editElement = (index, value) => {
  dbClick = value;
  indexEdit = index;
  render();
};

cancelElement = () => {
  indexEdit = -1;
  render();
};

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

cancelEsc = (event) => {
  if (event.key === "Escape") {
    cancelElement();
  }
};

addenter = (event) => {
  if (event.key == "Enter") {
    onClickButton();
  }
};

inputFunk = (types, values, classname) => {
  const inputname = document.createElement("input");
  inputname.type = types;
  inputname.className = classname;
  inputname.value = values;
  return inputname;
};

addImg = (imgname, path) => {
  imgname.src = `img/${path}.png`;
  imgname.className = "icons";
};

textAddFunk = (classNames, value, index) => {
  const textName = document.createElement("p");
  textName.className = classNames;
  textName.type = "text";
  textName.ondblclick = () => editElement(index, value);
  return textName;
};

render = () => {
  while (mainBlock.firstChild) mainBlock.removeChild(mainBlock.firstChild);

  const summ = document.createElement("p");
  summ.className = "summ";
  summ.type = "text";
  const testreducecoll = allCosts.reduce((a, b) => a + b.price, 0);
  summ.innerText = `Итого:${testreducecoll} р.`;
  mainBlock.appendChild(summ);

  allCosts.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "task-container";
    mainBlock.appendChild(container);
    const containerIcon = document.createElement("div");
    containerIcon.className = "containerIcon";
    const editButton = document.createElement("img");
    addImg(editButton, "edit");
    const removeButton = document.createElement("img");
    addImg(removeButton, "remove");
    const cancelButton = document.createElement("img");
    addImg(cancelButton, "cancel");
    const doneButton = document.createElement("img");
    addImg(doneButton, "done");
    const editInputSeller = inputFunk("text", item.seller, "editInputSeller");
    const editInputPrice = inputFunk("number", item.price, "editInputPrice");
    const editInputDate = inputFunk("date", item.date, "editInputDate");

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
    const textSeller = textAddFunk("textSeller", 1, index);
    textSeller.innerText = `${index + 1})Магазин "${item.seller}"`;
    const textData = textAddFunk("textData", 2, index);
    textData.innerText = item.date;
    const textPrice = textAddFunk("textCost", 3, index);
    textPrice.innerText = `${item.price} р.`;

    doneButton.onclick = () =>
      doneElement(
        index,
        editInputSeller.value,
        editInputPrice.value,
        editInputDate.value
      );

    editButton.onclick = () => editElement(index, 4);
    removeButton.onclick = () => removeElement(index);
    cancelButton.onclick = () => cancelElement();
    editInputSeller.addEventListener("keyup", cancelEsc);
    editInputPrice.addEventListener("keyup", cancelEsc);

    if (indexEdit === index) {
      switch (dbClick) {
        case 1:
          container.appendChild(editInputSeller);
          container.appendChild(textData);
          container.appendChild(textPrice);
          container.appendChild(containerIcon);
          containerIcon.appendChild(cancelButton);
          containerIcon.appendChild(doneButton);
          break;
        case 2:
          container.appendChild(textSeller);
          container.appendChild(editInputDate);
          container.appendChild(textPrice);
          container.appendChild(containerIcon);
          containerIcon.appendChild(cancelButton);
          containerIcon.appendChild(doneButton);
          break;
        case 3:
          container.appendChild(textSeller);
          container.appendChild(textData);
          container.appendChild(editInputPrice);
          container.appendChild(containerIcon);
          containerIcon.appendChild(cancelButton);
          containerIcon.appendChild(doneButton);
          break;
        case 4:
          container.appendChild(editInputSeller);
          container.appendChild(editInputDate);
          container.appendChild(editInputPrice);
          container.appendChild(containerIcon);
          containerIcon.appendChild(cancelButton);
          containerIcon.appendChild(doneButton);
          break;
        default:
          container.appendChild(textSeller);
          container.appendChild(textData);
          container.appendChild(textPrice);
          container.appendChild(containerIcon);
          containerIcon.appendChild(editButton);
          containerIcon.appendChild(removeButton);
          break;
      }
    } else {
      container.appendChild(textSeller);
      container.appendChild(textData);
      container.appendChild(textPrice);
      container.appendChild(containerIcon);
      containerIcon.appendChild(editButton);
      containerIcon.appendChild(removeButton);
    }
  });
};
