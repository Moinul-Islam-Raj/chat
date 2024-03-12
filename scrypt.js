const CLEAR_BTN = document.getElementById("clear")
const MESSAGES = document.getElementById("main")
const INPUT = document.getElementById("input")
const INPUT2 = document.getElementById("name")
const SUBMIT_BTN = document.getElementById("submit")
const form = document.getElementById("form")
const FILE_INPUT = document.getElementById("file")
const LABEL = document.getElementById("label")

const url = "https://messages-api-v5bk.onrender.com/api/messages"

INPUT2.value = localStorage.getItem("name") || ""
FILE_INPUT.onchange = () => {
    const arr = FILE_INPUT.value.split("\\");
    LABEL.innerText = arr[arr.length-1];
}

const update =() => {
    localStorage.setItem("name",INPUT2.value)
    fetch(url)
    .then(response => response.json())
    .then(res => {
        let str=""
        for(let i=0;i<res.length;i++){
            const date = new Date(res[i].createdAt)
            const type = res[i].messageType
            if (type == "text") {
                str+= `
                <div class="message ${res[i].username == INPUT2.value.toUpperCase() ? "right" : "left"}">
                    <p>${res[i].text}</p>
                    <div class="details">
                        <p class="username">${res[i].username}</p>
                        <p class="date">${date.toLocaleDateString()+" - "+date.toLocaleTimeString()}</p>
                    </div>
                </div>`
            }
            else if (type == "image") {
                str+= `
                <div class="message ${res[i].username == INPUT2.value.toUpperCase() ? "right" : "left"}">
                    <p>${res[i].text}</p>
                    <img src="${res[i].fileData}" alt="image failed">
                    <div class="details">
                        <p class="username">${res[i].username}</p>
                        <p class="date">${date.toLocaleDateString()+" - "+date.toLocaleTimeString()}</p>
                    </div>
                </div>`
            }
        }
        MESSAGES.innerHTML=str
    }); 
}

const post = (username, text, fileData, type) => {
    if (type == "text") {
        if(text == null || text == "") return
        if(username == null || username == "") username = "unknown"
    
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ text, username }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then(() => update());
    }
    else if(type == "image"){
        if(text == null || text == "") text = "Image"
        if(username == null || username == "") username = "unknown"
        
        
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({ text, username, fileData, messageType:"image" }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        .then(res => {
            update()
        })
        .catch((e) => {
            alert("file too big")
        });
    }
}

update();
setInterval(update,3000);

form.onsubmit = () => { 
    const text = INPUT.value
    let username = INPUT2.value.toUpperCase()
    let file = FILE_INPUT.files[0] || null;
    INPUT.value=""
    FILE_INPUT.value = null;
    LABEL.innerText = "Image"


    if (!file) {
        post(username, text, null, "text")
    }
    else{
        const fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onload = () => {
            post(username, text, fr.result, "image")
        }
    }
    
    return false
}

CLEAR_BTN.onclick = () => {
    if (INPUT2.value.toUpperCase() != "RAJ") return alert("You are not admin. You are not allowed to clear messages.")
    fetch(url, {
        method: 'DELETE'
    })
    .then(() => update());
}