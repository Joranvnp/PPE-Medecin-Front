$(document).ready(function () {

  var boutonprofil = $("#boutonprofil");

  // Récupérer le popup profil
  var popupprofil = $("#contenuProfil");
  
  // Récupérer le bouton fermer
  // var boutonfermerprofil = $("#closeProfil");
  
  // Cacher le popup par défaut
  // popupprofil.hide();
  
  // Afficher le popup profil lors du clic sur le bouton "Profil"
  boutonprofil.click(function () {
    // popupprofil.show();
  
    var contenuDiv = $('#contenu');
    contenuDiv.addClass('masquer');
    var popupProfil = $('#popupProfil');
    popupProfil.addClass('afficher');
    
    function afficher() {
      var letoken = document.cookie.split("=");
      letoken = letoken[1];
      $.ajax({
        method: "GET",
        url: "http://172.19.0.14/MVC/index.php?action=rdv&token=" + letoken,
      })
        .done(function (response) {
          console.log(response);
          $('#rdv').empty(); // On vide le tableau avant de l'afficher à nouveau
          response.forEach(function (rdv) {
            $('#rdv').append(
              '<tr>' +
              '<td>' + rdv.idMedecin + '</td>' +
              '<td>' + rdv.dateHeureRdv + '</td>' +
              '<td><button class="supprimer" data-id="' + rdv.idRdv + '">Supprimer</button></td>' +
              '<td><button class="modifier" data-id="' + rdv.idRdv + '">Modifier</button></td>' +
              '</tr>'
            )
  
          })
        });
    }
    afficher();
    $(document).on("click", ".supprimer", function () {
      var id = $(this).data('id');
      $.ajax({
        method: "DELETE",
        url: "http://172.19.0.14/MVC/index.php?action=rdv",
        data: JSON.stringify({ id: id })
      })
        .done(function (response) {
          alert("Le rdv a été supprimé avec succès !");
          $('#rdv').empty();
          afficher();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          alert("Erreur lors de la suppression du rdv !");
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        });
    });
    $(document).on("click", ".modifier", function () {
      var id = $(this).data('id');
  
      var dateHeure = $(this).closest('tr').find('td:eq(1)').text();
  
      $(this).closest('tr').find('td:eq(1)').html('<input type="text" id="date" value="' + dateHeure + '">');
  
  
      $(this).closest('tr').find('td:eq(3)').html('<button class="confirmer" data-id="' + id + '">Confirmer</button>' + '<button class="annuler">Annuler</button>');
  
      // On désactive les autres boutons "modifier"
      $('.modifier').not(this).prop('disabled', true);
  
      $(this).closest('tr').addClass('edit-mode');
    });
  
    $(document).on("click", ".annuler", function () {
      $('.modifier').prop('disabled', false);
      $('#rdv').empty();
      afficher();
    });
  
  
    $(document).on("click", ".confirmer", function () {
      $('.modifier').prop('disabled', false);
      var id = $(this).data('id');
  
      $.ajax({
        method: "PUT",
        url: "http://172.19.0.14/MVC/index.php?action=rdv",
        data: JSON.stringify({ id: id, date: $('#date').val() })
      })
        .done(function (response) {
          alert("Le rdv a été modifié avec succès !");
          $('#rdv').empty();
  
          afficher();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          alert("Erreur lors de la modification du rdv !");
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        });
    });

  });

  $("#closeProfil").click(function () {
    $("#popup").removeClass("afficher");
    $("#contenu").removeClass("masquer");
    popupprofil.hide();
    return false;
  });
});
