const CLEAR_BTN = document.getElementById("clear")
const MESSAGES = document.getElementById("main")
const INPUT = document.getElementById("input")
const INPUT2 = document.getElementById("name")
const SUBMIT_BTN = document.getElementById("submit")
const form = document.getElementById("form")

const url = "https://messages-api-v5bk.onrender.com/api/messages"

INPUT2.value = localStorage.getItem("name") || ""

const update =() => {
    localStorage.setItem("name",INPUT2.value)
    fetch(url)
    .then(response => response.json())
    .then(res => {
        let str=""
        for(let i=0;i<res.length;i++){
            const date = new Date(res[i].createdAt)
            str+= `
            <div class="message ${res[i].username == INPUT2.value.toUpperCase() ? "right" : "left"}">
                <p>${res[i].text}</p>
                <div class="details">
                    <p class="username">${res[i].username}</p>
                    <p class="date">${date.toLocaleDateString()+" - "+date.toLocaleTimeString()}</p>
                </div>
            </div>`
        }
        MESSAGES.innerHTML=str
    }); 
}

update();
setInterval(update,3000);

form.onsubmit = () => { 
    const text = INPUT.value
    let username = INPUT2.value.toUpperCase()
    INPUT.value=""
    if(text == null || text == "") return false
    if(username == null || username == "") username = "unknown"

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({ text, username }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(() => update());
    return false
}

CLEAR_BTN.onclick = () => {
    if (INPUT2.value.toUpperCase() != "RAJ") return alert("You are not admin. You are not allowed to clear messages.")
    fetch(url, {
        method: 'DELETE'
    })
    .then(() => update());
}