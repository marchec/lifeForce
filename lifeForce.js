const LVL_MAX = 1;
const PRIMARY_AXIS_LEN = 700;
const SECONDARY_AXIS_LEN = 500;
const SCROLLING_SPEED = 0.12;
const POWUP_CHOICE = 5;
const MAX_INVULNERABILITY = 60;
const SPACESHIP_SPEED_LIMIT = 0.5;
const UNIT_MAP = 20;


var ctx = null;
var cvs = null;

var score = 0;
var lives;
var pos_on_map = 0;
var unit_vector = [0,0];
var in_play;
var level;
var vertical_oriented;
var eligible_powup;
var lvl_size = [];
var width;
var height;

var dt;
var old;
var delta;
var delta_scrolling;

var arrow = {up: false, right: false, down: false, left: false};
var shoot = false;

var rect = {x: -1, y: -1, width: 0, height: 0};
var dir = {x: 0, y: 0};
var powups = [];
var bullet = {rect: {}, dir: {}, exists: false, power: 0, speed: 0, friend_bul: false, sprite: ""};
var bullets = [];
var weapon = {until_shot: 0, delay: 0, bullet: {}};
var foe = {rect: {}, type: ' ', shooting: false, weapon: {}, has_powup: false, speed: 0, hp: 0, earned_points: 0};
var foes = [];
var space_ship = {rect: {}, speed: 0, weapon: {}, lvl_weapon: 0, missile: false, ripple: false, laser: false, force: false, invulnerability: false, invulnerability_timer: 0, sprite: ""};
var wall = {rect: {}, type: ' ', destroyable: false, destroyed: false};
var walls = [];
var sprites = {f: "foe_f.png", F: "foeF.png", W: "wallW.png", w: "wall_w.png", m: "foe_m.png", M: "foeM.png", B: "wallB.png", b: "foe_b.png", N: "foeN.png", n: "foe_n.png", c: "foe_c.png", C: "foeC.png", T: "foeT.png", s: "foe_s.png"};
var img_file;
var min_wall_on_screen_index = [];
var lvl_maps = [];
var victory = false;

init = function() {
	
	cvs = document.getElementById("cvs");
    ctx = cvs.getContext("2d");
	
	document.addEventListener("keydown", keyPress);
	document.addEventListener("keyup", keyRelease);
	
	in_play = false;
	lives = 5;
	eligible_powup = 4;
	vertical_oriented = false;
	orient_update(vertical_oriented);
	
	for (var i = 0; i <= LVL_MAX; i++) {
		walls.push([]);
	}
	
	for (var i = 0; i <= LVL_MAX; i++) {
		foes.push([]);
	}
	
	lvl_maps.push(
	["----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
	 "-----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWW----------------------WWWWWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWW-----------WWWWWWWWWWW-------------WWWWWWWWWWWWWWWWWW-WWWWWWWWWWWWWWWW----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------w---------w-------w----w--------w-------w-------w-----w--------w-----ww-----w-----------------------n----------n--------n----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWW-----------------------WWWWWWWWWWWWWWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWW------------WWWWWWWWWWW-------------WWWWWWWWWWWWWWWWWW--WWWWWWWWWWWWWW---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------m------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------WWWWWWWWWWWWWWWWWWWWW----------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---------------------w---------w-----w----w---------w-------s------w-----w---------w---ss--w---s-----------------------------m---------m---------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-------------------------WWWWWWWWWWWWWWWWWWW----------------------------------------------WWWWWWWWWWWWWWW--------------WWWWWWWWW---------------WWWWWWWWWWWWWWWW----WWWWWWWWWWWW---------------m---------------------------------------------------------------------------m-----------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB------------------------C---------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------------------------BBBBBBBBBBBBBBBBBBBBB--------------------WWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWWW---WWWWWWWWWWWWWWWWW---------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------w----------w-www----w----------w--------w------w-----w-------s---w-----wws--------------------------------------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW---------------------------WWWWWWWWWWWWWWW-------------------------------------------------WWWWWWWWWWWWW---------------WWWWWWWWW----------------WWWWWWWWWWWWWW------WWWWWWWWWW--------------------------------------------------------------------------------------------M------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------------------c-------c----------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWWW----WWWWWWWWWWWWWWW---m-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------w----------w-------w-----------w--------www--w-------sw-wwwwww-w-----w-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-----------------------------WWWWWWWWWWW----------------------------------------------------WWWWWWWWWWW-----------------WWWWWWW-----------------WWWWWWWWWWWWWW------WWWWWWWWWW--------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------c---------------c-------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWW----------------------------------------------WWWWWWWWWWWWWWWW------WWWWWWWWWWWWW-------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------w-------www-------w-------------w-------s--s--------w--w------w-----w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWW-----------------------------------m----------------------------------------------------------------------------------------------------M---------WWWWWWWWWWWW--------WWWWWWWW---------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW------------------------------------------------WWWWWWWWWWWWWW--------WWWWWWWWWWW-------------------------------------C-------------------------------------------------w----ww---wwwwwww---------------w-----s----w---wwww----w----s-----sw------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWW-----------------------------------m-------------------------WWWWWWWW-------------------------------------------------------------------------------WWWWWWWWWW---------WWWWWWWW---------------------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWW--------------------------------------------------WWWWWWWWWWWW----------WWWWWWWWW-----------------------------------------------------------------------------------------wwww------w-----w---------------w---w------s-w-------w----s-----w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWW-------------------------------------M-----------------------WWWWWWWWWW-------------------------------------------------------------------------------WWWWWWWW-----------WWWWWW----------------------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBB--------------WWWWWWWWWWW----------------------------------------------------WWWWWWWWWW------------WWWWWWW-----------------------------------------------------------------------------------------w-------w-------w-----------------s-w--------w-------s----w-----s---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------WWWWWWWWWW-------------------------------------m-----------------------WWWWWWWWWWW---------------------------------------------------------------------------------------------------WWWW--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------N----------N----------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------WWWWWWWWWW-----------------------------------------------------WWWWWWWW--------------WWWWW-----------------------------------------------------------------------------------------w-------w---------w-----------------w--------s-s------wwww------s-w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------f-f-f-f-F---------------f-f-f-f-F-------------------f-f-f-f-F-----------------------------WWWWWWWW---------------------------------------m---------------------WWWWWWWWWWWWWW--------------------------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBB-------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------BBBBBBBBBBBBBBBBBBBB----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBB----------WWWWWWWW---------------------------------------------------------WWW-----------------WWW-------------------------------------------------------------------------------------------w-----w-----------w-----------------s------w-w--------s--------w--w-------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww-------------------------------------------------------------------------------------------------------------------------------------b------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------------------------------------------------------M---------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------M-------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------------------------------BB-------------BBBBBBBBB-------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWW-----------------------------------------------------------------wwwww-----------w-----------------w-w----s---w--------sw-----w----w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBB-----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------------------------------------------------------m------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWW---------------------------------------------------------------w-----w---------w-----------------w---s--w-----s---------w---w------s-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------m---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------n-----------n----------------------------------------------------------------------M---------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------w-------w-------w------------------w---w-w-----ww---------w--w--------w----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------f-f-f-f-F---------------f-f-f-f-F--------------------f-f-f-f-F-------------------------------WWWWWWWWW--------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m-------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---------------------------------------------------------w---------wwwwwwww-----------------s-----w-----w--w---------sw--------s-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "--------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWW--------------------------------------------------------WWWWWWWWWWWWWWWWWW---------------------------------------------------------------------------------m--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------w---------w--------w----------------s------s----s---w---------w--------w-----------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWW------------------WWWWWW--------------------------------WWWWWWWWWWWWWWWW----------------------------------------------------------------------------------M-------------------------------------------------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------m-----------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------w-------ww---------w--------------w-------w---w-----wsw------w-------w------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW----------------WWWWWWWW-------------------------------WWWWWWWWWWWWWWWW----------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------m-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------w-----w--w---------w------------w---------w-w-----w---w----s-w----ws-------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWW---------------WWWWWWWWWW-------------------------------WWWWWWWWWWWWWW-----------------------------------------------------------------------------------m-------------------------------------------------------------------------------------------------m----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------wwwwww----w--------w------------w----------w------w----w--s---s--w---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWW--------------WWWWWWWWWW--------------------------------WWWWWWWWWWWW-----------------------------------------------------------------------------------WWWWW----------------------------------------------------------------------------------------------m------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---m-----------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------w---w--w--w--------w------------w-----------w-----w------ww-----s-s---------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWW------------WWWWWWWWWWWWWW----------------------------------------------------------------------------------------------------------------------------WWWWWWW-----------------m---------------------------------------------------------------------------M----------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB---------------------------c--------------c----------------------BBBBBBBBBBBBBBBBBBBBBB--------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----C--------------------------------------www-----ww-ww--------w-ww---------w-------------w---w---------w---s-w-w--------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW-----------WWWWWWWWWWWWWW-----------------------------------------------------WWWWWWWW--------------------------------------------------------------WWWWWWWWW--------------------------------------------------------------------------------------------m-------------------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------c-------c-------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------w---w----w----w------w----w--------s--------------sww-----------sww-w---w-------------------------------------------------------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW----------WWWWWWWWWWWWWWWW---------------------------------------------------WWWWWWWWWW------------------------------------------------------------WWWWWWWWWWW--------------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB--------------m-----------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------------C-------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------w----w--w-w---------w------w------w---------------w---------------s--w---w----------------------------------m---------m---------------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "----------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWW---------WWWWWWWWWWWWWWWWWW-------------------------------------------------WWWWWWWWWWWW----------------------------------------------------------WWWWWWWWWWWWW---------------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB----------m---------------------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB-----------------------BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------w-----www---ww------w--------w----w-----------------w--------------w---w---w-----------------------------N---------N--------N----------------wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww--------------------------------------------------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"]);
	
	lvl_maps.push(
	["WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
	 "------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------n-------n---n-----n------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------------------W",
	 "-------------------------------WWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------------------wW----------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------W",
	 "--------------------------------WWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------n---------------------ww-------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------------------------------------W",
	 "---------------------------------WWWWWWWWWWWWWWWWWWWW--------------------------------------------------------ws------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------------------------------------W",
	 "-----------------------------------WWWWWWWWWWWWWWW---------------------------------------------------------------------------------------N---------------ws------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------------W",
	 "--------------------------------------WWWWWWWWW--------------------------------------------------------------------------w--------------wW--------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------------------------------------------W",
	 "------------------------------------------m-----------------------------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------------------W",
	 "------------------------------------------m------------------------------------------------------------------------------------w----------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------------------------------------------------W",
	 "------------------------------------------m-----------------------m---m--------------------------------------------wss------------------------------------------------------------------------------m---------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------m----------------------m--m--------------------------------------------------------------------------------ws---------------------------------------------m-------------------------------------------------------------------------------------------------------b-------W",
	 "------------------------------------------m--------------------------------------------------------------------------------N------------------------------------------------------------------------m---------------------------------------------------------------------------------------------------------------W",
	 "------------------------------------------m-------------------------------------------------------------------------------wWs-----------------------------------------------------------------------m---------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------m-m---------------------------------------ws---------------------------------ws----------------------------------------------------m---------------------------------------------------------------------------------------------------------------W",
	 "---------------------------------------------------------------------F-F--------------------------------------------N-------------------------------------------------------------------------------m---------------------------------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------F-------------------------------------------------wW-----------ws------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------------------------W",
	 "------------------------------f-f--------------------------------F-----------------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW---------------------------------------------------------------------------------------------W",
	 "-------------------------------f-f-------------------------------f-----------------------------------------------------------------------ws------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------F---------------------------------------------w-----------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------------------------W",
	 "-----------------------------------------------------------------f------------------------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------------------------------------------------------W",
	 "----------------------------------------------------------WWWWWWWWWWWWWW--------------------------------------------wW------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------W",
	 "-------------------------------------------------------WWWWWWWWWWWWWWWWWWW-------------------------------------------n----------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-------------------------------------------------------------------------------W",
	 "-----------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWW--------------------------------------------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW------------------------------------------------------------------------------W",
	 "----------------------------------------------------WWWWWWWWWWWWWWWWWWWWWWWWW----------------------------------ws---------N-----N---N-----N--------------ws------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW-----------------------------------------------------------------------------W",
	 "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"]);

	level = 0;
	
	lvl_create(lvl_maps[level], walls[level], foes[level]);
	
	for (var i = 0; i <= 69; i++) {
		bullet = {rect: {x: 0, y: 0, width: 5, height: 5},dir: {x: -1, y: 0}, exists: false, power: 0, speed: 0, friend_bul: false};
		bullets[i] = bullet;
	}
	
	for (var i = 0; i <= 19; i++) {
		powup = {rect: {x: 0, y: 0, height: 10, width: 10}, exists: false};
		powups[i] = powup;
	}
	
	var img;
	for (chara in sprites) {
		img = new Image();
		img.src = img_file + sprites[chara];
		sprites[chara] = img;
	}
	
	space_ship.rect = {x: (width / 2 - 20) * - unit_vector[1] + 20 * unit_vector[0], y: (height / 2 - 10) * unit_vector[0] + (60 - height) * unit_vector[1] , width: 40 * unit_vector[0] + 18 * - unit_vector[1], height: 18 * unit_vector[0] + 40 * - unit_vector[1]};
	space_ship.speed = 0.25;
	space_ship.weapon = {until_shot: 0, delay: 7, bullet: {rect:{}, exists: false, power: 1, speed: 0.60, friend_bul: true}};
	var img = new Image();
	img.src = img_file + "space_ship.png";
	space_ship.sprite = img;
	
	menu();
}

menu = function() {
	ctx.font = "30px Arial";
	ctx.fillStyle = "#FF0000";
	ctx.fillText("Press enter to start a new game", width / 2 - 200, height / 2);
}

game = function() {
	update(Date.now());
	render();
	if (in_play) {
		requestAnimationFrame(game);
	}
	
}

update = function(d) {
	dt = d - old;
	old = d;
	delta = dt * space_ship.speed;
	delta_scrolling = dt * SCROLLING_SPEED;
	
	pos_on_map += delta_scrolling;
	if (pos_on_map > lvl_maps[level][0].length * UNIT_MAP - width * unit_vector[0]) {
		pos_on_map = lvl_maps[level][0].length * UNIT_MAP - width * unit_vector[0]
		delta_scrolling = 0;
	}
	
	if (shoot) {
		playerShoot();
	}
	
	spaceShipMove(space_ship, arrow, delta, unit_vector);
	
	if (space_ship.weapon.until_shot > 0) {
		space_ship.weapon.until_shot--;
	}

	bulletsMove(bullets, delta_scrolling, dt, unit_vector);
	
	foesUpdate(foes[level], powups, space_ship, dt, unit_vector);
	
	for (var i = 0; i <= powups.length - 1; i++) {
		if (collides(space_ship, powups[i]) && powups[i].exists) {
			powups[i].exists = false;
			eligible_powup++;
			eligible_powup %= POWUP_CHOICE;
		}
	}
	
	if (collidesWall(space_ship, bullets, walls[level]) && !space_ship.invulnerability) {
		life_lost();
	}

	if (space_ship.invulnerability_timer > 0) {
		space_ship.invulnerability_timer--;
		if (space_ship.invulnerability_timer == 0) {
			space_ship.invulnerability = false;
		}
	}
}

spaceShipMove = function(space_ship, arrow, delta, unit_vector) {
	space_ship.rect.x += delta_scrolling * unit_vector[0];
	space_ship.rect.y += delta_scrolling * unit_vector[1];
	
	if (arrow.right) {
		space_ship.rect.x += delta;
		if (space_ship.rect.x + space_ship.rect.width - pos_on_map * unit_vector[0] >= width) {
			space_ship.rect.x = width - space_ship.rect.width + pos_on_map * unit_vector[0];
		}
	}
	if (arrow.left) {
		space_ship.rect.x -= delta;
		if (space_ship.rect.x - pos_on_map * unit_vector[0] <= 0) {
			space_ship.rect.x = pos_on_map * unit_vector[0];
		}
	}
	if (arrow.down) {
		space_ship.rect.y += delta;
		if (space_ship.rect.y + space_ship.rect.height - pos_on_map * unit_vector[1] >= height) {
			space_ship.rect.y = height - space_ship.rect.height + pos_on_map * unit_vector[1];
		}
	}
	if (arrow.up) {
		space_ship.rect.y -= delta;
		if (space_ship.rect.y - pos_on_map * unit_vector[1] <= 0) {
			space_ship.rect.y = pos_on_map * unit_vector[1];
		}
	}
}

bulletsMove = function(bullets, delta_scrolling, dt, unit_vector) {
		for (var i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			bullets[i].rect.x += bullets[i].dir.x * (dt * bullets[i].speed) + delta_scrolling * unit_vector[0];
			bullets[i].rect.y += bullets[i].dir.y * (dt * bullets[i].speed) + delta_scrolling * unit_vector[1];
			if (bullets[i].friend_bul && space_ship.ripple) {
				bullets[i].rect.height += dt * bullets[i].speed * 0.1;
				bullets[i].rect.x -= dt * bullets[i].speed * 0.05 * unit_vector[0];
				bullets[i].rect.y -= dt * bullets[i].speed * 0.05 * unit_vector[1];
			}
			if (!entity_on_screen(bullets[i])) {
				reset_bullet(bullets[i]);
			} 
		}
	}
}

foesUpdate = function(foes, powups, space_ship, dt, unit_vector) {
	for (var i = 0; i <= foes.length - 1; i++) {
		if (foes[i].hp > 0 && entity_on_screen(foes[i])) { 
			switch (foes[i].type.toLowerCase()) {
				case 'c': {
					foes[i].rect.x -= dt * foes[i].speed;
					if (foeCollidesWall(foes[i], walls[level])) {
						foes[i].rect.x += dt * foes[i].speed;
						foes[i].rect.y += foes[i].rect.y >= height / 2 ? - dt * foes[i].speed : dt * foes[i].speed;   
					}
				} break;
				
				case 'f': {
					foes[i].rect.x -= dt * foes[i].speed * unit_vector[0];
					foes[i].rect.y -= dt * foes[i].speed * unit_vector[1];
				}
			}

			for (var j = 0; j <= bullets.length - 1; j++) {
				if (collides(bullets[j], foes[i]) && bullets[j].friend_bul) {
					foes[i].hp -= bullets[j].power;
					reset_bullet(bullets[j]);					
					if (foes[i].hp <= 0) {
						score += foes[i].earned_points;
						if (foes[i].has_powup) {
							for (var k = 0; k <= powups.length - 1; k++) {
								if (!powups[k].exists) {
									powups[k].exists = true;
									powups[k].rect.x = foes[i].rect.x;
									powups[k].rect.y = foes[i].rect.y;
									break;
								}
							}
						}
					}
				}
			}
			
			if (!(space_ship.invulnerability) && collides(space_ship, foes[i])) {
				if (space_ship.force) {
					space_ship.force = false;
					space_ship.rect.x = (foes[i].rect.x - space_ship.rect.width - 100) * unit_vector[0] + space_ship.rect.x * unit_vector[1];
					space_ship.rect.y = space_ship.rect.y * unit_vector[0] + (foes[i].rect.y - space_ship.rect.height - 100) * unit_vector[1];
				} else {
					life_lost()
				}
			}
		}
		
		if (foes[i].hp <= 0 && foes[i].type == 'b') {
			in_play = false;
			victory = true;
			break;
		}
	}
}

render = function() {
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	
	showBullets(bullets);
	
	showPowups(powups);
	
	showFoes(foes[level]);
	
	showWalls(walls[level]);
	
	showSpace_ship(space_ship);
	
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, height, width, 100);
	
	powup_choice_render();
	ctx.strokeStyle = "#FFFFFF";
	for (i = 0; i <= POWUP_CHOICE - 1; i++) {
		ctx.strokeRect(i * 25, ctx.height - 75, 20, 5);
	}
	
	showScore();
	
	ctx.fillStyle = "#FF0000";
	if (!in_play && !victory) {
		ctx.font = "30px Arial";
		ctx.fillText("Game Over, you lose !", width / 2 - 200, height / 2);
	}
	
	if (victory) {
		ctx.font = "30px Arial";
		ctx.fillText("Congratulations, you won !", width / 2 - 200, height / 2);
	}
}

showBullets = function(bullets) {
	for (var i = 0; i <= bullets.length - 1; i++) {
		if (bullets[i].exists) {
			if (bullets[i].friend_bul) {
				if (bullets[i].dir.y != 0) {
					ctx.fillStyle = "#0000FF";
				} else {
					ctx.fillStyle = "#FF0000";
				}
			}
		rectFill(bullets[i]);
		}
	}
}

showPowups = function(powups) {
	for (var i = 0; i <= powups.length - 1; i++) {
		ctx.fillStyle = "#f49e42";
		if (powups[i].exists) {
			rectFill(powups[i]);
		}
	}
}

showFoes = function(foes) {
	for (i = 0; i <= foes.length - 1; i++) {
		if (foes[i].hp > 0  && entity_on_screen(foes[i])) {
			ctx.drawImage(sprites[foes[i].type], foes[i].rect.x - pos_on_map * unit_vector[0], foes[i].rect.y - pos_on_map * unit_vector[1], foes[i].rect.width, foes[i].rect.height);
		}
	}	
}

showWalls = function(walls) {
	for (var i = 0; i <= walls.length - 1; i++) {
		for (var j = min_wall_on_screen_index[i]; j <= walls[i].length - 1; j++) {
			if (!entity_on_screen(walls[i][j])) {
				break;
			}
			
			if (!walls[i][j].destroyed) {
				ctx.drawImage(sprites[walls[i][j].type], walls[i][j].rect.x - pos_on_map * unit_vector[0], walls[i][j].rect.y - pos_on_map * unit_vector[1], walls[i][j].rect.width, walls[i][j].rect.height);
			}
		}	
	}	
}

showSpace_ship = function(space_ship) {
	if (space_ship.invulnerability && (space_ship.invulnerability_timer % 4 == 1 || space_ship.invulnerability_timer % 4 == 2)) {
		ctx.fillStyle = "#FFFFFF";
		rectFill(space_ship);
	} else {
		ctx.drawImage(space_ship.sprite, space_ship.rect.x - pos_on_map * unit_vector[0], space_ship.rect.y - pos_on_map * unit_vector[1], space_ship.rect.width, space_ship.rect.height);
	}
	
	if (space_ship.force) {
		ctx.strokeStyle = "#42ebf4"
		ctx.strokeRect(space_ship.rect.x - pos_on_map * unit_vector[0], space_ship.rect.y - pos_on_map * unit_vector[1], space_ship.rect.width, space_ship.rect.height);
	}
}

lvl_create = function(lvl_map, walls, foes) {
	for (var i = 0; i <= lvl_map.length - 1; i++) {
		min_wall_on_screen_index.push(0);
		walls.push([]);
		for (var j = 0; j <= lvl_map[i].length - 1; j++) {
			if ("WwB".indexOf(lvl_map[i].charAt(j)) > -1) {
				wall = {rect: {x: (j * UNIT_MAP) * unit_vector[0] + (i * UNIT_MAP) * - unit_vector[1], y: (i * UNIT_MAP) * unit_vector[0] + (j * UNIT_MAP) * unit_vector[1], width: UNIT_MAP, height: UNIT_MAP}, type: lvl_map[i].charAt(j)};
				wall.destroyable = (lvl_map[i].charAt(j).toLowerCase() === lvl_map[i].charAt(j));
				wall.destroyed = false;
				walls[i].push(wall);
			} else if ("fFcCMmnNs".indexOf(lvl_map[i].charAt(j)) > -1) {
				foe = {rect: {x: (j * UNIT_MAP) * unit_vector[0] + (i * UNIT_MAP) * - unit_vector[1], y: (i * UNIT_MAP) * unit_vector[0] + (j * UNIT_MAP) * unit_vector[1], width: UNIT_MAP, height: UNIT_MAP}, type: lvl_map[i].charAt(j)};
				foe.has_powup = !(lvl_map[i].charAt(j).toLowerCase() === lvl_map[i].charAt(j));
				foe.hp = foe.has_powup ? 3 : 1;
				foe.speed = 0.08;
				if (lvl_map[i].charAt(j).toLowerCase() === 'c') {
					foe.speed = 0.45;
				}
				foe.earned_points = foe.hp * 10;
				foes.push(foe);			
			} else if ("b".indexOf(lvl_map[i].charAt(j)) > -1) {
				foe = {rect: {x: (j * UNIT_MAP) * unit_vector[0] + (i * UNIT_MAP) * - unit_vector[1], y: (i * UNIT_MAP) * unit_vector[0] + (j * UNIT_MAP) * unit_vector[1], width: 10*UNIT_MAP, height: 10*UNIT_MAP}, type: lvl_map[i].charAt(j)};
				foe.has_powup = false;
				foe.hp = 60;
				foe.speed = 0;
				foe.earned_points = foe.hp * 10 + 100;
				foes.push(foe);
			}
		}
	}
}

collides = function(a, b) {
	return a.rect.x < b.rect.x + b.rect.width && a.rect.x + a.rect.width > b.rect.x && a.rect.y < b.rect.y + b.rect.height && a.rect.height + a.rect.y > b.rect.y;
}

collidesWall = function(space_ship, bullets, walls) {
	var has_collided_space_ship = false;
	for (var i = 0; i <= walls.length - 1; i++) {
		while (pos_on_map > (walls[i][min_wall_on_screen_index[i]].rect.x + walls[i][min_wall_on_screen_index[i]].rect.width) * unit_vector[0] + (walls[i][min_wall_on_screen_index[i]].rect.y + walls[i][min_wall_on_screen_index[i]].rect.height - height) * unit_vector[1]) {
			min_wall_on_screen_index[i]++;
		}
		
		for (var j = min_wall_on_screen_index[i]; j <= walls[i].length - 1; j++) {
			if (!entity_on_screen(walls[i][j])) {
				break;
			}
			
			
			if (collides(space_ship, walls[i][j]) && !walls[i][j].destroyed) {
				has_collided_space_ship = true;
			}

			
			for (k = 0; k <= bullets.length - 1; k++) {
				if (bullets[k].exists && collides(bullets[k], walls[i][j]) && !walls[i][j].destroyed) {
					reset_bullet(bullets[k]);
					if (walls[i][j].destroyable) {
						walls[i][j].destroyed = true;
					}
				}
			}
		}
	}
	return has_collided_space_ship;
}

foeCollidesWall = function(foe, walls) {
	var has_collided = false;
	for (var i = 0; i <= walls.length - 1; i++) {
		while (pos_on_map > walls[i][min_wall_on_screen_index[i]].rect.x + walls[i][min_wall_on_screen_index[i]].rect.width) {
			min_wall_on_screen_index[i]++;
		}
		
		for (var j = min_wall_on_screen_index[i]; j <= walls[i].length - 1; j++) {
			if (!entity_on_screen(walls[i][j])) {
				break;
			}
			
			
			if (collides(foe, walls[i][j])) {
				has_collided = true;
			}
		}
	}
	return has_collided;
}
rectFill = function(a) {
	ctx.fillRect(a.rect.x - pos_on_map * unit_vector[0], a.rect.y - pos_on_map * unit_vector[1], a.rect.width, a.rect.height);
}

playerShoot = function() {
	var second_shot;
	
	if (space_ship.weapon.until_shot == 0) {
		space_ship.weapon.until_shot = space_ship.weapon.delay;
		for (var i = 0; i <= bullets.length - 1; i++) {
			if (!bullets[i].exists) {
				var j = i;
				var k = 0;
				while (((space_ship.laser && k <= 4) || k < 1) && j <= bullets.length - 1) {
					if (!bullets[j].exists) {
						bullets[j].exists = true;
						bullets[j].rect.x = space_ship.rect.x + (space_ship.rect.width / 2) * - unit_vector[1] + (space_ship.rect.width - k * 10) * unit_vector[0];
						bullets[j].rect.y = space_ship.rect.y + (space_ship.rect.height / 2) * unit_vector[0] + (space_ship.rect.height - k * 10) * - unit_vector[1];
						bullets[j].rect.width = 5;
						bullets[j].rect.height = 5;
						bullets[j].dir.x = unit_vector[0];
						bullets[j].dir.y = unit_vector[1];
						bullets[j].friend_bul = true;
						bullets[j].power = space_ship.weapon.bullet.power;
						bullets[j].speed = space_ship.weapon.bullet.speed;
						k++;
					}
					j++;
				}
				if (space_ship.missile) {
					second_shot = 0;
					for (var l = i; l <= bullets.length - 1; l++) {
						if (!bullets[l].exists) {
							bullets[l].exists = true;	
							bullets[l].rect.x = space_ship.rect.x + (space_ship.rect.width / 2) * - unit_vector[1] + (space_ship.rect.width) * unit_vector[0];
							bullets[l].rect.y = space_ship.rect.y + (space_ship.rect.height / 2) * unit_vector[0] + (space_ship.rect.height) * - unit_vector[1];
							bullets[l].rect.width = 5;
							bullets[l].rect.height = 5;
							bullets[l].dir.x = unit_vector[1] + unit_vector[0] - 2 * second_shot * unit_vector[1];
							bullets[l].dir.y = unit_vector[1] + unit_vector[0] - 2 * second_shot * unit_vector[0];
							bullets[l].friend_bul = true;
							bullets[l].power = space_ship.weapon.bullet.power;
							bullets[l].speed = space_ship.weapon.bullet.speed;
							second_shot += 1;
							if (second_shot == 2) {
								break;
							}
						}
					}
				}
				break;
			}
		}
	}
}

orient_update = function(vertical_oriented) {
	if (vertical_oriented) {
		unit_vector[0] = 0;
		unit_vector[1] = -1;
		width = SECONDARY_AXIS_LEN;
		height = PRIMARY_AXIS_LEN;
		cvs.width += width;
		cvs.height += height;
		img_file = "img/vertical/";
	} else {
		unit_vector[0] = 1;
		unit_vector[1] = 0;
		width = PRIMARY_AXIS_LEN;
		height = SECONDARY_AXIS_LEN;
		cvs.width += width;
		cvs.height += height;
		img_file = "img/horizontal/";
	}
	ctx.width = cvs.width;
    ctx.height = cvs.height;
}

powup_activ = function() {
	switch (eligible_powup) {
		case 0:
			space_ship.speed += space_ship.speed < SPACESHIP_SPEED_LIMIT ? 0.05 : 0;
			break;
		case 1:
			space_ship.missile = true;
			break;
		case 2:
			space_ship.laser = true;
			break;
		case 3:
			space_ship.ripple = true;
			space_ship.weapon.power = 3;
			break;
		case 4:
			space_ship.force = true;
			break;
		default:
			
	}
	eligible_powup = -1;
}

powup_choice_render = function() {
	ctx.font = "14px Verdana";
	ctx.fillStyle = "#FFFFFF";
	var powup_name;
	switch (eligible_powup) {
		case 0:
			powup_name = "Speed";
			break;
		case 1:
			powup_name = "Missile";
			break;
		case 2:
			powup_name = "Laser";
			break;
		case 3:
			powup_name = "Ripple";
			break;
		case 4:
			powup_name = "Force";
			break;
		default:
			powup_name = "";
			break;
	}
	ctx.fillText(powup_name, 125, ctx.height - 75);
	ctx.fillStyle = "#FF0000";
	ctx.fillRect(eligible_powup * 25, ctx.height - 75, 20, 5);
}

showScore = function() {
	ctx.font = "14px Verdana";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score : " + score, ctx.width - 100, ctx.height - 75);
}

life_lost = function() {
	if (lives > 1) {
		lives--;
		space_ship.invulnerability = true;
		space_ship.invulnerability_timer = MAX_INVULNERABILITY;
		space_ship.force = false;
		space_ship.missile = false;
		space_ship.laser = false;
		space_ship.ripple = false;
		eligible_powup = 0;
		space_ship.rect.x = (width / 2 - space_ship.rect.width / 2) * - unit_vector[1] + pos_on_map * unit_vector[0];
		space_ship.rect.y = (height / 2 - space_ship.rect.height / 2) * unit_vector[0] + (pos_on_map - height + space_ship.rect.height + 40) * unit_vector[1];
	} else {
		in_play = false;
	}
}

reset_bullet = function(bullet) {
	bullet.rect = {x: -1, y: -1, width: 0, height: 0};
	bullet.dir = {x: 0, y: 0};
	bullet.exists = false;
	bullet.power = 0;
	bullet.speed = 0;
	bullet.friend_bul = false;
}

entity_on_screen = function (entity) {
	return (entity.rect.x + entity.rect.width >= pos_on_map * unit_vector[0] && entity.rect.x <= pos_on_map * unit_vector[0] + width && entity.rect.y + entity.rect.height >= pos_on_map * unit_vector[1] && entity.rect.y <= pos_on_map * unit_vector[1] + height);
}													

keyPress = function(e) {
	switch (e.keyCode) {
		case 37 :
			arrow.left = true;
			break;
		case 38 :
			arrow.up = true;
			break;
		case 39 :
			arrow.right = true;
			break;
		case 40 :
			arrow.down = true;
			break;
		case 32 :
			shoot = true;
			break;
		case 13 :
			if (!in_play) {
				in_play = true;
				old = Date.now()
				game();
			} else {
				powup_activ();
			}	
			break; 
	}
}

keyRelease = function(e) {
	switch (e.keyCode) {
		case 37 :
			arrow.left = false;
			break;
		case 38 :
			arrow.up = false;
			break;
		case 39 :
			arrow.right = false;
			break;
		case 40 :
			arrow.down = false;
			break;
		case 32 :
			shoot = false;
	}
}

window.onload = init;