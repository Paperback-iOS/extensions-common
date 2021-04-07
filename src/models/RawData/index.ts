import { Source } from "../.."

export interface RawDataInfo {
    bytes: Uint8Array
}

export interface RawData {
    toByteArrayNoCopy: (allocator: Source) => Uint8Array
}

declare global {
    function createRawData(rawData: RawDataInfo): RawData 
}
