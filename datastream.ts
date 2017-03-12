module Stream {
    export class Reader {
        private buffer: ArrayBuffer;
        private view: DataView;
        private pos: number = 0;
        constructor(buffer: any) {
            if (buffer instanceof ArrayBuffer) {
                this.buffer = buffer;
            }
            else if (buffer instanceof Uint8Array) {
                this.buffer = buffer.buffer;
            }
            else {
                throw 'Invalid data type';
            }
            this.view = new DataView(this.buffer);
        }
        end() { return this.pos >= this.buffer.byteLength; }
        uint8()   { let r = this.view.getUint8(this.pos);   this.pos += 1; return r; }
        uint16()  { let r = this.view.getUint16(this.pos);  this.pos += 2; return r; }
        uint32()  { let r = this.view.getUint32(this.pos);  this.pos += 4; return r; }
        int8()    { let r = this.view.getInt8(this.pos);    this.pos += 1; return r; }
        int16()   { let r = this.view.getInt16(this.pos);   this.pos += 2; return r; }
        int32()   { let r = this.view.getInt32(this.pos);   this.pos += 4; return r; }
        float32() { let r = this.view.getFloat32(this.pos); this.pos += 4; return r; }
        float64() { let r = this.view.getFloat64(this.pos); this.pos += 8; return r; }
        vector(len: number)  { let r = this.buffer.slice(this.pos, this.pos + len); this.pos += len; return r; }
        getBuffer() {
            return this.buffer;
        }
        getData() {
            return new Uint8Array(this.buffer);
        }
        print() { console.log(new Uint8Array(this.buffer)); }
    }
    export class Writer {
        private buffer: ArrayBuffer;
        private view: DataView;
        private length: number = 0;
        constructor() {
            this.buffer = new ArrayBuffer(8);
            this.view = new DataView(this.buffer);
        }
        testLength(len: number) {
            if (this.length + len > this.buffer.byteLength) {
                let ab = new ArrayBuffer((this.length + len) * 1.1);
                let src = new Uint8Array(this.buffer);
                let dest = new Uint8Array(ab);
                dest.set(src, 0);
                this.buffer = ab;
                this.view = new DataView(this.buffer);
            }
        }
        writeUint8(n: number)   { this.testLength(1); this.view.setUint8(this.length, n);   this.length += 1; }
        writeUint16(n: number)  { this.testLength(2); this.view.setUint16(this.length, n);  this.length += 2; }
        writeUint32(n: number)  { this.testLength(4); this.view.setUint32(this.length, n);  this.length += 4; }
        writeInt8(n: number)    { this.testLength(1); this.view.setInt8(this.length, n);    this.length += 1; }
        writeInt16(n: number)   { this.testLength(2); this.view.setInt16(this.length, n);   this.length += 2; }
        writeInt32(n: number)   { this.testLength(4); this.view.setInt32(this.length, n);   this.length += 4; }
        writeFloat32(n: number) { this.testLength(4); this.view.setFloat32(this.length, n); this.length += 4; }
        writeFloat64(n: number) { this.testLength(8); this.view.setFloat64(this.length, n); this.length += 8; }
        writeVector(v: any) {
            if ('object' === typeof v) {
                let v2;
                if (v instanceof Uint8Array) {
                    v2 = v;
                }
                if (v instanceof Array) {
                    v2 = new Uint8Array(v);
                }
                this.testLength(v2.byteLength);
                let dest = new Uint8Array(this.buffer);
                dest.set(v2, this.length);
                this.length += v2.byteLength;
            }
        }
        getBuffer() {
            return this.buffer.slice(0, this.length);
        }
        getData() {
            return new Uint8Array(this.getBuffer());
        }
        print() { console.log(new Uint8Array(this.buffer)); }
    }
}