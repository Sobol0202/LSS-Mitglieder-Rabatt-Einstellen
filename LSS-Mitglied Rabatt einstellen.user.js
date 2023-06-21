// ==UserScript==
// @name         Mitglied Rabatt einstellen
// @namespace    https://www.leitstellenspiel.de
// @version      1.0
// @description  Stellt den Rabattwert basierend auf dem Abgabewert der Mitglieder ein
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/verband/mitglieder*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

// Funktion zum Einstellen des Rabattwerts
function setMemberDiscount(memberRow) {
    var contributionCell = memberRow.querySelector('td:nth-child(5)'); // Abgabe-Zelle
    var contribution = parseInt(contributionCell.textContent); // Abgabewert

    var discountButtons = memberRow.querySelectorAll('td:nth-child(4) a.btn-discount'); // Rabatt-Buttons
    var discountIndex = Math.min(contribution, 10); // Rabatt-Index berechnen (maximal 10)

    // Überprüfen, ob der Rabatt-Button vorhanden ist
    if (discountButtons.length > discountIndex) {
        // Klick auf den entsprechenden Rabatt-Button
        discountButtons[discountIndex].click();
    }
}

// Funktion zum Einstellen des Rabattwerts bei jedem Klick
function setDiscountValues() {
    var memberRows = document.querySelectorAll('table.table.table-striped tbody tr');

    var progressBarContainer = document.createElement('div'); // Fortschrittsanzeige-Container
    progressBarContainer.style.display = 'inline-block';
    progressBarContainer.style.marginLeft = '10px';

    var progressBar = document.createElement('progress'); // Fortschrittsanzeige
    progressBar.max = memberRows.length;
    progressBar.value = 0;

    var progressLabel = document.createElement('span'); // Fortschrittslabel
    progressLabel.textContent = '0 / ' + memberRows.length;

    progressBarContainer.appendChild(progressBar);
    progressBarContainer.appendChild(progressLabel);

    var addButtonContainer = document.querySelector('.table.table-striped');
    addButtonContainer.parentNode.insertBefore(progressBarContainer, addButtonContainer);

    memberRows.forEach(function(row, index) {
        setTimeout(function() {
            setMemberDiscount(row);
            progressBar.value = index + 1;
            progressLabel.textContent = (index + 1) + ' / ' + memberRows.length;

            if (index === memberRows.length - 1) {
                // Entfernen der Fortschrittsanzeige nach Abschluss
                progressBarContainer.remove();
            }
        }, index * 100); // 100 Millisekunden Verzögerung zwischen den Einstellungen
    });
}

// Button erstellen und Event-Handler hinzufügen
var button = document.createElement('button');
button.textContent = 'Rabattwerte einstellen';
button.addEventListener('click', setDiscountValues);

// Element zum Hinzufügen des Buttons auswählen
var addButtonContainer = document.querySelector('.table.table-striped');

// Button einfügen
addButtonContainer.parentNode.insertBefore(button, addButtonContainer);

})();
