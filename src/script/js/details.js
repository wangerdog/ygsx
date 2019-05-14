;
//渲染数据
(function($) {
    $('#details_header').load("./header.html");
    $('#details-footer').load("./footer.html");
    $.getScript("http://127.0.0.1:8080/1902/projectname/src/script/js/head.js");
    var id = location.search.substring(1).split('=')[1];
    //2.将当前的id传给后端获取对应的数据
    $.ajax({
        type: "post",
        url: "http://127.0.0.1:8080/1902/projectname/php/getdetails.php",
        data: {
            gid: id
        },
        dataType: "json",
        success: function(data) {
            var data = data[0];
            $('.details-nav-name').html(data.name);
            $('.product-name h1').html(data.name);
            $('.product-name p').html(data.article);
            $('.pro-price strong').html(data.price);
            $('.selected-pic').html('￥' + data.price);
            $('.selected-guige').html(data.guige);
            var arr = data.url.split(',');
            var str = '';
            $.each(arr, function(index, value) {
                str += '<li><img src="' + value + '"/></li>';
            });
            $('.big-img').attr('src', arr[0]);
            $('.picList ul').html(str);
        }
    });

})(jQuery);
//点击小图变化大图
(function($) {
    $('.picList ul').on('mouseover', 'li', function() {
        $(this).addClass('on').siblings().removeClass('on');
        var $imgurl = $(this).find('img').attr('src');
        $('.big-img').attr('src', $imgurl).css('opacity', 0).animate({ 'opacity': 1 });
    })
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate() + 1;
    if (day < 10) {
        day = "0" + day;
    }
    $('.pro-time').html('（' + month + '月' + day + '日）');
})(jQuery);
//数量加减按钮
(function($) {
    class adddel {
        constructor() {
            this.del = $('.decrease');
            this.add = $('.increase');
            this.nubshow = $('#p_number');
            this.nub = parseInt($('#p_number').val());
        }
        init() {
            let _this = this;
            this.del.on('click', function() {
                _this.delfn();
            })
            this.add.on('click', function() {
                _this.addfn();
            })
        }
        addfn() {
            this.nub += 1;
            this.nubshow.attr('value', this.nub);
            this.del.removeAttr("disabled");
        }
        delfn() {
            this.nub -= 1;
            this.nubshow.attr('value', this.nub);
            if (this.nub == 1) {
                this.del.attr('disabled', true);
            }
        }
    }
    new adddel().init();
})(jQuery);
//点击实现加入购物车
;
(function($) {
    class addTocart {
        constructor() {
            this.btn = $('.btn-gn');
            this.phoneval = $.cookie('phone');
            //用户购物车的数据以他的手机号作为key报存在cookie中
            this.str = $.cookie(this.phoneval);
            //商品的id
            this.id = location.search.substring(1).split('=')[1];

        };
        init() {
            var _this = this;

            this.btn.on('click', function(e) {
                e.preventDefault();
                _this.value();
                _this.mincart();
            })
        };
        //购物车存取cookie
        value() {
            //商品的数量
            this.num = parseInt($('#p_number').val());
            var phoneval = $.cookie('phone');
            var str = $.cookie(this.phoneval);
            //判断该用户是否有商品
            if (str) {
                var arr = JSON.parse(str);
                var newarr;
                //判断cookie中是否有该商品
                if (arr.filter((elm, i) => {
                        return elm.id == this.id
                    }).length > 0) {
                    newarr = arr.map((elm, i) => {
                        if (elm.id == this.id) {
                            elm.num += this.num;
                        }
                        return elm;
                    });
                    $.cookie(phoneval, JSON.stringify(newarr), { expires: 7 });
                } else {
                    arr.push({ "id": this.id, "num": this.num });
                    $.cookie(phoneval, JSON.stringify(arr), { expires: 7 });
                }
            } else {
                //添加新的数组到cookie中
                var arr1 = [{
                    "id": this.id,
                    "num": this.num
                }];
                $.cookie(this.phoneval, JSON.stringify(arr1), { expires: 7 });
            }
        };
        //头部的购物车显示
        mincart() {
            var arr = $.cookie(this.phoneval);
            if (arr) {
                $('.goods').show();
                $('.nogoods').hide();
                arr = JSON.parse(arr);
            }
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
    new addTocart().init();

})(jQuery)