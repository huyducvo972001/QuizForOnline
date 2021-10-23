
var isLogin = false;

// routing

var app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider) {

  $routeProvider
    .when("/", {
      templateUrl: "home.html"
    })
    .when("/mon-hoc", {
      templateUrl: "subjects.html"
    })
    .when("/gioi-thieu", {
      templateUrl: "about.html"
    })
    .when("/lien-he", {
      templateUrl: "contact.html"
    })
    .when("/gop-y", {
      templateUrl: "feedback.html"
    })
    .when("/hoi-dap", {
      templateUrl: "ans_quest.html"
    })
    .when("/dang-ky", {
      templateUrl: "createAccount.html"
    })
    .when("/dang-nhap", {
      templateUrl: "login.html"
    })
    .when("/quen-mat-khau", {
      templateUrl: "forgotpassword.html"
    })
    .when("/doi-mat-khau", {
      templateUrl: "changePassword.html"
    })
    .when("/cap-nhat-tai-khoan", {
      templateUrl: "changeInfor.html"
    })
    .when("/xac-nhan-ma", {
      templateUrl: "confirmCode.html"
    })
    .when("/doi-mat-khau-moi", {
      templateUrl: "changeNewPassword.html"
    })
    .when("/bai-trac-nghiem/:id", {
      templateUrl: "excersice.html"
    })
    .when("/ket-qua-hoc-tap", {
      templateUrl: "historyStudy.html"
    })
    .when("/xac-nhan", {
      templateUrl: "confirm.html"
    })
    ;

});

// slide
app.controller('myCtrl', function ($scope) {
  $scope.st = 0;
  $scope.next = function () {
    if ($scope.st == 2) {
      $scope.st = 0;
    } else {
      $scope.st++;
    }
  }
});

// fill subject
app.controller("subjectCtrl", function ($scope, $http, $rootScope) {

  $scope.listSubject = [];
  $http.get('db/Subjects.js').then(s => {
    $scope.listSubject = s.data;

  })
  $scope.saveResult = function () {
    for (var i = 0; i < $rootScope.dataHistory.length; i++) {
      $http.post('http://localhost:3000/historyExam', JSON.stringify($rootScope.dataHistory[i]))
        .then(function (response) {         
          if (response.data) {
            console.log("Post Data Submitted Successfully!")
          }
        }, function (error) {
          console.log(error + "lỗi nè")
        });
    }
  }

  $scope.start = 0;
  $scope.next = function () {
    $scope.start += 4
    if ($scope.start >= $scope.listSubject.length) {
      $scope.start = 0
    }
  }
  $scope.back = function () {
    $scope.start -= 4
    if ($scope.start <= 0) {
      $scope.start = $scope.listSubject.length - 4
    }
  }
  $scope.prev = function () {
    $scope.start = 0

  }
  $scope.last = function () {
    $scope.start = $scope.listSubject.length - 4

  }
  $scope.fill = 10
  $scope.check = true;
  $scope.show_hiden = "Xem thêm";
  $scope.full = function () {
    if ($scope.check == true) {
      $scope.fill = $scope.listSubject
      $scope.show_hiden = "Ẩn bớt";
      $scope.check = false;
    } else {
      $scope.fill = 10
      $scope.show_hiden = "Xem thêm";
      $scope.check = true;
    }

  }

  const searchWrapper = document.querySelector(".search-input");
  const inputBox = searchWrapper.querySelector("input");
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

        return data = `
        <ul class="list-group list-group-flush">
          <li class="list-group-item list-group-item-action"  style="cursor: pointer;">${data.Name}</li>
        </ul>`;
      });
      searchWrapper.classList.add("active");
      showSuggestions(emptyArray);
      let allList = suggBox.querySelectorAll("li");
      for (let i = 0; i < allList.length; i++) {

        allList[i].addEventListener("click", function () {
          let selectData = allList[i].textContent;
          inputBox.value = selectData;
          searchWrapper.classList.remove("active");
        }, false);
        
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
      listData = `<span><br>Không tìm thấy kết quả</span>`;
    } else {
      listData = list.join('');
    }
    suggBox.innerHTML = listData;

  }

  $scope.searchFinish = function() {
    setTimeout(function(){
      $scope.nameSuggest = document.getElementById('search_suggest').value;
    $http.get('db/Subjects.js')
    .then(
      function(r){
        $scope.idSuggest = r.data.find(s => s.Name === $scope.nameSuggest).Id
        window.location.href = "#!/bai-trac-nghiem/"+$scope.idSuggest
      }
    )
      }, 200);
  }
 
});

// exam
app.controller("examCtrl", function ($scope, $http, $window, $routeParams, $rootScope) {
  if (isLogin != true) {
    $window.location.href = "#!/dang-nhap"
  }
  $scope.exameID = $routeParams.id;
  $scope.quizs = [];

  $http.get(`db/Quizs/${$scope.exameID}.js`).then(q => {
    $scope.quizs = q.data
    $scope.random = Math.floor((Math.random() * $scope.quizs.length) + 1);
  })
  $scope.examName = "";
  $http.get('db/Subjects.js').then(s => {
    let sub = s.data.find(r => r.Id == $scope.exameID);
    $scope.examName = sub.Name;
  })
  $scope.result = []//
  $scope.resultId = []

  $scope.temp = "";
  $scope.tempid = "";
  $scope.mark = 0;
  $scope.answer = function (selected, idSelected) {
    if ($scope.tempid !== idSelected) {
      if ($scope.resultId.find(r => r === idSelected)) {
        $scope.result[$scope.resultId.indexOf(idSelected)] = angular.copy(selected)
        $scope.temp = selected
        console.log(resultId);
        console.log(result);
      } else {
        $scope.result.push(selected)
        $scope.resultId.push(idSelected)
        $scope.tempid = idSelected
        $scope.temp = selected
        console.log(resultId);
        console.log(result);
      }

    } else if ($scope.tempid === idSelected) {
      $scope.result[$scope.result.indexOf($scope.temp)] = angular.copy(selected)
      $scope.temp = selected
    }
  }
  $scope.checkSubmit = false;
  $scope.submit = function () {
    for (var i = 0; i < $scope.result.length; i++) {
      console.log($scope.result[i] + '<>' + $scope.resultId[i])
      if ($scope.result[i] === $scope.resultId[i]) {
        $scope.mark++;
      }
    }
    swal({
      title: "Bạn đã hoàn thành bài thi!",
      text: 'Điểm: ' + $scope.mark +"| Kết quả: "+ ($scope.mark> 5 ? "Đạt":"Rớt"),
      icon: 'success',
      button: "Xem đáp án!",
    });
    $scope.checkSubmit = true;
    // window.location.href = '#!/mon-hoc'  
    clearInterval($scope.myIntv);

    var currentdate = new Date();
    var datetime = (currentdate.getDate() < 10 ? "0" + currentdate.getDate() : currentdate.getDate()) + "/"
      + ((currentdate.getMonth() + 1) < 10 ? "0" + (currentdate.getMonth() + 1) : (currentdate.getMonth() + 1)) + "/"
      + currentdate.getFullYear() + " "
      + (currentdate.getHours() < 10 ? "0" + currentdate.getHours() : currentdate.getHours()) + ":"
      + (currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes()) + ":"
      + (currentdate.getSeconds() < 10 ? "0" + currentdate.getSeconds() : currentdate.getSeconds());


    var data = {
      username: $scope.username,
      mark: $scope.mark,
      examName: $scope.examName,
      time: $scope.timeremain,
      date: datetime
    };

    $rootScope.dataHistory.push(data)
  }

  $scope.localSlide = 0;
  $scope.next = function () {
    $scope.localSlide++;
    $scope.checkLocalSlide();
  }
  $scope.back = function () {
    $scope.localSlide--;
    $scope.checkLocalSlide();
  }
  $scope.prev = function () {
    $scope.localSlide = 1;
    $scope.checkLocalSlide();
  }
  $scope.last = function () {
    $scope.localSlide = 10;
    $scope.checkLocalSlide();
  }
  $scope.checkLocalSlide = function () {
    if ($scope.localSlide == 0) {
      document.getElementById("prev").disabled = true;
      document.getElementById("back").disabled = true;
      $scope.localSlide += 1;
    } else if ($scope.localSlide == 11) {
      document.getElementById("last").disabled = true;
      document.getElementById("next").disabled = true;
      $scope.localSlide -= 1;
    } else {
      document.getElementById("last").disabled = false;
      document.getElementById("next").disabled = false;
      document.getElementById("prev").disabled = false;
      document.getElementById("back").disabled = false;
    }
  }

  $scope.startExam = function () {
    $scope.next()
    var startingMinutes = 10;
    var time = startingMinutes * 60;
    var countDownEl = document.getElementById('countDown')
    $scope.myIntv = setInterval(abc, 1000)
    function abc() {
      const minutes = Math.floor(time / 60);
      let second = time % 60;
      second = second < 10 ? '0' + second : second;
      countDownEl.innerHTML = `Thời gian còn lại: ${minutes}:${second}`
      $scope.timeremain = `${minutes}:${second}`
      time--;
      // console.log(startingMinutes)       
      if (minutes == 0 && second == 0) {
        clearInterval($scope.myIntv);
        $scope.submit()
      }
    }
  }


})

// login

app.controller("checkLoginCtrl", function ($scope, $rootScope) {
  $scope.kiemTraLogin = function () {
    $scope.kiemLogin = isLogin
  };
  $scope.logout = function () {
    isLogin = false;
    window.location.href = '#!/'
    location.reload();
  }
  $rootScope.fullname

})

app.controller("loginCtrl", function ($scope, $rootScope, $http) {
  $rootScope.dataHistory = []
  $scope.login = function () {
    $http.get("http://localhost:3000/courses")
      .then(function (response) {
        $scope.student = response.data;
        if ($scope.student.find(u => u.username === $scope.username && u.password === $scope.password) != null) {
          window.location.href = '#!/mon-hoc'
          isLogin = true;
          $scope.sts = $scope.student.find(u => u.username === $scope.username);
          // info account
          $rootScope.username = $scope.sts.username
          $rootScope.fullname = $scope.sts.fullname
          $rootScope.email = $scope.sts.email
          $rootScope.fee = parseInt($scope.sts.schoolfee)
          $rootScope.gender = $scope.sts.gender
          $rootScope.birthday = $scope.sts.birthday
          $rootScope.password = $scope.sts.password
          $rootScope.mark = parseInt($scope.sts.mark)
          $rootScope.idUser = $scope.sts.id
          $rootScope.img = $scope.sts.img


        } else {
          swal({
            title: "Đăng nhập không thành công!",
            text: "Vui lòng kiểm tra lại username và password",
            icon: "error",
            button: "Xác nhận!",
          });
        }
      });
  }

  $scope.update = function () {
    var str = document.getElementById('anhDaiDoen').value;
    var data = {
      username: $scope.username,
      password: $scope.password,
      fullname: $scope.fullname,
      email: $scope.email,
      gender: $scope.gender,
      birthday: $scope.birthday,
      schoolfee: $scope.fee,
      mark: $scope.mark,
      img: str.substring(str.lastIndexOf("\\") + 1)
    };

    $http.put('http://localhost:3000/courses/' + $rootScope.idUser, JSON.stringify(data)).then(function (response) {
      if (response.data)
        console.log("Put Data Method Executed Successfully!")
      window.location.href = '#!/dang-nhap'
    }, function (error) {
      console.log(error)
    });

  };

  $scope.updatePassword = function () {
    var data = {
      username: $scope.username,
      password: $scope.newPass,
      fullname: $scope.fullname,
      email: $scope.email,
      gender: $scope.gender,
      birthday: $scope.birthday,
      schoolfee: $scope.fee,
      mark: $scope.mark,
      img: $rootScope.img
    };

    if ($scope.newPass === $scope.newPassAgain && $scope.password === $scope.oldPass) {
      $http.put('http://localhost:3000/courses/' + $rootScope.idUser, JSON.stringify(data)).then(function (response) {
        if (response.data)
          console.log("Put Data Method Executed Successfully!")
        window.location.href = '#!/dang-nhap'
      }, function (error) {
        console.log(error)
      });
    } else {
      swal({
        title: "Đổi mật khẩu không thành công!",
        text: "Vui lòng kiểm tra lại!",
        icon: "error",
        button: "Xác nhận!",
      });
    }

  };

})


app.controller('createAccountCtrl', function ($scope, $http) {
  $scope.postdata = function () {
    var data = {
      username: $scope.username,
      password: $scope.password,
      fullname: $scope.fullname,
      email: $scope.email,
      gender: $scope.gender,
      birthday: $scope.birthday,
      schoolfee: $scope.schoolfee,
      mark: $scope.mark
    };
    $http.post('http://localhost:3000/courses', JSON.stringify(data))
      .then(function (response) {
        if (response.data) {
          console.log("Post Data Submitted Successfully!")
          window.location.href = '#!/dang-nhap'
        }
      }, function (error) {
        console.log(error + "lỗi nè")
      });
  };
});


app.controller('historyStudy', function ($scope, $http) {
  $scope.dataStudents = []
  $scope.totalMark = []
  $http.get("http://localhost:3000/historyExam").then(function (response) {
    $scope.dataStudents = response.data.filter(s => s.username === $scope.username);
    $scope.totalFinish = $scope.dataStudents.length;
    for (var i = 0; i < $scope.dataStudents.length; i++) {
      $scope.totalMark.push(response.data.filter(s => s.username === $scope.username)[i].mark)
    }
    $scope.maxTotal = Math.max.apply(Math, ($scope.totalMark))
    $scope.minTotal = Math.min.apply(Math, ($scope.totalMark))
  })

});

app.controller('forgotPasswordCtrl', function ($scope, $http, $rootScope) {
  $scope.usersForgot = []
  $scope.forgotPassword = function () {
    $rootScope.codeForgot = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
    console.log($rootScope.codeForgot)
    $http.get("http://localhost:3000/courses")
      .then(function (response) {
        $scope.usersForgot = response.data;
        console.log($scope.usersForgot)
        if ($scope.usersForgot.find(u => u.email === $scope.email) != null) {
          $rootScope.emailForgot = $scope.email
          window.location.href = "#!/xac-nhan"
          Email.send({
            SecureToken: "fbf31702-bb7f-4a4e-9c1c-4ccf17ee777f",
            To: $scope.email,
            From: "huyvoduc77@gmail.com",
            Subject: "Xin chào bạn chúng tôi được nhận yêu cầu gửi mã xác minh.",
            Body: "Đây là mã xác nhận của bạn: " + $rootScope.codeForgot
          })
        }
      })
  }
});

app.controller('confirmCtrl', function ($scope, $http, $rootScope) {
  $scope.confirmCode = function () {
    console.log($scope.confirm + "-----" + $rootScope.codeForgot)
    if ($scope.confirm === $rootScope.codeForgot) {
      $http.get("http://localhost:3000/courses")
        .then(function (response) {
          $scope.passwordForgot = response.data.find(u => u.email === $rootScope.emailForgot).password;
          window.location.href = "#!/dang-nhap"
          Email.send({
            SecureToken: "fbf31702-bb7f-4a4e-9c1c-4ccf17ee777f",
            To: $scope.emailForgot,
            From: "huyvoduc77@gmail.com",
            Subject: "Bạn đã xác minh thành công!",
            Body: "Mật khẩu của bạn là: " + $scope.passwordForgot + "<br>Nhớ đổi mật khẩu mới nhé! <br> Đội ngũ chăm sóc khách hàng!"
          })
        })
    }
  }
})