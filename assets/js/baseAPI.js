//每次调用$.git()或$.post()或$.ajax()时,都会调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (optinos) {
  optinos.url = "http://ajax.frontend.itheima.net" + optinos.url;
  //统一为有限的接口,设置headers请求头
  if (optinos.url.indexOf("/my/") !== -1) {
    optinos.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  //全局配置complete回调函数
  optinos.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});