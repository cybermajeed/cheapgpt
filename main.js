let hamBurgBtn = document.querySelector(".hamBurgBtn");
let sideBar = document.querySelector("#sideBar");
let gptMore = document.querySelector(".cheapgptMore .more");
let gptMoreBox = document.querySelector(".cheapgptMore .moreBox");
let chatsList = document.querySelector(".chatsList");
let chatArea = document.getElementById("chatArea");
let emptyMsg = document.getElementById("emptyMsg");
let wrapper = document.querySelector(".wrapper");

let promptArea = document.getElementById("prompt");
let submit = document.getElementById("submit");

gptMore.onclick = (e) => {
  if (getComputedStyle(gptMoreBox).display == "none") {
    gptMoreBox.style.display = "flex";
  } else {
    gptMoreBox.style.display = "none";
  }
};

hamBurgBtn.onclick = (op) => {
  if (getComputedStyle(sideBar).left == "0px") {
    sideBar.style.left = "-100%";
    op = 1;
  } else {
    sideBar.style.left = "0";
    op = 0.3;
  }
  [promptArea.parentElement, chatArea].forEach((e) => {
    e.style.opacity = op;
  });
};

promptArea.oninput = () => {
  submit.disabled = !promptArea.value.trim();
};

window.onkeyup = (e) => {
  e.preventDefault();
  if (e.keyCode == 13 && !e.shiftKey) {
    submit.click();
  }
};

submit.onclick = async () => {
  let promptValue = promptArea.value.trim();
  if (!promptValue) return;
  wrapper.style.display = "flex";
  emptyMsg.style.display = "none";
  submit.disabled = true;
  submit.innerHTML = "stop_circle";
  promptArea.value = "";
  let userMsg = document.createElement("div");
  userMsg.classList.add("userMsg");
  userMsg.classList.add("msgBox");
  userMsg.innerText = promptValue;
  wrapper.appendChild(userMsg);
  chatArea.scrollTop = chatArea.scrollHeight;
  //  <div class="msgBox userMsg">Who are you?</div>
  //  <div class="msgBox gptMsg">Hello there! I am CheapGPT</div>
  marked.setOptions({
    breaks: true,
  });
  let gptMsg = document.createElement("div");
  gptMsg.classList.add("gptMsg");
  gptMsg.classList.add("msgBox");
  gptMsg.innerHTML = `<div id="loadBubble">
  <span></span>
  <span></span>
  <span></span>
  </div>`;
  wrapper.appendChild(gptMsg);
  chatArea.scrollTop = chatArea.scrollHeight;
  let reply = await getResponse(promptValue);
  gptMsg.textContent = reply;

  renderMathInElement(gptMsg, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  });
  reply = marked.parse(gptMsg.innerHTML);
  gptMsg.innerHTML = reply;
  chatArea.scrollTop = chatArea.scrollHeight;
  chatsList.innerHTML += `<span class="title">${promptValue.slice(
    0,
    15
  )}</span>`;
  //<span class="title">chat#1</span>
};
chatsList.querySelectorAll(".title").forEach((t) => {
  t.oncontextmenu = (e) => {
    e.preventDefault();
    if (chatsList.querySelector(".deleteBtn")) {
      chatsList.querySelector(".deleteBtn").remove();
    }
    let deleteBox = document.createElement("div");
    deleteBox.classList.add("deleteBtn");
    deleteBox.innerText = "Delete";
    deleteBox.innerHTML +=
      '<span class="material-symbols-rounded">delete</span>';
    t.appendChild(deleteBox);
    deleteBox.style.right = 5 + "px";
    deleteBox.style.top = e.y + 20 + "px";
    console.log(e.x);
    console.log(e.y);
  };
});

window.onclick = (e) => {
  let deleteBox = chatsList.querySelector(".deleteBtn");
  if (deleteBox) {
    if (e.target != deleteBox) {
      deleteBox.remove();
    } else {
      if (confirm("Are you sure you want to delete this?")) {
        deleteBox.parentElement.remove();
      }
    }
  }
};

async function getResponse(promptValue) {
  const API_KEY = `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`;
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "HTTP-Referer": "http://localhost",
      "X-Title": "CheapGPT",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-chat:free",
      messages: [
        {
          role: "user",
          content: promptValue,
        },
      ],
    }),
  });
  //submit.disabled = false;
  const data = await res.json();
  submit.innerHTML = "arrow_upward";
  return data.choices?.[0]?.message?.content || "Rate limit exceeded!";
}
