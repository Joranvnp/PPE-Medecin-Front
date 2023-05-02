const map = L.map('map').setView([48.824, 2.274], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$.ajax({
  method: "GET",
  url: "https://data.issy.com/api/records/1.0/search/?dataset=medecins-generalistes-et-infirmiers&q=&rows=10000",
  dataType: "json",
})
  .done(function (data, textStatus, jqXHR) {
    for (var i = 0; i < data.records.length; i++) {
      var record = data.records[i];
      var fields = record.fields;
      if (fields.specialite == "MEDECIN GENERALISTE") {
        var marker = L.marker(fields.geolocalisation).addTo(map);
        var popupContent = fields.prenom + " " + fields.nom + "<br>" + fields.adresse + "<br>" + fields.cp + " " + fields.ville + "<br><br><button type='button' class='btn btn-primary prendreRdv' data-recordid='" + record.recordid + "'>Prendre rendez-vous</button>";
        marker.bindPopup(popupContent);
      }
    }

    function getCookie() {
      let name = "token=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }

    console.log(getCookie());

    if(getCookie()) {
      $("#boutonconnecter").addClass("masquer");
      $("#boutonenregistrer").addClass("masquer");
    } else if (!document.cookie) {
      $("#boutondeco").addClass("masquer")
      $("#boutonprofil").addClass("masquer")
      $("#boutondeconnecter").removeClass("masquer");
      $("#boutonenregistrer").removeClass("masquer");
    }

    $(document).on("click", "#boutondeco", function () {
      console.log("on passe");
      document.cookie = "token=; Max-Age=-99999999;";
      window.location.href = "/PPE WEB/index.html";
    });

    $(document).on("click", "button.prendreRdv", function () {
      var recordid = $(this).data("recordid");
      console.log(recordid);

      var contenuDiv = $('#contenu');
      contenuDiv.addClass('masquer');
      var popupDiv = $('#popup');
      popupDiv.addClass('afficher');

      $("#startTime").change(function () {
        // Récupérer la date sélectionnée dans le formulaire
        var selectedDate = new Date($("#startTime").val());
      
        // Définir l'heure de début et de fin de la journée
        var startTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 8, 0, 0);
        var endTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 18, 0, 0);
      
        // Envoyer une requête AJAX pour récupérer les horaires déjà réservés
        $.ajax({
          url: "http://172.19.0.14/MVC/index.php?action=rdv&idMedecin=" + recordid + "&dateRdv=" + selectedDate.toISOString().slice(0, 10),
          type: "GET",
          success: function(response) {
            // Horaires déjà réservés récupérés avec succès
            var reservedSlots = response;
            console.log("Horaires déjà réservés :", reservedSlots);
      
            // Créer un tableau d'horaires disponibles pour la journée
            var timeSlots = [];
            var optionsHtml = "";
            while (startTime < endTime) {
              timeSlots.push(new Date(startTime));
              startTime.setMinutes(startTime.getMinutes() + 20);
            }
      
            // Ajouter chaque horaire disponible au select
            for (var i = 0; i < timeSlots.length; i++) {
              var timeSlot = timeSlots[i];
              var timeString = timeSlot.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit', timeZone: 'Europe/Paris'});
              console.log("Horaire disponible :", timeString);
      
              // Vérifier si l'horaire est réservé
              var isReserved = false;
              for (var j = 0; j < reservedSlots.length; j++) {
                // var reservedSlot = new Date(reservedSlots[j]);
                var reservedSlot = new Date(Date.parse(selectedDate.toISOString().slice(0, 10) + ' ' + reservedSlots[j]));
                // var reservedSlot = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), reservedSlots[j].getHours(), reservedSlots[j].getMinutes());
                if (timeSlot.getHours() === reservedSlot.getHours() && timeSlot.getMinutes() === reservedSlot.getMinutes()) {
                  isReserved = true;
                  break;
                }
              }
      
              // Si l'horaire n'est pas réservé, l'ajouter au select
              if (!isReserved) {
                optionsHtml += "<option value='" + timeSlot.getTime() + "'>" + timeString + "</option>";
              }
            }
      
            // Afficher le select avec les horaires disponibles
            var selectHtml = "<select id='time-slots'>" + optionsHtml + "</select>";
            $("#time-slots-container").html(selectHtml);
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      });      
      
      

      $(document).on("click", "#prendrerdv", function () {
        function getCookie() {
          let name = "token=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
            }
          }
          return "";
        }

        var selectedDate = new Date($("#startTime").val());
        var selectedTime = new Date(parseInt($("#time-slots option:selected").val()));
        selectedTime.setFullYear(selectedDate.getFullYear());
        selectedTime.setMonth(selectedDate.getMonth());
        selectedTime.setDate(selectedDate.getDate());
        var dateTimeString = selectedTime.toISOString().slice(0, 19).replace('T', ' ');

        if(getCookie()) {
          $.ajax({
            method: "POST",
            url: "http://172.19.0.14/MVC/index.php?action=rdv",
            data: JSON.stringify({ dateheure: dateTimeString, token: getCookie(), idMedecin: recordid })
          })
            .done(function (data, textStatus, jqXHR) {
              alert("Réponse reçue avec succès !");
              console.log(data);
              console.log(textStatus);
              console.log(jqXHR);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              // alert("Veuillez vous connecter !");
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            });
        } else {
          // alert("Veuillez vous connecter !");
          window.location.replace("/PPE WEB/login.html");
          alert("Veuillez vous connecter !");
        }
       
      });


      $("#close").click(function () {
        $("#popup").removeClass("afficher");
        $("#contenu").removeClass("masquer");
      });
    });
  });