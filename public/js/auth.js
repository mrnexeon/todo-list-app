var signIn = function(uid) {
    $.post('/auth', { uid: uid }).done(function(result) {
        if (result === 'successful') {
            location.reload();
        } else {
            throwAlert('Ошибка', 'Сервис временно недоступен');
        }
    }).fail(function() {
        throwAlert('Ошибка', 'Не удалось соединиться с сервером');
    });
}

var main = function() {
    /* Initialize Firebase */

    var config = {
        apiKey: "AIzaSyCGUHD64mY2TdzKTDwmb5-MnV2fUOwt7HY",
        authDomain: "planner-1bfbc.firebaseapp.com",
        databaseURL: "https://planner-1bfbc.firebaseio.com",
        projectId: "planner-1bfbc",
        storageBucket: "planner-1bfbc.appspot.com",
        messagingSenderId: "540815566871"
    };

    firebase.initializeApp(config);

    $('button[name="sign-in"]').on('click', function() {
        var provider, isGuest;

        switch($(this).attr('provider')) {
            case 'google':
                provider = new firebase.auth.GoogleAuthProvider();
                break;
            case 'facebook':
                provider = new firebase.auth.FacebookAuthProvider();
                break;
            case 'twitter':
                provider = new firebase.auth.TwitterAuthProvider();
                break;
            case 'guest': {
                isGuest = true;
                break;
            }
        }

        if (!isGuest) {
            firebase.auth().signInWithPopup(provider).then(function(result) {
                signIn(result.user.uid);
            }).catch(function(err) {
                throwAlert('Ошибка', 'Не удалось войти в аккаунт');
            });
        } else {
            var nickname = $('input[name="nickname"]').val();
            if (nickname !== '') {
                signIn(nickname);
            } else {
                $('input[name="nickname"]').focus();
            }
        }
    });
}

$(document).ready(main);