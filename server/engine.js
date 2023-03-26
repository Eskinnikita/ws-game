const Matter = require('matter-js')

const {Engine, Bodies, World, Vector, Body} = Matter;

module.exports = class MatterEngine {
    //Matter components setup
    canvas = {width: 1200, height: 800};
    wallThickness = 20;
    speed = 0.05;
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

    moveClientEntity = data => {
        const clientBody = this.entities.clients.find(el => el.socketId === data.socketId)
        if(clientBody) {
            for(let key in data.moveTo) {
                if(data.moveTo[key] !== 0) {
                    data.moveTo[key] = data.moveTo[key] > 0 ? this.speed : -this.speed;
                }
            }
            Body.applyForce(clientBody, {x: clientBody.position.x, y: clientBody.position.y}, data.moveTo)
        }
    }

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
