// 의원 정보 출력
var moveToUserProfile = function (id) {
    var member = members[id]; // 의원 정보 가져오기.
    $("#user-profile-empty-block").css("display", "none");
    $("#user-profile").attr("data-id", "" + id); // 국회의원 아이디 지정

    $("#user-photo").attr("src", "images/" + id + ".jpg"); // 사진
    $("#user-photo").attr("alt", member.name);
    $("#user-photo").attr("title", member.name);

    $("#user-name").text(member.name); // 이름

    $("#user-party-borough").text(parties[member.party] + " - " + member.borough); // 당 - 지역구
    if (member.place === "") {
        $("#user-place").css("display", "none");
    } else { // 의원회관
        $("#user-place span").text(member.place);
        $("#user-place").css("display", "block");
    }
    if (member.phone === "") {
        $("#user-phone").css("display", "none");
    } else { // 전화번호
        $("#user-phone span").text(member.phone);
        $("#user-phone").css("display", "block");
    }
    if (member.email === "") {
        $("#link-user-email").css("display", "none");
    } else { // 이메일
        $("#link-user-email").css("display", "block");
        $("#link-user-email").attr("href", "mailto:" + member.email);
        $("#user-email span").text(member.email);
    }
    if (member.blog === "") {
        $("#link-user-blog").css("display", "none");
    } else { // 블로그
        $("#link-user-blog").css("display", "block");
        $("#link-user-blog").attr("href", "http://" + member.blog);
        $("#user-blog span").text(member.blog);
    }
    if (member.twitter === "") {
        $("#link-user-twitter").css("display", "none");
    } else { // 트위터
        $("#link-user-twitter").css("display", "block");
        $("#link-user-twitter").attr("href", "https://" + member.twitter);
        $("#user-twitter span").text(member.twitter);
    }
    if (member.facebook === "") {
        $("#link-user-facebook").css("display", "none");
    } else { // 페이스북
        $("#link-user-facebook").css("display", "block");
        $("#link-user-facebook").attr("href", "https://" + member.facebook);
        $("#user-facebook span").text(member.facebook);
    }
    $("#user-account span").text(""); // 계좌

    $("#user-schedule-title").text(member.name + "님의 일정"); // 일정 제목 변경

    console.log("\n\nid : " + id + ", member : ");
    console.dir(member);
    $("#user-profile").css("display", "block");
    $("#user-schedule").css("display", "block");

    $("#user-profile").ScrollTo(); // '국회의원 프로필' 로 이동.

    $("#user-schedule-calendar").calendar({userId: id}); // [NIM2] 국회의원 일정 가져오기.
};

// 모바일 메뉴 show/hide
var toggleMobileMenu = function () {
    if ($("#mobile-menu").is(":animated") === false) {
        if ($("#mobile-menu").css("right") === "0px") {
            $("#mobile-menu").animate({right: "-=240px"}, "slow", function () {
                $("#mobile-menu").css("display", "none");
            });
        } else {
            $("#mobile-menu").css("display", "block");
            $("#mobile-menu").animate({right: "+=240px"}, "slow", function () {});
        }
    }
};

$(document).ready(function() {
    // 모바일 메뉴 토글 버튼 클릭 시
    $("#menu").on("click", "#menu-btn-mobile", function (e) {
        e.preventDefault();
        toggleMobileMenu();
    });

    // 최상단 '의원 찾고 응원하기' 버튼 클릭 시
    $("#btn-scrollto-search").on("click", function (e) {
        e.preventDefault();
        $("#search-title").ScrollTo(); // 하단 검색창 '의원찾고 응원하기' 로 이동.
    });

    // 응원 현황에서 '국회의원 보기' 버튼 클릭 시
    $(".btn-user").on("click", function (e) {
        e.preventDefault();
        var id = parseInt($(e.currentTarget).parent().attr("data-id"));
        moveToUserProfile(id); // 하단 '국회의원 프로필' 로 이동.
    });

    // 최하단 국회의원 법안 발의 내용 링크의 'X' 버튼 클릭 시
    $("#bottom-fixed").on("click", "#bottom-fixed-close", function (e) {
        e.preventDefault();
        console.log("bottom-fixed clicked..");
        $("#bottom-fixed").css("display", "none");
    });

    // 메뉴 클릭 시
    $(".btn-scrolls").on("click", function (e) {
        e.preventDefault();
        var id = $(e.currentTarget).attr("id");
        if (id === "menu-message-rank-desktop" || id === "menu-message-rank-mobile") {
            $("#nim-zzang-title").ScrollTo(); // '응원 순위 - 님짱' 으로 이동.
        } else if (id === "menu-search-send-message-desktop" || id === "menu-search-send-message-mobile") {
            $("#search-title").ScrollTo(); // '의원찾고 응원하기' 로 이동.
        } else if (id === "menu-user-messages-desktop" || id === "menu-user-messages-mobile") {
            $("#user-messages-title").ScrollTo(); // '전체 응원 현황' 으로 이동.
        }

        if ( // 모바일 전용 버튼 클릭 시 모바일 전용 메뉴 닫기
            id === "menu-message-rank-mobile" ||
            id === "menu-search-send-message-mobile" ||
            id === "menu-user-messages-mobile"
        ) {
            toggleMobileMenu();
        }
    });

    // active menu
    $(".body-inner-main").scroll(function() {
        //console.log("nimZzang : " + nimZzang + ", search : " + search + ", userMessages : " + userMessages);
        $(".menu-item").removeClass("selected");
        // scroll bottom에 존재 시, 전체 응원 현환 선택.
        if ($(".body-inner-main")[0].scrollHeight === ($(".body-inner-main").scrollTop() + $(window).height())) {
            // 전체 응원 현황
            $("#menu-user-messages-desktop").addClass("selected");
            $("#menu-user-messages-mobile").addClass("selected");
            return;
        }
        // 60보다 작은 것 중에 가장 큰거로 선택.
        var currentIndex = 0, currentValue = $("#nim-zzang-title").offset().top;
        if (currentValue >= 60) {
            currentIndex = -1;
        }
        var offsetTop = [$("#search-title").offset().top, $("#user-messages-title").offset().top];
        for (var i = 0; i < offsetTop.length; i++) {
            if (offsetTop[i] < 60) {
                if (currentIndex === -1) {
                    currentIndex = i + 1;
                    currentValue = offsetTop[i];
                } else {
                    if (currentValue < offsetTop[i]) {
                        currentIndex = i + 1;
                        currentValue = offsetTop[i];
                    }
                }
            }
        }
        if (currentIndex === 0) {
            // 응원 순위 - 님짱
            $("#menu-message-rank-desktop").addClass("selected");
            $("#menu-message-rank-mobile").addClass("selected");
        } else if (currentIndex === 1) {
            // 의원찾고 응원하기
            $("#menu-search-send-message-desktop").addClass("selected");
            $("#menu-search-send-message-mobile").addClass("selected");
        } else if (currentIndex === 2) {
            // 전체 응원 현황
            $("#menu-user-messages-desktop").addClass("selected");
            $("#menu-user-messages-mobile").addClass("selected");
        }
    });
    $(document).on("click", ".preparing-service", function (e) {
        e.preventDefault();
        alert("서비스 준비중입니다.");
        return false;
    });
});