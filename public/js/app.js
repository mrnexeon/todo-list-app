var main = function() {
    /* Do or Undo the task */

    $('ul').on('click', 'li', function() {
        var $task = $(this);

        $.post('/task/do', {"text": $task.children('span').text(), done: !$task.hasClass('done')}).done(function(result) {
            if (result === 'successful') {
                $task.toggleClass('done');
            } else {
                throwAlert('Ошибка', 'Сервис временно недоступен');
            }
        }).fail(function() {
            throwAlert('Ошибка', 'Не удалось соединиться с сервером');
        });
    });

    /* Remove the task */

    $('ul').on('click', 'button[name="remove"]', function() {
        var $task = $(this).parent();

        $.post('/task/remove', { "text": $task.children('span').text() }).done(function(result) {
            if (result === 'successful') {
                $task.remove();
            } else {
                throwAlert('Ошибка', 'Сервис временно недоступен');
            }
        }).fail(function() {
            throwAlert('Ошибка', 'Не удалось соединиться с сервером');
        })
    });

    /* Add a new task */

    $('button[name="add"]').on('click', function() {
        var text = $('input').val();

        if (text !== '') {
            $.post('/task/add', { "text": text }).done(function(result) {
                if (result === 'successful') {
                    $('<li>')
                        .append('<span>' + text + '</span>')
                        .append('<button name="remove"><i class="material-icons">close</i></button>')
                        .appendTo('ul');
                    $('input').val('');
                } else {
                    throwAlert('Ошибка', 'Сервис временно недоступен');
                }
            }).fail(function() {
                throwAlert('Ошибка', 'Не удалось соединиться с сервером');
            });
        } else {
            $('input').focus();
        }
    });

    /* Logout */
 
    $('button[name="logout"]').on('click', function() {
        $.post('/logout').done(function() {
            location.reload();
        }).fail( function() {
            throwAlert('Ошибка', 'Не удалось соединиться с сервером');
        });
    });
};

$(document).ready(main);