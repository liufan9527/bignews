$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({

        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须在1~6个字符之间!'
            }
        }
    })

    //初始化用户信息

    initUser()

    function initUser() {

        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                //调用 form.val快速为表单赋值
                form.val('formUser', res.data)
                console.log(res);
            }
        })
    }

    //重置表单数据
    $('#btnUser').on('click', function (e) {
        e.preventDefault()
        initUser()
    })

    //监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        //ajax事件
        $.ajax({

            method: 'POST',
            url: '/my/userinfo',
            data: $('.layui-form').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                //在子页面中调用父页面里的渲染用户信息方法
                window.parent.getUserInfo()
            }
        })
    })
})