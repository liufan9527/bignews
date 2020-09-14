$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    var y = dt.getFullYear();
    var m = pad(dt.getMonth() + 1);
    var d = pad(dt.getDate());
    var h = pad(dt.getHours());
    var mm = pad(dt.getMinutes());
    var s = pad(dt.getSeconds());
    return y + "-" + m + "-" + d + "  " + h + ":" + mm + ":" + s;
  };

  //定义补零函数
  function pad(n) {
    return n > 9 ? n : "0" + n;
  }
  //创建一个查询对象
  var q = {
    pagenum: 1, //页码值
    pagesize: 2, //每页显示多少条数据
    cate_id: "", //文章分类的 Id
    state: "", //文章的状态，可选值有：已发布、草稿
  };
  initTable();
  initCata();

  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败");
        }

        //使用模板引擎渲染界面
        var htmlStr = template("tel-table", res);
        $("tbody").html(htmlStr);

        renderPage(res.total);
      },
    });
  }

  //初始化文章分类的方法
  function initCata() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败");
        }

        var htmlStr = template("tel-cata", res);
        // console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  //为筛选表单绑定submit事件
  $("#form-secher").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  //定义渲染分页方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox",
      count: total,
      limit: q.pagesize,
      curr: q.pagenum,
      limits: [2, 3, 5, 8],
      layout: ["count", "limit", "prev", "page", "next", "skip"],

      //获取当前选择的页码值
      jump: function (obj, first) {
        //把最新的页码值赋值给q
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  //利用事件委托为删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    //获取到的文章id
    var id = $(this).attr("data-id");
    //获取页面按钮数量
    var len = $(".btn-delete").length;
    console.log(len);
    layer.confirm(
      "确定删除?",
      {
        icon: 3,
        title: "提示",
      },

      function (index) {
        // console.log(id);
        $.ajax({
          method: "GET",
          url: "/my/article/delete/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除失败");
            }
            layer.msg("删除成功");

            //当数据删除完成后,需要判断当前这一页中,是否还剩余数据
            //如果没有了数据,则让页码值-1
            //再重新调用initTable()方法渲染页面

            if (len === 1) {
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
            }
            initTable();
          },
        });

        layer.close(index);
      }
    );
  });
});
