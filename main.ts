/**
 * Spelen met Lego — MakeCode extensie voor micro:bit met Wukong board.
 * Bevat motoraansturing met timer, sonar:bit afstandsmeting en TM1637 display.
 */

//% color=#e85b3f icon="\uf1b9" block="Spelen met Lego"
//% groups="['Rijden', 'Sonar', 'Display']"
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

    // -------------------------
    // DISPLAY (TM1637)
    // -------------------------

    let TM1637_CMD1 = 0x40
    let TM1637_CMD2 = 0xC0
    let TM1637_CMD3 = 0x80
    let _SEGMENTS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71]

    let _clk: DigitalPin = DigitalPin.P13
    let _dio: DigitalPin = DigitalPin.P14
    let _brightness: number = 6
    let _displayBuf: Buffer = pins.createBuffer(4)

    function _start() {
        pins.digitalWritePin(_dio, 0)
        pins.digitalWritePin(_clk, 0)
    }

    function _stop() {
        pins.digitalWritePin(_dio, 0)
        pins.digitalWritePin(_clk, 1)
        pins.digitalWritePin(_dio, 1)
    }

    function _writeByte(b: number) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(_dio, (b >> i) & 1)
            pins.digitalWritePin(_clk, 1)
            pins.digitalWritePin(_clk, 0)
        }
        pins.digitalWritePin(_clk, 1)
        pins.digitalWritePin(_clk, 0)
    }

    function _writeDataCmd() {
        _start()
        _writeByte(TM1637_CMD1)
        _stop()
    }

    function _writeDspCtrl() {
        _start()
        _writeByte(TM1637_CMD3 | 8 | _brightness)
        _stop()
    }

    function _dat(bit: number, dat: number) {
        _writeDataCmd()
        _start()
        _writeByte(TM1637_CMD2 | (bit % 4))
        _writeByte(dat)
        _stop()
        _writeDspCtrl()
    }

    /**
     * Stel de CLK en DIO pinnen in voor het display. Doe dit eenmalig bij het opstarten.
     * @param clk de CLK pin, eg: DigitalPin.P13
     * @param dio de DIO pin, eg: DigitalPin.P14
     */
    //% blockId=display_setup
    //% block="display instellen CLK %clk DIO %dio"
    //% clk.defl=DigitalPin.P13
    //% dio.defl=DigitalPin.P14
    //% group="Display"
    //% weight=100
    export function displaySetup(clk: DigitalPin, dio: DigitalPin): void {
        _clk = clk
        _dio = dio
        pins.digitalWritePin(_clk, 0)
        pins.digitalWritePin(_dio, 0)
        _displayBuf = pins.createBuffer(4)
        displayClear()
    }

    /**
     * Toon een getal op het display.
     * @param num het te tonen getal, eg: 1234
     */
    //% blockId=display_show_number
    //% block="display toon getal %num"
    //% group="Display"
    //% weight=90
    export function displayShowNumber(num: number): void {
        if (num < 0) {
            _dat(0, 0x40)
            num = -num
        } else {
            _dat(0, _SEGMENTS[Math.idiv(num, 1000) % 10])
        }
        _dat(1, _SEGMENTS[Math.idiv(num, 100) % 10])
        _dat(2, _SEGMENTS[Math.idiv(num, 10) % 10])
        _dat(3, _SEGMENTS[num % 10])
    }

    /**
     * Wis het display.
     */
    //% blockId=display_clear
    //% block="display wissen"
    //% group="Display"
    //% weight=80
    export function displayClear(): void {
        for (let i = 0; i < 4; i++) {
            _dat(i, 0)
            _displayBuf[i] = 0
        }
    }

    /**
     * Stel de helderheid van het display in (0 = laagst, 7 = hoogst).
     * @param val helderheid 0-7, eg: 6
     */
    //% blockId=display_brightness
    //% block="display helderheid %val"
    //% val.min=0 val.max=7
    //% val.defl=6
    //% group="Display"
    //% weight=70
    export function displayBrightness(val: number): void {
        _brightness = Math.max(0, Math.min(7, val))
        _writeDspCtrl()
    }

}