// creat Varibauls
let input = document.querySelector('.input-box input[type="text"]');
let btn = document.querySelector('.input-box button');
let list = document.querySelector('.list-body ul');

// json url
let url = "https://610990bad71b6700176399bd.mockapi.io/todos";
let arrOfTsks = [];

fetch(url).then(response => response.json()).then(data => {
    data.forEach(element => {
        if(element.title.trim() !== "")
            arrOfTsks.push(element);
            creatlistItem(element, true);
    })
});

// when clicked in the add button
// will start function and creat new li elemints
btn.addEventListener("click", ()=>{
    if(input.value.trim() !== ""){
        // Add Time from input number and select box(Day,Hour,Minute)
        let obj = {}
        obj.title = input.value.trim();
        obj.completed = false;
        obj.id = `${Number(arrOfTsks[arrOfTsks.length - 1].id) + 1}`;
        arrOfTsks.push(obj);
        creatlistItem(obj, false);
        input.value = "";
    }
});

// creat li element function
// text => the text it will added to li
// old => to chick if this text new or old couse add it to localstorage
function creatlistItem(object, old = true){
    // create li
    let li = document.createElement("li");

    // creat span and add text to it
    let spanLi = document.createElement('span');
    spanLi.textContent = object.title;

    if(object.completed === true){
        li.classList.add("done")
    }else{
        // create checkbox input
        let checkbox = document.createElement("input");
        checkbox.setAttribute('type','checkbox');
        li.appendChild(checkbox);
        finishedItem(checkbox, object.id);
    }
    
    // creat x button
    let x = document.createElement("a");
    x.textContent = "x";
    x.classList.add("remove");
    
    // add elements to li
    li.appendChild(spanLi);
    li.appendChild(x);
    // add li to list
    list.appendChild(li);
    // chick the value if new or old
    if(!old){
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(object)
        });
    }
    // function add event listen to remove button
    removeElem(x,object.id);
}

// create array and include to it the all remove button
let remove = document.querySelectorAll(".remove");
// loop to all elemints inside remove button's array
remove.forEach(remove=>{
    // function add event listen to all remove button
    removeElem(remove,object.id);
})

// function add event listen to remove button
function removeElem(remove, id){
    // remove event
    remove.addEventListener('click', ()=>{

        fetch(url + `/${id}`, {
            method: "DELETE",
        });

        // remove li (the x button's perant)
        remove.parentElement.remove();
        
    })
}

// create array and include to it the all checkbox
let finishChick = document.querySelectorAll('input[type = "checkbox"]');
// loop to all elemints inside checkbox's array
finishChick.forEach(el=>{
    // function add event listen to all checkbox
    finishedItem(el,id);
})

function finishedItem(finish,id){
    finish.addEventListener("click", ()=>{
        // if user select true 
        if(finish.checked){
            // add class
            finish.parentElement.classList.add("done");
            let task = arrOfTsks.find(e=>e.id === id);
            task.completed = true;
            fetch(url + `/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
              });
        }
        // if user select true 
        else{
            // remove class
            finish.parentElement.classList.remove("done");
        }
    });
}
