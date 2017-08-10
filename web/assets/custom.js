var toggleFullScreen = function(){

    document.fullScreenElement&&null!==document.fullScreenElement||!document.mozFullScreen&&!document.webkitIsFullScreen?
        document.documentElement.requestFullScreen?document.documentElement.requestFullScreen():
            document.documentElement.mozRequestFullScreen?
                document.documentElement.mozRequestFullScreen():
            document.documentElement.webkitRequestFullScreen&&document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT):
        document.cancelFullScreen?document.cancelFullScreen():document.mozCancelFullScreen?document.mozCancelFullScreen():
        document.webkitCancelFullScreen&&document.webkitCancelFullScreen();
        document.getElementsByClassName("ConWrap")[0].style.height=document.body.scrollHeight-70-70+"px";

};
$(document).ready(function() {
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        monthsFull: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
        monthsShort:  [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
        weekdaysFull: [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
        weekdaysShort: [ '日', '一', '二', '三', '四', '五', '六' ],
        weekdaysLetter:[ '日', '一', '二', '三', '四', '五', '六' ],
        today: '今日',
        clear: '清除',
        close: '关闭',
        firstDay: 1,
        format: 'yyyy 年 mm 月 dd 日',
        formatSubmit: 'yyyy/mm/dd'
    });

    /*jQuery.extend( jQuery.fn.pickatime.defaults, {
     clear: '清除'
     });*/

        // $('.datepicker').pickadate({
        //     onSet: function () {
        //         $('.picker__close').click();
        //     },
        //     selectMonths: false, // Creates a dropdown to control month
        //     selectYears: 0 // Creates a dropdown of 15 years to control year
        // });

    $('select').material_select();
    $('.tooltipped').tooltip();
});