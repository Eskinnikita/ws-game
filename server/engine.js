const Matter = require('matter-js')

const {Engine, Bodies, Composite, World, Vector, Body, Runner, Render} = Matter;

module.exports = class MatterEngine {
    //Matter components setup
    canvas = {width: 1200, height: 800};
    wallThickness = 20;
    entities = {
        clients: [],
        walls: [
            Bodies.rectangle(
                this.canvas.width / 2,
                0,
                this.canvas.width,
                this.wallThickness,
                {isStatic: true}
            ),
            Bodies.rectangle(
                0, this.canvas.height / 2,
                this.wallThickness,
                this.canvas.height,
                {isStatic: true}
            ),
            Bodies.rectangle(
                this.canvas.width,
                this.canvas.width / 2,
                this.wallThickness,
                this.canvas.width,
                {isStatic: true}
            ),
            Bodies.rectangle(
                this.canvas.width / 2,
                this.canvas.height,
                this.canvas.width,
                this.wallThickness,
                {isStatic: true}
            ),
            Bodies.rectangle(
                380,
                400,
                this.wallThickness,
                200
            )
        ]
    };

    engine = Engine.create();

    updater = (() => {
        return setInterval(() => {
            Engine.update(this.engine, 1000 / 60);
            const processedEntities = {};
            for(let key in this.entities) {
                processedEntities[key] = this.entities[key].map(this.toVertices);
            }
            this.io.to(this.roomId).emit('game:update', processedEntities)
        }, 1000 / 60)
    })()

    constructor(io, socket, roomId) {
        //socket components
        this.io = io;
        this.socket = socket;
        this.roomId = roomId;

        this.init()
    }

    init = () => {

    };

    addEntity = (entity, type) => {
        if (!this.entities[type]) {
            this.entities[type] = [];
        }
        this.entities[type].push(entity);
        World.add(this.engine.world, Object.values(this.entities).flat());
    }

    removeEntity = (entityIndex, type) => {
        this.entities[type].splice(entityIndex, 1);
    }

    onClientConnect = (client, socketId) => {
        const box = Bodies.rectangle(400, 200, 80, 80);
        box.socketId = socketId
        box.name = client.name
        this.addEntity(box, 'clients')
    }

    onClientLeave = (client, socketId) => {
        const entityIndex = this.entities.clients.findIndex(el => {
            return el.socketId === socketId;
        })
        const entity = this.entities.clients[entityIndex];
        this.removeEntity(entityIndex, 'clients');
        World.remove(this.engine.world, entity)
    }

    toVertices = e => e.vertices.map(({x, y}) => ({x, y}));
}
