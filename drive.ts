/**
 * Rijblokken met timer voor het Wukong board.
 * Combineert motorsnelheid en pauze in één blok.
 */

//% color=#e85b3f icon="\uf1b9" block="Rijden"
namespace rijden {

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
    //% weight=100
    export function rijMs(m1: number, m2: number, ms: number): void {
        wukong.motorRun(wukong.Motors.M1, m1)
        wukong.motorRun(wukong.Motors.M2, m2)
        basic.pause(ms)
    }

    /**
     * Stop beide motoren.
     */
    //% blockId=rijden_stop
    //% block="stop motoren"
    //% weight=90
    export function stop(): void {
        wukong.motorRun(wukong.Motors.M1, 0)
        wukong.motorRun(wukong.Motors.M2, 0)
    }

}
