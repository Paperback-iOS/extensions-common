import { RawData, RawDataInfo } from "."
import { Source } from "../.."
import { Request } from "../RequestObject"

const _global = global as any

_global.createRawData = function (rawData: RawDataInfo): RawData {
    return {
        toByteArrayNoCopy: (_: Source) => {
            return rawData.bytes
        }
    }
}