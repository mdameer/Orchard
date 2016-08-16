﻿jQuery.fn.extend({
    insertAtCaret: function (myValue) {
        return this.each(function (i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart === "0") {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});

jQuery.fn.extend({
    tokenized: function () {
        return $(this).each(function () {
            var _this = $(this);

            // Add an icon to tokenized inputs.
            _this.wrap("<span class='token-wrapper'></span>");
            var popup = $("<div><span class='tokenized-popup'>&nbsp;</span></div>");
            _this.parent().prepend(popup);

            // Show the full list of tokens when the icon is clicked.
            popup.children(".tokenized-popup").click(function () {
                var input = $(this).parent().next();
                // Pass empty string as value to search for, displaying all results.
                input.autocomplete("search", "");
                input.focus();
            });

            $(this).autocomplete({
                minLength: 0,
                source: $.tokens,
                select: function (event, ui) {
                    $(this).insertAtCaret(ui.item.value);
                    return false;
                }
            }).each(function () {
                $(this).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var result = item.value === "" ? $("<li class='accategory'></li>") : $("<li></li>");

                    // Place invisible space characters inside long strings to prevent word-wrap to split words.
                    var value = item.value.replace(/\./g, "\.\u200B");
                    var label = item.label.replace(/,/g, ",\u200B");

                    return result
                        .data("ui-autocomplete-item", item)
                        .append("<a><div class='listitemtext aclabelmod'>" + $("<div/>").text(label).html()
                        + "</div><div class='listitemtext acvaluemod'>" + $("<div/>").text(value).html()
                        + "</div><div class='listitemtext acdescmod'>" + $("<div/>").text(item.desc).html() + "</div></a>")
                        .appendTo(ul);
                };
            });
        });
    },
});

jQuery.fn.extend({
    btnTokenized: function () {
        return $(this).each(function () {
            var _this = $(this);

            $(this).each(function () {
                var textbox = $('#' + _this.data('tokens'));
                var btn = $('[data-tokens=\'' + _this.data('tokens') + '\']');
                    //var tokens = ['United States', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia', 'Canada', 'Argentina', 'Armenia'];
                    var cList = $('<ul></ul>');
                    cList.addClass('dropdown-menu pull-right scrollable-menu');
                    $.tokens.forEach(function (item) {
                        var li = document.createElement('li');
                        var anchor = document.createElement('a');
                        var row = document.createElement('div');
                        var col1 = document.createElement('div');
                        var col2 = document.createElement('div');
                        var col3 = document.createElement('div');
                        row.className = "row";
                        col1.className = 'col-xs-12 col-sm-4';
                        col2.className = 'col-xs-12 col-sm-4';
                        col3.className = 'col-xs-12 col-sm-4';
                        col1.textContent = item.label;
                        col2.textContent = item.desc;
                        col3.textContent = item.value == '' ? item.label : item.value;
                        row.appendChild(col1);
                        row.appendChild(col2);
                        row.appendChild(col3);
                        anchor.appendChild(row);
                        anchor.onclick = function () {
                            $('#' + _this.data('tokens')).val(textbox.val() + item.value);
                        };
                        li.appendChild(anchor);
                        cList.append(li);
                    });

                    cList.insertAfter(btn);
            });
        });
    },
});

$(function () {

    $.tokens = {};

    // Provide autocomplete behavior to tokenized inputs.
    // tokensUrl is initialized from the view.
    $.get(tokensUrl, function (data) {
        $.tokens = data;
        $(".tokenized").tokenized();
        $('[data-tokens]').btnTokenized();
    });
});