# Spelen met Lego

MakeCode extensie voor micro:bit met Wukong board. Bevat blokken voor motoraansturing, afstandsmeting met de sonar:bit en een 4-cijferig display.

## Extensie toevoegen

1. Ga naar [makecode.microbit.org](https://makecode.microbit.org) en open je project
2. Klik op het **tandwiel** (⚙️) rechtsboven → **Extensions**
3. Plak de volgende URL in de zoekbalk en druk op Enter:
   ```
   https://github.com/Evin89/spelenMetLego
   ```
4. Klik op de extensie om hem toe te voegen
5. De blokken verschijnen onder **Spelen met Lego**

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

## Display (TM1637 4-cijferig display)

> **Aansluiting:** sluit CLK aan op P13 en DIO op P14 (of andere vrije pinnen).  
> **Let op:** gebruik geen jumper wires op P0 (buzzer), en niet op pinnen die je al gebruikt voor sonar of motoren.

### `display instellen CLK ... DIO ...`
Stel in welke pinnen je gebruikt voor het display. Gebruik dit blok **eenmalig** bij het opstarten (`on start`).

### `display toon getal ...`
Toont een getal op het display. Werkt van -999 tot 9999.

### `display wissen`
Maakt het display leeg.

### `display helderheid ...`
Stel de helderheid in van 0 (donkerst) tot 7 (felst).

---

## Licentie

MIT
