const CLEAR_btn = document.getElementsByTagName("button")[0]
const msgs = document.getElementsByClassName("messages")[0]
const INPUT = document.getElementById("input")
const form = document.getElementsByTagName("form")[0]

const update =(d) => {
    let str=""
    for(let i=0;i<d.length;i++){
        str= `<div class="message">${d[i]}</div>` +str
    }
    msgs.innerHTML=str
}

fetch('https://chat-api-cbev.onrender.com/')
  .then(response => response.json())
  .then(datas => update(datas.data));
setInterval(()=>{
   fetch('https://chat-api-cbev.onrender.com/')
  .then(response => response.json())
  .then(datas => update(datas.data));
},3000)

form.onsubmit = () => { 
    let temp = INPUT.value
    if(temp == null) return false 

    fetch('https://chat-api-cbev.onrender.com/', {
    method: 'POST',
    body: JSON.stringify({ text:temp }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    }
    })
    .then(response => response.json())
    .then(datas => {
		update(datas.data)
	});
    return false
}

CLEAR_btn.onclick = () => {
    fetch('https://chat-api-cbev.onrender.com/', {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(datas => update(datas.data));
}