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

create table processvariety
(
	processid int not null,
	variety varchar(20) not null,
	primary key(processid,variety)
);

create table allapplyedge
(
	applyid int not null,
	userid int not null,
	processid int not null,
	fromusersta int not null,
	tousersta int not null,
	res int not null,
	primary key(applyid,fromusersta,tousersta)
);

create table userinfo
(
	userid int not null,
	nick varchar(20) not null,
	email varchar(50) not null,
	password varchar(20) not null,
	primary key(userid),
	unique key(nick)
	unique key(email)
);


create table applyvariety
(
	applyid int not null,
	userid int not null,
	variety varchar(20) not null,
	val int not null,
	primary key(applyid,userid,variety)
);

create table applyreason
(
	applyid int not null,
	userid int not null,
	reason varchar(200) not null,
	primary key(applyid,userid,reason)
);
