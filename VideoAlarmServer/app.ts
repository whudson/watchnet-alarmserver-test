/*
In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp 
server, but for some reason omit a client connecting to it.  I added an 
example at the bottom.
Save the following server in example.js:
*/

var net = require('net');

const STATUS_CODES = new Array();
STATUS_CODES[2] = "Motion"
STATUS_CODES[6] = "General HDD Alarm"
STATUS_CODES[38] = "IP Camera Offline"
STATUS_CODES[120] = "Automatic Self Test"

class AlarmData {
    static startBytes = new Buffer([0x69, 0x00, 0x00]);
    static magicByte0Offset = 0x03;
    static magicByte1Offset = 0x04;
    static magicByte2Offset = 0x11;
    static statusByteOffset = 0x0C;
    static stringDataOffset = 0x20;

    magicByte0;
    magicByte1;
    statusByte;
    magicByte2;
    stringData;

    constructor(data: Buffer) {
       // if (data.indexOf(AlarmData.startBytes) == 0) {
            this.magicByte0 = data.readUInt8(AlarmData.magicByte0Offset);
            this.magicByte1 = data.readUInt8(AlarmData.magicByte1Offset);
            this.magicByte2 = data.readUInt8(AlarmData.magicByte2Offset);
            this.statusByte = data.readUInt8(AlarmData.statusByteOffset);
            this.stringData = data.slice(AlarmData.stringDataOffset);
       // } else { // packet start bytes mismatch
            //throw new Error("packet start bytes mismatch");
       // }
    }
    private stringFields(stringData) { };
}

var server = net.createServer(function (socket) {
  //  socket.write('Echo server\r\n');
  //  socket.pipe(socket);
    socket.on('data', (data: Buffer) => {
        console.log("== Alarm Report ==");
        console.log("Remote IP:%s", socket.remoteAddress);
        let almStruct = new AlarmData(data);
        console.log("Status code:%d", almStruct.statusByte);
        console.log("Description:%s", STATUS_CODES[almStruct.statusByte]);
        console.log("String data>>\n%s", almStruct.stringData);
        console.log("Raw:%o", data);
        console.log("Magic bytes:(%d, %d, %d)\n\n", almStruct.magicByte0, almStruct.magicByte1, almStruct.magicByte2);

    });
});

server.listen(7000, '0.0.0.0');

