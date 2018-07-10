# passwd-as-service
A minimal HTTP service that exposes the user and group information on a UNIX-like system that is usually locked away in the UNIX /etc/passwd and /etc/groups files.

- ### Windows Installation (Use the command line that you feel comfortable using; I stuck with windows powershell :) )
  - #### Prerequisites
  1. Install Node.js is you don't have it installed. Heres a tutorial on installing Node.js: https://nodesource.com/blog/installing-nodejs-tutorial-windows/
  3. Open up your command line (windows powershell will be enough ).
  2. Clone the repo using the command: 
      - git clone https://github.com/b2castro/passwd-as-service.git
  3. Run the following commands to install packages the application needs: 
      - npm install
      - npm install -g nodemon
      - npm install -g mocha
      - npm install sqlite3
  
- ### How To Run Application
  1. Change directory to:  
     -  passwd-as-service
  2. run the server.js file using nodemon with the command: 
     -  nodemon --watch etc/passwd.txt --watch etc/groups.txt --watch server.js  
     ### Note: --watch allows the server to refresh when any changes are made to passwd.txt or groups.txt while the service is running.
  3. Go to http://localhost:3000/passwdAsService.html to use the application.
  
- ### Usage
