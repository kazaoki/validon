<?php

/**
 * お名前
 */
$_VALIDON['name'] = function($params, $errors){
    if(!strlen($params['name'])) {
        $errors['name'] = '必須項目です。';
    }
    return [$params, $errors];
};

/**
 * 年齢
 */
$_VALIDON['age'] = function($params, $errors){
    if(!strlen($params['size[]'])) {
        $errors['size[]'] = '必須項目です。';
    }
    return [$params, $errors];
};

/**
 * サイズ
 */
$_VALIDON['size[]'] = function($params, $errors){
    if(!strlen($params['size[]'])) {
        $errors['size[]'] = '必須項目です。';
    }
    return [$params, $errors];
};

/**
 * XXX
 */
$_VALIDON['全角キーもOK'] = function($params, $errors){
    if(!strlen($params['全角キーもOK'])) {
        $errors['全角キーもOK'] = '必須項目です。';
        $params['全角キーもOK'] = 'あわわ'; // changesに入る
    }
    return [$params, $errors];
};
