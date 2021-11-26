const Fastify = require("fastify");
const zmq = require("zeromq");

const app = Fastify();
const sock = new zmq.Request();

app.post("/", async (request, reply) => {
  const { text } = JSON.parse(request.body);
  await sock.send(JSON.stringify({ text }));
  const [result] = await sock.receive();
  return reply.send({ length: Number(Buffer.from(result)) });
});

// app.post("/", (request, reply) => {
//     const { text } = JSON.parse(request.body);
//     sock.send(JSON.stringify({ text }));
//     reply.type('application/json').code(200)
//     return { message: 'sent' }
//   });

const main = async () => {
  try {
    await sock.bind("tcp://*:7777");
    await app.listen(3000);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
main();