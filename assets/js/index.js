$(function () {
    getUserInfo();
    //退出功能
    $("#btnLogoout").on("click", function () {
        layer.confirm("确定要退出?", {
            icon: 3,
            title: "提示"
        }, function (index) {
            //do something

            localStorage.removeItem('token')
            location.href = "/login.html"

            layer.close(index);
        });
    });
});

//获取用户信息
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }

            renderAvatar(res.data);
        },
    });
}

//渲染用户头像
function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username;

    //设置欢迎文本
    $("#welcome").html("欢迎&nbsp;&nbsp" + name);

    if (user.user_pic !== null) {
        //渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();

        $(".text-avatar").hide();
    } else {
        //渲染文本头像
        $(".layui-nav-img").hide();
        //首字母第一个转为大写
        var first = name[0].toUpperCase();

        $(".text-avatar").html(first).show();
    }
}