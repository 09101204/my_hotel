layui.define(['layer','element', 'fortree'], function(exports) {
    var layer      = layui.layer;
    var element    = layui.element();
    var fortree    = layui.fortree;
    var $          = layui.jquery;

    var nav        = null;
    var tab        = null;
    var tabcontent = null;
    var tabtitle   = null;
    var navfilter  = null;
    var tabfilter  = null;

    /**
     * ��ӵ���
     */
    function addNav(data, topid, idname, pidname, nodename, urlname) {
        topid    = topid    || 0;
        idname   = idname   || 'id';
        pidname  = pidname  || 'pid';
        nodename = nodename || 'node';
        urlname  = urlname  || 'url';

        var mytree = new fortree(data, idname, pidname, topid);
        var html = '';

        mytree.forBefore = function (v, k, hasChildren) {
            html += '<li class="layui-nav-item">';
        };

        mytree.forcurr = function(v, k, hasChildren) {
            html += '<a href="javascript:;"'+(v[urlname] ? ' data-url="'+v[urlname]+'" data-id="'+v[idname]+'"' : '')+'>';
            html += v[nodename];
            html += '</a>';
        };

        mytree.callBefore = function (v, k) {
            html += '<ul class="layui-nav-child">';
        };

        mytree.callAfter = function (v, k) {
            html += '</ul>';
        };

        mytree.forAfter = function (v, k, hasChildren) {
            html += '</li>';
        };

        mytree.each();

        nav.append(html);

        element.init('nav('+navfilter+')');
    }

    /**
     * ��������붥���л������а�
     */
    function bind(height) {
        var height = height || 60 + 41 + 44; //ͷ���߶� �����л�������߶� �ײ��߶�
        /**
         * iframe����Ӧ
         */
        $(window).resize(function() {
            //���ö����л���������
            tabcontent.height($(this).height() - height);
            //���ö����л���������ÿ��iframe�߶�
            tabcontent.find('iframe').each(function () {
                $(this).height(tabcontent.height());
            });
        }).resize();

        /**
         * �����������������¼�
         */
        element.on('nav('+navfilter+')', function(elem) {
            var a        = elem.children('a');
            var title    = a.text();
            var src      = elem.children('a').attr('data-url');
            var id       = elem.children('a').attr('data-id');
            var iframe   = tabcontent.find('iframe[data-id='+id+']').eq(0);
            var tabindex = tabtitle.children('li').length;

            if(src != undefined && src != null && id != undefined && id != null) {
                if(iframe.length) { //���� iframe
                    //��ȡiframe���ϵ�tab index
                    tabindex = iframe.attr('data-tabindex');
                }else{ //������ iframe
                    //��ʾ���ز�
                    var tmpIndex = layer.load();
                    //����1����ٴιر�loading
                    setTimeout(function() {
                        layer.close(tmpIndex);
                    }, 1000);
                    //ƴ��iframe
                    var iframe = '<iframe onload="layui.layer.close('+tmpIndex+')"';
                    iframe += ' src="'+src+'" data-id="'+id+'" data-tabindex="'+tabindex+'"';
                    iframe += ' style="width: 100%; height: '+tabcontent.height()+'px; border: 0px;"';
                    iframe += '></iframe>';
                    //�����л�������һ����Ƭ
                    element.tabAdd(tabfilter, {title: title, content: iframe});
                }

                //�л���ָ�������Ŀ�Ƭ
                element.tabChange(tabfilter, tabindex);

                //���ص�һ���л�����ɾ����ť
                tabtitle.find('li').eq(0).find('i').hide();
            }
        });
    }

    /**
     * �������������������ĳ��li
     */
    function clickLI(index) {
        nav.find('li').eq(index || 0).click();
    }

    /**
     * �����ӿ�
     */
    exports('hotel', function(navLayFilter, tabLayFilter) {
        navfilter  = navLayFilter;
        tabfilter  = tabLayFilter;

        nav        = $('.layui-nav[lay-filter='+navfilter+']').eq(0);
        tab        = $('.layui-tab[lay-filter='+tabfilter+']').eq(0);
        tabcontent = tab.children('.layui-tab-content').eq(0);
        tabtitle   = tab.children('.layui-tab-title').eq(0);

        var error = '';
        if(nav.length == 0) {
            error += 'û���ҵ�������<br>';
        }

        if(tab.length == 0) {
            error += 'û���ҵ��л���<br>';
        }

        if(error) {
            layer.msg('hotelģ���ʼ��ʧ�ܣ�<br>' + error);
            return false;
        }

        return {addNav: addNav, bind: bind, clickLI: clickLI};
    });
});