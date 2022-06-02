export interface Frame {
    firstPipe: PipePair;
    secondPipe: PipePair;
    bird: Bird;
    gameOver: boolean;
    gameStarted: boolean;
    receivePointSound: boolean;
    width: number;
    height: number;
    score: number;
    ground: Ground;
}

export interface Bird {
    jump: boolean;
    top: number;
    left: number;
    height: number;
    width: number; 
}

export interface Ground {
    height: number;
}

export interface PipePair {
    topPipe: Pipe;
    bottomPipe: Pipe;
    show: boolean;
    left: number;
    width: number;
}

export interface Pipe {
    top: number;
    height: number;
}

export class GameController {
    private frame: Frame;
    private velocity = 0;
    constructor(
        public readonly height = 800,
        public readonly width = 400,
        public readonly pipeWidth = 50,
        public readonly pipeGap = 240,
        public readonly minTopForTopPipe = 70,
        public readonly maxTopForTopPipe = 350,
        public readonly generateNewPipePercent = 0.7,
        public readonly speed = 1,
        public readonly groundHeight = 0,
        public readonly birdX = 20,
        public readonly birdSize = 70,
        public readonly gravity = 1.5,
        public readonly jumpVelocity = 11,
        public readonly slowVelocityBy = 0.3,
    ) {}

    private movePipe(pipe: PipePair, otherPipe: PipePair) {
        if (pipe.show && pipe.left <= this.pipeWidth * -1) {
            pipe.show = false;
            return pipe;
        }
    
        if (pipe.show) {
            pipe.left -= this.speed;
        }
    
        if ( otherPipe.left < this.width * (1 - this.generateNewPipePercent) && 
            otherPipe.show && !pipe.show) {
            return this.createPipe(true);
        }
    
        return pipe;
    }

    public nextFrame() {
        if (this.frame.gameOver || !this.frame.gameStarted) {
            return this.frame;
        }
        
        if (this.velocity < 2) {
            this.frame.bird.jump = false;
        }

        this.frame.firstPipe = this.movePipe(
            this.frame.firstPipe,
            this.frame.secondPipe
        );
        this.frame.secondPipe = this.movePipe(
            this.frame.secondPipe,
            this.frame.firstPipe
        );

        // Checking if dragon hit the ground
        if (this.frame.bird.top >= this.height - this.groundHeight - this.birdSize) {
            this.frame.bird.top = this.height - this.groundHeight - this.birdSize;
            this.frame.gameOver = true;
            this.frame.gameStarted = false;
            return this.frame;
        }
        // End Check if dragon hit ground

        // Checks if the pipe has collided with the dragon
        if (this.hasCollidedWithPipe()) {
            this.frame.gameOver = true;
            this.frame.gameStarted = false;
            return this.frame;
        }

        // Gravity section
        if (this.velocity > 0) {
            this.velocity -= this.slowVelocityBy;
        }

        // Add score
        if (this.frame.firstPipe.left + this.pipeWidth == this.birdX - this.speed) {
            this.frame.receivePointSound = true;
            this.frame.score += 1;
            setTimeout(() => { this.frame.receivePointSound = false; }, 100)
        }

      // Add Score
        if (this.frame.secondPipe.left + this.pipeWidth == this.birdX - this.speed) {
            this.frame.receivePointSound = true;
            this.frame.score += 1;
            setTimeout(() => { this.frame.receivePointSound = false; }, 100)
        }

        this.frame.bird.top += Math.pow(this.gravity, 2) - this.velocity;
    
        return this.frame;
    }

    public start() {
        this.newGame();
        this.frame.gameStarted = true;
        return this.frame;
    }

    public jump() {
        if (this.velocity <= 0 && this.frame.gameStarted) {
            this.frame.bird.jump = true;
            this.velocity += this.jumpVelocity;
        }
    }

    private hasCollidedWithPipe() {
        if (this.frame.firstPipe.show && this.checkPipe(this.frame.firstPipe.left)) {
            return !(this.frame.bird.top > this.frame.firstPipe.topPipe.height &&
                (this.frame.bird.top - 20) + this.frame.bird.width < this.frame.firstPipe.bottomPipe.top);
        }
    
        if (this.frame.secondPipe.show && this.checkPipe(this.frame.secondPipe.left)) {
            return !( this.frame.bird.top > this.frame.secondPipe.topPipe.height &&
                (this.frame.bird.top - 20) + this.frame.bird.width < this.frame.secondPipe.bottomPipe.top);
        }
    
        return false;
    }

    private checkPipe(left: number) {
        return (
            left <= this.birdX + this.frame.bird.width && left + this.pipeWidth - 20 >= this.birdX
        );
    }

    public newGame() {
        let firstPipe = this.createPipe(true);
        let secondPipe = this.createPipe(false);

        this.frame = {
            firstPipe,
            secondPipe,
            score: 0,
            width: this.width,
            height: this.height,
            gameOver: false,
            gameStarted: false,
            receivePointSound: false,
            ground: {
                height: this.groundHeight,
            },
            bird: {
                jump: false,
                left: this.birdX,
                top: this.height / 2 - this.birdSize / 2,
                height: this.birdSize,
                width: this.birdSize * 1.28,
            },
        };
        return this.frame;
    }

    private randomYForTopPipe(): number {
        return (
            this.minTopForTopPipe +
            (this.maxTopForTopPipe - this.minTopForTopPipe) * Math.random()
        );
    }

    private createPipe(show: boolean): PipePair {
        const height = this.randomYForTopPipe();

        return {
            topPipe: {
            top: 0,
            height,
            },
            bottomPipe: {
            top: height + this.pipeGap,
            height: this.height,
            },
            left: this.width - this.pipeWidth,
            width: this.pipeWidth,
            show,
        };
    }
}