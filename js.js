const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 400;
        canvas.height = 600;

        const bird = {
            x: 50,
            y: canvas.height / 2,
            width: 30,
            height: 30,
            velocity: 0,
            gravity: 0.25,
            jumpStrength: -6.5,
            rotation: 0,
            rotationSpeed: 0.1,
            maxRotation: Math.PI / 4
        };

        const pipes = [];
        let score = 0;

        const pipeWidth = 50;
        const pipeGap = 150;
        const pipeVelocity = 2;

        function drawBird() {
            ctx.save();
            ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
            ctx.rotate(bird.rotation);
            ctx.fillStyle = '#ff8c00'; // Orange color
            ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height);
            ctx.restore();
        }

        function drawPipe(x, height) {
            // Draw light front
            ctx.fillStyle = '#55cc55'; // Light green color
            ctx.fillRect(x, 0, pipeWidth, height);
            ctx.fillRect(x, height + pipeGap, pipeWidth, canvas.height - height - pipeGap);
            // Draw dark body
            ctx.fillStyle = '#008000'; // Dark green color
            ctx.fillRect(x + 5, 0, pipeWidth - 10, height);
            ctx.fillRect(x + 5, height + pipeGap, pipeWidth - 10, canvas.height - height - pipeGap);
        }

        function drawScore() {
            ctx.font = '24px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(`Score: ${score}`, 10, 30);
        }

        function collisionDetection() {
            if (bird.y + bird.height > canvas.height || bird.y < 0) {
                gameOver();
            }

            pipes.forEach(pipe => {
                if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
                    if (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap) {
                        gameOver();
                    } else {
                        score++;
                    }
                }
            });
        }

        function gameOver() {
            ctx.font = '48px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
            clearInterval(gameLoop);
        }

        function update() {
            bird.velocity += bird.gravity;
            bird.y += bird.velocity;

            // Rotation
            if (bird.velocity > 0) {
                bird.rotation = Math.min(bird.maxRotation, bird.rotation + bird.rotationSpeed);
            } else {
                bird.rotation = 0;
            }

            pipes.forEach(pipe => {
                pipe.x -= pipeVelocity;

                if (pipe.x + pipeWidth < 0) {
                    pipes.shift();
                }
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBird();
            pipes.forEach(pipe => drawPipe(pipe.x, pipe.height));
            drawScore();
        }

        window.addEventListener('keydown', event => {
            if (event.code === 'Space' || event.code === 'ArrowUp') {
                bird.velocity = bird.jumpStrength;
            }
        });

        canvas.addEventListener('click', () => {
            bird.velocity = bird.jumpStrength;
        });

        setInterval(() => {
            pipes.push({
                x: canvas.width,
                height: Math.random() * (canvas.height - pipeGap - 50)
            });
        }, 2000);

        const gameLoop = setInterval(() => {
            update();
            draw();
            collisionDetection();
        }, 1000 / 60);
