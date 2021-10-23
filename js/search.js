 const searchWrapper = document.querySelector(".search-input");
 const inputBox = searchWrapper.querySelector("#search_suggest");
 const suggBox = searchWrapper.querySelector(".autocom-box");
 const icon = searchWrapper.querySelector(".icon");
 let linkTag = searchWrapper.querySelector("a");

 inputBox.onkeyup = (e) => {
     let userData = e.target.value; //user enetered data
     let emptyArray = [];
     if (userData) {

         emptyArray = suggestions.filter((data) => {

             return data.Name.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
         });
         emptyArray = emptyArray.map((data) => {

             return data = `<li>${data.Name}</li>`;
         });
         searchWrapper.classList.add("active");
         showSuggestions(emptyArray);
         let allList = suggBox.querySelectorAll("li");
         for (let i = 0; i < allList.length; i++) {

             allList[i].setAttribute("onclick", "select(this);abc()");
         }
     } else {
         searchWrapper.classList.remove("active");
     }
 }

 function select(element) {
     let selectData = element.textContent;
     inputBox.value = selectData;
     searchWrapper.classList.remove("active");
 }

 function showSuggestions(list) {
     let listData;
     if (!list.length) {
         userValue = inputBox.value;
         listData = `<li>${userValue}</li>`;
     } else {
         listData = list.join('');
     }
     suggBox.innerHTML = listData;

 }