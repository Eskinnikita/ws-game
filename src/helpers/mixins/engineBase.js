import Matter from "matter-js";

const engineBase = {
    data() {
        return {
            Engine: Matter.Engine,
            Render: Matter.Render,
            Bodies: Matter.Bodies,
            Runner: Matter.Runner,
            Composite: Matter.Composite,
            engine: null,
            render: null,
            entities: []
        };
    },
    methods: {
        initEngine() {
            this.engine = this.Engine.create();

            this.render = this.Render.create({
                canvas: this.canvas,
                engine: this.engine
            });

            const ground = this.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
            this.entities.push(ground)
            this.Composite.add(this.engine.world, this.entities);
            this.Render.run(this.render);
            const runner = this.Runner.create();
            this.Runner.run(runner, this.engine);
        },
        addProp(prop) {
            this.entities.push(prop)
            this.Composite.add(this.engine.world, this.entities)
        },
        updateEngine() {
            this.Engine.update(this.engine)
        }
    }
};

export default engineBase;
