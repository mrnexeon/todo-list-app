var throwAlert = function(type, msg) {
    var $alertBox = $('<div>').addClass('alert');
    $('<b>').text(type).appendTo($alertBox);
    $('<span>').text(msg).appendTo($alertBox);
    $('#alerts').prepend($alertBox);
    $alertBox.hide().fadeIn().delay(5000).fadeOut();
};
