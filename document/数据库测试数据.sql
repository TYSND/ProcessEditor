insert into applyinfo
values
(1,1,1,"icpc报名费");

insert into applyinfo
values
(2,1,1,"icpc路费");

insert into applyinfo
values
(3,2,2,"竞赛教室申请");

insert into applyinfo
values
(4,1,2,"竞赛逃课申请");

insert into applyres
values
(1,0);

insert into applyres
values
(2,2);

insert into applyres
values
(3,0);

insert into applyres
values
(4,1);

insert into processinfo
values
(1,'奖学金申请',3);

insert into processinfo
values
(2,'请假',3);

insert into allapplyedge
values
(1,0,1,1,'2019-11-01 00:00:00');

insert into allapplyedge
values
(1,0,2,1,'2019-11-01 00:00:00');

insert into allapplyedge
values
(1,1,3,0,'0001-01-01 00:00:00');

insert into allapplyedge
values
(1,2,3,0,'0001-01-01 00:00:00');


insert into processmember
values
(1,3,2);


insert into userinfo
values
(4,'王老师','wls@qq.com','123456');

insert into userinfo
values
(5,'李老师','lls@qq.com','123456');

insert into userinfo
values
(6,'小明','xm@qq.com','123456');

insert into processmember
values
(1,4,1);

insert into processmember
values
(1,5,1);

insert into processmember
values
(1,6,1);
