var express = require('express');
var bodyParser = require('body-parser');
const SimMessages = require('./helpers/simMessages');
  
var app = express();

class PuttingConnect {
        constructor(ipcPort, gsProConnect) {
        
        this.ipcPort = ipcPort;
        this.gsProConnect = gsProConnect;
        this.ballData = {}
        this.clubData = {}
        this.clubType = 'Putter'
    
        app.use(bodyParser.json());
        //app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));
        app.use(bodyParser.urlencoded({ extended: false }));
        
        app.post("/putting", (req, res) => {

            var data = req.body.ballData

            
            this.setBallData(data)
            

            this.ipcPort.postMessage({
                type: 'R10Message',
                message: "CAM PUTTING Data Received and Ball Data set",
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