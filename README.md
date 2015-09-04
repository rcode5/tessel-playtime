# Tessel Playtime

## Setup

```

npm install

```

## Examples

### Blinky

Make the Tessel lights blink.

```
npm blinky
```

### Networked

Given a server listening for POSTs at `/api/tessel` (domain for the server is configured in `./config/config.json`), this code running on the Tessel will post data from both ambient and climate modules to the server every 500 ms over Wifi (also setup in `config/config.json`

```
npm run networked
```


### Tethered


Given a tethered computer running a node server using the `usb_reader.js` script, the Tessel will post data to the USB port (subsequently read by that local node server) every 500 ms.

##### THIS DOES NOT WORK

```
node usb_reader.js
```
