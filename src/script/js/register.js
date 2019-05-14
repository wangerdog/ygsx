;
(function($) {
    $('#register-footer').load('./footer.html');
    //失去焦点时，开始验证
    $("#Phone_Password").blur(checkPwd);
    $("#Phone_DoublePassword").blur(checkRepwd);
    $("#Phone_Number").blur(checkTel);
    $('#agreecheck').blur(checkbox);


    //提交表单 
    $("#PhoneReg").click(function(e) {
        e.preventDefault();
        var flag = true;
        if (!checkPwd()) flag = false;
        if (!checkRepwd()) flag = false;
        if (!checkTel()) flag = false;
        if (!checkbox()) flag = false;
        if (flag) {
            $.ajax({
                type: "post",
                url: "http://127.0.0.1:8080/1902/projectname/php/getregister.php",
                data: {
                    phone: $('#Phone_Number').val().trim(),
                    password: $('#Phone_Password').val()
                }

            }).done(function(data) {
                if (data != 'true') {
                    alert('手机号已经注册,请重新注册');
                    window.location.reload();
                } else {
                    alert('注册成功');
                    location.href = 'http://127.0.0.1:8080/1902/projectname/src/login.html';
                }
            });
        }
    });
    //验证手机号
    function checkTel() {
        var tel = $("#Phone_Number").val().trim();
        var regtel = /^(13|15|18|17|14)[0-9]{9}$/;
        if (regtel.test(tel) == false) {
            $("#Phone_Number").next().addClass("pass-error").removeClass("pass-succ");
            $("#Phone_Number").next().html("<i></i>手机号格式不正确");
            return false;
        } else {
            $("#Phone_Number").next().addClass("pass-succ").removeClass("pass-error");
            $("#Phone_Number").next().html("<i></i>");
            return true;
        }
    }
    //验证密码
    function checkPwd() {
        var pwd = $("#Phone_Password").val().trim();
        var regpwd = /^[0-9a-zA-Z]{6,18}$/;
        if (regpwd.test(pwd) == false) {
            $("#Phone_Password").next().addClass("pass-error").removeClass("pass-succ");
            $("#Phone_Password").next().html("<i></i>密码需6-18位字符");
            return false;
        } else {
            $("#Phone_Password").next().addClass("pass-succ").removeClass("pass-error");
            $("#Phone_Password").next().html("<i></i>");
            return true;
        }
    }
    //确认密码
    function checkRepwd() {
        var pwd = $("#Phone_Password").val().trim();
        var repwd = $("#Phone_DoublePassword").val().trim();
        if (pwd == "") {
            $("#Phone_DoublePassword").next().html("");
            return false;
        }
        if (repwd != pwd) {
            $("#Phone_DoublePassword").next().addClass("pass-error").removeClass("pass-succ");
            $("#Phone_DoublePassword").next().html("两次密码输入不一致");
            return false;
        } else {
            $("#Phone_DoublePassword").next().addClass("pass-succ").removeClass("pass-error");
            $("#Phone_DoublePassword").next().html("<i></i>");
            return true;
        }
    }
    //验证勾选
    function checkbox() {

        if (!$("#agreecheck").prop('checked')) {
            $("#agreecheck").nextAll('span').addClass("pass-error").removeClass("pass-succ");
            $("#agreecheck").nextAll('span').html("<i></i>请勾选");
            return false;
        } else {
            $("#agreecheck").nextAll('span').addClass("pass-succ").removeClass("pass-error");
            $("#agreecheck").nextAll('span').html("<i></i>");
            return true;
        }
    }
})(jQuery);