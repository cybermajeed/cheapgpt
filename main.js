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

submit.onclick = async () => {
  let promptValue = promptArea.value;

  if (promptValue.trim()) {
    wrapper.style.display = "flex";
    emptyMsg.style.display = "none";
    // submit.disabled = true;
    promptArea.value = "";
    let userMsg = document.createElement("div");
    userMsg.classList.add("userMsg");
    userMsg.classList.add("msgBox");
    userMsg.innerText = promptValue;
    wrapper.appendChild(userMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
    /*
        <div class="msgBox userMsg">Who are you?</div>
        <div class="msgBox gptMsg">Hello there! I am CheapGPT</div>
    */
    let gptMsg = document.createElement("div");
    gptMsg.classList.add("gptMsg");
    gptMsg.classList.add("msgBox");
    const reply = await getResponse(promptValue);
    gptMsg.innerHTML = reply;
    wrapper.appendChild(gptMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
  }
};

async function getResponse(promptValue) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer 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",
      "HTTP-Referer": "http://localhost", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "CheapGPT", // Optional. Site title for rankings on openrouter.ai.
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
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
  return data.choices?.[0]?.message?.content || "Rate limit exceeded!";
}
