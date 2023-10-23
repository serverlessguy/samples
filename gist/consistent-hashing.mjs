/*
    WARNING: THIS SOLUTION IS AN EXAMPLE ONLY AND NO SUPPORT IS PROVIDED!
    This solution uses a hash function to determine the hash ring position for UUID, IPv4, and IPv6.
    It is an example of distributed storage/caching using consistent hashing.
    
    How it works:
    1. A list of node/server IP addresses (IPv4, IPv6) are converted into a hash table.
    2. For each node (and virtual nodes), a position on the hash ring is determined and the hash table is sorted.
    3. A key value (UUID) is converted to a position on the hash ring.
    4. The node that is equal to, or immediately following, the key's hash value is identified.
    
    More info on consistent hashing: https://www.toptal.com/big-data/consistent-hashing

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
    Key will use the following node:  [ 279, '2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF' ]
*/

//Prerequisite: npm install uuid
import {v4 as uuidv4} from 'uuid';

// CHANGING THE RING SIZE WILL CREATE DIFFERENT HASH KEYS FOR NODES AND OBJECTS.
// DO NOT CHANGE THE RING SIZE UNLESS YOU ABSOLUTELY INTENDED TO.
// Default 360 (to simulate the degrees of a full circle/ring).
const ringSize = 360;

// The number of total virtual nodes to add to the ring.
const numVirtualNodes = 3;

// Space between virtual nodes on the ring.
const virtualNodeSpacing = parseInt(ringSize / numVirtualNodes);

/*
    -------------------------------------------
    Determine position of nodes on hash ring.
    Create a two-dimenstional sorted array containing the list of nodes and associated ring position.
    -------------------------------------------
*/ 

// List of IP addresses for nodes (servers).
const nodes = ["10.0.10.1","172.16.10.1","192.168.10.11","192.168.10.12","192.168.10.13","2001:0db8:0:0:8d3:0:0:0","2001:0db8:0:0:8d3:0:0:1","2001:db8:3333:4444:5555:6666:7777:8888","2001:db8:3333:4444:CCCC:DDDD:EEEE:FFFF","2001:0db8:0001:0000:0000:0ab9:C0A8:0102"]
let nodeType = "IPv4";

let nodesLength = nodes.length;
if (nodes.length > ringSize) nodesLength = ringSize;

let nodesOnRing = [];
for (let n = 0; n < nodesLength; n++) {
    // Check if IP address is not IPv4.
    const count = nodes[n].split('.').length;
    if (count !== 4) {
        nodeType = "IPv6";
    }
    let origPosition = getRingPosition(nodeType, nodes[n])
    // Create a sub-array containing the IP address and hash ring position for each virtual node.
    for (let v = 0; v < numVirtualNodes; v++) {
        // Determine the distance between virtual nodes on the ring.
        let virtualPosition = origPosition + (v * virtualNodeSpacing);
        // If the position is greater than the ring size, loop around the ring.
        if (virtualPosition > ringSize) virtualPosition -= ringSize;
        let node = new Array();
        node[0] = virtualPosition;
        node[1] = nodes[n];
        nodesOnRing.push(node);
    }
}
// Sort the two-dimenstional array by the first element (ring position).
nodesOnRing.sort((a,b) => a[0]-b[0])
console.log("List of nodes on hash ring: ", nodesOnRing);

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
const nextNode = getNextNode(nodesOnRing, keyPosition);
console.log("Key will use the following node: ", nextNode);

function getNextNode(nodesOnRing, keyPosition) {
    let nextNode = [];
    // If the key position is lower than or equal to the lowest node position, return the lowest node position.
    // Or if the key position is greater than the highest node position, return the lowest node position.
    if (keyPosition <= nodesOnRing[0][0] || keyPosition > nodesOnRing[nodesOnRing.length-1][0]) {
        nextNode = nodesOnRing[0];
    // Otherwise, determine the next hightest node position.
    } else {
        // Loop through nodes on ring while the node position is less than the key position.
        for (let i = 0; nodesOnRing[i][0] < keyPosition; i++) {
            nextNode = nodesOnRing[i+1];
        }
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

    // Determine the hash ring position using modulo of the ring size.
    let position = parseInt(valueBigInt % BigInt(ringSize));
    
    // If modulo equals zero, then assign last position on ring.
    if (position === 0) position = ringSize;
    return position;
}

// Convert IPv4 to BigInt.
function ipv4ToBigInt(ipv4) {
    return ipv4.split('.').reduce((int, value) => BigInt(int) * BigInt(256) + BigInt(+value));
}

// Convert IPv6 to BigInt.
// Supports uncompressed IPv6 addresses only.
function ipv6ToBigInt(ipv6) {
    return ipv6.split(':').map(str => parseInt('0x'+str)).reduce((int, value) => BigInt(int) * BigInt(65536) + BigInt(+value));
}

// Convert UUID to BigInt.
function uuidToBigInt(uuid) {
    // Get the first 8 hex characters of the UUID.
    const firstEight = uuid.substring(0, 8);
    
    // Convert the first 8 hex characters to big integer.
    return BigInt(parseInt(firstEight, 16));
}