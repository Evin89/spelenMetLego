/**
 * Blokken voor de Sonar:bit EF04089 3-wire ultrasone sensor.
 * Gebruikt het correcte 1µs triggersignaal voor de ingebouwde MCU op de sensor.
 */

//% color=#e85b3f icon="\uf1b9" block="Spelen met Lego"
namespace spelenMetLego {

    /**
     * Meet de afstand in cm.
     * Geeft -1 terug als er geen geldige meting is (geen echo of buiten bereik).
     * Bereik: 4 cm tot 400 cm.
     * @param pin de pin waarop de sonar:bit is aangesloten, eg: DigitalPin.P1
     */
    //% blockId=sonar_distance_cm
    //% block="sonar afstand in cm op pin %pin"
    //% pin.defl=DigitalPin.P1
    //% weight=100
    export function distanceCm(pin: DigitalPin): number {
        pins.setPull(pin, PinPullMode.PullNone)
        pins.digitalWritePin(pin, 0)
        control.waitMicros(2)
        pins.digitalWritePin(pin, 1)
        control.waitMicros(1)
        pins.digitalWritePin(pin, 0)

        let pulse = pins.pulseIn(pin, PulseValue.High, 23200)
        if (pulse == 0) return -1

        let cm = Math.idiv(pulse, 58)
        if (cm < 4 || cm > 400) return -1
        return cm
    }

    /**
     * Meet de afstand in cm, herhaalt tot een geldige meting (max 5 pogingen).
     * Handig voor beginners: geen -1 afhandeling nodig.
     * Geeft -1 terug als na 5 pogingen nog geen geldige meting is.
     * @param pin de pin waarop de sonar:bit is aangesloten, eg: DigitalPin.P1
     */
    //% blockId=sonar_distance_cm_stable
    //% block="sonar afstand in cm op pin %pin (stabiel)"
    //% pin.defl=DigitalPin.P1
    //% weight=90
    export function distanceCmStable(pin: DigitalPin): number {
        let result = -1
        for (let i = 0; i < 5; i++) {
            result = distanceCm(pin)
            if (result > 0) return result
            basic.pause(25)
        }
        return -1
    }

    /**
     * Geeft true als de afstand kleiner is dan de opgegeven drempel.
     * Handig voor obstakels detecteren.
     * @param pin de pin waarop de sonar:bit is aangesloten, eg: DigitalPin.P1
     * @param threshold drempelwaarde in cm, eg: 20
     */
    //% blockId=sonar_closer_than
    //% block="sonar object dichterbij dan %threshold cm op pin %pin"
    //% pin.defl=DigitalPin.P1
    //% threshold.defl=20
    //% weight=80
    export function closerThan(threshold: number, pin: DigitalPin): boolean {
        let d = distanceCmStable(pin)
        if (d < 0) return false
        return d < threshold
    }

}
