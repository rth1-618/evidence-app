
  # OmniCase: Evidence Management System

This is the project submission for CST4011 Software Development. The group members are:
- Chein Yu Lin (M01054141)
- Parth Rajeshkumar Tandel (M01088020)

OmniCase is built on the MERN stack with Cloudinary serving as the Cloud storage bucket for media files and MongoDB Atlas as the NoSQL Database for the project. 
- The frontend is made using React Typescript and various supporting libraries.
- The backend is made using Express.js and on the Node.js development Engine. Other supporting packages for handling database communication and security features like mongoose and jsonwebtoken are also used.
- Database is MongoDB Atlas.
- Cloudinary as media bucket.
Note: You will need internet access to interact with the system.

### Installing Dependencies
Install the dependencies on the root (This installs dependencies for the frontend).
```shell
nom i
```
For installing backend dependencies,
```shell
cd server
npm i
```
## Running the code  
- using mdx eduroam wifi would have problem
To start backend from root,
```shell
npm run serve
```
To start frontend, open a separate Terminal and run
```shell
npm run dev
```
If you get any warning on the browser, just Go to Advanced and Proceed to site.
The warnings arise because we are using https instead of http for the frontend.
(This change was necessary for the web app to be made accesibke from a mobile device.)

## To access WebApp from mobile device,
Make sure the mobile device is connected to the same WiFi Network as your PC from which you run the code.
After that, get the IPv4 of the Network,
For eg. if your network IP is ```192.168.1.243``` 
Replace the ```VITE_SERVER_URL``` environment variable from the ```.env``` in the root of the project as:

```shell
VITE_SERVER_URL=http://192.168.1.243:5000/api
```

Then run both frontend and backend in separate terminals.
From the mobile device access the web app at 
```https://192.168.1.243:5173/```
  