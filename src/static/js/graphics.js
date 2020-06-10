window.addEventListener("load", init);

var SCALE = 1 / 30;
var stage;
var world;
var gravityVertical = 15;
var velocityIterations = 8;
var positionIterations = 3;
var stageWidth;
var stageHeight;
var ballImage;
var imageRadius;
var standardRadius = 20;
var floor = new createjs.Rectangle();

function init() {
  let gravity = new Box2D.Common.Math.b2Vec2(0, gravityVertical);
  // Stageオブジェクトを作成します
  var canvasElement = document.getElementById("myCanvas");
  stage = new createjs.Stage(canvasElement);
  canvasElement.width = document.documentElement.clientWidth;
  canvasElement.height =  document.documentElement.clientHeight;
  stageWidth = canvasElement.width;
  stageHeight = canvasElement.height;
  floor.width = stageWidth * 0.8;
  floor.x = (stageWidth - floor.width) / 2;
  initializeBox2D(gravity,stageWidth,stageHeight);
  console.log( document.documentElement.clientHeight);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
  stage.addChild(createDynamicBall(stageWidth/2,stageHeight/2,10));
  // // 円を作成します
  // var shape = new createjs.Shape();
  // shape.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
  // shape.graphics.drawCircle(0, 0, 100); //半径 100px の円を描画
  // shape.x = 200; // X 座標 200px の位置に配置
  // shape.y = 200; // Y 座標 200px の位置に配置
  // stage.addChild(shape); // 表示リストに追加
  // let text = new createjs.Text("Hello World! aa", "24px serif", "DarkRed");
  // stage.addChild(text)
  // console.log(text.getMeasuredHeight());
  // console.log(text.getMeasuredWidth());
  // Stageの描画を更新します
  // stage.update();
}

// Box2Dのワールドを初期化 重力設定
function initializeBox2D(gravity, stageWidth, stageHeight) {
  world = new Box2D.Dynamics.b2World(gravity,true);
  let textShape = createDynamicText(stageWidth/2,stageHeight/2+50,"test");
  stage.addChild(textShape);
  let floorShape = createStaticFloor(stageWidth / 2, stageHeight + standardRadius, stageWidth, standardRadius, "#CCCCCC");
  stage.addChild(floorShape);
  // createStaticWall(0-(standardRadius/2), stageHeight/2, standardRadius,  stageHeight/2 );
  // createStaticWall(stageWidth-(standardRadius/2), 0, standardRadius,  stageHeight );
  // createStaticWall(0, 0, standardRadius,  stageHeight );
  let floorShape1 = createStaticFloor(0 - standardRadius, stageHeight / 2,  standardRadius, stageHeight,"#CCCCCC");
  stage.addChild(floorShape1);
  let floorShape2 = createStaticFloor(stageWidth +  standardRadius, stageHeight / 2,  standardRadius, stageHeight,"#CCCCCC");
  stage.addChild(floorShape2);
}

// 定期的に呼び出される関数
function tick(eventObject){
  let delta = eventObject.delta;
  update(delta);
  stage.update();
}

// ボール定義
function createDynamicBall(nX,nY,radius){
  let dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
  let bodyDef = defineBody(nX,nY,dynamicBody);
  let ball  = createVisualBall(radius,bodyDef);
  let circleShape = new Box2D.Collision.Shapes.b2CircleShape(radius * SCALE);
  let fixtureDef = defineFixture(circleShape);
  setFixture(fixtureDef, 1, 0.1, 0.8);
  createBody(world, bodyDef, fixtureDef);
  return ball;
}

function createVisualBall(radius,bodyDef){
  let shape = new createjs.Shape();
  shape.graphics.beginFill("DarkRed"); // 赤色で描画するように設定
  shape.graphics.drawCircle(0, 0, radius); //半径 100px の円を描画
  shape.x = 200; // X 座標 200px の位置に配置
  shape.y = 200; // Y 座標 200px の位置に配置
  bodyDef.userData = shape;
  return shape;
}

function createStaticFloor(nX, nY, nWidth, nHeight, color) {
  let staticBody = Box2D.Dynamics.b2Body.b2_staticBody;
  let bodyDef = defineBody(nX,nY,staticBody);
  let floorShape = createVisualFloor(nWidth,nHeight,color,bodyDef);
  let boxShape = new Box2D.Collision.Shapes.b2PolygonShape();
  let fixtureDef = defineFixture(boxShape);
  boxShape.SetAsBox(nWidth / 2 * SCALE, nHeight / 2 * SCALE);
  createBody(world, bodyDef, fixtureDef);
  return floorShape;
}

function createStaticWall(nX, nY, nWidth, nHeight) {
  let staticBody = Box2D.Dynamics.b2Body.b2_staticBody;
  let bodyDef = defineBody(nX,nY,staticBody);
  let boxShape = new Box2D.Collision.Shapes.b2PolygonShape();
  let fixtureDef = defineFixture(boxShape);
  boxShape.SetAsBox(nWidth / 2 * SCALE, nHeight / 2 * SCALE);
  createBody(world, bodyDef, fixtureDef);
}

function createVisualFloor(nWidth,nHeight,color,bodyDef){
  let floorShape = new createjs.Shape();
  floorShape.regX = nWidth / 2;
  floorShape.regY = nHeight / 2;
  floorShape.graphics
  .beginFill(color)
  .drawRect(0,0,nWidth,nHeight);
  bodyDef.userData = floorShape;
  return floorShape;
}

function createVisualText(text,bodyDef){
  let textShape = new createjs.Text(text, "24px serif", "DarkRed");
  textShape.regX = textShape.getMeasuredWidth()/2;
  textShape.regY = textShape.getMeasuredHeight()/2
  bodyDef.userData = textShape;
  return textShape;
}

function createDynamicText(nX,nY,text){
  let dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
  let bodyDef = defineBody(nX,nY,dynamicBody);
  let textShape = createVisualText(text,bodyDef);
  let boxShape = new Box2D.Collision.Shapes.b2PolygonShape();
  let fixtureDef = defineFixture(boxShape);
  boxShape.SetAsBox(textShape.getMeasuredWidth()/2*SCALE,textShape.getMeasuredHeight()/2*SCALE);
  setFixture(fixtureDef, 1, 0.1, 0.3);
  createBody(world,bodyDef,fixtureDef);
  return textShape;
}

function defineBody(nX,nY,bodyType){
  let bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.position.Set(nX*SCALE,nY*SCALE);
  bodyDef.type = bodyType;
  return bodyDef;
}

function createBody(world, bodyDef,fixtureDef) {
  let body = world.CreateBody(bodyDef);
  body.CreateFixture(fixtureDef);
}

function defineFixture(myShape){
  let fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.shape = myShape;
  return fixtureDef;
}

function setFixture(fixtureDef, density,friction,restitution){
  fixtureDef.density = density;
  fixtureDef.friction = friction;
  fixtureDef.restitution = restitution;
}

// 更新
function update(delta) {
  world.Step(delta / 1000, velocityIterations, positionIterations);
  var body = world.GetBodyList();
  while(body){
  var myObject = body.GetUserData();
  if (myObject) {
    var position = body.GetPosition();
    myObject.x = position.x / SCALE;
    myObject.y = position.y / SCALE;
    myObject.rotation = body.GetAngle() / createjs.Matrix2D.DEG_TO_RAD;
  }
  body = body.GetNext();
}
}

function clearWorld(){
  world.ClearForces();
  stage.removeAllChildren();
}