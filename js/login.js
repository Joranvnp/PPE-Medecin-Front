$("#connecter").click(function (event) {
  var login = $("input[name=login]").val();
  var password = $("input[name=password]").val();

  console.log(login);
  console.log(password);

  $.ajax({
    method: "POST",
    url: "http://172.19.0.14/MVC/index.php?action=connexion",
    data: JSON.stringify({
      login: login,
      mdp: password
    })
  })
  .done(function (data, textStatus, jqXHR) {
    alert("Connecté avec succès !");

    var token = data.token;
    document.cookie = "token=" + token; 

    if(token)
    {
      $("#bouton").addClass("masquer");
    } else {
      $("bouton").removeClass("masquer");
    }

    $("#bouton").addClass("masquer");
    // if(token) {
    //   document.cookie = "token=" + token; 
    // } else {
    //   console.log("test token ne marche pas");
    // }

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
