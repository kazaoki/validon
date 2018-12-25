<?php
header('HTTP/1.1 200 OK');
header('Content-Type: application/json; charset=utf-8');


$param = json_decode(file_get_contents('php://input'), true);


echo json_encode([
  'config'=>$param['config'],
  'each'=>$param['each'],
  'errortag'=>$param['errortag'],
  'position'=>$param['position'],
]);
