import {t} from "../localization"

export const formateDistance = (distanceInKm) => {
    let meter = t('m')
    let kilometer = t('kilometer')
    if(distanceInKm < 1){
        return (distanceInKm*1000)+meter
    } else {
        return distanceInKm+kilometer
    }
}