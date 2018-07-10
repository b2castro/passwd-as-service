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
  2. Run the server.js file using nodemon with the command: 
     -  nodemon --watch etc/passwd.txt --watch etc/groups.txt --watch server.js  
     ### Note: --watch allows the server to refresh when any changes are made to passwd.txt or groups.txt while the service is running.
  3. Go to http://localhost:3000/passwdAsService.html to use the application.
  
- ### Usage Of The Application
 #### 1. GET /users
     - Get a list of all users on the system, as defined in the /etc/passwd.txt file and display it on the front end. Press the first button that is located at the top left of the web page.

  #### Example of use and resulting display 
  ![capture](https://user-images.githubusercontent.com/7214905/42538122-ceedcd34-844b-11e8-9c56-bf910159a96e.PNG)
  
 #### 2. GET /groups
     - Get a list of all groups on the system, a defined by /etc/group.txt file and display it on the front end. This button is located right below the "GET /users" button. 
 
  #### Example of use and resulting display
  ![capture](https://user-images.githubusercontent.com/7214905/42538317-8127ca9a-844c-11e8-8065-702a3f71efb4.PNG)

 #### 3. GET /users/<uid>
     - Get a single user with <uid> and display it on the front end. Return 404 if <uid> is not found.Pressing the button without specifying input will return all users.
  
   #### Example of use and resulting display
   ![capture](https://user-images.githubusercontent.com/7214905/42538556-1b638df6-844d-11e8-870d-205f5d1e10a2.PNG)

 #### 4. GET /groups/<gid>
    - Get a single group with <gid> and display it on the front end. Return 404 if <gid> is not found. Pressing the button without specifying input will return all groups.
  
  #### Example of use and resulting display
  ![capture](https://user-images.githubusercontent.com/7214905/42538729-97094d4c-844d-11e8-9d5b-d214817853f4.PNG)

     
