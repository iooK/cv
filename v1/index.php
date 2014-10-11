<?php
include 'base/Filter.php';
include 'base/Renderer.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);
define('APP_PATH', dirname(__FILE__));

$renderer = new Renderer();
$renderer->load('index');
echo $renderer->show();