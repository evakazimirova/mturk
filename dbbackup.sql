INSERT INTO annotators VALUES ('ip','noggatur@ya.ru','356a192b7913b04c54574d18c28d46e6395428ab',NULL,1,'iGor','Polyakov',10000,6,'2017-06-08 11:14:54','2017-06-12 16:33:57');
INSERT INTO annotators VALUES ('igorpol','igor_polyakov@phystech.edu','7c222fb2927d828af22f592134e8932480637c0d','a5d16949842616895cc1f94227d1ec7761d8123a',0,'igor','polyakov',0,0,'2017-06-10 08:21:11','2017-06-10 08:21:11');
INSERT INTO annotators VALUES ('johndoe_42','cpp.define@gmail.com','f7c3bc1d808e04732adf679965ccc34ca7ae3441',NULL,1,'John','Doe',3000,2,'2017-06-10 08:22:58','2017-06-10 09:03:49');
INSERT INTO annotators VALUES ('mpotap','y.lavrinenko@neurodatalab.com','d2ce961fe06369cdf275210f36225244f05dbb09',NULL,1,'michal','potapuch',0,0,'2017-06-10 09:07:05','2017-06-10 09:07:34');

INSERT INTO emotionsinfo VALUES ('Gladness',1,NULL,NULL);
INSERT INTO emotionsinfo VALUES ('Sadness',1,NULL,NULL);
INSERT INTO emotionsinfo VALUES ('Madness',2,NULL,NULL);
INSERT INTO emotionsinfo VALUES ('Fear',2,NULL,NULL);

INSERT INTO eventsinfo VALUES ('Person speaks',NULL,NULL);
INSERT INTO eventsinfo VALUES ('Person is visible',NULL,NULL);
INSERT INTO eventsinfo VALUES ('Commercials',NULL,NULL);

INSERT INTO humans VALUES ('Mariya Sharapova','https://firebasestorage.googleapis.com/v0/b/mturk-video.appspot.com/o/sharapova_person1.png?alt=media&token=8703c74a-8704-4869-84cd-84ff9e839508',NULL,NULL);
INSERT INTO humans VALUES ('Dima Bilan','https://firebasestorage.googleapis.com/v0/b/mturk-video.appspot.com/o/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%202017-06-10%20%D0%B2%2011.46.40.png?alt=media&token=ee27821d-02e3-450b-a072-4c6c10f6f8d3',NULL,NULL);

INSERT INTO projects VALUES ('Mark up',1000,6,NULL,NULL);
INSERT INTO projects VALUES ('Event selection',2000,6,NULL,NULL);

INSERT INTO videos VALUES ('https://firebasestorage.googleapis.com/v0/b/mturk-video.appspot.com/o/sharapova.mp4?alt=media&token=8aec7703-379a-4fbf-b518-28d5c24d6b55',NULL,NULL);
INSERT INTO videos VALUES ('https://firebasestorage.googleapis.com/v0/b/mturk-video.appspot.com/o/bilan_0005.mp4?alt=media&token=a44a0b02-af66-4c06-97e7-8a34190ba303',NULL,NULL);

INSERT INTO fragments VALUES (1,1,'Start,End
7,12
12,17
22,27
27,32
32,37
44,49
49,53
63,68
72,77
77,82
82,85
91,96
96,101
101,106
106,111
111,116
116,121
125,130
137,144
148,153
153,158
160,165
165,170
170,175
175,181',NULL,NULL);
INSERT INTO fragments VALUES ( 2,2,'start,end
39.2,41.54
71.8,75.38
111.16,120.88
123.56,125.6
130.05,133.61
150.06,155.5',NULL,NULL);

INSERT INTO tasks VALUES (1,1,'1,3',0,NULL,NULL);
INSERT INTO tasks VALUES (2,1,'1,2',0,NULL,NULL);
INSERT INTO tasks VALUES (1,2,'2,3,4',0,NULL,NULL);
INSERT INTO tasks VALUES (2,2,'1,2',0,NULL,NULL);