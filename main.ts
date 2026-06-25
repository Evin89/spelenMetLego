/**
 * Spelen met Lego — MakeCode extensie voor micro:bit met Wukong board.
 * Bevat motoraansturing met timer en sonar:bit afstandsmeting.
 */

//% color=#e85b3f icon="\uf1b9" block="Spelen met Lego"
//% groups="['Rijden', 'Sonar']"
namespace spelenMetLego {

    // -------------------------
    // RIJDEN
    // -------------------------

    /**
     * Stel de snelheid van M1 en M2 in en rij gedurende een aantal milliseconden.
     * Positieve waarden = vooruit, negatieve waarden = achteruit.
     * Gebruik verschillende waarden voor M1 en M2 om te draaien.
     * @param m1 snelheid motor M1 (-100 tot 100), eg: 50
     * @param m2 snelheid motor M2 (-100 tot 100), eg: 50
     * @param ms duur in milliseconden, eg: 1000
     */
    //% blockId=rijden_timed
    //% block="rij M1: %m1 M2: %m2 gedurende %ms ms"
    //% m1.min=-100 m1.max=100
    //% m2.min=-100 m2.max=100
    //% ms.defl=1000
    //% group="Rijden"
    //% weight=100
    export function rijMs(m1: number, m2: number, ms: number): void {
        if (!control.isSimulator()) {
            wukong.motorRun(wukong.Motors.M1, m1)
            wukong.motorRun(wukong.Motors.M2, m2)
        }
        basic.pause(ms)
    }

    /**
     * Stop beide motoren.
     */
    //% blockId=rijden_stop
    //% block="stop motoren"
    //% group="Rijden"
    //% weight=90
    export function stop(): void {
        if (!control.isSimulator()) {
            wukong.motorRun(wukong.Motors.M1, 0)
            wukong.motorRun(wukong.Motors.M2, 0)
        }
    }

    // -------------------------
    // SONAR
    // -------------------------

    /**
     * Meet de afstand in cm.
     * Geeft -1 terug als er geen geldige meting is (geen echo of buiten bereik).
     * Bereik: 4 cm tot 400 cm.
     * @param pin de pin waarop de sonar:bit is aangesloten, eg: DigitalPin.P1
     */
    //% blockId=sonar_distance_cm
    //% block="sonar afstand in cm op pin %pin"
    //% pin.defl=DigitalPin.P1
    //% group="Sonar"
    //% weight=80
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
     * Geeft -1 terug als na 5 pogingen nog geen geldige meting is.
     * @param pin de pin waarop de sonar:bit is aangesloten, eg: DigitalPin.P1
     */
    //% blockId=sonar_distance_cm_stable
    //% block="sonar afstand in cm op pin %pin (stabiel)"
    //% pin.defl=DigitalPin.P1
    //% group="Sonar"
    //% weight=70
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
     * @param threshold drempelwaarde in cm, eg: 20
     * @param pin de pin waarop de sonar:bit is aangesloten, eg: DigitalPin.P1
     */
    //% blockId=sonar_closer_than
    //% block="sonar object dichterbij dan %threshold cm op pin %pin"
    //% pin.defl=DigitalPin.P1
    //% threshold.defl=20
    //% group="Sonar"
    //% weight=60
    export function closerThan(threshold: number, pin: DigitalPin): boolean {
        let d = distanceCmStable(pin)
        if (d < 0) return false
        return d < threshold
    }

}