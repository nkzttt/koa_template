# koa_template

## information
This is a koa template which is created by 'koa-generator'. and to compilation is used the webpack.  
If there is anything problem in the webpack, please switch to 'unuseWP' branch and use it.  

## Node version
`v8.4.0`

## commands
- `npm start` - It builds source for production.
- `npm run dev` - It launches server for development.

## protocol
if the env-variable is `production`, please access to `https:` protocol, because it is used http2. ※  
and if the env-variable is `development` please access to `http:` protocol.  

※ Please prepare a certificate for yourself if to use `https:` protocol in  the local environment.  

## modules
- view - ect
- css - stylus
- js - babel
