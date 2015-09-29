# AndTekUI (WIP)

![](http://up.frd.mn/YbxY9.jpg)

Simple iOS web application to control your AndTek call center status. Comes with a (poor man's) PHP API located in the [`api/`](api/) folder to talk to the AndTek backend.

## Installation

1. Make sure you've installed all requirements
2. Clone this repository:  
  `git clone https://github.com/frdmn/AndTekUI`
3. Adjust the MAC addresses of your agents handsets in the `agents.json`:  
  `cp agents.default.json agents.json`

## Development

1. Make sure you've installed `grunt-cli` and `bower` globally:  
  `npm install -g grunt-cli bower`  
2. Install all Node dependencies:  
  `npm install`
3. Install all libraries using Bower:  
  `bower install`  
4. Run Grunt tasks to compile assets:  
  `grunt`  

## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Requirements / Dependencies

* AndTek Call Center
* Web server

## Version

1.0.0

## License

[MIT](LICENSE)
