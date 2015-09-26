local serverRoomsKey = KEYS[1]
local roomCountsKey = KEYS[2]
local roomTimeoutsKey = KEYS[3]
local serversKey = KEYS[4]

local time = tonumber(ARGV[1])
local dead = ARGV[2]

redis.call('ZUNIONSTORE', roomCountsKey, 2, roomCountsKey, serverRoomsKey, 'WEIGHTS', 1, -1)
redis.call('DEL', serverRoomsKey)
redis.call('ZREM', serversKey, dead)

local empty = redis.call('ZRANGEBYSCORE', roomCountsKey, '-inf', 0)

for _, room in ipairs(empty) do
  redis.call('ZADD', roomTimeoutsKey, time, room)
end
