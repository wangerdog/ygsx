;
(function($) {
    //城市tab切换
    class tab {
        constructor() {
            this.citytab = $('.citylist-tab>span');
            this.citylist = $('.citylist-con');
        }
        init() {
            let _this = this;
            this.citytab.on('mouseover', function() {
                _this.tabfn(this);
            })
        }
        tabfn(span) {
            $(span).addClass('active').siblings().removeClass('active');
            const _index = $(span).index();
            this.citylist.eq(_index).addClass('active').siblings().removeClass('active');

        }
    }
    //滚动实现吸顶
    class scroll {
        constructor() {
            this.header = $('.header');
        }
        init() {
            let _this = this;
            $(document).scroll(function() {

                _this.scrollfn(this);

            })
        }
        scrollfn(it) {
            if ($(it).scrollTop() > 100) {
                $('#index-header .header').addClass('header-fixed');
            } else {
                $('#index-header .header').removeClass('header-fixed');
            }
        }
    }
    //cookie的效果
    class cookie {
        constructor() {
            this.phone = $.cookie('phone'); //获取cookie值
            this.phoneValue = $.cookie(this.phone);
            this.login = $('#_login');
            this.register = $('#_register');
            this.loginname = $('#_loginname');
            this.out = $('#_logout'); //导航的退出
            this.myout = $('.logout'); //我的易果里面的退出

        }
        init() {
                let _this = this;
                //如果用户存在就显示用户
                this.usershow();
                //如果商品存在
                this.cartshow();
                //点击退出，删cookie跑路
                this.out.on('click', function(e) {
                        e.preventDefault();
                        _this.outchick();
                    })
                    //点击退出，删cookie跑路
                this.myout.on('click', function(e) {
                    e.preventDefault();
                    _this.outchick();
                })
            }
            //判断用户显示登录效果
        usershow() {
                if (this.phone) {
                    this.login.hide();
                    this.register.hide();
                    this.loginname.show();
                    this.out.show();
                    this.myout.show();
                    this.loginname.find('a').html(this.phone);
                }
            }
            //判断是否有商品
        cartshow() {
                if (this.phoneValue) {
                    var arr = JSON.parse(this.phoneValue);
                    $('.goods').show();
                    $('.nogoods').hide();
                    var p_number = 0;
                    var p_price = 0;
                    $('.goods>ul').html('');
                    $.each(arr, function(i, v) {
                        p_number += v.num;
                        $.ajax({
                            type: "post",
                            url: "http://127.0.0.1:8080/1902/projectname/php/getheader.php",
                            data: {
                                'id': v.id,
                            },
                            dataType: "json",
                            success: function(data) {
                                data = data[0];
                                var img_url = data.url.split(',')[0];
                                var li = `
                         <li>
                            <div class="l">
                                <a href="#" target="_blank">
                                    <img src="${img_url}" width="42" height="42">
                                </a>
                            </div>
                            <div class="c">
                            <a href="#">${data.name}</a></div>
                            <div class="r">
                                <b>¥${data.price}</b> * ${v.num}
                                <a href="#">删除</a>
                            </div>
                        </li>
                        `;
                                $('.goods>ul').html(function(i, old) {
                                    return old + li;
                                })
                                p_price += Number(data.price) * parseInt(v.num);
                                $('.totlePrice').html('￥' + p_price.toFixed(2));
                                $('.totleNum>b').html(p_number);

                            }
                        });
                    })
                }
            }
            //点击退出按钮退出
        outchick() {
            $.cookie('phone', this.phone, { expires: -1 });
            location.reload();
        }
    }

    //购物车
    class cart {
        constructor() {
            this.btn = $('.shopping-cart');
            this.list = $('.shopping-list');
        }
        init() {
            let _this = this;
            //鼠标移动到购物车显示按钮
            this.btn.hover(function() {
                    _this.list.stop().show(500);
                },
                function() {
                    _this.list.stop().hide(500);
                });
        }

    }

    new tab().init();
    new scroll().init();
    new cookie().init();
    new cart().init();
})(jQuery);