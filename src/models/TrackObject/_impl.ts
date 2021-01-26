import {TrackObject} from '.'

const _global = global as any

_global.createTrackObject = function(trackObject: TrackObject): TrackObject {
    return trackObject
}