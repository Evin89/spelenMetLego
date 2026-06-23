# Spelen met Lego

MakeCode extensie voor micro:bit met Wukong board. Bevat blokken voor motoraansturing en afstandsmeting met de sonar:bit.

## Extensie toevoegen

1. Ga naar [makecode.microbit.org](https://makecode.microbit.org) en open je project
2. Klik op het **tandwiel** (⚙️) rechtsboven → **Extensions**
3. Plak de volgende URL in de zoekbalk en druk op Enter:
   ```
   https://github.com/JOUWGEBRUIKERSNAAM/pxt-spelen-met-lego
   ```
4. Klik op de extensie om hem toe te voegen
5. De blokken verschijnen onder **Rijden** en **Sonar**

---

## Rijden

### `rij M1: ... M2: ... gedurende ... ms`
Stel de snelheid van motor M1 en M2 in, en geef op hoe lang de robot moet rijden.

- Snelheid loopt van **-100 tot 100**
- **Positief** = vooruit, **negatief** = achteruit
- Geef M1 en M2 **dezelfde waarde** om rechtdoor te rijden
- Geef M1 en M2 **verschillende waarden** om te draaien — ontdek zelf welke combinatie werkt!

### `stop motoren`
Stopt beide motoren direct.

---

## Sonar

> **Let op:** sluit de sonar:bit **niet** aan op P0 — die pin is in gebruik door de buzzer op het Wukong board. Gebruik P1 of P2.

### `sonar afstand in cm op pin`
Eenmalige meting. Geeft `-1` terug bij geen geldige echo of buiten bereik (4–400 cm).

### `sonar afstand in cm op pin (stabiel)`
Herhaalt automatisch tot 5 keer totdat er een geldige meting is. Makkelijker voor beginners.

### `sonar object dichterbij dan X cm op pin`
Geeft `true` als er een object binnen de opgegeven afstand is. Handig voor obstakels detecteren.

---

## Licentie

MIT
