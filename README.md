# Project

### `npm install`  run this command to install node_modules folder.

### `npm run dev`  run this command to start this server on development mode.

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in your browser.

# Server's directory has a index.js file 

### `you have to put mongodb url in line number 54`


# Important !!!!!!!!!!!!!!

# Create a folder in project base directory the folder will be env folder just provide name ( .env ) and put this two line there.Just remove the hash (#) if it is there in .env file.

#    CONNECT_DB="your mongoDB url"
#    SECRET = "abcd1234"

### Server directory's index.js file has some seed data of university in line no. 64 . student must give the same university string that he/she belongs.


# 1 - Student Regsiter [http://localhost:4000/signup] this is a post url it will take four data in body. the data is {"name" : "student1","password" : "1234","universityId":"UNI12345","role":"student"}.

# 2- Stundent Login [http://localhost:4000/login] this a is post url it will take two data in body. The data is {"userId" : "student-user-Id","password" : "1234"}.

# 3 - Dean Regsiter [http://localhost:4000/signup] this is a post url it will take four data in body. The data is {"name" : "dean1","password" : "1234","universityId":"UNI12345","role":"dean"}.

# 4 - Dean Login [http://localhost:4000/login] this is post url it will take two data in body. The data is {"userId" : "dean-user-Id","password" : "1234"}.

# 5 - Student book a slot with dean [http://localhost:4000/student/appointment] this is a post url it will take two data in body. There will be two case stundent can book a slot thursday or friday. The data is in the body 1- case {deanId : "dean-ID" , appointmentDay:"thursday"} or 2- case {deanId : "dean-ID" , appointmentDay : "friday"} . This route authorized by student only.

# 6 - Student appointment slot details [http://localhost:4000/student/appointment] this is a get url. it returns student appointment slot details . This route authorized by student only.

# 7 - Dean appointment slot details [http://localhost:4000/dean/appointment] this is a get url. it returns dean appointment slot details . This route authorized by dean only.

# 8 - Student logins and sees the free deans slot  [http://localhost:4000/student/free-session] this is a get url. It returns all free deans id, student can book a slot with one of them. This route authorized by student only.