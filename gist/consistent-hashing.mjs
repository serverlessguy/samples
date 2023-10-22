/*
    WARNING: THIS SOLUTION IS AN EXAMPLE ONLY AND NO SUPPORT IS PROVIDED!
    This solution uses a hash function to determine the hash ring position for UUID, IPv4, and IPv6.
    It is an example of distributed storage/caching using consistent hashing.
    A sorted list of node positions on a hash ring is generated.
    Then once a key value (UUID) is converted to a position on the hash ring, the next highest node can be found.

    Example output:
    List of nodes on hash ring:  [
        [ 32, '2001:db8:3333:4444:5555:6666:7777:8888' ],
        [ 51, '192.168.10.11' ],
        [ 52, '192.168.10.12' ],
        [ 53, '192.168.10.13' ],
        [ 104, '2001:0db8:0:0:8d3:0:0:0' ],
        [ 105, '2001:0db8:0:0:8d3:0:0:1' ],
        [ 114, '2001:0db8:0001:0000:0000:0ab9:C0A8:0102' ],
        [ 279, '2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF' ],
        [ 289, '172.16.10.1' ],
        [ 321, '10.0.10.1' ]
    ]
    Position of key on hash ring:  247
    Next node on hash ring for key:  [ 279, '2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF' ]
*/

//Prerequisite: npm install uuid
import {v4 as uuidv4} from 'uuid';

/*
    -------------------------------------------
    Determine position of nodes on hash ring.
    Create a two-dimenstional sorted array containing the list of nodes and associated ring position.
    -------------------------------------------
*/ 
const nodes = ["10.0.10.1","172.16.10.1","192.168.10.11","192.168.10.12","192.168.10.13","2001:0db8:0:0:8d3:0:0:0","2001:0db8:0:0:8d3:0:0:1","2001:db8:3333:4444:5555:6666:7777:8888","2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF","2001:0db8:0001:0000:0000:0ab9:C0A8:0102"]
let nodeType = "IPv4";
let nodesPosition = [];
for (let i = 0; i < nodes.length; i++) {
    // Check if IP address is not IPv4.
    const count = nodes[i].split('.').length;
    if (count !== 4) {
        nodeType = "IPv6";
    }
    // Create sub-array containing IP address and hash ring position.
    let nodePos = new Array();
    nodePos[0] = getRingPosition(nodeType, nodes[i]);
    nodePos[1] = nodes[i];
    nodesPosition.push(nodePos);
}
// Sort the two-dimenstional array by the first element (ring position).
nodesPosition.sort((a,b) => a[0]-b[0])
console.log("List of nodes on hash ring: ", nodesPosition);

/*
    -------------------------------------------
    Determine position of key on hash ring.
    Using UUID as an example key value.
    -------------------------------------------
*/ 
const keyType = "UUID";
const value = uuidv4();
const keyPosition = getRingPosition(keyType, value);
console.log("Position of key on hash ring: ", keyPosition);

/*
    -------------------------------------------
    Determine next node on hash ring for a key.
    -------------------------------------------
*/ 
const nextNode = getNextNode(nodesPosition, keyPosition);
console.log("Next node on hash ring for key: ", nextNode);
function getNextNode(arr, value) {
    let nextNode = [];
    // If the key position is lower than the lowest node position, return the lowest node position.
    if (value < arr[0][0]) {
        nextNode = arr[0];
    // Otherwise, determine the next hightest node position.
    } else {
        let i = arr.length;
        while (arr[--i][0] >= value);
        nextNode = arr[++i];
        // If the key position is higher than the highest node position, return the lowest node position.
        if (nextNode === undefined || nextNode === null) nextNode = arr[0];
    }
    return nextNode;
}

/*
    -------------------------------------------
    Hash ring function.
    Convert input to position on hash ring.
    type = IPv4|IPv6|UUID
    value = IPv4 address|IPv6 address|uuidv4()
    -------------------------------------------
*/ 
function getRingPosition(type, value) {
    // Check type and convert the value to BigInt.
    let valueBigInt = 0;
    if (type === "UUID") {
        valueBigInt = uuidToBigInt(value);
    } else if (type === "IPv4") {
        valueBigInt = ipv4ToBigInt(value);
    } else if (type === "IPv6") {
        valueBigInt = ipv6ToBigInt(value);
    }

    // console.log(type);
    // console.log(value);
    // console.log(valueBigInt);

    // Determine the hash ring position using modulo of 360 (to simulate a circle/ring).
    const position = Number(valueBigInt % BigInt(360));
    return position;
}

// Convert IPv4 to BigInt.
function ipv4ToBigInt(ipv4) {
    return ipv4.split('.').reduce((int, value) => BigInt(int) * BigInt(256) + BigInt(+value));
}

// Convert IPv6 to BigInt.
// Supports uncompressed IPv6 addresses only.
function ipv6ToBigInt(ipv6) {
    return ipv6.split(':').map(str => Number('0x'+str)).reduce((int, value) => BigInt(int) * BigInt(65536) + BigInt(+value));
}

// Convert UUID to BigInt.
function uuidToBigInt(uuid) {
    // Get the first 8 hex characters of the UUID.
    const firstEight = uuid.substring(0, 8);
    
    // Convert the first 8 hex characters to big integer.
    return BigInt(parseInt(firstEight, 16));
}