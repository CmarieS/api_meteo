var CLEFAPI = 'f2d186789cc5087dd59f9d20c91580b1';

var tabJourenOrdre = function () {
    const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    let ajd = new Date();
    let options = { weekday: 'long' };
    let jourActuel = ajd.toLocaleDateString('fr-FR', options);
    jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);
    var tabJour = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));

    return tabJour;
}
var callbackSecondSuccess = function (data) {

    var tempPourH = document.querySelectorAll('.heure-prevision-valeur');
    var tempJoursDiv = document.querySelectorAll('.jour-prevision-temp');
    var imgIcone = document.querySelector('.logo-meteo');

    // temp pour 3h
    for (let j = 0; j < tempPourH.length; j++) {
        tempPourH[j].innerText = `${Math.trunc(data.hourly[j * 3].temp)}°`
    }
    // Temps par jour
    for (let m = 0; m < 7; m++) {
        tempJoursDiv[m].innerText = `${Math.trunc(data.daily[m + 1].temp.day)}°`
    }

    let heureActuelle = new Date().getHours();
    
    // Icone dynamique 
    if (heureActuelle >= 6 && heureActuelle < 21) {
        imgIcone.src = `ressources/jour/${data.current.weather[0].icon}.svg`
    } else {
        imgIcone.src = `ressources/nuit/${data.current.weather[0].icon}.svg`
    }
    console.log(imgIcone.src);
}

var callbackFirstSuccess = function(data){

    var temps = document.querySelector('.temps');
    var temperature = document.querySelector('.temperature');
    var localisation = document.querySelector('.localisation');
    var heure = document.querySelectorAll('.heure-nom-prevision');
    var joursDiv = document.querySelectorAll('.jour-prevision-nom');

    temps.innerText = data.weather[0].description;
    temperature.innerText = `${Math.trunc(data.main.temp)}°`
    localisation.innerText = data.name;

    // les heures, par tranche de trois, avec leur temperature.
    let heureActuelle = new Date().getHours();

    for (let i = 0; i < heure.length; i++) {
        
        let heureIncr = heureActuelle + i * 3;
        
        if (heureIncr > 24) {
            heure[i].innerText = `${heureIncr - 24} h`;
        } else if (heureIncr === 24) {
            heure[i].innerText = "00 h"
        } else {
            heure[i].innerText = `${heureIncr} h`;
        }
        
    }
    // trois premieres lettres des jours 
    let tabJoursEnOrdre = tabJourenOrdre();
    for (let k = 0; k < tabJoursEnOrdre.length; k++) {
        joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0, 3);
    }

    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let url_2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely&units=metric&lang=fr&appid=" + CLEFAPI + "";
    $.get(url_2, callbackSecondSuccess).done(function () {
        
    })    
}
function buttonClickGet(){
    var queryLoc = document.getElementById("queryLoc").value;
    document.getElementById("tableau").style.display = "block";
    var url = "http://api.openweathermap.org/data/2.5/weather?q=" + queryLoc + "&units=metric&lang=fr&appid=" + CLEFAPI +"";

    $.get(url, callbackFirstSuccess).done(function(){
        //alert("second success");
    })
    .fail(function(){
        alert("Cette ville n'existe pas / City does not exist")
    })
    .always(function(){
        //alert("finished");
    })
}