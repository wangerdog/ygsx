;
(function($) {
    $('#cart_header').load("./header.html .site-nav");
    $('#cart_footer').load("./footer.html");
    $.getScript("http://127.0.0.1:8080/1902/projectname/src/script/js/head.js");
    class cartMain {
        constructor() {
            //用户存在的商品
            this.phone = $.cookie($.cookie('phone'));
            //购物车没有商品显示的图片盒子
            this.cartnone = $('.cart-none');
            //购物车有商品时显示的盒子
            this.cartshow = $('.cart-show');
            //增加按钮
            this.addnum = $('.increment');
            this.downnum = $('.decrement');
        };
        init() {
            let _this = this;
            this.isgoods();
            this.allcheck();
            this.onecheck();
            //点击数量增加按钮
            this.addnum.on('click', function(e) {
                e.preventDefault();
                _this.add(this);
            });
            this.downnum.on('click', function(e) {
                e.preventDefault();
                _this.down(this);
            });
            $('.itxt').on('input', function() {
                _this.writenum(this);
            });
            $('.delgood').on('click', function(e) {
                e.preventDefault();
                _this.delgood($(this));
            })
        };
        //判断cookie中是否有商品，加载数据
        isgoods() {
            let _this = this;
            // $('.cart-main-list tr:visible').hide();
            if (this.phone) {
                var phonedata = JSON.parse($.cookie($.cookie('phone')));
                $.each(phonedata, function(index, value) {
                    _this.goodlist(value.id, value.num);
                })
                this.cartnone.hide();
                this.cartshow.show();
            } else {
                this.cartnone.show();
                this.cartshow.hide();
            }
        };
        //渲染数据的方法
        goodlist(id, count) {
            let _this = this;

            $.ajax({
                type: "post",
                url: "http://127.0.0.1:8080/1902/projectname/php/getcart.php",
                dataType: "json",
                data: {
                    id: id,
                },
            }).done(function(data) {
                data = data[0];
                var $tr = $('.cart-main-list tr:hidden').clone(true, true);
                $tr.find('.cart-t-img').find('img').attr('src', data.indexurl);
                $tr.find('.cart-t-info').find('a').html(data.name);
                $tr.find('.cart-t-price').html(data.price);
                $tr.find('.itxt').val(count);
                $tr.find('.itxt').attr('data-id', data.gid);
                $tr.find('.cart-t-total').html((parseFloat(data.price) * Number(count)).toFixed(2));
                $tr.find('.cart-t-spec').html(data.guige);
                $tr.css('display', 'block');
                $('.car-cont').append($tr);
                _this.allprice();
            });
        };
        //计算总价和总的商品数量
        allprice() {
            var allprice = 0;
            $('.cart-main-list').find('tr:not(:first)').each(function(index, element) {
                // console.log(element);
                if ($(element).find('.cart-t-check input').prop('checked')) {
                    allprice += parseFloat($(element).find('.cart-t-total').html());
                }
            })
            $('#zj').html(allprice.toFixed(2));
        };
        //全选按钮
        allcheck() {
            let _this = this;
            $('.checkAll').on('change', function() {
                $('.cart-main-list').find('tr:not(:first)').find('.cart-t-check input').prop('checked', $(this).prop('checked'));
                $('.checkAll').prop('checked', $(this).prop('checked'));
                _this.allprice(); //取消选项，重算总和。
            });
        };
        // 单独按钮
        onecheck() {
            var $input = $('.cart-main-list').find('tr:not(:first)').find('.cart-t-check input');
            var _this = this;
            $('.cart-main-list').on('change', $input, function() {
                if ($('.cart-main-list').find('tr:not(:first)').find('.cart-t-check input').length == $('.cart-main-list').find('tr:not(:first)').find('.cart-t-check input:checked').length) {
                    $('.checkAll').prop('checked', true);
                } else {
                    $('.checkAll').prop('checked', false);
                }
                _this.allprice();
            })
        };
        //商品数量增加按钮
        add(it) {
            var $count = $(it).parents('.cart-t-num').find('.itxt').val();
            $count++;
            if ($count >= 99) {
                $count = 99;
            }
            $(it).parents('.cart-t-num').find('.itxt').val($count);
            $(it).parents('.cart-t-num').next().html(this.changeprice($(it)));
            this.numaddtocookie($(it));
            this.allprice();
        };
        //商品数量减少按钮
        down(it) {
            var $count = $(it).parents('.cart-t-num').find('.itxt').val();
            // console.log($count);
            $count--;
            if ($count < 1) {
                $count = 1;
            }
            $(it).parents('.cart-t-num').find('.itxt').val($count);
            $(it).parents('.cart-t-num').next().html(this.changeprice($(it)));
            this.numaddtocookie($(it));
            this.allprice();
        };
        //直接输入改变数量
        writenum(it) {
            var $reg = /^\d+$/g; //只能输入数字
            var $value = parseInt($(it).val());
            if ($reg.test($value)) { //是数字
                if ($value >= 99) { //限定范围
                    $(it).val(99);
                } else if ($value <= 0) {
                    $(it).val(1);
                } else {
                    $(it).val($value);
                }
            } else { //不是数字
                $(it).val(1);
            }
            $(it).parents('.cart-t-num').next().html(this.changeprice($(it))); //改变后的价格
            this.numaddtocookie($(it));
            this.allprice();
        };
        //计算数量改变后单个商品的价格
        changeprice(obj) {
            var $dj = parseFloat(obj.parents('.cart-t-num').prev().html());
            var $cnum = obj.parents('.cart-t-num').find('.itxt').val();
            return (($dj * $cnum).toFixed(2));
        };
        //把商品数量添加到cookie中
        numaddtocookie(obj) {
            //   console.log(obj);
            var $id = obj.parents('.cart-t-num').find('.itxt').attr("data-id");
            var $cnum = obj.parents('.cart-t-num').find('.itxt').val(); //商品数量
            var arr = JSON.parse($.cookie($.cookie('phone')));
            var newarr;
            if (arr.filter((elm, i) => {
                    return elm.id == $id
                }).length > 0) {
                newarr = arr.map((elm, i) => {
                    if (elm.id == $id) {
                        elm.num = parseInt($cnum);
                    }
                    return elm;
                });
                $.cookie($.cookie('phone'), JSON.stringify(newarr), { expires: 7 });
            }
        };
        //删除单个商品
        delgood(obj) {
            var $id = obj.parent().parent().find('.itxt').attr("data-id");
            var arr = JSON.parse($.cookie($.cookie('phone')));

            //   console.log($id);
            var index = arr.indexOf((arr.filter((elm, i) => {
                return elm.id == $id;
            }))[0]);
            arr.splice(index, 1);
            // console.log(JSON.stringify(arr));
            if (arr.length > 0) {
                $.cookie($.cookie('phone'), JSON.stringify(arr), { expires: 7 })
            } else {
                $.cookie($.cookie('phone'), JSON.stringify(arr), { expires: -1 })
            }

            window.location.reload();
        }
    }

    new cartMain().init();
})(jQuery);