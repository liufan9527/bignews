$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor()
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎渲染下拉菜单
                var htmlStr = template('tel-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //为选择文件按钮绑定点击事件
    $('#btnChoose').on('click', function () {
        //隐藏表单模拟人的点击事件
        $('#topBtn').click()

    })

    //监听隐藏表单的change事件
    $('#topBtn').on('change', function (e) {
        //获取文件列表数组
        var files = e.target.files
        //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    //默认状态为已发布
    var art_state = '已发布'
    //为发布按钮绑定点击事件
    $('#fabuBtn').on('click', function () {
        art_state = '草稿'
    })

    //为总表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        //基于表单快速创建一个Formdata对象
        var fd = new FormData($(this)[0])
        //往fd中添加state属性
        fd.append('state', art_state)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publish(fd)
            })
        //定义发布方法
        function publish(fd) {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                //以FormData方式发起请求，必写下两项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布新文章失败')
                    }
                    layer.msg('发布新文章成功')
                    //成功后跳转到文章列表页面
                    location.href = '/article/art.list.html'
                }
            })

        }

    })

})