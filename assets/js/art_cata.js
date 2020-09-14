$(function () {
    var layer = layui.layer
    var form = layui.form
    initArt()
    //获取文章分类列表
    function initArt() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tlp-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加类别绑定事件
    var indexAdd = null
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog').html()
        });
    })

    //通过代理为form-add绑定点击事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败')
                }
                initArt()
                layer.msg('添加文章分类成功')
                layer.close(indexAdd)
            }
        })
    })

    //通过代理方式为btn-enit绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {

        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })


    })
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArt()
            }
        })
    })

    $('tbody').on('click', '.btn-delate', function () {
        var id = $(this).attr('data-id')
        layer.confirm('确定要删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArt()
                }
            })


        });
    })
})