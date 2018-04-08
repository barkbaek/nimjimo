/*
 * @author prograpper
 * Created on 2017. 01. 12.
 */
(function ( $ ) {

    var methods = {
        /**
         * Create calendar.
         * @param {Object} e - Calendar html element.
         * @param {number} userId - user's id.
         * */
        init: function (e, userId) {
            console.log("init - e : " + typeof e);
            console.log("init - userId : " + typeof userId);
            var ul, li, temp, div;
            e.empty();

            // 달력 배경 이미지 변경하기
            // e.css("background-image", "url('/images/" + userId + ".jpg')");
            if (userId % 2 === 0) {
                e.css("background-image", "url('http://www.lpmbohemia.com/wp-content/uploads/2013/01/full-width-long-barn-2.jpg')");
            } else {
                e.css('background-image', "url('http://www.lpmbohemia.com/wp-content/uploads/2013/01/full-width-long-barn-3.jpg')");
            }

            e.attr("data-id", userId + "");
            e.append($.parseHTML("<div class='calendar-top'><select class='calendar-year' onchange='calendarChange(this)'></select><select class='calendar-month' onchange='calendarChange(this)'></select></div>"));

            li = "<li class='label-week'><div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div></li>";

            for (var x = 1; x < 7; x++) {
                div = "";
                for (var y = 0; y < 7; y++) {
                    div = div + "<div class='weekday-" + y + "' onclick='calendarClick(this)'></div>";
                }
                temp = "<li class='week week-" + x + "'>" + div + "</li>";
                li = li + temp;
            }
            ul = "<ul>" + li + "</ul>";
            e.append($.parseHTML(ul));
        }
    };

    /**
     * Initialize calendar with options.
     * @param {Object} options - The calendar options.
     * @param {number} options.startYear - The start year of calendar.
     * @param {number} options.endYear - The end year of calendar.
     * @param {number} options.selectedYear - The selected year of calendar.
     * @param {number} options.selectedMonth - The selected month of calendar.
     * @param {string} options.userId - The selected user's id.
     * */
    $.fn.calendar = function( options ) {

        var date, first, last, day, cur, week, innerStr, innerHTML;
        if (!options["selectedYear"] && !options["selectedMonth"]) {
            date = new Date();
        } else {
            date = new Date(options["selectedYear"], options["selectedMonth"], 1);
        }
        if (!options["startYear"]) {options["startYear"] = 2010;}
        if (!options["endYear"]) { options["endYear"] = new Date().getFullYear();}

        options["months"] = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        options["days"] = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        options["id"] = "#" + this[0]["id"];

        methods["init"](this, options["userId"]);

        for (var y = options["endYear"]; y >= options["startYear"]; y--) {
            if (y === date.getFullYear()) {
                innerStr = "<option selected='selected' value='" + y + "'>" + y  + "년</option>";
            } else {
                innerStr = "<option value='" + y + "'>" + y  + "년</option>";
            }
            innerHTML = $.parseHTML(innerStr);
            $(options["id"] + " .calendar-year").append(innerHTML);
        }

        for (var i = 0; i < options["months"].length; i++) {
            if (i === date.getMonth()) {
                innerStr = "<option selected='selected' value='" + i + "'>" +  options["months"][i] + "</option>";
            } else {
                innerStr = "<option value='" + i + "'>" + options["months"][i]  + "</option>";
            }
            innerHTML = $.parseHTML(innerStr);
            $(options["id"] + " .calendar-month").append(innerHTML);
        }

        first = new Date(date.getFullYear(), date.getMonth(), 1);
        last = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // fake_data 로 테스트 1
        var schedulePerMonth;
        if ( fake_data && fake_data[options["userId"]] && fake_data[options["userId"]][first.getFullYear()] && fake_data[options["userId"]][first.getFullYear()][first.getMonth()]) {
          schedulePerMonth = fake_data[options["userId"]][first.getFullYear()][first.getMonth()];
        }

        for (var day = first.getDay(), date = first.getDate(); day < first.getDay() + 7; day++, date++) { // 일주일 반복..
            cur = date;
            if (day > 6) { // 둘째 줄부터 채움
                week = 2;
            } else { // 첫째 줄부터 채움
                week = 1;
            }
            while (cur <= last.getDate()) {
                $(options["id"] + " .week-" + week +" .weekday-" + (day % 7)).text(cur);
                $(options["id"] + " .week-" + week +" .weekday-" + (day % 7)).addClass("useable");

                // fake_data 로 테스트 2 (fake_data에 사용자 일정 존재 시, checked 클래스 추가하기(초록색 박스로 표시))
                if (schedulePerMonth && (schedulePerMonth[cur] === true)) {
                    $(options["id"] + " .week-" + week +" .weekday-" + (day % 7)).addClass("checked");
                }
                cur = cur + 7;
                week = week + 1;
            }
        }
        // 데이터 가져와서 뿌리기
        if (!options["selectedYear"] && !options["selectedMonth"]) {
            // 오늘 기준으로 데이터 15일치 가져오기.
            console.log("오늘 기준으로 데이터 15일치 가져오기\n");
        } else {
            console.log("선택된 년도, 월의 마지막 일 기준으로 데이터 15일치 가져오기\n");
        }
    };
}( jQuery ));

// 달력의 년도, 월 변경 시
function calendarChange(e) {
    var id = "#" + $(e).parent().parent().attr('id');
    var userId = parseInt($(e).parent().parent().attr('data-id'));
    var selectedYear = parseInt($(id + " .calendar-year option:selected").val());
    var selectedMonth = parseInt($(id + " .calendar-month option:selected").val());

    $(id).calendar({
        userId: userId,
        selectedYear: selectedYear,
        selectedMonth: selectedMonth
    });
}

// 달력의 특정 날짜 클릭 시
function calendarClick(e) {
    var id = "#" + $(e).parent().parent().parent().attr('id');
    var userId = parseInt($(e).parent().parent().parent().attr('data-id'));
    var selectedYear = parseInt($(id + " .calendar-year option:selected").val());
    var selectedMonth = parseInt($(id + " .calendar-month option:selected").val());
    var selectedDay = parseInt($(e).text());

    if (isFinite(selectedDay)) {
        // 데이터 가져와서 뿌리기.
        if ($(e).hasClass('checked')) {
            // 클릭한 날짜에 해당 국회의원 일정 존재
            console.log("year : " + selectedYear + " month : " + selectedMonth + " day : " + selectedDay + ". userId : " + userId + ". 해당 국회의원 일정 존재. 데이터 15일치 가져오기.\n");
        } else {
            // 클릭한 날짜에 해당 국회의원 일정 존재하지 않음. (특정 날짜 일정공유 요청 기능 추가 시 사용하기)
            console.log("year : " + selectedYear + " month : " + selectedMonth + " day : " + selectedDay + ". userId : " + userId + ". 해당 국회의원 일정 존재하지 않음. 데이터 15일치 가져오기. (특정 날짜 일정공유 요청 기능 추가 시 사용하기)\n");
        }
    }
}


// 가짜 달력 일정 데이터 테스트용 - 2016년, 2017년만
var fake_data = {};
for (var fd = 0; fd < 300; fd++) {
    fake_data[fd] = {};
    fake_data[fd][2016] = {};
    for (var m1 = 0; m1 < 12; m1++) {
        fake_data[fd][2016][m1] = {};
        for (var r = 0; r < 10; r++) {
            fake_data[fd][2016][m1][Math.floor((Math.random() * 28) + 1)] = true;
        }
    }
    fake_data[fd][2017] = {};
    for (var m2 = 0; m2 < 12; m2++) {
        fake_data[fd][2017][m2] = {};
        for (var r = 0; r < 10; r++) {
            fake_data[fd][2017][m2][Math.floor((Math.random() * 28) + 1)] = true;
        }
    }
};