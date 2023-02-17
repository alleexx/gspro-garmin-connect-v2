Q: Can I adjust the FPS rate in the putting app?
A: It just takes the fps the camera will provide. If I set 60 fps for example in ivcam or kinovea it uses this in the app for me.

Q: My view shows the internal Webcam, how can I change it?
A: When you start the putting app you can choose a different Webcam Index. Default is 0 which will be your built in cam. Probably 1 will be your external camera. Just try it and start the putting view.

Q: How long does the putt need to roll in view in order to register?
A: It needs 2 good reads after crossing the red lines. I have about 70 cm in view in my setup and can read accurately up to 8-10 MPH with 30 FPS HD webcam.

Q: My ball is not detected, what can I do?
A: Biggest topic on the setup is the lighting. If your light is reflecting of the surface and giving a lot of bright color back to the software the software has to many detection points other than the ball. Try to turn down the light or see if your camera is too close to the ligh. Adapting the environment and/or camera settings (brightness, etc) is your best bet at the moment. For camera adjustment the kinovea software has really good settings options for detected cameras.

Q: Can I adjust the starting position rectangle (marked yellow in the camera view)?
A: Yes, go to advanced settings in the app. You can now hit "a" to set the starting ball rectangle and to overwrite the ball radius detected.

Q: My putting is not showing in GSPRO and saying it is disabled in the connector messages.
A: Putting is only enabled in the connector if PT is shoosen in GSPRO for putter as club. This is automatically done on the green. If you want to putt off the green just set it to PT manually. This is done to avoid any ghost putts if you have object in the detection area while not putting.

Q: Can the connector settings be stored so I do not have to select the webcam and ball color each time I run the software?
A: You can hardcode the options set in the connector now in the gspro-garmin-connect-v2-putting\resources\app\src\env.js file so you do not have to set them manually anymore. The advanced settings in the putting itself will be stored. If you want the radius to be autodetected again you have to move it back to 0.

Q: Are DSLR cameras supported?
A: As long as windows detects the camera as webcam it should be possible to use it - just check the different webcams by setting the webcam index on the start screen.

Q: Does this only work for GSPRO?
A: The connector only connects to GSPRO, the putting app could also send data to other software if there is an open interface.

Q: My putts are really off line and they still go fairly straight. HLA shown in putting does not show the same in GSPRO.
A; Check if putting assist is enabled in GSPRO. It auto corrects bad putts.

Q: Does it work with any ball?
A: It should work with any ball but the best results are reported with an orange ball on a dark putting surface.