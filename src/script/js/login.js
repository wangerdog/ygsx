;
(function($) {
    $('#login-footer').load('./footer.html');
    //点击登录按钮
    $('#btnLogin').on('click', function(e) {
        e.preventDefault();
        var $phone = $('#login-phone');
        var $div = $('#msg-wrap>div');
        var $msg = $('#msg-wrap');
        var $password = $('#login-password');
        if ($phone.val() == '') {
            $msg.attr('class', 'msg-wrap');
            $div.html('登录名不能为空');
            $div.attr('class', 'msg-error');
            return;
        }
        if ($password.val() == '') {
            $msg.attr('class', 'msg-wrap');
            $div.html('密码不能为空');
            $div.attr('class', 'msg-error');
        }
        if ($password.val() != '') {
            $msg.attr('class', '');
            $div.html('');
            $div.attr('class', '');
        }
        if ($phone.val() != '' && $password.val() != '') {

            $.ajax({
                type: "post",
                url: "../php/getlogin.php",
                data: {
                    phone: $phone.val(),
                    password: $password.val()
                }
            }).done(function(data) {

                if (data != 'true') {
                    alert('用户名或密码错误');
                } else {
                    location.href = './index.html';
                    //存cookie
                    $.cookie('phone', $phone.val(), { expires: 7 });
                }
            });
        }
    })

})(jQuery);