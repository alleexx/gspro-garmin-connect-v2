var express = require('express');
var bodyParser = require('body-parser');
const SimMessages = require('./helpers/simMessages');
  
var app = express();

var ballColors = ["calibrate","white","white2","yellow","yellow2","orange","orange2","orange3","green","green2","red","red2"]

var webcamIndeces = ["0","1","2","3"]

var args = [];

var exec = require('child_process').execFile;
    
    
class PuttingConnect {
    constructor(ipcPort, gsProConnect) {
        
        this.ipcPort = ipcPort;
        this.gsProConnect = gsProConnect;
        this.ballData = {}
        this.clubData = {}
        this.clubType = 'Putter'
        this.ballColor = "calibrate"
        this.webcamIndex = 0

        
        this.ipcPort.on('message', (event) => {
            if (event.data === 'startPuttSim') {
                this.ipcPort.postMessage({
                    type: 'R10Message',
                    message: "PUTTING Start Simulator",
                });
                args = ["-c="+this.ballColor,"-w="+this.webcamIndex];               
                this.execute("ball_tracking.exe",args,__dirname+"\\\\dist\\\\ball_tracking\\\\"); 
            } else if (event.data && event.data.type === 'setBallColor') {
            this.setNewBallColor(event.data.data)
            } else if (event.data && event.data.type === 'setWebcamIndex') {
                this.setNewWebcamIndex(event.data.data)
            }
        });

        this.ipcPort.postMessage({
            type: 'ballColorOptions',
            data: ballColors,
        })

        this.ipcPort.postMessage({
            type: 'setBallColor',
            data: this.ballColor,
        })

        this.ipcPort.postMessage({
            type: 'webcamIndexOptions',
            data: webcamIndeces,
        })

        this.ipcPort.postMessage({
            type: 'setWebcamIndex',
            data: this.webcamIndex,
        })
    
    
        app.use(bodyParser.json());
        //app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));
        app.use(bodyParser.urlencoded({ extended: false }));
        
        app.post("/putting", (req, res) => {

            var data = req.body.ballData

            
            this.setBallData(data)
            

            this.ipcPort.postMessage({
                type: 'R10Message',
                message: "PUTTING Data Received and Ball Data set",
            });

            
             this.sendShot()
        
            // Retrieve array form post body
            // var ballData = req.body.ballData; 


      
            // Return json response
            res.json({ result: "Data Received " });
        });
        
        // Server listening to PORT 8888
        app.listen(8888);       

    }

    setNewBallColor(ballColor) {
        this.ipcPort.postMessage({
            type: 'setBallColor',
            data: ballColor,
        })

        this.ballColor = ballColor

        this.ipcPort.postMessage({
            type: 'R10Message',
            message: `PUTTING Switching Ball Color to ${ballColor}`,
        })
    }

    setNewWebcamIndex(webcamIndex) {
        this.ipcPort.postMessage({
            type: 'setWebcamIndex',
            data: webcamIndex,
        })

        this.webcamIndex = webcamIndex

        this.ipcPort.postMessage({
            type: 'R10Message',
            message: `PUTTING Switching Webcam Index to ${webcamIndex}`,
        })
    }

    /**
         * Function to execute exe
         * @param {string} fileName The name of the executable file to run.
         * @param {string[]} params List of string arguments.
         * @param {string} path Current working directory of the child process.
         */
    async execute(fileName, params, path){
    
        exec(fileName, params, { cwd: path });
    }


    setBallData(ballData) {
        let spinAxis = Number(ballData.SpinAxis)
        if (spinAxis > 90) {
            spinAxis -= 360
        }
        spinAxis *= -1
        // this.ipcPort.postMessage({
        //     type: 'R10Message',
        //     message: `Spin Axis received: ${ballData.SpinAxis} | Spin Axis set: ${spinAxis}`,
        //     level: 'success',
        // })
        this.ballData = {
            ballSpeed: ballData.BallSpeed,
            spinAxis: 0.0,
            totalSpin: ballData.TotalSpin,
            hla: ballData.LaunchDirection,
            vla: 0.0
        }

        this.ipcPort.postMessage({
            type: 'gsProShotStatus',
            ready: false,
        })
    }

    async sendShot() {
        this.ipcPort.postMessage({
            type: 'gsProShotStatus',
            ready: false,
        })
        this.gsProConnect.launchBall(this.ballData, this.clubData)

        if (this.client) {
            this.client.write(SimMessages.get_success_message('SendShot'))
            setTimeout(() => {
                this.client.write(SimMessages.get_shot_complete_message())
            }, 300)
            setTimeout(() => {
                this.client.write(SimMessages.get_sim_command('Disarm'))
            }, 700)
            setTimeout(() => {
                this.client.write(SimMessages.get_sim_command('Arm'))
            }, 1000)
        }

        setTimeout(() => {
            this.ipcPort.postMessage({
                type: 'gsProMessage',
                message: '💯 PUTTING SHOT successful 💯',
                level: 'success',
            })
            this.ipcPort.postMessage({
                type: 'gsProShotStatus',
                ready: true,
            })
        }, 1000)
    }


}

module.exports = PuttingConnect;