import redis from "redis";
import keys from "./keys";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: Number(keys.redisPort),
  retry_strategy: () => 1000, // retry if it loses connection every 1sec
});

// We are doing this duplication because according to the
// redis documentation for javascript, if we ever have a client that is
// publishing or listening, we have to make a duplicate connection
// because once a client is used for publishing or listening, it cannot be used for
// other purposes
const sub = redisClient.duplicate();

const fib = (index: number): number => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
};

// Get a message anytime a vlue enters redis
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, String(fib(parseInt(message))));
});

sub.subscribe("insert");
