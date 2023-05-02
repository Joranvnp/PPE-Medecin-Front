$("#enregistrer").click(function (event) {
    var prenom = $("input[name=prenom]").val();
    var nom = $("input[name=nom]").val();
    var adresse = $("input[name=adresse]").val();
    var codepostal = $("input[name=codepostal]").val();
    var ville = $("input[name=ville]").val();
    var telephone = $("input[name=telephone]").val();
    var login = $("input[name=login]").val();
    var password = $("input[name=password]").val();
    var password2 = $("input[name=password2]").val();
  
    $.ajax({
        method: "POST",
        url: "http://172.19.0.14/MVC/index.php?action=patient",
        data: JSON.stringify({
            nom: nom,
            prenom: prenom,
            rue: adresse,
            cp: codepostal,
            ville: ville,
            tel: telephone,
            login: login,
            mdp: password
        })
    })
        .done(function (data, textStatus, jqXHR) {
            alert("Connecté avec succès !");

            var token = data.token;
            document.cookie = "token=" + token;

            window.location.replace("/PPE WEB/index.html");

            console.log(data);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            alert("Erreur !");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        });
  
    event.preventDefault();
  
  });
  