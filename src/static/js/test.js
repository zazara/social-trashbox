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
function initialize() {
  var canvasElement = document.getElementById("myCanvas");
  var gravity = new Box2D.Common.Math.b2Vec2(0, gravityVertical);
  stage = new createjs.Stage(canvasElement);
  stageWidth = canvasElement.width;
  stageHeight = canvasElement.height;
  initializeBox2D(gravity);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  preloadImage("images/Pen.png");
}
function initializeBox2D(gravity) {
  world = new Box2D.Dynamics.b2World(gravity, true);
}
function tick(eventObject) {
  var delta = eventObject.delta;
  update(delta);
  stage.update();
}
function addBall() {
  var ball = createDynamicBall(stageWidth / 2, -imageRadius, imageRadius);
  stage.addChild(ball);
}
function createDynamicBall(nX, nY, radius) {
  var dynamicBody = Box2D.Dynamics.b2Body.b2_dynamicBody;
  var bodyDef = defineBody(nX, nY, dynamicBody);
  var ball = createVisualBall(radius, bodyDef);
  createBody(world, bodyDef);
  return ball;
}
function defineBody(nX , nY, bodyType) {
  var bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.position.Set(nX * SCALE, nY * SCALE);
  bodyDef.type = bodyType;
  return bodyDef;
}
function createBody(world, bodyDef) {
  var body = world.CreateBody(bodyDef);
}
function update(delta) {
  world.Step(delta / 1000, velocityIterations, positionIterations);
  var body = world.GetBodyList();
  var myObject = body.GetUserData();
  if (myObject) {
    var position = body.GetPosition();
    myObject.x = position.x / SCALE;
    myObject.y = position.y / SCALE;
    myObject.rotation = body.GetAngle() / createjs.Matrix2D.DEG_TO_RAD;
  }
}
function createVisualBall(radius, bodyDef) {
  var ball = new createjs.Bitmap(ballImage);
  ball.regX = ballImage.width / 2;
  ball.regY = ballImage.height / 2;
  ball.scaleX = ball.scaleY = radius / imageRadius;
  bodyDef.userData = ball;
  return ball;
}
function preloadImage(file) {
  var loader = new createjs.LoadQueue(false);
  loader.addEventListener("fileload", loadFinished);
  loader.loadFile(file);
}
function loadFinished(eventObject) {
  ballImage = eventObject.result;
  imageRadius = ballImage.width / 2;
  createjs.Ticker.addEventListener("tick", tick);
  addBall();
}
///////////

var standardRadius = 20;
var floor = new createjs.Rectangle();
function initialize() {

  floor.width = stageWidth * 0.8;
  floor.x = (stageWidth - floor.width) / 2;
  // initializeBox2D(gravity);
  initializeBox2D(gravity, stageWidth, stageHeight);

}
// function initializeBox2D(gravity) {
function initializeBox2D(gravity, stageWidth, stageHeight) {

  var floorShape = createStaticFloor(stageWidth / 2, stageHeight - standardRadius, floor.width, standardRadius, "#CCCCCC");
  stage.addChild(floorShape);
}

function createStaticFloor(nX, nY, nWidth, nHeight, color) {
  var staticBody = Box2D.Dynamics.b2Body.b2_staticBody
  var bodyDef = defineBody(nX, nY, staticBody);
  var floorShape = createVisualFloor(nWidth, nHeight, color, bodyDef);
  createBody(world, bodyDef);
  return floorShape;
}

function createVisualFloor(nWidth, nHeight, color, bodyDef) {
  var floorShape = new createjs.Shape();
  floorShape.regX = nWidth / 2;
  floorShape.regY = nHeight / 2;
  floorShape.graphics
  .beginFill(color)
  .drawRect(0, 0, nWidth, nHeight);
  bodyDef.userData = floorShape;
  return floorShape;
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