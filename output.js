const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const dateDisplayElement = document.getElementById("dateDisplay");
dateDisplayElement.textContent = `今日は${month}月${day}日です。`;