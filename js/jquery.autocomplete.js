/*
 * Created by prograpper on 2016. 12. 12.
 */
var elementFactory = function (element, e) {
    var img, left, nameBorough, dong, right, innerStr, innerHTML;
    img = "<img src='images/" + e.id + ".jpg' alt='" + e.name + "'>";
    left = "<div class='search-left'>" + img + "</div>";
    nameBorough = "<div class='search-name-borough'>" + e.name + " - " + e.borough + "</div>";
    dong = "<div class='search-dong'>" + e.dong + "</div>";
    right = "<div class='search-right'>" + nameBorough + dong + "</div>";
    innerStr = "<div id='" + e.id + "' class='search-item-inner'>" + left + right + "</div>";
    innerHTML = $.parseHTML(innerStr);
    element.append(innerHTML);
};
$(document).ready(function () {
    var membersSew = members.map(function(obj) {
        var rObj = {};
        rObj["id"] = obj.id;
        rObj["name"] = obj.name;
        rObj["borough"] = obj.borough;
        rObj["dong"] = obj.dong;
        return rObj;
    });
    var returned = $('#search-input').sew({values: membersSew, token: '', elementFactory: elementFactory});
});