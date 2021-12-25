import { ByteArray, RawData } from ".."

const _global = global as any

_global.createByteArray = function (rawData: RawData): ByteArray {
    return new Uint8Array(rawData)
}

_global.createRawData = function (byteArray: ByteArray): RawData {
    return {
        ...byteArray,
        length: byteArray.length,
        toString: () => {
            var out, i, len, c;
            var char2, char3;

            out = "";
            len = this.length;
            i = 0;
            while(i < len) {
                c = this[i++];
                switch(c >> 4)
                { 
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = this[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = this[i++];
                    char3 = this[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                                ((char2 & 0x3F) << 6) |
                                ((char3 & 0x3F) << 0));
                    break;
                }
            }

            return out;
        }
    }
}