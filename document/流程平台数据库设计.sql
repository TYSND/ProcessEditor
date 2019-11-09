create table processedge
(
	processid int not null,
	fromusersta int not null,
	tousersta int not null,
	variety varchar(20) null,
	leftval int null,
	rightval int null,
	primary key(processid,fromusersta,tousersta)
);

create table processinfo
(
	processid int not null,
	processname varchar(50) not null,
	authorid int not null,
	primary key(processid)
);


create table processmember
(
	processid int not null,
	userid int not null,
	usersta int not null,
	primary key(processid,userid)
);
create table procstameaning
(
	processid int not null,
	usersta int not null,
	meaning varchar(50) not null,
	primary key(processid,usersta)
);
create table processvariety
(
	processid int not null,
	variety varchar(20) not null,
	primary key(processid,variety)
);

create table userinfo
(
	userid int not null,
	nick varchar(20) not null,
	email varchar(50) not null,
	password varchar(20) not null,
	primary key(userid),
	unique key(nick),
	unique key(email)
);

create table applyinfo
(
	applyid int not null,
	userid int not null,
	processid int not null,
	applyname varchar(50) not null,
	applyreason varchar(200) not null,
	primary key(applyid)
);

create table applyres
(
	applyid int not null,
	res int not null,
	primary key(applyid)
);

create table allapplyedge
(
	applyid int not null,
	fromusersta int not null,
	tousersta int not null,
	res int not null,
	checktime datetime not null default '0001-01-01 00:00:00',
	primary key(applyid,fromusersta,tousersta)
);



create table applyvariety
(
	applyid int not null,
	variety varchar(20) not null,
	val int not null,
	primary key(applyid,userid,variety)
);


