$(function () {

    //注册点击事件
    $('#link_reg').on('click', function () {
        $('.logoin-box').hide()
        $('.reg-box').show()
    })
    //登录点击事件
    $('#link_login').on('click', function () {
        $('.logoin-box').show()
        $('.reg-box').hide()
    })
    //获取全局对象layui的form属性
    var form = layui.form
    var layer = layui.layer

    form.verify({

        //自定义密码校验规则
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repass: function (value) {
            //.reg-box[name=value]属性选择器,选择再次输入密码的input
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次密码输入不一致"
            }
        }


    })

    $('#form_reg').on('submit', function (e) {
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        e.preventDefault()
        $.post('http://ajax.frontend.itheima.net/api/reguser',

            data,
            function (res) {

                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功');

                //模拟人点击登录
                $('#link_login').click()
            })
    })


    //登录表单提交事件
    $('#form-login').on('submit', function (e) {
        e.preventDefault()
        $.ajax({

            url: 'http://ajax.frontend.itheima.net/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                    localStorage.setItem('token', res.token)
                    location.href = '/index.html'
                }
            }
        })
    })
})