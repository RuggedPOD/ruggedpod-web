/*
 * RuggedPOD management web console
 *
 * Copyright (C) 2015 Guillaume Giamarchi <guillaume.giamarchi@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

define(['notification'], function (notification) {

    function checkInputValues(condition, message, idList) {
        if (condition) {
            notification.showInfo(message);

            var taskId = setInterval(function(){
                for (var i = 0 ; i < idList.length ; i++) {
                    $("#" + idList[i]).toggleClass("error-input");
                }
            },200);

            setTimeout(function() {
                for (var i = 0 ; i < idList.length ; i++) {
                    window.clearInterval(taskId);
                    $("#" + idList[i]).removeClass("error-input");
                    $("#" + idList[0]).select();
                }
            }, 1000);

            return true;
        }
        return false;
    }

    function rawInput(id) {
        return $("#" + id).val();
    }

    function input(id) {
        return rawInput(id).trim();
    }

    function setupSubmitButton(submitButtonId) {
        var setupEnterKeyHandler = function(field, submitButtonId) {
            field.keyup(function(event) {
                if (event.which === 13) {
                    submitButton = $("#" + submitButtonId);
                    submitButton.focus();
                    submitButton.click();
                }
            });
        };

        fields = $('input[type=text], input[type=password]');

        for (var i = 0 ; i < fields.length ; i++) {
            field = $("#" + fields[i].id);
            if (i === 0) {
                field.focus();
            }
            setupEnterKeyHandler(field, submitButtonId);
        }
    }

    return {
        checkInputValues: checkInputValues,
        input: input,
        rawInput: rawInput,
        setupSubmitButton: setupSubmitButton
    };

});
