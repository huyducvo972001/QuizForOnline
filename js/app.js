
var courseAPI = "http://localhost:3000/courses"


function getCourses(callback) {
    fetch(courseAPI)
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(data)
    }
    fetch(courseAPI, options)
        .then(function (response) {
            response.json();
        })
        .then(callback);
}
function updateCourse(id, data, callback) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify(data)
    }
    fetch(courseAPI + "/" + id, options)
        .then(function (response) {
            response.json();
        })
        .then(callback);
}
// function handleDeleteCourse(id) {
//     var options = {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'

//         }

//     }
//     fetch(courseAPI + '/' + id, options)
//         .then(function (response) {
//             response.json();
//         })
//         .then(function () {
//             getCourses(renderCourses);
//         });
// }

function loadForm() {
    var id = prompt("What's your favorite cocktail drink?");
    var aPromise = fetch(courseAPI);
    aPromise
        .then(function (response) {
            var myJSON_promise = response.json();
            var i = 0;
            myJSON_promise.then(function (myJSON) {             
                document.querySelector('input[name="username"]').value = myJSON.find(u => u.username == id).username;
                document.querySelector('input[name="password"]').value = myJSON.find(u => u.username == id).password;
                document.querySelector('input[name="fullname"]').value = myJSON.find(u => u.username == id).fullname;
                document.querySelector('input[name="email"]').value = myJSON.find(u => u.username == id).email;
                var select = document.getElementById('gender');
                select.options[select.selectedIndex].text = myJSON.find(u => u.username == id).gender;
                document.querySelector('input[name="birthday"]').value = myJSON.find(u => u.username == id).birthday;
                document.querySelector('input[name="schoolfee"]').value = myJSON.find(u => u.username == id).schoolfee;
                document.querySelector('input[name="mark"]').value = myJSON.find(u => u.username == id).mark;
            })
        })

}
// function renderCourses(courses) {
//     var listCoursesBlock = document.querySelector("#list-courses");
//     var htmls = courses.map(function (course) {
//         return `
//             <li>
//                 <h4>${course.username}</h4>
//                 <p>${course.password}</p>
//                 <p>${course.fullname}</p>
//                 <p>${course.email}</p>
//                 <p>${course.gender}</p>
//                 <p>${course.birthday}</p>
//                 <p>${course.schoolfee}</p>
//                 <p>${course.mark}</p>
//                 <button onclick="handleDeleteCourse(${course.id})" >Xoa</button>
//                 <button onclick="doGetJSON(${course.id})" >Sua</button>
//             </li>
//         `
//     })
//     listCoursesBlock.innerHTML = htmls.join('');
// }

function handleCreateForm() {    
        var username = document.querySelector('input[name="username"]').value;
        var password = document.querySelector('input[name="password"]').value;
        var fullname = document.querySelector('input[name="fullname"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var select = document.getElementById('gender');
        var gender = select.options[select.selectedIndex].value;
        var birthday = document.querySelector('input[name="birthday"]').value;
        var schoolfee = document.querySelector('input[name="schoolfee"]').value;
        var mark = document.querySelector('input[name="mark"]').value;
        var formData = {
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            gender: gender,
            birthday: birthday,
            schoolfee: schoolfee,
            mark: mark

        }
        createCourse(formData, function () {
            getCourses(renderCourses);
        });

        window.location.href = '#!/'
    
}

function doGetJSON(id) {
    var aPromise = fetch(courseAPI);
    aPromise
        .then(function (response) {
            var myJSON_promise = response.json();
            myJSON_promise.then(function (myJSON) {
                document.querySelector('input[name="username"]').value = myJSON.find(u => u.id == id).username;
                document.querySelector('input[name="password"]').value = myJSON.find(u => u.id == id).password;
                document.querySelector('input[name="fullname"]').value = myJSON.find(u => u.id == id).fullname;
                document.querySelector('input[name="email"]').value = myJSON.find(u => u.id == id).email;
                var select = document.getElementById('gender');
                select.options[select.selectedIndex].text = myJSON.find(u => u.id == id).gender;
                document.querySelector('input[name="birthday"]').value = myJSON.find(u => u.id == id).birthday;
                document.querySelector('input[name="schoolfee"]').value = myJSON.find(u => u.id == id).schoolfee;
                document.querySelector('input[name="mark"]').value = myJSON.find(u => u.id == id).mark;
            })
        })


    var createBtn = document.querySelector('#update');
    createBtn.onclick = function () {
        var username = document.querySelector('input[name="username"]').value;
        var password = document.querySelector('input[name="password"]').value;
        var fullname = document.querySelector('input[name="fullname"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var select = document.getElementById('gender');
        var gender = select.options[select.selectedIndex].text;
        var birthday = document.querySelector('input[name="birthday"]').value;
        var schoolfee = document.querySelector('input[name="schoolfee"]').value;
        var mark = document.querySelector('input[name="mark"]').value;
        var formData = {
            username: username,
            password: password,
            fullname: fullname,
            email: email,
            gender: gender,
            birthday: birthday,
            schoolfee: schoolfee,
            mark: mark
        }
        updateCourse(id, formData, function () {
            getCourses(renderCourses);
        });
    }
}
