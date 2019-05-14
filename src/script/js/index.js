;
(function($) {
    $('#index-header').load("./header.html");
    $('#index-footer').load('./footer.html');
    $.getScript("http://127.0.0.1:8080/1902/projectname/src/script/js/head.js");
    // 左边导航
    class leftnav {
        constructor() {
            this.h3 = $('.item>h3');
            this.title = $('.leftnav-title');
            this.list = $('.leftnav-list');

        }
        init() {
                let _this = this;
                this.title.on('click', function(event) {
                    event.preventDefault(); //阻止默认的点击事件
                    _this.onclick();
                });
                $('.item').hover(function() {
                    $(this).find('h3').next().show();
                }, function() {
                    $(this).find('h3').next().hide();
                })
            }
            // 点击标题隐藏显示
        onclick() {
            if (this.list.hasClass('block')) {
                this.list.removeClass('block').addClass('none');
            } else {
                this.list.removeClass('none').addClass('block');
            }
        }

    }
    //首页滚动实现效果
    class indexscroll {
        constructor() {
            //距离浏览器的高度
            this.floors = $('.floor');
            this.floor_guide = $('.min-nav a');

        }
        init() {
            let _this = this;
            //首页滚动时候实现的效果
            this.floor_guide.hide();
            $('.right-guide').css('top', '90%');
            $('.gotop').hide();

            $(window).scroll(function() {
                    var $top = $(window).scrollTop();
                    _this.showall(this);
                    _this.floorshow($top);
                })
                //点击按钮时实现楼梯效果
            this.floor_guide.on('click', function() {
                    _this.floorscroll(this);

                })
                //  3. 回到顶部
            $('.gotop').on('click', function(e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 1000);
            });
        }

        showall(it) {
                //楼梯的显示和隐藏
                if ($(it).scrollTop() >= 700) {
                    this.floor_guide.show();
                } else {
                    this.floor_guide.hide();
                }
                //回到顶部按钮的显示与隐藏
                if ($(it).scrollTop() >= 650) {
                    $('.right-guide').css('top', '80%');
                    $('.gotop').show();
                } else {
                    $('.right-guide').css('top', '90%');
                    $('.gotop').hide();
                }
            }
            //页面滚动时左边图标对应滚动
        floorshow(top) {
                $('.floor').each(function(index, element) {
                    var $loucentTop = $(element).offset().top; //每个楼层的top值
                    if ($loucentTop + 200 > top) {
                        $('.min-nav a').removeClass('current');
                        $('.min-nav a').eq(index).addClass('current');
                        return false;
                    }
                })
            }
            //点击左边图标，跳转到相应额页面
        floorscroll(it) {
            $(it).addClass('current').siblings().removeClass('current');
            var $top = this.floors.eq($(it).index()).offset().top - 100;
            $('html,body').animate({
                scrollTop: $top
            });
        }
    }

    //数据传输
    class indexajax {
        constructor() {}
        init() {
            this.shuju();
        }
        shuju() {
            $.ajax({
                type: "get",
                url: "http://127.0.0.1:8080/1902/projectname/php/getindex.php",
                dataType: "json",
                success: function(data) {
                    $.each(data, function(index, value) {
                        if (index != 3 && index != 2) {
                            var $li = `
                <li>
                    <a href="./details.html?id=${value.gid}" target="_blank ">
                        <img class="lazy" data-original="${value.indexurl}" width="230" height="230" >
                    </a>
                </li>
                `
                        } else {
                            var $li = `
                            <li class="wide">
                                <a href="./details.html?id=${value.gid}" target="_blank ">
                                    <img class="lazy" data-original="${value.indexurl}" width="460" height="230" >
                                </a>
                            </li>
                            `
                        }
                        $('#floor1-ul').html(function(i, old) {
                            return old + $li;
                        })
                    })
                    $("img.lazy").lazyload({
                        effect: "fadeIn"
                    });
                }
            });
        }
    }

    //执行class方法
    new leftnav().init();
    new indexscroll().init();
    new indexajax().init();
})(jQuery);

(function($) {
    var index = 0;
    var timer;
    timer = setInterval(play, 3500);

    function play() {
        index++;
        if (index > 2) {
            index = 0;
        }
        if (index < 0) {
            index = 2;
        }
        $('.b-slider>li').eq(index).show().siblings().hide();
        $('.b-slider>li').eq(index).addClass("currents").siblings().removeClass('currents');
        $('.b-dot li').eq(index).addClass("on").siblings().removeClass('on');
    }
    $('.next').on('click', function(e) {
        e.preventDefault();
        play();
        console.log(index);
    })
    $('.prev').on('click', function(e) {
        e.preventDefault();
        index = index - 2;
        play();
        console.log(index);
    })
    $('.b-dot li').on('click', function(e) {
            e.preventDefault();
            index = $(this).index();
            $('.b-slider>li').eq(index).show().siblings().hide();
            $(this).addClass("on").siblings().removeClass('on');
        })
        //鼠标悬浮
    $('#banner').hover(function() {
        clearInterval(timer);
        $('.b-btn').show();
    }, function() {
        $('.b-btn').hide();
        timer = setInterval(play, 3500);
    });
})(jQuery);