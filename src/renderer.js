window.addEventListener('DOMContentLoaded', () => {
    let timeout = false
    let gsProConnected = false
    let port

    let ipOptionsOpen = false
    let ballColorOptionsOpen = false
    let webcamIndexOptionsOpen = false

    window.onmessage = (event) => {
        if (event.source === window && event.data === 'main-port') {
            const [_port] = event.ports
            port = _port
            _port.onmessage = (event) => {
                handleMessage(event.data)
            }

            const sendTestShotButton = document.querySelector('#send-test-shot')

            sendTestShotButton.addEventListener('click', () => {
                if (!gsProConnected) {
                    return
                }
                timeout = true
                port.postMessage('sendTestShot')

                sendTestShotButton.classList.remove('send-test-shot')
                sendTestShotButton.classList.add('send-test-shot-disabled')
                setTimeout(() => {
                    sendTestShotButton.classList.remove('send-test-shot-disabled')
                    sendTestShotButton.classList.add('send-test-shot')
                    timeout = false
                }, 8000)
            })

            const startPuttSimButton = document.querySelector('#start-putt-sim')

            startPuttSimButton.addEventListener('click', () => {
                // Check if GSPRO is connected - maybe removed
                // if (!gsProConnected) {
                //     return
                // }
                timeout = true

                port.postMessage('startPuttSim')
            })
        }
    }

    function toggleModal() {
        const ipOptionsContainer = document.querySelector('.ip-settings-options-container')

        if (ipOptionsOpen) {
            ipOptionsContainer.style.visibility = 'hidden'
        } else {
            ipOptionsContainer.style.visibility = 'visible'
        }
        ipOptionsOpen = !ipOptionsOpen
    }

    function toggleModalBallColor() {
        const ballColorOPtionContainer = document.querySelector('.ball-color-options-container')

        if (ballColorOptionsOpen) {
            ballColorOPtionContainer.style.visibility = 'hidden'
        } else {
            ballColorOPtionContainer.style.visibility = 'visible'
        }
        ballColorOptionsOpen = !ballColorOptionsOpen
    }

    function toggleModalWebcamIndex() {
        const webcamIndexOPtionContainer = document.querySelector('.webcam-index-options-container')

        if (webcamIndexOptionsOpen) {
            webcamIndexOPtionContainer.style.visibility = 'hidden'
        } else {
            webcamIndexOPtionContainer.style.visibility = 'visible'
        }
        webcamIndexOptionsOpen = !webcamIndexOptionsOpen
    }

    document.querySelector('#ip-settings').addEventListener('click', toggleModal)

    document.querySelector('#ball-color-settings').addEventListener('click', toggleModalBallColor)

    document.querySelector('#webcam-index-settings').addEventListener('click', toggleModalWebcamIndex)


    function handleMessage(data) {
        if (data.type) {
            if (data.type === 'garminStatus') {
                updateStatus('garmin', data.status)
            } else if (data.type === 'R10Message') {
                printMessage('R10', data.message, data.level)
            } else if (data.type === 'gsProStatus') {
                updateStatus('gspro', data.status)
            } else if (data.type === 'gsProMessage') {
                printMessage('GSPro', data.message, data.level)
            } else if (data.type === 'gsProShotStatus') {
                updateShotStatus(data.ready)
            } else if (data.type === 'ipOptions') {
                setIPOptions(data.data, true)
            } else if (data.type === 'setIP') {
                setIP(data.data)
            } else if (data.type === 'ballColorOptions') {
                setballColorOptions(data.data, true)
            } else if (data.type === 'webcamIndexOptions') {
                setwebcamIndexOptions(data.data, true)
            } else if (data.type === 'setBallColor') {
                setBallColor(data.data)
            } else if (data.type === 'setWebcamIndex') {
                setWebcamIndex(data.data)
        }
        }
    }

    function setIP(ip) {
        const IPText = document.getElementById('ip-address')
        IPText.innerText = ip
        updateIPOptions(ip)
    }

    function setBallColor(ballColor) {
        const ballColorText = document.getElementById('ball-color')
        ballColorText.innerText = ballColor
        updateBallColorOptions(ballColor)
    }

    function setWebcamIndex(webcamIndex) {
        const webcamIndexText = document.getElementById('webcam-index')
        webcamIndexText.innerText = webcamIndex
        updateWebcamIndexOptions(webcamIndex)
    }

    function updateIPOptions(activeIp) {
        const ipOptionsContainer = document.querySelector('.ip-settings-options-container')

        ipOptionsContainer.querySelectorAll('.ip-option-text').forEach((ipOption) => {
            if (ipOption.innerHTML === activeIp) {
                ipOption.classList.add('ip-option-text-selected')
            } else {
                ipOption.classList.remove('ip-option-text-selected')
            }
        })
    }

    function updateBallColorOptions(activeBallColor) {
        const ballColorOptionsContainer = document.querySelector('.ball-color-options-container')

        ballColorOptionsContainer.querySelectorAll('.ball-color-text').forEach((ballColorOption) => {
            if (ballColorOption.innerHTML === activeBallColor) {
                ballColorOption.classList.add('ball-color-text-selected')
            } else {
                ballColorOption.classList.remove('ball-color-text-selected')
            }
        })
    }

    function updateWebcamIndexOptions(activeWebcamIndex) {
        const webcamIndexOptionsContainer = document.querySelector('.webcam-index-options-container')

        webcamIndexOptionsContainer.querySelectorAll('.webcam-index-text').forEach((webcamIndexOption) => {
            if (webcamIndexOption.innerHTML === activeWebcamIndex) {
                webcamIndexOption.classList.add('webcam-index-text-selected')
            } else {
                webcamIndexOption.classList.remove('webcam-index-text-selected')
            }
        })
    }

    function setIPOptions(ips) {
        const ipOptionsContainer = document.querySelector('.ip-settings-options-container')

        const ipTextNode = ipOptionsContainer.querySelector('.ip-option-text').cloneNode(true)

        ipOptionsContainer.innerHTML = ''

        for (let ip of ips) {
            const ipText = ipTextNode.cloneNode(true)

            ipText.innerHTML = ip
            ipOptionsContainer.append(ipText)
        }

        ipOptionsContainer.addEventListener('click', (e) => {
            port.postMessage({
                type: 'setIP',
                data: e.target.innerHTML,
            })
            toggleModal()
            // ipOptionsOpen = !ipOptionsOpen
        })
    }

    function setballColorOptions(ballColorOptions) {
        const ballColorOptionsContainer = document.querySelector('.ball-color-options-container')

        const ballColorTextNode = ballColorOptionsContainer.querySelector('.ball-color-option-text').cloneNode(true)

        ballColorOptionsContainer.innerHTML = ''

        for (let ballColorOption of ballColorOptions) {
            const ballColorText = ballColorTextNode.cloneNode(true)

            ballColorText.innerHTML = ballColorOption
            ballColorOptionsContainer.append(ballColorText)
        }

        ballColorOptionsContainer.addEventListener('click', (e) => {
            port.postMessage({
                type: 'setBallColor',
                data: e.target.innerHTML,
            })
            toggleModalBallColor()
        })
    }

    function setwebcamIndexOptions(webcamIndexOptions) {
        const webcamIndexOptionsContainer = document.querySelector('.webcam-index-options-container')

        const webcamIndexTextNode = webcamIndexOptionsContainer.querySelector('.webcam-index-option-text').cloneNode(true)

        webcamIndexOptionsContainer.innerHTML = ''

        for (let webcamIndexOption of webcamIndexOptions) {
            const webcamIndexText = webcamIndexTextNode.cloneNode(true)

            webcamIndexText.innerHTML = webcamIndexOption
            webcamIndexOptionsContainer.append(webcamIndexText)
        }

        webcamIndexOptionsContainer.addEventListener('click', (e) => {
            port.postMessage({
                type: 'setWebcamIndex',
                data: e.target.innerHTML,
            })
            toggleModalWebcamIndex()
        })
    }

    function updateStatus(element, status) {
        if (element === 'gspro') {
            const sendTestShotButton = document.querySelector('#send-test-shot')

            if (status === 'connected') {
                gsProConnected = true
                sendTestShotButton.classList.remove('send-test-shot-disabled')
                sendTestShotButton.classList.add('send-test-shot')
            } else {
                gsProConnected = false
                sendTestShotButton.classList.remove('send-test-shot')
                sendTestShotButton.classList.add('send-test-shot-disabled')
            }
        }
        const COLOR_CLASSES = ['status-color-red', 'status-color-yellow', 'status-color-green']

        const el = document.getElementById(element)
        const statusColor = el.querySelector('.status-icon')
        const statusText = el.querySelector('.status-text-container .status-status')

        statusColor.classList.remove(...COLOR_CLASSES)

        if (status === 'connected') {
            statusColor.classList.add(COLOR_CLASSES[2])
            statusText.innerHTML = 'Connected'
        } else if (status === 'connecting') {
            statusColor.classList.add(COLOR_CLASSES[1])
            statusText.innerHTML = 'Connecting...'
        } else {
            statusColor.classList.add(COLOR_CLASSES[0])
            statusText.innerHTML = 'Disconnected'
        }
    }

    function printMessage(system, message, level) {
        const mw = document.querySelector('.messages-window')

        const messageEl = mw.querySelector('.message-text').cloneNode(true)

        if (level === 'error') {
            messageEl.classList.add('message-text-red')
        }
        if (level === 'success') {
            messageEl.classList.add('message-text-green')
        }

        const title = messageEl.querySelectorAll('span')[0]
        const text = messageEl.querySelectorAll('span')[1]

        const date = new Date()

        title.innerHTML = `${system}  🔅  ${date.getHours().toString().padStart(2, '0')}:${date
            .getHours()
            .toString()
            .padStart(2, '0')}>`

        text.innerHTML = message

        mw.append(messageEl)
    }

    function updateShotStatus(ready) {
        const shotReadyText = document.querySelector('.shot-status')
        if (ready) {
            shotReadyText.innerHTML = 'Ready For Shot  💣'

            shotReadyText.classList.remove('message-text-red')
            shotReadyText.classList.add('message-text-green')
        } else {
            shotReadyText.innerHTML = 'Wait ✋'

            shotReadyText.classList.remove('message-text-green')
            shotReadyText.classList.add('message-text-red')
        }
    }
})
