const CLEAR_BTN = document.getElementById("clear")
const MESSAGES = document.getElementById("main")
const INPUT = document.getElementById("input")
const SUBMIT_BTN = document.getElementById("submit")
const form = document.getElementById("form")

const url = "https://messages-api-v5bk.onrender.com/api/messages"

const update =() => {
    fetch(url)
    .then(response => response.json())
    .then(res => {
        let str=""
        for(let i=0;i<res.length;i++){
            str= `<div class="message">${res[i].text}</div>` +str
        }
        MESSAGES.innerHTML=str
    }); 
}

update();
setInterval(update,3000);

form.onsubmit = () => { 
    const text = INPUT.value
    INPUT.value=""
    if(text == null || text == "") return false

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({ text }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(() => update());
    return false
}

CLEAR_BTN.onclick = () => {
    fetch(url, {
        method: 'DELETE'
    })
    .then(() => update());
}