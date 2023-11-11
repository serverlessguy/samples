// WARNING: THIS SOLUTION IS AN EXAMPLE ONLY AND NO SUPPORT IS PROVIDED!
// This function will convert a UUID into an integer which can be used for data sharding.

// Prerequisite: npm install uuid
import {v4 as uuidv4} from 'uuid';

/*
    Total number of shards (max: 1048576 shards).
    If shards = 8, the returned shardId will range from 1 - 8.
    If shards = 1024, the returned shardId will range from 1 - 1024.
*/

const shards = 1048576;
const shardId = getShardId(uuidv4(), shards);
console.log(shardId);

function getShardId(uuid, shards) {
    // Enforce maximum number of shards.
    if (shards > 1048576) shards = 1048576;

    // Convert the uuid into a big int.
    const bigIntUUID = BigInt("0x" + uuid.replace(/-/g, ""));

    // Determine the shardId using modulo of shards.
    // Add 1 so its not zero based.
    const shardId = parseInt((bigIntUUID % BigInt(shards)) + BigInt(1));

    // console.log(uuid);
    // console.log(shards);
    // console.log(bigIntUUID);

    return shardId;
}