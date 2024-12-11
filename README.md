## Cloud Computing Final Project - StormCloud 

### Project Title: Graphulator 

### Group Members 
- Shuhao Yu 
- Luke Haidze 
- Sam Brunacini 
- Kevin Burkhardt 
- Na Tang 
  
### Project Description

Our project will consist of creating an online web application that can graph a given function and provide other tools for calculating different statistics/values, such as the derivative and integral. Our application will be enabled through the use of a cloud service that provides all the necessary resources for our project to run. 

### Project Structure

Project Name: Graphulator 

#### Frontend

https://graphulator-app-598507763983.us-central1.run.app/
 
Technologies/Languages
- Javascript 
- HTML 
- CSS 
- Python 
- UI/UX 
- Left-bar - Function Input
- Top-half – Graph Download and Cloud Load
- Bottom-half – Derivative and Integral Calculation 
- Home Page - Provides help section, access to previous graphs, or creating a new graph 
- Calculator Page - Allows basic scientific calculator functionality 
  
#### Backend

Database and APIs 

GCP Technologies
- Cloud Storage - Store the static files 
- Cloud Run - Responsible for the backend server part
  - Provide APIs
  - Handle the static files from cloud Storage and return to frontend
  - Connect with cloud function 
- Cloud Function - Responsible for processing and acquiring graph data
- Firestore - Store the graph data when generate new graphs

Deploy with Automation
- GitHub Actions 
  

