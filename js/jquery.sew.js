/**
 * jQuery plugin for getting position of cursor in textarea
 * @license under dfyw (do the fuck you want)
 * @author leChantaux (@leChantaux)
 */
/**
 * Edited by prograpper on 16. 9. 20.
 */

(function ($, window, undefined) {

    var elementFactory = function (element, value) {
        element.text(value.val);
    };

    var isAfterBlur = false;

    var pluginName = 'sew',
        defaults = {
            token: '@',
            elementFactory: elementFactory,
            values: [],
            unique: false,
            repeat: true
        };

    function Plugin(element, options) {

        this.element = element;
        this.$element = $(element);
        this.$itemList = $("#search-item-prompt");

        this.options = $.extend({}, defaults, options); // $.extend로 default 객체에 options 내용을 추가한다.
        this.reset();

        this._defaults = defaults;
        this._name = pluginName; // 이름은 sew

        this.expression = new RegExp('(^|\\b|\\s)' + this.options.token + '([\\w.]*)$');
        this.cleanupHandle = null;

        this.init();
    }

    Plugin.SEARCH_ITEM_TEMPLATE = "<li class='search-item'></li>";
    Plugin.KEYS = [40, 38, 13, 27, 9];

    Plugin.prototype.init = function () {
        if(this.options.values.length < 1) return;

        this.$element
            .bind('keyup', $.proxy(this.onKeyUp, this))
            .bind('keydown', $.proxy(this.onKeyDown, this))
            .bind('focus', $.proxy(this.renderElements, this, this.options.values))
            .bind('blur', $.proxy(this.remove, this));
    };

    Plugin.prototype.reset = function () {
        if(this.options.unique) {
            this.options.values = Plugin.getUniqueElements(this.options.values);
        }

        this.index = 0;
        this.matched = false;
        this.dontFilter = false;
        this.lastFilter = undefined;
        this.filtered = this.options.values.slice(0);
    };

    Plugin.prototype.next = function () {
        this.index = (this.index + 1) % this.filtered.length;
        this.hightlightItem();
    };

    Plugin.prototype.prev = function () {
        this.index = (this.index + this.filtered.length - 1) % this.filtered.length;
        this.hightlightItem();
    };

    Plugin.prototype.select = function () {
        if (this.filtered[this.index]) {
            this.replace(this.filtered[this.index].id);
            this.$element.trigger('mention-selected', this.filtered[this.index]);
            this.hideList();

            // prompt 닫아주기
            $("#search-item-prompt").css("display", "none");

            // user-profile로 이동
            moveToUserProfile(this.filtered[this.index].id);
        }
    };

    Plugin.prototype.remove = function () {
        //$("#search-item-prompt").css("display", "none");
        isAfterBlur = true;
    };

    Plugin.prototype.replace = function (replacement) {
    };

    Plugin.prototype.hightlightItem = function () {
        this.$itemList.find(".search-item").removeClass("selected");
        var container = this.$itemList.find(".search-item").parent();
        var element = this.filtered[this.index].element.addClass("selected");
    };

    Plugin.prototype.renderElements = function (values) {
        $("#search-item-prompt").css("display", "block");
        var self = this;
        if (isAfterBlur === true) {
            isAfterBlur = false;
            return;
        }

        var container = this.$itemList.find('ul').empty();
        values.forEach($.proxy(function (e, i) {
            var $item = $(Plugin.SEARCH_ITEM_TEMPLATE);
            this.options.elementFactory($item, e);
            e.element = $item.appendTo(container).bind('mousedown', $.proxy(this.onItemClick, this, e)).bind('mouseover', $.proxy(this.onItemHover, this, i));

        }, this));

        this.index = 0;
        this.hightlightItem();
    };

    Plugin.prototype.displayList = function () {
        if(!this.filtered.length) return;

        this.$itemList.show();
        var element = this.$element;
        var offset = this.$element.offset();
        var pos = element.getCaretPosition();

        this.$itemList.css({
            left: offset.left + pos.left - 10,
            top: offset.top + pos.top + 3
        });
    };

    Plugin.prototype.moveList = function (left, top) {
        this.$itemList.css({
            left: left,
            top: top
        });
    };

    Plugin.prototype.hideList = function () {
    };

    Plugin.prototype.filterList = function (val) {
        if(val == this.lastFilter) return;
        this.lastFilter = val;

        this.$itemList.find(".search-item").remove();
        var values = this.options.values;
        var vals = this.filtered = values.filter($.proxy(function (e) {
            var pattern = new RegExp("(?:^|\\s)"+ this.getText(), "gi");
            if (pattern.test(e.name) || pattern.test(e.borough) || pattern.test(e.dong) ) {
                return true;
            } else {
                return false;
            }
        }, this));

        if(vals.length) {
            this.renderElements(vals);
            this.$itemList.show();
        } else {
            this.hideList();
        }
    };

    Plugin.getUniqueElements = function (elements) {
    };

    Plugin.prototype.getText = function () {
        return(this.$element.val() || this.$element.text());
    };

    Plugin.prototype.setText = function (text) {
        if(this.$element.is('input,textarea')) {
            this.$element.val(text);
        } else {
            this.$element.html(text);
        }
    };

    Plugin.prototype.onKeyUp = function (e) {
        var startpos = this.$element.getCursorPosition();
        var val = this.getText().substring(0, startpos);
        var matches = val;//val.match(this.expression);

        if(!matches && this.matched) {
            this.matched = false;
            this.dontFilter = false;
        }

        if(matches && !this.matched) {
            this.lastFilter = "\n";
            this.matched = true;
        }

        if(!this.dontFilter) {
            this.filterList(matches);
        }
    };

    Plugin.prototype.onKeyDown = function (e) {
        var listVisible = this.$itemList.is(":visible");
        if(!listVisible || (Plugin.KEYS.indexOf(e.keyCode) < 0)) return;

        switch(e.keyCode) {
            case 9:
            case 13:
                this.select();
                break;
            case 40:
                this.next();
                break;
            case 38:
                this.prev();
                break;
            case 27:
                break;
        }
        e.preventDefault();
    };

    Plugin.prototype.onItemClick = function (element, e) {
        if(this.cleanupHandle) window.clearTimeout(this.cleanupHandle);

        this.replace(element.id);
        this.$element.trigger('mention-selected',this.filtered[this.index]);
        this.hideList();
        // prompt 닫아주기
        $("#search-item-prompt").css("display", "none");
        // 내용 세팅하기
        moveToUserProfile(element.id);
    };

    Plugin.prototype.onItemHover = function (index, e) {
         this.index = index;
         this.$itemList.find(".search-item").removeClass("selected");
         var container = this.$itemList.find(".search-item").parent();
         var element = this.filtered[this.index].element.addClass("selected");
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if(!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            } else {
            }
        });
    };
}(jQuery, window));