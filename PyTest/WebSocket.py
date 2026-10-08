import socketio

sio = socketio.Client()
sio.connect('http://localhost:3001', socketio_path='/chat', transports=['websocket'])
print(sio.call('ping', {'a': 1}))
sio.disconnect()