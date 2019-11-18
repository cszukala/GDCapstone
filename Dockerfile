FROM node:8
RUN mkdir /frontend
WORKDIR /frontend

RUN git clone https://github.com/wongcoder/GDCapstone.git

WORKDIR GDCapstone/
RUN ls

RUN npm install
#RUN npm install react-scripts@1.1.1 -g --silent
EXPOSE 80
EXPOSE 3000

CMD npm start