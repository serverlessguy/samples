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

    // Get the first 8 hex characters of the UUID.
    const firstEight = uuid.substring(0, 8);
    
    // Convert the first 8 hex characters to an integer.
    const intFirstEight = parseInt(firstEight, 16);

    // Determine the shardId using modulo of shards.
    // Add 1 so its not zero based.
    const shardId = (intFirstEight % shards) + 1;

    // console.log(uuid);
    // console.log(shards);
    // console.log(firstEight);
    // console.log(intFirstEight);

    return shardId;
}