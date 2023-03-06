// eslint-disable-next-line import/no-extraneous-dependencies
const Matter = require('matter-js');
const { boxes, walls } = require('./store/metadata');
const { frameRate } = require('./store/metadata');

module.exports.initEngine = io => {
  const engine = Matter.Engine.create();
  Matter.Composite.add(engine.world, Object.values({ boxes, walls }).flat());
  const toVertices = e => e.vertices.map(({ x, y }) => ({ x, y }));
  setInterval(() => {
    Matter.Engine.update(engine, frameRate);
    io.emit('game', {
      boxes: boxes.map(toVertices),
      walls: walls.map(toVertices)
    });
  }, frameRate);
};
